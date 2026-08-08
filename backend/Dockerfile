# /********************************************************************************
#  * [新增功能]: Node.js 后端服务 Docker 多阶段构建镜像配置文件 (Multi-stage Dockerfile)
#  * [应用场景]: 实现轻量化、高安全的生产环境镜像打包，将镜像体积精简至最小 (< 150MB)
#  ********************************************************************************/

# 第一阶段：构建并安装生产依赖
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 第二阶段：最终运行环境镜像
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

USER node

CMD ["node", "index.js"]
# /********************************************************************************/
