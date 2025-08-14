import { FastifyInstance } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) {
  // 登录接口，签发 token
  fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };
    if (username === 'admin' && password === '123456') {
      const token = (fastify as any).jwt.sign({ username });
      return { code: 20000, data: { token }, msg: 'success' };
    } else {
      reply.code(401).send({ code: 401, msg: 'Invalid credentials' });
    }
  });
}
