import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({
  logger: true
});

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
