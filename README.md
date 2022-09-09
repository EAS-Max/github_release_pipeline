# github_release_pipeline
# Usage
Example GET request
```
node src/index.js --token={token} --org={org} --repo={repo} --tag={tag} --method=GET
```
Example POST request
```
node src/index.js --token={token} --org={org} --repo={repo} --method=POST
```
Example PATCH request
```
node src/index.js --token={token} --org={org} --repo={repo}  --relId={repo_Id} --method=PATCH
```