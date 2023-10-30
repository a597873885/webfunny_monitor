/**
 * 按天建表
 */
const { DataTypes } = require("sequelize");

const FlowDataInfoByHourSchema = require('./flowDataInfoByHour')
const FlowDataInfoByHourConfig = FlowDataInfoByHourSchema(DataTypes)


const schemaList = [
    {
        name: "FlowDataInfoByHour",
        fields: FlowDataInfoByHourConfig.fields,
        index: FlowDataInfoByHourConfig.fieldIndex
    },
]
//exports//
module.exports = schemaList
//exports//