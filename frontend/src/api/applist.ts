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
    .get('/api/applist')
    .then((res) => {
      console.log('applist api response:', res);
      return res.data ?? [];
    });
}
