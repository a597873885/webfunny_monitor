const { MenuPermissionsController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 更新菜单权限
    router.post('/updateMenuPermission', MenuPermissionsController.updateMenuPermission);
    // 根据项目id获取菜单权限
    router.post('/getMenuPermissionsByProject', MenuPermissionsController.getMenuPermissionsByProject);
}
