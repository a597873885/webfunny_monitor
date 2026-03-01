/**
 * SourceMap 文件路由
 */

const { SourceMapFileController } = require('../../controllers/controllers')

module.exports = (router) => {
  /**
   * SourceMap 文件管理接口
   * 路径前缀: /wfApm/api/sourceMapFile
   */
  
  // 上传文件
  router.post('/api/sourceMapFile/upload', SourceMapFileController.uploadFile)
  
  // 获取文件列表（分页）
  router.get('/api/sourceMapFile/list', SourceMapFileController.getFileList)
  
  // 获取文件详情
  router.get('/api/sourceMapFile/detail/:id', SourceMapFileController.getFileDetail)
  
  // 下载文件
  router.get('/api/sourceMapFile/download/:id', SourceMapFileController.downloadFile)
  
  // 获取版本列表
  router.get('/api/sourceMapFile/versions', SourceMapFileController.getVersionList)
  
  // 获取版本统计
  router.get('/api/sourceMapFile/versionStats', SourceMapFileController.getVersionStats)
  
  // 获取项目统计
  router.get('/api/sourceMapFile/projectStats', SourceMapFileController.getProjectStats)
  
  // 获取所有项目统计
  router.get('/api/sourceMapFile/allProjects', SourceMapFileController.getAllProjectsStats)
  
  // 删除文件
  router.delete('/api/sourceMapFile/:id', SourceMapFileController.deleteFile)
  
  // 删除整个版本
  router.delete('/api/sourceMapFile/version', SourceMapFileController.deleteVersion)
}

