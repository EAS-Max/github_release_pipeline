package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type Release struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	Body       string `json:"body"`
	Draft      bool   `json:"draft"`
	PreRelease bool   `json:"prerelease"`
	TagName    string `json:"tag_name"`
}

func main() {
	token := flag.String("token", "", "(Required) A Github auth token")
	org := flag.String("org", "", "(Required) A target Github org.")
	repo := flag.String("repo", "", "(Required) A target Github repo")
	tag := flag.String("tag", "", "(Required) A target Github tag")

	flag.Parse()

	if *token == "" || *repo == "" || *tag == "" {
		flag.Usage()
		os.Exit(1)
	}
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	// example url
	// https://api.github.com/repos/EAS-Max/jenkins-node/releases/tags/test
	req, _ := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/tags/%s", *org, *repo, *tag), nil)
	req.Header.Set("Authorisation", fmt.Sprintf("token %s", *token))
	res, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusOK {
		bodyBytes, err := ioutil.ReadAll(res.Body)
		if err != nil {
			log.Fatal(err)
			os.Exit(1)
		}

		release := Release{}
		json.Unmarshal(bodyBytes, &release)

		bodyTextBytes, err := ioutil.ReadFile("/tmp/body.txt")
		if err != nil {
			log.Fatal(err)
			os.Exit(1)
		}
		release.Body = string(bodyTextBytes)
		release.TagName = "result-" + *tag
		release.PreRelease = true
		body, err := json.Marshal(release)
		if err != nil {
			log.Fatal(err)
			os.Exit(1)
		}
		req, _ := http.NewRequest("POST", fmt.Sprintf("https://api.github.com/repos/%s/%s/releases", *org, *repo), bytes.NewBuffer(body))
		req.Header.Set("Authorisation", fmt.Sprintf("token %s", *token))
		res, err := client.Do(req)
		if err != nil {
			log.Fatal(err)
			os.Exit(1)
		}
		if res.StatusCode == http.StatusCreated {
			fmt.Println("New release created")
		} else if res.StatusCode == http.StatusUnprocessableEntity {
			req, _ := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/repos/%s/%s/releases", *org, *repo), nil)
			req.Header.Set("Authorisation", fmt.Sprintf("token %s", *token))
			res, err := client.Do(req)
			if err != nil {
				log.Fatal(err)
				os.Exit(1)
			}
			if res.StatusCode == http.StatusOK {
				bodyBytes, err := ioutil.ReadAll(res.Body)
				if err != nil {
					log.Fatal(err)
					os.Exit(1)
				}

				releases := []Release{}
				json.Unmarshal(bodyBytes, &releases)

				id := -1
				for i := range releases {
					if releases[i].TagName == "result-"+*tag {
						id = releases[i].Id
						break
					}
				}
				if id == -1 {
					log.Fatal("release could not be found")
					os.Exit(1)
				}
				req, _ := http.NewRequest("PATCH", fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/%d", *org, *repo, id), bytes.NewBuffer(body))
				req.Header.Set("Authorisation", fmt.Sprintf("token %s", *token))
				res, err := client.Do(req)
				if err != nil {
					log.Fatal(err)
					os.Exit(1)
				}
				if res.StatusCode == http.StatusOK {
					fmt.Println("release updated")
				} else {
					log.Fatal("could not pdate release")
					os.Exit(1)
				}
			} else {
				log.Fatal("could not get tags or releases")
				os.Exit(1)
			}
		} else {
			log.Fatal(fmt.Sprintf("could not create release or tag (output-%s).", *tag))
			os.Exit(1)
		}
	} else {
		log.Fatal(fmt.Sprintf("could not find release or tag (output-%s).", *tag))
		os.Exit(1)
	}
}
