const fs = require('fs');
const {URL} = require('url');
const axios = require('axios');

const resources = [
  ['tos.md', './terms-of-service.md']
]

function saveResource(path, destination) {
  const stream = fs.createWriteStream(destination);
  const url = new URL('/gradebook/legal/master/' + path, 'https://raw.githubusercontent.com/').href;

  return axios({method: 'GET', responseType: 'stream', url})
    .then(response => response.data.pipe(stream));
}

function updateResources() {
  return Promise.all(resources.map(([remote, local]) => saveResource(remote, local)));
}

updateResources()
  .catch(e => console.error(e));