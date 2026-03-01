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
    router.post('/updateFieldBySql', CommonTableController.updateFieldBySql);


    /**
     * 批量操作表结构
     */
    // 批量添加字段
    router.post('/addColumnByWebMonitorIds', CommonTableController.addColumnByWebMonitorIds);
    // 批量更新字段
    // router.post('/updateColumnByWebMonitorIds', CommonTableController.updateColumnByWebMonitorIds);

}
