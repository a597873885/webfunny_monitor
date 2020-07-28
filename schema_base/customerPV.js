//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/customerPV')
//delete//
const CustomerPV = function (sequelize, DataTypes) {
  const { fields, fieldIndex } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'CustomerPV' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)

}
//exports//
module.exports = CustomerPV
//exports//