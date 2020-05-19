FROM  node:10.6.0-slim
RUN npm install pm2 -g
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 8010
EXPOSE 8011
CMD npm run prd