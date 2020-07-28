//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/videosInfo')
//delete//
const VideosInfo = function (sequelize, DataTypes) {
  const {fieldIndex, fields} = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'VideosInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = VideosInfo
//exports//