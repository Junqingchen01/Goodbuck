/********************************************************************************
 * [新增/修改功能]: Redis 内存数据库连接池与平滑降级客户端 (Redis Client with Graceful Fallback)
 * [修改原因]: 提供统一的高性能 Redis 读写接口，用于缓存 JWT 会话、大盘统计及 Token 黑名单，同时包含连接失败时的自动优雅降级机制
 ********************************************************************************/
const Redis = require('ioredis');
require('dotenv').config();

let redisClient = null;
let isRedisConnected = false;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: (times) => {
      if (times > 2) {
        console.warn('⚠️ [Redis]: 无法连接到 Redis 服务器，后端自动平滑降级为纯 MySQL 运行模式');
        return null;
      }
      return Math.min(times * 200, 1000);
    }
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    console.log('✅ [Redis]: 成功连接至 Redis 内存缓存服务器');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
  });

  redisClient.connect().catch((err) => {
    isRedisConnected = false;
  });
} catch (e) {
  isRedisConnected = false;
}

const getCache = async (key) => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 600) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return true;
  } catch (err) {
    return false;
  }
};

const delCache = async (key) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    return false;
  }
};

const delCachePattern = async (pattern) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  redisClient,
  getCache,
  setCache,
  delCache,
  delCachePattern,
  isRedisAvailable: () => isRedisConnected,
};
/********************************************************************************/
