//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/javascriptErrorInfo')
//delete//
const JavascriptErrorInfo = function (sequelize, DataTypes) {
  const { fieldIndex, fields } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'JavascriptErrorInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = JavascriptErrorInfo
//exports//