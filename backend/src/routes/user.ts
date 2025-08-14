import { FastifyInstance } from 'fastify';

export default async function userRoutes(fastify: FastifyInstance) {
  // 受保护接口
  fastify.get('/api/profile', { preHandler: [(fastify as any).authenticate] }, async (request, reply) => {
    return { user: (request as any).user };
  });

  // 用户信息接口
  fastify.post('/api/user/info', async (request, reply) => {
    return {
      code: 20000,
      data: {
        name: 'admin',
        role: 'admin',
        avatar: '',
        job: '前端工程师',
        organization: 'ACME',
        location: 'China',
        email: 'admin@example.com',
        introduction: '管理员',
        personalWebsite: '',
        jobName: '前端',
        organizationName: 'ACME',
        locationName: '中国',
        phone: '123456789',
        registrationDate: '2025-01-01',
        accountId: '1',
        certification: '',
      },
      msg: 'success'
    };
  });
}
