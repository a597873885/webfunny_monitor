/**
 * 按年建表
 */
const { DataTypes } = require("sequelize");

const FlowDataInfoByDaySchema = require('./flowDataInfoByDay')
const FlowDataInfoByDayConfig = FlowDataInfoByDaySchema(DataTypes)

const schemaList = [
    {
        name: "FlowDataInfoByDay",
        fields: FlowDataInfoByDayConfig.fields,
        index: FlowDataInfoByDayConfig.fieldIndex
    },
]
//exports//
module.exports = schemaList
//exports//