//delete//
const baseInfo = require('./baseInfo');
const Utils = require('../util/utils');
const getTableProperty = require('../schema_con/pageLoadInfo')
//delete//
const PageLoadInfo = function (sequelize, DataTypes) {
  const {fieldIndex, fields} = getTableProperty(DataTypes)
  return sequelize.define(Utils.setTableName('PageLoadInfo'), {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = PageLoadInfo 
//exports//