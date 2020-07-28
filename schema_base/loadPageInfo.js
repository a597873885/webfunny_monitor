//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/loadPageInfo')
//delete//
const LoadPageInfo = function (sequelize, DataTypes) {
  const {fieldIndex, fields} = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'LoadPageInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = LoadPageInfo 
//exports//