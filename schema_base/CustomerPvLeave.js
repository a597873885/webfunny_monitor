//delete//
const getTableProperty = require('../schema_con/CustomerPvLeave')
//delete//
const CustomerPvLeave = function (sequelize, DataTypes) {
  const { fields, fieldIndex } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'CustomerPvLeave' + 'date-tail', {
    ...fields
  }, fieldIndex)

}
//exports//
module.exports = CustomerPvLeave
//exports//