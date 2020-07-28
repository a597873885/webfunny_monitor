//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/behaviorInfo')
//delete//
const BehaviorInfo = function (sequelize, DataTypes) {
  const { fields, fieldIndex } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'BehaviorInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)

}
//exports//
module.exports = BehaviorInfo
//exports//