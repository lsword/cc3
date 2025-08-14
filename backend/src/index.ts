import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import applistRoutes from './routes/applist.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';

const fastify = Fastify({
  logger: true
});

// 注册 JWT 插件
fastify.register(jwt, {
  secret: 'your-secret-key', // 请替换为更安全的密钥
});

// 注册路由
fastify.register(applistRoutes);
fastify.register(userRoutes);
fastify.register(authRoutes);

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
