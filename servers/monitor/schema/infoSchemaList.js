const { DataTypes } = require("../node_clickhouse/consts");

const PageLoadInfoByMinuteSchema = require('./pageLoadInfoByMinute')
const PageLoadInfoByMinuteConfig = PageLoadInfoByMinuteSchema(DataTypes)

const schemaList = [
    {
        name: "PageLoadInfoByMinute",
        fields: PageLoadInfoByMinuteConfig.fields,
        index: PageLoadInfoByMinuteConfig.fieldIndex
    },
]

module.exports = schemaList