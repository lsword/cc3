import { FastifyInstance } from 'fastify';
import { exec } from 'child_process';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
dotenv.config();

export default async function applistRoutes(fastify: FastifyInstance) {
  fastify.get('/api/applist', async (request, reply) => {
    const namespace = (request.query as any).namespace || 'default';

    // 读取 apiserver 和 token 环境变量
    const apiserver = process.env.K8S_SERVER;
    const token = process.env.K8S_TOKEN;
    // 拼接 helm list 命令，带上 apiserver 和 token
    const kubeArgs = apiserver && token ? `--kube-apiserver ${apiserver} --kube-token ${token} --kube-insecure-skip-tls-verify` : '';
    const cmd = `helm list -n ${namespace} --output json ${kubeArgs}`;
    console.log(apiserver, cmd);
    return new Promise((resolve) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          resolve({
            code: 500,
            msg: `获取 Helm 应用失败: ${stderr || error.message}`,
            data: []
          });
          return;
        }
        try {
          const result = JSON.parse(stdout);
          // helm list --output json 返回 { "Releases": [ ... ] }
          const data = (result || []).map((item: any, idx: number) => ({
            id: idx + 1,
            name: item.name,
            updateCount: item.revision,
            status: item.status,
            package: item.chart,
            version: item.app_version,
            repo: '', // helm list 不直接返回 repo，可后续扩展
          }));
          resolve({
            code: 20000,
            data,
            msg: 'success'
          });
        } catch (e) {
          resolve({
            code: 500,
            msg: 'Helm 输出解析失败',
            data: []
          });
        }
      });
    });
  });

  fastify.get('/api/app/:name', async (request, reply) => {
    const namespace = (request.query as any).namespace || 'default';
    const name = (request.params as any).name;

    // 读取 apiserver 和 token 环境变量
    const apiserver = process.env.APISERVER;
    const token = process.env.TOKEN;
    const kubeArgs = apiserver && token ? `--kube-apiserver ${apiserver} --kube-token ${token}` : '';
    // 用 helm get manifest 获取指定 app 的 manifest
    const cmd = `helm get manifest -n ${namespace} ${name} ${kubeArgs}`;
    return new Promise((resolve) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          resolve({
            code: 500,
            msg: `获取 Helm manifest 失败: ${stderr || error.message}`,
            data: null
          });
          return;
        }
        try {
          // manifest 可能包含多个 yaml 文档，用 --- 分隔
          const docs = stdout
            .split(/^---$/m)
            .map((doc: string) => doc.trim())
            .filter((doc: string) => doc.length > 0)
            .map((doc: string) => yaml.load(doc));
          // 按 kind 分类
          resolve({
            code: 20000,
            data: docs,
            msg: 'success'
          });
        } catch (e) {
          console.error('Manifest 解析异常:', e);
          resolve({
            code: 500,
            msg: 'Manifest 解析失败',
            data: { error: e, manifest: stdout }
          });
        }
      });
    });
  });
}
