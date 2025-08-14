import { FastifyInstance } from 'fastify';
import { exec } from 'child_process';

export default async function applistRoutes(fastify: FastifyInstance) {
  fastify.get('/api/applist', async (request, reply) => {
    const namespace = (request.query as any).namespace || 'default';

    // 执行 helm list 命令获取指定 namespace 的 release 列表
    const cmd = `helm list -n ${namespace} --output json`;
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
          console.log(result);
          console.log(data);
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
}
