import { createClient } from 'redis';

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        return new Error('Max retries reached');
      }
      return Math.min(retries * 100, 5000);
    },
  },
};

export const initRedis = async () => {
  const client = createClient(redisConfig);
  
  client.on('error', (err) => {
    console.error('Redis error:', err);
  });
  
  await client.connect();
  return client;
};

export const healthCheck = async (client) => {
  try {
    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};