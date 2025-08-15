import axios from 'axios';

export function getNamespaces() {
  return axios
    .get('/api/namespaces', { params: { namespace: 'default' } })
    .then((res) => {
      console.log('namespaces api response:', res);
      return res.data ?? [];
    });
}
