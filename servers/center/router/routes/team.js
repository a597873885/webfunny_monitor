// const TeamController = require('../../controllers/team')
const { TeamController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 添加team
    router.post('/team', TeamController.create);
    // 获取团队列表
    router.post("/getTeamList", TeamController.getTeamList)
    router.post("/getSimpleTeamList", TeamController.getSimpleTeamList)
    router.post("/getTeamMemberByUser", TeamController.getTeamMemberByUser)
    router.post("/getTeamListWithoutToken", TeamController.getTeamListWithoutToken)
    router.post("/getTeams", TeamController.getTeams)
    router.post("/addTeamMember", TeamController.addTeamMember)
    router.post("/createNewTeam", TeamController.createNewTeam)
    router.post("/createNewTeamForApi", TeamController.createNewTeamForApi)
    router.post('/deleteTeam', TeamController.deleteTeam);
    router.post('/moveProToTeam', TeamController.moveProToTeam)
    router.post('/updateTeamProjects', TeamController.updateTeamProjects)
    // 获取团队下的成员
    router.post("/getTeamMembersByWebMonitorId", TeamController.getTeamMembersByWebMonitorId)
    // 获取所有团队列表
    router.post("/getAllTeamList", TeamController.getAllTeamList)
    // 将团长移交给其他人
    router.post("/resetTeamLeader", TeamController.resetTeamLeader)
    // 根据团长的userId获取团队列表
    router.post("/findTeamListByLeaderId", TeamController.findTeamListByLeaderId)
    // 获取team详情
    router.post("/getTeamDetail", TeamController.getTeamDetail)
    // 更新团队
    router.post("/updateTeam", TeamController.updateTeam)

    // 设置观察者
    router.post('/addViewers', TeamController.addViewers);
    // 禁用项目权限验证
    router.post('/forbiddenRightCheck', TeamController.forbiddenRightCheck);
    // 禁用项目
    router.post('/forbiddenProject', TeamController.forbiddenProject);
    // 删除项目权限验证
    router.post('/deleteProjectRightCheck', TeamController.deleteProjectRightCheck);
    // 删除项目
    router.post('/deleteProject', TeamController.deleteProject);
}
