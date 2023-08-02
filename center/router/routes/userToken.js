// const UserTokenController = require('../../controllers/UserToken')
const { UserTokenController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 验证token
    router.post('/checkToken', UserTokenController.checkToken);
    // 检查登录信息是否存在(服务器间通信，废弃)
    router.post('/getUserTokenFromNetworkByToken', UserTokenController.getUserTokenFromNetworkByToken);
}
