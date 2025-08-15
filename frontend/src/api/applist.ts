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

export interface K8sManifest {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    labels?: Record<string, string>;
    [key: string]: any;
  };
  spec?: any;
  [key: string]: any;
}

export function getAppDetail(name: string): Promise<K8sManifest[] | null> {
  return axios
    .get(`/api/app/${encodeURIComponent(name)}`, { params: { namespace: 'default' } })
    .then((res) => {
      return res.data as K8sManifest[];
    });
}
