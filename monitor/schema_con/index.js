const { DataTypes } = require("sequelize");

const BaseInfoSchema = require('../schema/baseInfo')
const BaseFields = BaseInfoSchema(DataTypes)

const CustomerPvSchema = require('./customerPV')
const CustomerPvConfig = CustomerPvSchema(DataTypes)

const BehaviorInfoSchema = require('./behaviorInfo')
const BehaviorInfoConfig = BehaviorInfoSchema(DataTypes)

const CustomerPvLeaveSchema = require('./CustomerPvLeave')
const CustomerPvLeaveConfig = CustomerPvLeaveSchema(DataTypes)

const CustomerStayTimeSchema = require('./CustomerStayTime')
const CustomerStayTimeConfig = CustomerStayTimeSchema(DataTypes)

const ExtendBehaviorInfoSchema = require('./extendBehaviorInfo')
const ExtendBehaviorInfoConfig = ExtendBehaviorInfoSchema(DataTypes)

const HttpErrorInfoSchema = require('./HttpErrorInfo')
const HttpErrorInfoConfig = HttpErrorInfoSchema(DataTypes)

const HttpLogInfoSchema = require('./HttpLogInfo')
const HttpLogInfoConfig = HttpLogInfoSchema(DataTypes)

const HttpLogReqInfoSchema = require('./HttpLogReqInfo')
const HttpLogReqInfoConfig = HttpLogReqInfoSchema(DataTypes)

const JavascriptErrorInfoSchema = require('./javascriptErrorInfo')
const JavascriptErrorInfoConfig = JavascriptErrorInfoSchema(DataTypes)

const LoadPageInfoSchema = require('./loadPageInfo')
const LoadPageInfoConfig = LoadPageInfoSchema(DataTypes)

const PageLoadInfoSchema = require('./pageLoadInfo')
const PageLoadInfoConfig = PageLoadInfoSchema(DataTypes)

const ResourceLoadInfoSchema = require('./resourceLoadInfo')
const ResourceLoadInfoConfig = ResourceLoadInfoSchema(DataTypes)

const ScreenShotInfoSchema = require('./ScreenShotInfo')
const ScreenShotInfoConfig = ScreenShotInfoSchema(DataTypes)

const VideosInfoSchema = require('./videosInfo')
const VideosInfoConfig = VideosInfoSchema(DataTypes)

const schemaList = [
    {
        name: "BehaviorInfo",
        fields: { ...BaseFields, ...BehaviorInfoConfig.fields },
        index: BehaviorInfoConfig.fieldIndex
    },
    {
        name: "CustomerPV",
        fields: { ...BaseFields, ...CustomerPvConfig.fields },
        index: CustomerPvConfig.fieldIndex
    },
    {
        name: "CustomerPvLeave",
        fields: { ...BaseFields, ...CustomerPvLeaveConfig.fields },
        index: CustomerPvLeaveConfig.fieldIndex
    },
    {
        name: "CustomerStayTime",
        fields: { ...BaseFields, ...CustomerStayTimeConfig.fields },
        index: CustomerStayTimeConfig.fieldIndex
    },
    {
        name: "ExtendBehaviorInfo",
        fields: { ...BaseFields, ...ExtendBehaviorInfoConfig.fields },
        index: ExtendBehaviorInfoConfig.fieldIndex
    },
    {
        name: "HttpErrorInfo",
        fields: { ...BaseFields, ...HttpErrorInfoConfig.fields },
        index: HttpErrorInfoConfig.fieldIndex
    },
    {
        name: "HttpLogInfo",
        fields: { ...BaseFields, ...HttpLogInfoConfig.fields },
        index: HttpLogInfoConfig.fieldIndex
    },
    {
        name: "HttpLogReqInfo",
        fields: { ...BaseFields, ...HttpLogReqInfoConfig.fields },
        index: HttpLogReqInfoConfig.fieldIndex
    },
    {
        name: "JavascriptErrorInfo",
        fields: { ...BaseFields, ...JavascriptErrorInfoConfig.fields },
        index: JavascriptErrorInfoConfig.fieldIndex
    },
    {
        name: "LoadPageInfo",
        fields: { ...BaseFields, ...LoadPageInfoConfig.fields },
        index: LoadPageInfoConfig.fieldIndex
    },
    {
        name: "PageLoadInfo",
        fields: { ...BaseFields, ...PageLoadInfoConfig.fields },
        index: PageLoadInfoConfig.fieldIndex
    },
    {
        name: "ResourceLoadInfo",
        fields: { ...BaseFields, ...ResourceLoadInfoConfig.fields },
        index: ResourceLoadInfoConfig.fieldIndex
    },
    {
        name: "ScreenShotInfo",
        fields: { ...BaseFields, ...ScreenShotInfoConfig.fields },
        index: ScreenShotInfoConfig.fieldIndex
    },
    {
        name: "VideosInfo",
        fields: { ...BaseFields, ...VideosInfoConfig.fields },
        index: VideosInfoConfig.fieldIndex
    },
]

module.exports = schemaList