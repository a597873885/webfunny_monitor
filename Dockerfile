FROM  node:10.6.0-slim
RUN npm install pm2 -g
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 8010
EXPOSE 8011
CMD npm run prd