//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/HttpErrorInfo')
//delete//
const HttpLogInfo = function (sequelize, DataTypes) {
  const { fieldIndex, fields } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'HttpLogInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = HttpLogInfo
//exports//