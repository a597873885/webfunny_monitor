//delete//
const getTableProperty = require('../schema_con/locationPoints')
//delete//
const LocationPoints = function (sequelize, DataTypes) {
  const {fieldIndex, fields} = getTableProperty(DataTypes)
  return sequelize.define('LocationPoints' + 'date-tail', {
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = LocationPoints 
//exports//