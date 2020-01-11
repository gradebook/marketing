const fs = require('fs');
const {URL} = require('url');
const axios = require('axios');
const marked = require('marked');

const resources = [
  ['tos', './terms-of-service'],
  ['privacy', './privacy-policy'],
  ['SECURITY', './security']
]

function buildResource(path, destination) {
  fs.unlink(destination + '.html', () => {});
  const stream = fs.createWriteStream(destination + '.html');

  return fs.readFile('template.html', (err, data) => {
    if (err)
      throw err;

    const url = new URL('/gradebook/legal/master/' + path + '.md', 'https://raw.githubusercontent.com/').href;

    return axios({method: 'GET', responseType: 'text', url})
    .then(response => {
      let template = data.toString();
      template = template.replace('{{body}}', marked(response.data));
      stream.write(template);
    });
  });
}

function buildResources() {
  return Promise.all(resources.map(([remote, local]) => buildResource(remote, local)));
}

buildResources()
  .catch(e => console.error(e));