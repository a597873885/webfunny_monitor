//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/HttpLogReqInfo')
//delete//
const HttpLogInfo = function (sequelize, DataTypes) {
  const { fieldIndex, fields } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'HttpLogReqInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = HttpLogInfo
//exports//