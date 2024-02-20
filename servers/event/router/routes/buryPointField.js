const { BuryPointFieldController } = require("../../controllers/controllers")

module.exports = (router) => {
    /**
     * 点位字段接口
     */
    router.post('/buryPointField/create', BuryPointFieldController.create);
    router.get('/buryPointField/detail', BuryPointFieldController.detail);
    router.post('/buryPointField/update', BuryPointFieldController.update);
    router.post('/buryPointField/delete', BuryPointFieldController.delete);
    router.post('/buryPointField/page', BuryPointFieldController.getPageList);
    router.post('/buryPointField/list', BuryPointFieldController.getNoWeList);
    router.post('/buryPointField/getListByPointId', BuryPointFieldController.getListByPointId);
    router.post('/buryPointField/getListAndWfByPointId', BuryPointFieldController.getListAndWfByPointId);
    router.post('/buryPointField/getListAndWfByProjectId', BuryPointFieldController.getListAndWfByProjectId);
    router.get('/buryPointField/AllList', BuryPointFieldController.getAllList);
    router.post('/buryPointField/fieldExport', BuryPointFieldController.exportField);
    router.post('/buryPointField/getFieldCount', BuryPointFieldController.getFieldCount);
}
