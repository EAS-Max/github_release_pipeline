// const fetch = require('node-fetch')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Octokit } = require("@octokit/core");
var Body = require('../testBody.json');
var argv = require('minimist')(process.argv.slice(2));


var token = argv.token;
var org = argv.org;
var repo = argv.repo;
var tag = argv.tag;
var relId = argv.relId
var method = argv.method

// Example command: node src/index.js --token={token} --org={org} --repo={repo} --tag={tag} --method=GET

function getByTag() {
    var req = fetch(`https://api.github.com/repos/${org}/${repo}/releases/tags/${tag}`, { method: 'GET', headers: { Authentication: `bearer ${token}` } })
        .then(response => response.json())
        .then(jsonResponse => {
            test = jsonResponse;
            console.log(test)
            console.log(test.body, '----------------------');
            return test;
        });

}

const octokit = new Octokit({
    auth: `${token}`
})

// Example command: node src/index.js --token={token} --org={org} --repo={repo} --method=POST
// The body you want must be in the json file
async function postAuto() {

    await octokit.request(`POST /repos/${org}/${repo}/releases`, {
        owner: `${org}`,
        repo: `${repo}`,
        tag_name: `${Body.tag_name}`,
        target_commitish: `${Body.target_commitish}`,
        name: `${Body.name}`,
        body: `${Body.body}`,
        draft: Body.draft,
        prerelease: Body.prerelease,
        generate_release_notes: Body.generate_release_notes
    })
}

// Example command: node src/index.js --token={token} --org={org} --repo={repo}  --relId={repo_Id} --method=PATCH
async function patchRelease() {
    await octokit.request(`PATCH /repos/${org}/${repo}/releases/${relId}`, {
        owner: `${org}`,
        repo: `${repo}`,
        release_id: `${relId}`,
        tag_name: `${Body.tag_name}`,
        target_commitish: `${Body.target_commitish}`,
        name: `${Body.name}`,
        body: `${Body.body}`,
        draft: Body.draft,
        prerelease: Body.prerelease
    })
}

if (method === "GET") {
    getByTag()
} else if (method === "PATCH") {
    patchRelease()
} else if (method === "POST") {
    postAuto()
} else {
    console.log('method is undefined or incorrect, please use the --method= flag to chose one of the following options: GET, POST, PATCH')
}
