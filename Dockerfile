# build stage
FROM registry.cn-beijing.aliyuncs.com/sf-service/node:20.13.1 as build-stage
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./

RUN npm config set registry https://registry.npmmirror.com
# RUN yarn config set registry https://registry.npm.taobao.org
# RUN npm config set registry https://mirrors.huaweicloud.com/repository/npm/
RUN yarn config set registry https://registry.npmmirror.com
RUN npm install -g cnpm -registry=https://registry.npmmirror.com

RUN npm install
COPY . .


RUN npm run build

# production stage
FROM registry.cn-beijing.aliyuncs.com/sf-service/nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
