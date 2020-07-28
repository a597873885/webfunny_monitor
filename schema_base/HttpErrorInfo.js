//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/HttpErrorInfo')
//delete//
const HttpErrorInfo = function (sequelize, DataTypes) {
  const { fields, fieldIndex } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'HttpErrorInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = HttpErrorInfo
//exports//