//delete//
const baseInfo = require('./baseInfo');
const getTableProperty = require('../schema_con/ScreenShotInfo')
//delete//
const ScreenShotInfo = function (sequelize, DataTypes) {
  const {fieldIndex, fields} = getTableProperty(DataTypes)
  return sequelize.define('id-head' + 'ScreenShotInfo' + 'date-tail', {
    ...baseInfo(DataTypes),
    ...fields
  }, fieldIndex)
}
//exports//
module.exports = ScreenShotInfo
//exports//