//delete//
const baseInfo = require('./baseInfo');
const Utils = require('../util/utils');
const getTableProperty = require('../schema_con/loadPageInfo')
//delete//
const LoadPageInfo = function (sequelize, DataTypes) {
  const {fieldIndex, fields} = getTableProperty(DataTypes)
  return sequelize.define(Utils.setTableName('LoadPageInfo'), {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = LoadPageInfo 
//exports//