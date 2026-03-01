/**
 * 按年建表
 */
const { DataTypes } = require("sequelize");

const FlowDataInfoByDaySchema = require('./flowDataInfoByDay')
const FlowDataInfoByDayConfig = FlowDataInfoByDaySchema(DataTypes)

const FlowDataInfoByHourSchema = require('./flowDataInfoByHour')
const FlowDataInfoByHourConfig = FlowDataInfoByHourSchema(DataTypes)

const schemaList = [
    {
        name: "FlowDataInfoByDay",
        fields: FlowDataInfoByDayConfig.fields,
        index: FlowDataInfoByDayConfig.fieldIndex
    },
    {
        name: "FlowDataInfoByHour",
        fields: FlowDataInfoByHourConfig.fields,
        index: FlowDataInfoByHourConfig.fieldIndex
    },
]
//exports//
module.exports = schemaList
//exports//