const {SITE_URL: _url} = env;

const url = _url.replace(/\/$/, '');

export default function resolveUrl(path) {
  return `${url}/${path.replace(/^\//, '')}`;
}
