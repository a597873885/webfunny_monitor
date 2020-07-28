//delete//
const getTableProperty = require('../schema_con/extendBehaviorInfo')
//delete//
const ExtendBehaviorInfo = function (sequelize, DataTypes) {
  const { fields, fieldIndex } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'ExtendBehaviorInfo' + 'date-tail', {
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = ExtendBehaviorInfo
//exports//