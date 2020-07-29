//delete//
const getTableProperty = require('../schema_con/CustomerStayTime')
//delete//
const CustomerStayTime = function (sequelize, DataTypes) {
  const { fields, fieldIndex } = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'CustomerStayTime' + 'date-tail', {
    ...fields
  }, fieldIndex)

}
//exports//
module.exports = CustomerStayTime
//exports//