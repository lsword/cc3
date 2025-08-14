import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

const fastify = Fastify({
  logger: true
});

// 注册 JWT 插件
fastify.register(jwt, {
  secret: 'your-secret-key', // 请替换为更安全的密钥
});

fastify.after(() => {
  // 登录接口，签发 token
  fastify.post('/api/login', async (request, reply) => {
    // 简单示例，实际应校验用户名密码
    const { username, password } = request.body as { username: string; password: string };
    if (username === 'admin' && password === '123456') {
      const token = (fastify as any).jwt.sign({ username });
      return { token };
    } else {
      reply.code(401).send({ error: 'Invalid credentials' });
    }
  });

  // JWT 校验装饰器
  fastify.decorate(
    'authenticate',
    async function (request: any, reply: any) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }
  );

  // 示例接口
  fastify.get('/api/hello', async (request, reply) => {
    return { message: 'Hello from Fastify backend!' };
  });

  // 受保护接口
  fastify.get('/api/profile', { preHandler: [(fastify as any).authenticate] }, async (request, reply) => {
    // request.user 包含解码后的 token 信息
    return { user: (request as any).user };
  });
});

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: '*'
    });
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Fastify server is running at http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
