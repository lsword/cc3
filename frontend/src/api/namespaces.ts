import axios from 'axios';

export async function getNamespaces() {
  const res = await axios.get('/api/namespaces');
  console.log('namespaces api response:', res);
  return res.data ?? [];
}
