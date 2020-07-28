//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/resourceLoadInfo')
//delete//
const ResourceLoadInfo = function (sequelize, DataTypes) {
  const { fieldIndex, fields } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'ResourceLoadInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = ResourceLoadInfo
//exports//