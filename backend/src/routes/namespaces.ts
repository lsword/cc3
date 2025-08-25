import { FastifyInstance } from 'fastify';
import * as k8s from '@kubernetes/client-node';
import dotenv from 'dotenv';
dotenv.config();

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/namespaces', async (request, reply) => {
    // 推荐在 .env 文件中配置 K8S_TOKEN=xxx
    const token = process.env.K8S_TOKEN || '';
    if (!token) {
      reply.code(500).send({ code: 500, msg: 'K8S_TOKEN not set in environment' });
      return;
    }

    // 构造 KubeConfig，使用 BearerToken 认证
    const kc = new k8s.KubeConfig();
    kc.loadFromOptions({
      clusters: [
        {
          name: 'cluster',
          server: process.env.K8S_SERVER || 'https://kubernetes.default.svc',
          skipTLSVerify: true,
        },
      ],
      users: [
        {
          name: 'user',
          token,
        },
      ],
      contexts: [
        {
          name: 'context',
          user: 'user',
          cluster: 'cluster',
        },
      ],
      currentContext: 'context',
    });

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    try {
      const result = await k8sApi.listNamespace();
      const namespaces = result.items.map((ns: any) => ns.metadata?.name).filter(Boolean);
      return { code: 20000, data: namespaces, msg: 'success' };
    } catch (err: any) {
      // 输出详细异常信息，便于排查
      console.error('K8s API error:', err);
      // fallback: mock 数据
      const namespaces = ['default', 'kube-system'];
      return { code: 20000, data: namespaces, msg: 'mock fallback: ' + (err && err.message ? err.message : JSON.stringify(err)) };
    }
  });
}
