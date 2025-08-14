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
      return { code: 20000, data: { token }, msg: 'success' };
    } else {
      reply.code(401).send({ code: 401, msg: 'Invalid credentials' });
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

  // 用户信息接口
  fastify.post('/api/user/info', async (request, reply) => {
    // 简单示例，实际应校验 token 并返回用户信息
    // 这里假设已登录用户为 admin
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

  // 获取应用列表接口
  fastify.get('/api/applist', async (request, reply) => {
    return {
      code: 20000,
      data: [
        {
          id: 1,
          name: '示例应用A',
          updateCount: 5,
          status: '正常',
          package: 'app-a.pkg',
          version: '1.2.3',
          repo: 'https://github.com/example/app-a',
        },
        {
          id: 2,
          name: '示例应用B',
          updateCount: 2,
          status: '异常',
          package: 'app-b.pkg',
          version: '2.0.1',
          repo: 'https://github.com/example/app-b',
        },
      ],
      msg: 'success'
    };
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
