FROM  node:14.16.1-slim
RUN npm install pm2 -g
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run bootstrap
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 8008
EXPOSE 8009
EXPOSE 8010
EXPOSE 8011
EXPOSE 8014
EXPOSE 8015
CMD npm run prd