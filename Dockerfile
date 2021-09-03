FROM node:lts-alpine
RUN apk add --no-cache tzdata \
 && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
 && echo 'Asia/Shanghai' > /etc/timezone \
 && wget -O /tmp/webfunny.zip https://codeload.github.com/a597873885/webfunny_monitor/zip/refs/heads/master \
 && unzip /tmp/webfunny.zip \
 && rm -f /tmp/webfunny.zip \
 && mv webfunny* /app \
 && cd /app \
 && npm install . pm2 \
 && rm -rf /root/.npm \
 && npm run init \
 && mv bin/mysqlConfig.js bin/mysqlConfig.js.def
COPY entrypoint.sh /app/
WORKDIR /app
EXPOSE 8010 8011
CMD /app/entrypoint.sh