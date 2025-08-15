import { FastifyInstance } from 'fastify';

// 如需接入真实 k8s，可引入 k8s 客户端
// import k8s = require('@kubernetes/client-node');

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/namespaces', async (request, reply) => {
    // TODO: 这里可接入 k8s API 查询
    // const kc = new k8s.KubeConfig();
    // kc.loadFromDefault();
    // const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    // const result = await k8sApi.listNamespace();
    // const namespaces = result.body.items.map(ns => ns.metadata?.name);

    // 先返回 mock 数据
    const namespaces = ['default', 'kube-system', 'dev', 'prod', 'test'];
    return { code: 20000, data: namespaces, msg: 'success' };
  });
}
