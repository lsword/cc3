import axios from 'axios';

export interface ApplistItem {
  id: number;
  name: string;
  updateCount: number;
  status: string;
  package: string;
  version: string;
  repo: string;
}

export function getApplist(): Promise<ApplistItem[]> {
  return axios
    .get('/api/applist', { params: { namespace: 'default' } })
    .then((res) => {
      console.log('applist api response:', res);
      return res.data ?? [];
    });
}

export function getAppDetail(name: string): Promise<ApplistItem | null> {
  return axios
    .get(`/api/app/${encodeURIComponent(name)}`, { params: { namespace: 'default' } })
    .then((res) => {
      if (res.data && res.data.code === 20000) {
        return res.data.data;
      }
      return null;
    });
}
