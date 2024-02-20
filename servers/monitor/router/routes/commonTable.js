const { CommonTableController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    /**
     * 查询表名
     */
    router.post('/getTableList', CommonTableController.getTableList);
    /**
     * drop 表结构
     */
    router.post('/dropTable', CommonTableController.dropTable);
    /**
     * create表结构
     */
    router.post('/createLogTable', CommonTableController.createLogTable);
    /**
     * 更新表结构
     */
    router.post('/updateTableBySql', CommonTableController.updateTableBySql);
}
