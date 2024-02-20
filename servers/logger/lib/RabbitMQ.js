let amqp = require('amqplib');


module.exports = class RabbitMQ {
  constructor() {
    // amqp://webfunny_user:sdkjlsd_@12300HJ_@139.196.230.69:5672
    this.hosts = ["amqp://用户名:密码@127.0.0.1:5672"]; 
    this.index = 0;
    this.length = this.hosts.length;
    this.open = amqp.connect({
      protocol: 'amqp',
      hostname: '139.196.230.69',
      port: 5672,
      username: 'webfunny_user',
      password: 'sdkjlsd_',
      locale: 'en_US',
      frameMax: 0,
      heartbeat: 0,
      vhost: '/',
    });
  }

  sendQueueMsg(queueName, msg, successCallback, errorCallBack) {
    let self = this;
    self.open
      .then(function (conn) {
        return conn.createChannel();
      })
      .then(function (channel) {
        return channel.assertQueue(queueName).then(function (ok) {
          return channel.sendToQueue(queueName, new Buffer.from(msg), {
            persistent: true
          });
        }).then(function (data) {
            if (data) {
              typeof successCallback === "function" && successCallback("success");
              channel.close();
            }
        }).catch(function (e) {
          errorCallBack ** errorCallBack(e)
            setTimeout(() => {
              if (channel) {
                channel.close();
              }
            }, 500)
          });
      })
      .catch(function (e) {
        typeof errorCallBack === "function" && errorCallBack(e)
        // let num = self.index++;
        //
        // if (num <= self.length - 1) {
        //   self.open = amqp.connect(self.hosts[num]);
        // } else {
        //   self.index == 0;
        // }
      });
  }

  receiveQueueMsg(queueName, receiveCallBack, errCallBack) {
    let self = this;

    self.open
      .then(function (conn) {
        return conn.createChannel();
      })
      .then(function (channel) {
        return channel.assertQueue(queueName).then(function (ok) {
            channel.prefetch(10, false);
            return channel.consume(queueName, function (msg) {
              if (msg !== null) {
                let data = msg.content.toString();
                receiveCallBack && receiveCallBack(data, function() {});
                channel.ack(msg);
              }
            }).finally(function () { });
          })
      })
      .catch(function (e) {
        errCallBack(e)
        /**
         * 下面的逻辑是做容灾处理，会有多个rabbitmq服务用来切换
         * @type {number}
          let num = self.index++;
           if (num <= self.length - 1) {
            self.open = amqp.connect(self.hosts[num]);
          } else {
            self.index = 0;
            self.open = amqp.connect(self.hosts[0]);
          }
         */

      });
  }
}
// var mq = new RabbitMQ()
// setInterval(function () {
//   mq.sendQueueMsg("queue1", "这是一个队列消息", function (err) {
//     console.log(err)
//   })
// }, 5000)
//
// setInterval(function () {
//   mq.receiveQueueMsg("queue1", function (msg) {
//     console.log(msg)
//   }, function (error) {
//     console.log(error)
//   })
// }, 5000)

