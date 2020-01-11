import {url as _url} from './config';

const url = _url.replace(/\/$/, '');

export default function resolveUrl(path) {
  return `${url}/${path.replace(/^\//, '')}`;
}