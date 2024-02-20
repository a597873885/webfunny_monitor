FROM  node:14.16.1-slim
RUN npm install pm2 -g
COPY . /app
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install
RUN npm run bootstrap
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 9010
EXPOSE 9011
CMD npm run prd