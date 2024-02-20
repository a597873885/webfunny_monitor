const { HttpErrorInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    /**
     * 接口请求报错相关接口
     */
    // 获取接口请求出错的实时数据量
    router.get('/getHttpErrorCountByHour', HttpErrorInfoController.getHttpErrorInfoListByHour);
    // 获取每天的接口请求出错的数据量
    router.get('/getHttpErrorCountByDay', HttpErrorInfoController.getHttpErrorCountByDay);
    // 获取每天的出错的接口请求列表
    router.post('/getHttpErrorListByDay', HttpErrorInfoController.getHttpErrorListByDay);
    // 获取每天的出错的ErrorCode数量
    router.post('/getStatusListGroupByErrorCode', HttpErrorInfoController.getStatusListGroupByErrorCode);
    // 获取每天的出错的HttpUrl列表
    router.post('/getHttpErrorSort', HttpErrorInfoController.getHttpErrorSort);
    // 获取httpError详情
    router.post('/getHttpErrorSortInfo', HttpErrorInfoController.getHttpErrorSortInfo);
    // 根据版本号获取Http错误数量
    router.post('/getHttpErrorCountByVersion', HttpErrorInfoController.getHttpErrorCountByVersion);
    // 根据版本号获取HTTP错误数量,的相关详情
    router.post('/getHttpErrorVersionSortInfo', HttpErrorInfoController.getHttpErrorVersionSortInfo);
    // 根据url获取的出错的接口请求列表
    router.post('/getHttpErrorListByUrl', HttpErrorInfoController.getHttpErrorListByUrl);
    // 根据错误码计算数据
    router.post('/getErrorCodeForGroup', HttpErrorInfoController.getErrorCodeForGroup);
}
