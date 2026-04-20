FROM  node:16.20.2-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    iputils-ping \
    curl \
    telnet \
    lsof \
    net-tools \
    procps \
    vim \
  && rm -rf /var/lib/apt/lists/*

RUN npm install pm2 -g
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run bootstrap
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 9010
EXPOSE 9011
CMD npm run prd