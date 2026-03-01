const { Common } = require("../../controllers/controllers.js")

module.exports = (router) => {
    router.get('/getAllTableList', Common.getAllTableList);
}
