// const fetch = require('node-fetch')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


var argv = require('minimist')(process.argv.slice(2));
var token = argv.token;
var org = argv.org;
var repo = argv.repo;
var tag = argv.tag;
var pathToBody = argv.pathToBody;
// console.log(token)
// Example of setting flags: node src/index.js --token=abc123 --org=myorg --repo=myrepo --tag=v1.0.0

function main() {

    // const getByTag = new Request(`https://api.github.com/repos/${org}/${repo}/releases/tags/${tag}`, { method: 'GET', headers: { Authentication: `bearer ${token}` } })
    // // .then(response => response.json())
    // // .then(jsonResponse => {
    // //     test = jsonResponse;
    // //     console.log(test);
    // //     return test;
    // // });
    // console.log(getByTag, '--------')


    const url = getByTag.url;
    const method = getByTag.method;
    const credentials = getByTag.credentials;
    const bodyUsed = getByTag.bodyUsed;

    var potsReq = new fetch(`https://api.github.com/repos/${org}/${repo}/releases`, { method: 'POST', body: '', headers: { Authentication: `bearer ${token}` } })
};

// main()

function getByTag() {
    var req = fetch(`https://api.github.com/repos/${org}/${repo}/releases/tags/${tag}`, { method: 'GET', headers: { Authentication: `bearer ${token}` } })
        .then(response => response.json())
        .then(jsonResponse => {
            test = jsonResponse;
            console.log(test.body);
            return test;
        });
    // console.log(req, '--------')

}
getByTag()
