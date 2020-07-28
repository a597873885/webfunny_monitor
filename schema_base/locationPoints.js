//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/locationPoints')
//delete//
const LoadPageInfo = function (sequelize, DataTypes) {
  const {fieldIndex, fields} = getTableProperty(DataTypes)
  return sequelize.define('LocationPoints' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = LoadPageInfo 
//exports//