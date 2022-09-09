// const fetch = require('node-fetch')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Octokit } = require("@octokit/core");


var argv = require('minimist')(process.argv.slice(2));
var token = argv.token;
var org = argv.org;
var repo = argv.repo;
var tag = argv.tag;
var pathToBody = argv.pathToBody;
// Example of setting flags: node src/index.js --token=abc123 --org=myorg --repo=myrepo --tag=v1.0.0

function main() {

    const url = getByTag.url;
    const method = getByTag.method;
    const credentials = getByTag.credentials;
    const bodyUsed = getByTag.bodyUsed;

    var potsReq = new fetch(`https://api.github.com/repos/${org}/${repo}/releases`, { method: 'POST', body: '', headers: { Authentication: `bearer ${token}` } })
};

// main()

function getByTag() {
    var req = fetch(`https://api.github.com/repos/${org}/${repo}/releases/tags/${tag}`, { method: 'GET', headers: { Authentication: `bearer ${token}`, body: pathToBody } })
        .then(response => response.json())
        .then(jsonResponse => {
            test = jsonResponse;
            console.log(test.body);
            return test;
        });
    // console.log(req, '--------')

}
getByTag()


async function post1() {
    const octokit = new Octokit({
        auth: `${token}`
    })

    await octokit.request(`POST /repos/${org}/${repo}/releases`, {
        owner: `${org}`,
        repo: `${repo}`,
        tag_name: 'v21.0.0',
        target_commitish: 'master',
        name: 'v12.0.0',
        body: 'Description of the release post rquest 1',
        draft: false,
        prerelease: false,
        generate_release_notes: false
    })
}
post1()