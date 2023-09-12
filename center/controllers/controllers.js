const db = require('../config/db');
                                        const Sequelize = db.sequelize;
                                        const colors = require('colors');
                                        const Utils = require('../util/utils');
                                        const utils = require('../util/utils');
                                        const CusUtils = require('../util_cus')
                                        const log = require("../config/log");
                                        const statusCode = require('../util/status-code');
                                        const { UPLOAD_TYPE, FLOW_TYPE, PROJECT_INFO, USER_INFO, WEBFUNNY_CONFIG_URI } = require('../config/consts');
                                        const fetch = require('node-fetch');
                                        const jwt = require('jsonwebtoken')
                                        const secret = require('../config/secret')
                                        const xlsx = require('node-xlsx');
                                        const fs = require('fs');
                                        const nodemailer = require('nodemailer');
                                        const formidable = require("formidable");
                                        const AccountConfig = require('../config/AccountConfig');
                                        const process = require('child_process')
                                        const getmac = require('getmac')
                                        const { spawn, exec, execFile } = require('child_process');
                                        const { accountInfo } = AccountConfig
                                        const { feiShuConfig } = require("../sso")
                                        const Consts = require('../config/consts')
                                        const { PROJECT_API } = Consts
                                        const ProductTypeMap = { monitor: '监控', event: '埋点' }
                                        
const {UserTokenModel,ApplicationConfigModel,CommonTableModel,ConfigModel,FlowDataInfoByHourModel,MessageModel,FlowDataInfoByDayModel,TeamModel,ProductModel,CompanyModel,UserModel,} = require('../modules/models.js');
class CommonTableController {
  /**
   * 创建数据库辩驳
   */
  static async createTable(timeSize = 0) {
    const day = Utils.addDays(timeSize)
    const dateStr = day.replace(/-/g, "")
    CommonTableModel.createInfoTable(dateStr)
    const yearStr = day.substring(0, 4)
    CommonTableModel.createInfoTableByYear(yearStr)
  }
}

class UserTokenController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await UserTokenModel.createUserToken(req);
            let data = await UserTokenModel.getUserTokenDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async getAllTokens() {
        const userTokens = await UserTokenModel.getAllTokens()
        return userTokens
    }

    static async getUserTokenDetailByToken(token) {
        const userTokenDetail = await UserTokenModel.getUserTokenDetailByToken(token)
        return userTokenDetail
    }

    static async getUserTokenFromNetworkByToken(ctx) {
        let param = ctx.request.body;
        const userTokenDetail = await UserTokenModel.getUserTokenDetailByToken(param.token)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', userTokenDetail)
    }
    /**
     * 检查token是否有效
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async checkToken(ctx) {
        // 能进入这个方法，就说明token有效
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('Token验证通过！', 0)
    }
}

class ProductController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        const data = await ProductModel.createProduct(req);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }
    /**
     * 根据公司ID获取当月流量套餐
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectByCompanyIdForMonth(ctx) {
        const { companyId } = ctx.wfParam
        const month = new Date().Format("yyyy-MM")
        const data = await ProductModel.getProjectByCompanyIdForMonth(companyId, month);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }

    /**
     * 创建新产品
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createNewProduct(ctx) {
        let req = ctx.request.body;
        const data = await ProductModel.createProduct(req);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }

    /**
     * 批量创建新和更新产品
     * @returns {Promise.<void>}
     */
    static async batchCreateOrUpdateProduct(ctx) {
        // const appConfig = await TeamController.handleAllApplicationConfig()
        // const { monitor, event } = appConfig
        const productInfoHost = '139.224.102.107:8030'
        const _url = `${productInfoHost}${PROJECT_API.SAAS_PRODUCT_INFO}`
        const productRes = await Utils.requestForTwoProtocol("post", _url)
        // console.log('productRes', productRes)
        const { data = {} } = productRes
        let params = [] //需要新增的数据列表
        let allOrderIds = [] //当成新增或者失效的全部订单列表
        let ids = []  //失效订单列表
        const newList = data.newProductList || []  //新增列表
        const expireList = data.expireOrderIds || [] //失效列表
        if (newList.length) {
            params = newList.map(prod => {
                //SAAS_PACKAGE(60,"套餐"), SAAS_TRAFFIC_PACKET(61,"流量包"),
                // SAAS_FREE_TRAFFIC_SUBSCRIPTION(60,"免费版流量订阅"),
                // SAAS_TRAFFIC_SUBSCRIPTION(61,"流量订阅"),
                // SAAS_TRAFFIC_PACKET(62,"流量包"),
                const { productType, companyId, endDate, flowCount, orderId, month } = prod
                // const _productType = productType === 60 ? 1 : 2  //1 套餐， 2流量
                allOrderIds.push(orderId)
                return {
                    companyId,
                    endDate,
                    orderId,
                    month,
                    productType,
                    maxFlowCount: flowCount,
                    // productType: _productType,
                    usedFlowCount: 0,
                    isValid: 1
                }
            });
        }
        if (expireList.length) {
            ids = data.expireOrderIds
            allOrderIds = [...allOrderIds, ...ids]
        }
        if (allOrderIds.length) {
            // console.log("allOrderIds", allOrderIds)
            //批量查询当次需要操作的所有订单id有效的产品
            const curAllProducts = await ProductModel.batchQueryProductByOrderId(allOrderIds);
            const curMonth = new Date().Format("yyyy-MM")
            // console.log('curAllProducts', curAllProducts)
            //新增列表中剔除，数据库中已经存在有效的相同产品信息
            params = params.filter(param => {
                const { orderId, month, companyId } = param
                //所有列表中， 存在当前有效产品剔除掉
                return curAllProducts.length ? !(!!curAllProducts.find(curProd => curProd.orderId === orderId && curProd.companyId === companyId && curProd.month === month)) : true
            })
            if (expireList.length) {
                //筛选出来当月失效的产品
                const curMonthExpireProduct = curAllProducts.filter(item => item.month === curMonth && expireList.includes(item.orderId))
                //在新增的数据中，找到当月新增的数据，追加上需要设置失效的 已使用流量和总流量
                params = params.map(newParam => {
                    const { month, companyId } = newParam
                    let obj = { ...newParam }
                    const addProd = curMonthExpireProduct.find(expProd => expProd.month === month && expProd.companyId === companyId) || null
                    if (addProd) {
                        obj.usedFlowCount += addProd.usedFlowCount || 0
                        obj.maxFlowCount += addProd.maxFlowCount || 0
                    }
                    return obj
                })
            }
            // console.log("start 批量创建或者批量更新流量套餐产品 -->", ids, params);
            //批量更新，旧产品为失效状态
            if (ids.length) {
                await ProductModel.batchUpdateProductByOrderId(ids, { isValid: 0 });
            }
            //先批量创建
            if (params.length) {
                await ProductModel.batchCreateProduct(params);
            }
            // console.log("curAllProducts", curAllProducts)
            console.log("批量创建或者批量更新流量套餐产品成功！！！");
            // ctx.response.status = 200;
            // ctx.body = statusCode.SUCCESS_200('创建信息成功', { curAllProducts, params })
        }
    }


    /**
     * 批量创建新产品
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async batchCreateProduct(ctx) {
        let req = ctx.request.body;
        const data = await ProductModel.batchCreateProduct(req);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('批量创建信息成功', data)
    }

    /**
    * 批量更新产品
    * @param ctx
    * @returns {Promise.<void>}
    */
    static async batchUpdateProduct(ctx) {
        const { ids } = ctx.wfParam
        const data = await ProductModel.batchUpdateProductByOrderId(ids, { isValid: 1 });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('批量更新信息成功', data)
    }
}

class CompanyController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateCompany(ctx) {
        const {userId, companyName, companyTax, bankName, bankNumber, companyAddress, companyPhone} = JSON.parse(ctx.request.body);
        // 查询userId是否已经绑定公司了
        const companyRes = await CompanyModel.getCompanyDetailByOwnerId(userId);
        let isComplete = 0
        if (companyRes) {
            if (companyName && companyTax) {
                isComplete = 1
            }
            await CompanyModel.updateCompany(companyRes.companyId, {
                ownerId: userId,
                companyName,
                companyTax,
                companyAddress: companyAddress,
                companyPhone: companyPhone,
                bankName,
                bankNumber,
                isComplete
            })
        } else {
            if (companyName && companyTax) {
                isComplete = 1
            }
            await CompanyModel.createCompany({
                ownerId: userId,
                companyId: Utils.getUuid(),
                companyName,
                companyTax,
                companyAddress: companyAddress,
                companyPhone: companyPhone,
                bankName,
                bankNumber,
                isComplete
            });
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getCompanyInfo(ctx) {
        const {companyId} = JSON.parse(ctx.request.body);
        // 查询userId是否已经绑定公司了
        const company = await CompanyModel.getCompanyInfo(companyId);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询成功', company)
    }
    /**
     * 获取公司列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getCompanyList(ctx) {
        // 查询userId是否已经绑定公司了
        const companyList = await CompanyModel.getCompanyList();
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询成功', companyList)
    }
}

class OrderController {
    /**
     * 获取订单列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getOrderList(ctx) {
        let { companyId = "" } = JSON.parse(ctx.request.body);
        const orderListRes = await Utils.postJson(`${WEBFUNNY_CONFIG_URI}/config/getSaasOrderList`, { companyId }).catch((e) => {
            console.log(e)
        })
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询成功', orderListRes.data)
    }
}

class ApplicationConfigController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await ApplicationConfigModel.createApplicationConfig(req);
            let data = await ApplicationConfigModel.getApplicationConfigDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateSysConfigInfo(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { serverDomain, adminDomain, editType } = param

        // 先检查对应配置是否存在
        const checkRes = await ApplicationConfigModel.getApplicationConfigByConfigName(editType)
        if (checkRes && checkRes.length) {
            // 如果存在，则更新
            await ApplicationConfigModel.updateApplicationConfig(editType, {configValue: JSON.stringify({serverDomain, adminDomain})})
        } else {
            // 如果不存在，则新建
            await ApplicationConfigModel.createApplicationConfig({systemName: editType, configValue: JSON.stringify({serverDomain, adminDomain})})
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }

    /**
     * 更新域名配置信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async setInitSysConfigInfo(serverDomain, adminDomain, editType) {
        // 如果对应配置不存在，则新建
        const checkRes = await ApplicationConfigModel.getApplicationConfigByConfigName(editType)
        if (checkRes && checkRes.length === 0) {
            await ApplicationConfigModel.createApplicationConfig({systemName: editType, configValue: JSON.stringify({serverDomain, adminDomain})})
        }
    }

    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getSysConfigInfo(ctx) {
        const { monitorServerDomain, monitorAssetsDomain, eventServerDomain, eventAssetsDomain, emailNeeded, phoneNeeded, activationRequired } = accountInfo
        const res = {
            monitor: {
                serverDomain: monitorServerDomain,
                adminDomain: monitorAssetsDomain,
            },
            event: {
                serverDomain: eventServerDomain,
                adminDomain: eventAssetsDomain,
            },
            emailNeeded,
            phoneNeeded,
            activationRequired
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    }
    /**
     * 获取基础配置
     */
    static async handleAllApplicationConfig() {
        const systemRes = await ApplicationConfigModel.getAllApplicationConfig()
        let monitor = {}
        let event = {}
        systemRes.forEach((sysItem) => {
            const configValue = JSON.parse(sysItem.configValue)
            switch(sysItem.systemName) {
                case "monitor":
                    monitor = configValue
                    break
                case "event":
                    event = configValue
                    break
                default:
                    break
            }
        })
        return {
            monitor, event
        }
    }
    /**
     * 获取监控的基本信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async monitorBaseInfo(ctx) {
        const appConfig = await ApplicationConfigController.handleAllApplicationConfig()
        const { monitor } = appConfig

        const monitorBaseRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.MONITOR_BASE_INFO}`, {})
        if (!monitorBaseRes) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('监控系统基本信息获取失败!')
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', monitorBaseRes.data)
        }
    }
    /**
     * 获取埋点的基本信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async eventBaseInfo(ctx) {
        const appConfig = await ApplicationConfigController.handleAllApplicationConfig()
        const { event } = appConfig

        const eventBaseRes = await Utils.requestForTwoProtocol("post", `${event.serverDomain}${PROJECT_API.EVENT_BASE_INFO}`, {})
        if (!eventBaseRes) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('监控系统基本信息获取失败!')
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', eventBaseRes.data)
        }
    }

    /**
     * 获取第三方token
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getOtherAccessTokenWithCode(ctx) {
        const { code } = JSON.parse(ctx.request.body)
        const { getTenantTokenConfig, getUserInfoConfig } = feiShuConfig
        const params = {
            grant_type: "authorization_code",
            client_id: feiShuConfig.appId,
            client_secret: feiShuConfig.appSecret,
            redirect_uri: feiShuConfig.redirectUri,
            code
        }
        const tokenRes = await Utils.postForm(getTenantTokenConfig.url, params).catch((e) => {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(e.msg, 0)
        })
        console.log(tokenRes)
        if (tokenRes && tokenRes.code === 200) {
            const { access_token } = tokenRes.data
            // 根据access_token获取用户信息
            const userInfoRes = await Utils.postForm(getUserInfoConfig.url, {access_token}).catch((e) => {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(e.msg, 0)
            })
            console.log(userInfoRes)
            if (userInfoRes && userInfoRes.code === 200) {
                const { username = "", mobile = "", email = "" } = userInfoRes.data
                if (!mobile && !email) {
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412("登录失败，手机号和邮箱都为空！", 0)
                    return
                }
                // 检查账号是否存在
                const existUsers = await UserModel.checkUserByPhoneOrEmail(mobile, email)
                if (!existUsers || !existUsers.length) {
                    // 账号不存在，则创建一个
                    const userData = {
                        companyId: "1",
                        nickname: username || "no name",
                        emailName: email || mobile,
                        phone: mobile || email,
                        password: Utils.md5(Utils.getUuid()),
                        userId: Utils.getUuid(),
                        userType: "customer",
                        registerStatus: 1,
                        avatar: Math.floor(Math.random() * 6)
                    }
                    let userRet = await UserModel.createUser(userData);
                    if (userRet && userRet.id) {
                        const accessToken = await UserController.createSsoToken(mobile, email)
                        if (accessToken) {
                            ctx.response.status = 200;
                            ctx.body = statusCode.SUCCESS_200('success', {
                                accessToken
                            })
                        } else {
                            ctx.response.status = 412;
                            ctx.body = statusCode.ERROR_412("登录失败，账号无效或不存在！", 0)
                        }
                    }
                }
            } else {
                console.log(userInfoRes)
                log.printError(`获取第三方用户信息失败（${getUserInfoConfig.url}）`, userInfoRes)
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(tokenRes.msg, tokenRes.msg)
            }
        } else {
            console.log(tokenRes)
            log.printError(`获取第三方token失败（${getTenantTokenConfig.url}）`, tokenRes)
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(tokenRes.msg, tokenRes.msg)
        }
    }

    /**
     * 获取飞书的签名
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getSignatureForFeiShu(ctx) {
        const { getAppTokenConfig, getJsTicketConfig, redirectUri } = feiShuConfig
        log.printInfo("飞书配置项：", JSON.stringify(feiShuConfig))
        const params = {
            app_id: feiShuConfig.appId,
            app_secret: feiShuConfig.appSecret,
        }
        // 获取缓存里的token
        const tokenInCache = global.monitorInfo.ssoForFeiShu.appToken
        let cacheTokenValid = false
        if (tokenInCache && tokenInCache.value) {
            if (new Date().getTime() < tokenInCache.endTime) {
                cacheTokenValid = true
            }
        }
        let finalToken = ""
        if (!cacheTokenValid) {
            log.printInfo(getAppTokenConfig.url + " 接口参数：", JSON.stringify(params))
            const tokenRes = await Utils.postJson(getAppTokenConfig.url, params).catch((e) => {
                log.printInfo(getAppTokenConfig.url + " 接口报错 ：", e)
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(e.msg, 0)
            })
            log.printInfo(getAppTokenConfig.url + " 接口结果：", JSON.stringify(tokenRes))
            if (tokenRes) {
                const { app_access_token, expire } = tokenRes
                finalToken = app_access_token
                global.monitorInfo.ssoForFeiShu.appToken = {
                    value: finalToken,
                    endTime: new Date().getTime() + expire * 1000
                }
            }
        } else {
            finalToken = global.monitorInfo.ssoForFeiShu.appToken.value
        }
        if (!finalToken) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412("token无效", 0)
            return
        }

        const customHead = {
            "Authorization": `Bearer ${finalToken}`,
            "Content-Type": "application/json"
        }
        // 获取缓存里的ticket
        const ticketInCache = global.monitorInfo.ssoForFeiShu.ticket
        let cacheTicketValid = false
        if (ticketInCache && ticketInCache.value) {
            if (new Date().getTime() < ticketInCache.endTime) {
                cacheTicketValid = true
            }
        }
        let finalTicket = ""
        if (!cacheTicketValid) {
            log.printInfo(getJsTicketConfig.url + " 接口参数（header）：", JSON.stringify(customHead))
            const ticketRes = await Utils.get(getJsTicketConfig.url, {}, {customHead}).catch((e) => {
                log.printInfo(getJsTicketConfig.url + " 接口报错 ：", e)
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(e.msg, 0)
            })
            log.printInfo(getJsTicketConfig.url + " 接口结果：", JSON.stringify(ticketRes))
            if (ticketRes) {
                const { ticket, expire_in } = ticketRes.data
                finalTicket = ticket
                global.monitorInfo.ssoForFeiShu.ticket = {
                    value: finalTicket,
                    endTime: new Date().getTime() + expire_in * 1000
                }
            }
        } else {
            finalTicket = global.monitorInfo.ssoForFeiShu.ticket.value
        }

        if (!finalTicket) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`ticket无效`, 0)
            return
        }
        const nonceStr = Utils.getUuid().replace(/-/g, "")
        const timestamp = new Date().getTime()
        const url = redirectUri
        const verifyStr = `jsapi_ticket=${finalTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
        const signature = Utils.sha1(verifyStr)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', {
            appId: feiShuConfig.appId,
            timestamp,
            nonceStr,
            signature
        })
    }

    /**
     * 根据code获取飞书的用户信息已经登录token
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getAccessTokenByCodeForFeiShu(ctx) {
        const { code, grant_type } = Utils.parseQs(ctx.request.url)
        const { getUserTokenConfig, getUserInfoConfig } = feiShuConfig

        let finalToken = ""
        const customHead = {
            "Authorization": `Bearer ${global.monitorInfo.ssoForFeiShu.appToken.value}`,
            "Content-Type": "application/json"
        }
        log.printInfo(getUserTokenConfig.url + " 接口参数（header）：", JSON.stringify(customHead))
        const tokenRes = await Utils.postJson(getUserTokenConfig.url, {code, grant_type}, {customHead}).catch((e) => {
            log.printInfo(getUserTokenConfig.url + " 接口报错 ：", e)
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(e.msg, 0)
        })
        log.printInfo(getUserTokenConfig.url + " 接口结果：", JSON.stringify(tokenRes))
        if (tokenRes) {
            const { access_token } = tokenRes.data
            finalToken = access_token
        }
        if (!finalToken) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412("token无效", 0)
            return
        }

        const userInfoCustomHead = {
            "Authorization": `Bearer ${finalToken}`
        }
        log.printInfo(getUserInfoConfig.url + " 接口参数（header）：", JSON.stringify(userInfoCustomHead))
        const userInfoRes = await Utils.get(getUserInfoConfig.url, {}, {customHead: userInfoCustomHead}).catch((e) => {
            log.printInfo(getUserInfoConfig.url + " 接口报错 ：", e)
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(e.msg, 0)
        })
        log.printInfo(getUserInfoConfig.url + " 接口结果：", JSON.stringify(userInfoRes))
        const { email = "", mobile = "", name = ""} = userInfoRes.data
        const finalMobile = mobile.replace(/\+86/g, "")
        if (email || finalMobile) {
            // 检查账号是否存在
            const existUsers = await UserModel.checkUserByPhoneOrEmail(finalMobile, email)
            if (!existUsers || !existUsers.length) {
                // 账号不存在，则创建一个
                const nickname = name || "no name"
                const emailName = email || finalMobile
                const phone = finalMobile || email
                const userData = {
                    companyId: "1",
                    nickname,
                    emailName,
                    phone,
                    password: Utils.md5("123456"),
                    userId: Utils.getUuid(),
                    userType: "customer",
                    registerStatus: 1,
                    avatar: Math.floor(Math.random() * 6)
                }
                log.printInfo("用户不存在，即将创建：", JSON.stringify(userData))
                let userRet = await UserModel.createUser(userData);
                if (userRet && userRet.id) {
                    const accessToken = await UserController.createSsoToken(phone, emailName)
                    if (accessToken) {
                        ctx.response.status = 200;
                        ctx.body = statusCode.SUCCESS_200('success', {
                            accessToken
                        })
                        log.printInfo("生成token：", JSON.stringify(accessToken))
                    } else {
                        log.printInfo("生成token失败：", JSON.stringify(accessToken))
                        ctx.response.status = 412;
                        ctx.body = statusCode.ERROR_412("登录失败，账号无效或不存在1！", 0)
                    }
                }
            } else {
                const emailName = email || finalMobile
                const phone = finalMobile || email
                log.printInfo("用户已存在，用户信息：", JSON.stringify({phone, emailName}))
                const accessToken = await UserController.createSsoToken(phone, emailName)
                if (accessToken) {
                    ctx.response.status = 200;
                    ctx.body = statusCode.SUCCESS_200('success', {
                        accessToken
                    })
                    log.printInfo("生成token：", JSON.stringify(accessToken))
                } else {
                    log.printInfo("生成token失败：", JSON.stringify(accessToken))
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412("登录失败，账号不存在或匹配到多条信息！", 0)
                }
            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412("未获取到手机号或邮箱", 0)
        }

        
    }
}

class FlowDataInfoByHourController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createFlowDataInfoByHour(ctx) {
    const param = ctx.request.body
    const { flowArray, dayName = "" } = param
    let valueSql = ""
    for (let i = 0; i < flowArray.length; i++) {
      const { flowCount } = flowArray[i]
      if (flowCount === 0) continue
      valueSql += FlowDataInfoByHourController.handleFlowArray(flowArray[i])
    }
    valueSql = valueSql.substring(0, valueSql.length - 1)

    const dateEnd = dayName.replace(/-/g, "")
    const table = "FlowDataInfoByHour" + dateEnd
    let sql = ""
    if (valueSql) {
      sql = `INSERT INTO ${table} (companyId, projectId, projectName, flowOrigin, productType, flowType, hourName, flowCount, createdAt, updatedAt)
      VALUES
      ${valueSql}
      `
    }
    if (sql) {
      FlowDataInfoByHourModel.createFlowDataInfosByHour(sql)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
  }
  static handleFlowArray(flowData) {
    const createdAt = new Date().Format("yyyy-MM-dd hh:mm:ss")
    const updatedAt = createdAt
    const { companyId, projectId, projectName, productType, flowType, hourName, flowCount } = flowData
    // 如果流量套餐到期，则使用流量包
    const flowOrigin = "subscribe"
    let sqlStr = `('${companyId}', '${projectId}', '${projectName}', '${flowOrigin}', '${productType}', '${flowType}', '${hourName}', ${flowCount}, '${createdAt}', '${updatedAt}'),`
    return sqlStr
  }

  /**
   * 获取流量分布和趋信息
   * @param {Object} ctx 请求参数
   * @returns {Promise.<void>}
   */
  static async getHourFlowTrendData(ctx) {
    const { companyId, projectIds = '', productType = 'monitor' } = ctx.wfParam
    // 获取事件趋势信息
    const flowTrend = await FlowDataInfoByHourModel.getHourFlowTrendDataForCompanyId(companyId, productType, projectIds)
    // console.log('getHourFlowTrendData--->', flowTrend)
    const ids = projectIds.split(',')
    let obj = {}
    if (flowTrend && flowTrend.length) {
      ids.forEach(id => {
        obj[id] = flowTrend.filter(item => item.projectId == id)
      });
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', obj)
  }
}

class MessageController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createNewMessage(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { id, ruleName, loopTime, quietStartTime, quietEndTime } = req
        const ruleList = JSON.stringify(req.ruleList)
        const paramData = { ruleName, loopTime, quietStartTime, quietEndTime, ruleList }
        if (ruleName) {
            if (id) {
                paramData.id = id
                await MessageModel.updateMessage(id, paramData)
            } else {
                await MessageModel.createMessage(paramData);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async getAllMessage(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        let data = await MessageModel.getAllMessage(params);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    }

    static async getMessageByType(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { userId } = ctx.user
        params.userId = userId
        // 获取分页消息
        let data = await MessageModel.getMessageByType(params);
        // 获取有多少条未读消息
        let readCountInfo = await MessageModel.getUnReadMessageCountByType(params);
        let unReadCount = 0
        let total = 0
        if (readCountInfo) {
            readCountInfo.forEach((readInfo) => {
                if (readInfo.isRead === 0) {
                    unReadCount = parseInt(readInfo.count, 10)
                }
                total += parseInt(readInfo.count, 10)
            })
        }
        const result = {
            messages: data,
            unReadCount,
            total,
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    }

    static async readMessage(ctx) {
        let req = JSON.parse(ctx.request.body)
        const { messageId } = req
        const message = MessageModel.getMessageDetail(messageId)
        message.isRead = 1
        await MessageModel.updateMessage(messageId, message);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', 0)
    }

    static async readAll(ctx) {
        let req = JSON.parse(ctx.request.body)
        const { messageType } = req
        const { userId } = ctx.user
        MessageModel.readAll(userId, messageType)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', 0)
    }

    /**
     * 查询单条信息数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(id) {
        return await MessageModel.getMessageDetail(id)
    }

    static async deleteMessage(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param

        await MessageModel.deleteMessage(id)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    // 最新的更新日志写入到日志表中
    static async saveLastVersionInfo() {
        await Utils.get("http://www.webfunny.cn/config/lastVersionInfo", {}).then(async(result) => {
            const updateInfo = result.data
            const { updateDate, version, updateContent, upgradeGuide, updateDatabase } = updateInfo
            const currentDate = new Date().Format("yyyy-MM-dd")
            // 如果日期相同，说明是今天的，可以入库
            if (updateDate === currentDate) {
                const userList = await UserModel.getAllUserInfoForSimple()
                userList.map(async(userInfo) => {
                    const { userId } = userInfo
                    await MessageModel.createMessage({
                        userId,
                        title: `版本号：${version}`,
                        content: JSON.stringify([updateContent, upgradeGuide, updateDatabase]),
                        type: "update",
                        isRead: 0,
                        link: "https://www.webfunny.cn/update.html"
                    })
                })
            }
        }).catch((error) => {
            console.error(error)
        })
    }
}

class FlowDataInfoByDayController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createFlowDataInfoByDay(ctx) {
    const param = ctx.request.body
    const { flowArray, dayName = "" } = param
    let valueSql = ""
    for (let i = 0; i < flowArray.length; i++) {
      const { flowCount } = flowArray[i]
      if (flowCount === 0) continue
      valueSql += FlowDataInfoByDayController.handleFlowArray(flowArray[i])
    }
    valueSql = valueSql.substring(0, valueSql.length - 1)

    const dateEnd = dayName.substring(0, 4)
    const table = "FlowDataInfoByDay" + dateEnd
    let sql = ""
    if (valueSql) {
      sql = `INSERT INTO ${table} (companyId, projectId, flowType, monthName, dayName, flowCount, createdAt, updatedAt) 
      VALUES
      ${valueSql}
      `
    }
    if (sql) {
      FlowDataInfoByDayModel.createFlowDataInfosByHour(sql)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
  }
  /**
   * 获取事件/流量橄榄数据
   * @param {Object} ctx 请求参数
   * @returns {Promise.<void>}
   */
  static async getTotalFlowData(ctx) {
    const { companyId } = ctx.wfParam
    const date = new Date()
    const nowYear = date.getFullYear()
    let nowMonth = date.getMonth() + 1
    nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth //月份补 0
    let curDay = date.getDate()       //获取当前的天
    curDay = curDay < 10 ? '0' + curDay : curDay //天补 0
    const dateInterval = `${nowYear}/${nowMonth}/1~${nowYear}/${nowMonth}/${curDay}`
    // 获取当月流量数据
    // const monthFlowRes = await FlowDataInfoByDayModel.getMonthFlowDataForCompanyId(companyId)
    // console.log('getTotalFlowData ---monthFlowRes', monthFlowRes)
    // const packageRes = monthFlowRes && monthFlowRes.length ? monthFlowRes.find(item => item.flowOrigin === 'package') : null
    // const subscribeRes = monthFlowRes && monthFlowRes.length ? monthFlowRes.find(item => item.flowOrigin === 'subscribe') : null

    // // 已消耗流量 usedFlowCount  // 流量上限 maxFlowCount
    const _month = date.Format("yyyy-MM")
    //套餐数据
    const subscribeProductRes = await ProductModel.getProjectByCompanyIdForMonth(companyId, _month)
    // console.log('subscribeProductRes-->', subscribeProductRes)
    //流量包数据
    const packageProductRes = await ProductModel.getProjectPackageByCompanyId(companyId)
    // console.log('packageProductRes-->', packageProductRes)
    //套餐-subscribe，流量包-package
    const monthFlow = {
      packageCount: packageProductRes && packageProductRes.length ? parseInt(packageProductRes[0].usedFlowCount) : 0,
      subscribeCount: subscribeProductRes && subscribeProductRes.length ? parseInt(subscribeProductRes[0].usedFlowCount) : 0,
      dateInterval
    }
    // 获取当月剩余数据
    const monthLeftFlow = {
      packageCount: packageProductRes && packageProductRes.length ? packageProductRes[0].maxFlowCount - packageProductRes[0].usedFlowCount : 0,
      subscribeCount: subscribeProductRes && subscribeProductRes.length ? subscribeProductRes[0].maxFlowCount - subscribeProductRes[0].usedFlowCount : 0,
      dateInterval
    }

    // 获取总消耗流量
    const totalFlowRes = await FlowDataInfoByDayModel.getTotalFlowDataForCompanyId(companyId)
    // console.log('totalFlowRes-->', totalFlowRes)
    let totalFlowCount = 0
    let minDayArr = []
    if (totalFlowRes && totalFlowRes.length && totalFlowRes[0].minDay) {
      totalFlowRes.forEach((item) => {
        totalFlowCount += item.count
        minDayArr.push(item.minDay)
      })
    }
    //获取最小的日期
    const minDay = minDayArr.length ? (minDayArr.sort()[0]).replace(/-/g, '/') : '/'
    const totalFlow = {
      totalFlowCount,
      dateInterval: `${minDay}~${nowYear}/${nowMonth}/${curDay}`
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { monthFlow, monthLeftFlow, totalFlow })
  }

  /**
   * 获取流量分布和趋信息
   * @param {Object} ctx 请求参数
   * @returns {Promise.<void>}
   */
  static async getFlowTrendData(ctx) {
    const { companyId, startDate = '', endDate = '' } = ctx.wfParam
    // 获取事件趋势信息
    const flowTrend = await FlowDataInfoByDayModel.getFlowTrendDataForCompanyIdByDate(companyId, startDate, endDate)
    // console.log('flowTrendRes--->', flowTrend)

    // 获取事件分布信息
    const flowDistributeRes = await FlowDataInfoByDayModel.getFlowDistributeDataForCompanyIdByDate(companyId, startDate, endDate)
    const flowDistribute = []
    // console.log('flowTrendRes--->', flowDistributeRes)
    if (flowDistributeRes && flowDistributeRes.length) {
      flowDistributeRes.forEach((item) => {
        const { productType, count } = item
        // 产品类型, 监控-monitor，埋点-event
        //只是填入埋点和监控数据
        if (ProductTypeMap[productType]) {
          flowDistribute.push({ productType, value: count, name: ProductTypeMap[productType] })
        }
      })
    }

    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { flowTrend, flowDistribute })
  }
  /**
   * 获取流量列表信息
   * @param {Object} ctx 请求参数
   * @returns {Promise.<void>}
   */
  static async getFlowTableListData(ctx) {
    const { companyId, productType = 'monitor', projectName = '', page = 1, pageSize = 10 } = ctx.wfParam
    //获取事件总数
    let total = 0;
    const flowTotalCountRes = await FlowDataInfoByDayModel.getFlowTotalCountForCompanyId(companyId, productType, projectName)
    if (flowTotalCountRes && flowTotalCountRes.length) {
      flowTotalCountRes.forEach((item) => {
        total += Number(item.count)
      })
    }
    // 获取事件趋势信息
    const flowTableRes = await FlowDataInfoByDayModel.getFlowTableListDataForCompanyId({ companyId, productType, projectName, page, pageSize })
    // console.log('flowTableRes--->', flowTableRes)
    let list = flowTableRes && flowTableRes.length ? flowTableRes : []
    // if (flowTableRes && flowTableRes.length) {
    // list = flowTableRes.map((item, index) => {
    //   //todo 需要查询接口获取状态
    //   return { ...item, status: index % 2 === 0 ? 0 : 1 }
    // })
    // }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { list, total })
  }
}

class ConfigController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await ConfigModel.createConfig(req);
            let data = await ConfigModel.getConfigDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

}


class TimerCalculateController {

  /**
   * 定时计算每天的流量
   */
  static async calculateCountByDay(dayIndex) {

    const dayName = Utils.addDays(dayIndex)
    const monthName = dayName.substring(0, 7)
    // 归类计算总流量数据
    await FlowDataInfoByHourModel.calculateFlowCountByDay(dayIndex).then(async(flowDataRes) => {
      // 存储当天的流量消耗
      FlowDataInfoByDayModel.createFlowDataInfosByDay(flowDataRes, dayName, monthName)
      // 更新产品的消耗信息
      const totalCountArr = flowDataRes.filter((item) => item.flowType === FLOW_TYPE.TOTAL_FLOW_COUNT)
      const totalCount = totalCountArr[0].flowCount
      const companyId = totalCountArr[0].companyId
      const productRes = await ProductModel.getProductDetailByCompanyId(companyId)
      const finalUsedFlowCount = totalCount + productRes.usedFlowCount * 1
      ProductModel.updateProduct(companyId, monthName, {usedFlowCount: finalUsedFlowCount})
    }).catch((e) => {
      log.printError("calculateFlowCountByDay 错误", e)
    })
    // const cusData = await CustomerPVModel.getCusInfoCountForDay(webMonitorId, useDay, tempObj.uploadTypeForHour + userTag);
    // const uploadType = tempObj.uploadTypeForDay + userTag
    // infoCountByDayInfo.uploadType = uploadType
    // infoCountByDayInfo.dayCount = cusData[0].count
    // const result_uv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, uploadType)
    // if (result_uv.length <= 0) {
    //   await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
    // } else {
    //   const id = result_uv[0].id
    //   await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
    // }
  }

  static async handleProject(callback) {
    const projectList = await ProjectModel.getAllProjectList();
    for (let p = 0; p < projectList.length; p ++) {
      const { webMonitorId, pageAggregation, httpAggregation} = projectList[p]
      callback({webMonitorId, userTag: "", p, projectList, pageAggregation, httpAggregation})
    }
  }
  static async handleProjectWithTag(callback) {
    const projectList = await ProjectModel.getAllProjectList();
    for (let p = 0; p < projectList.length; p ++) {
      const webMonitorId = projectList[p].webMonitorId
      const userTags = projectList[p].userTag
      const firstTagArray = [""]
      let userTagArray = userTags ? userTags.split(",") : []
      // 如果userTagArray只有一个空字符串，说明用户没有设置userTag
      if (!(userTagArray.length === 1 && userTagArray[0] === "")) {
        userTagArray = firstTagArray.concat(userTagArray)
      }
      for (let tagIndex = 0; tagIndex < userTagArray.length; tagIndex ++) {
        let userTag = userTagArray[tagIndex]
        callback(webMonitorId, userTag)
      }
    }
  }
}


class TeamController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await TeamModel.createTeam(req);
            let data = await TeamModel.getTeamDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async createNewTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { teamName } = param
        const { userId, companyId } = ctx.user
        const team = {teamName, leaderId: userId, members: userId, webMonitorIds: "", companyId}
        const teamRes = await TeamModel.createTeam(team);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', teamRes)
    }

    static async createNewTeamForApi(ctx) {
        const { teamName, userId } = ctx.request.body
        const team = {teamName, leaderId: userId, members: userId, webMonitorIds: ""}

        const teamDetail = await TeamModel.getTeamDetailByName(teamName)
        if (teamDetail) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('团队名称重复！')
            return
        }
        const teamInfo = await TeamModel.createTeam(team);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('团队创建成功', teamInfo)
    }

    static async deleteTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param

        const delRes = await TeamModel.deleteTeam(id)

        if (delRes) {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('团队删除成功', 0)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('团队删除失败！')
        }
        
        // 删除前，先检查team下是否还有团队
        // const teamDetail = await TeamModel.getTeamDetail(id)
        // const webMonitorIds = teamDetail.webMonitorIds
        // const projects = await ProjectModel.getProjectByWebMonitorIds(webMonitorIds)
        // if (projects.length <= 0) {
        //     await TeamModel.deleteTeam(id)
        //     ctx.response.status = 200;
        //     ctx.body = statusCode.SUCCESS_200('success', "")
        // } else {
        //     ctx.response.status = 200;
        //     ctx.body = statusCode.SUCCESS_200('success', "当前team下还有项目，无法执行删除操作！")
        // }
        
    }

    static async moveProToTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { showMoveMonitorId, chooseTeamId } = param
        const team = await TeamModel.getTeamDetail(chooseTeamId)
        const tempProjects = team.webMonitorIds + "," + showMoveMonitorId
        await TeamModel.updateTeam(chooseTeamId, {webMonitorIds: tempProjects})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async handleAllApplicationConfig() {
        const systemRes = await ApplicationConfigModel.getAllApplicationConfig()
        let monitor = {}
        let event = {}
        systemRes.forEach((sysItem) => {
            const configValue = JSON.parse(sysItem.configValue)
            switch(sysItem.systemName) {
                case "monitor":
                    monitor = configValue
                    break
                case "event":
                    event = configValue
                    break
                default:
                    break
            }
        })
        return {
            monitor, event
        }
    }

    static async handleTeamList(userId, userType, companyId) {
        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        const res = await TeamModel.getTeamList(userId, userType, companyId)
        for (let i = 0; i < res.length; i ++) {
            const team = res[i]
            const { leaderId, members, webMonitorIds } = team
            const users = await UserModel.getUserListByMembers(members)
            team.members = users
            users.forEach((user) => {
                if (user.userId == leaderId) {
                    team.leader = user
                    return false
                }
            })

            const projectRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.MONITOR_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS}`, {webMonitorIds})

            const projects = projectRes ? projectRes.data : []

            for (let m = 0; m < projects.length; m ++) {
                let projectItem = projects[m]
                const { viewers } = projectItem
                projectItem.id = "m-" + projectItem.id
                projectItem.sysType = "monitor"
                const viewerList = await UserModel.getUserListByViewers(viewers)
                projectItem.viewerList = viewerList
            }

            const eventProjectRes = await Utils.requestForTwoProtocol("post", `${event.serverDomain}${PROJECT_API.EVENT_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS}`, {webMonitorIds})

            const eventProjects = eventProjectRes ? eventProjectRes.data : []

            for (let m = 0; m < eventProjects.length; m ++) {
                let projectItem = eventProjects[m]
                const {viewers} = projectItem
                // 埋点项目需要补全的三个字段
                projectItem.projectType = "event"
                projectItem.sysType = "event"
                projectItem.id = "e-" + projectItem.id

                const viewerList = await UserModel.getUserListByViewers(viewers)
                projectItem.viewerList = viewerList
            }

            team.projects = [...projects, ...eventProjects]
        }
        return res
    }


    static async getTeamList(ctx) {
        let userId = ""
        let userType = ""
        let companyId = ""
        if (ctx.user) {
            userId = ctx.user.userId
            userType = ctx.user.userType
            companyId = ctx.user.companyId
        } else {
            const param = ctx.request.body
            userId = param.userId
            userType = param.userType
            companyId = param.companyId
        }
        if (!companyId) {
            ctx.response.status = 401;
            ctx.body = statusCode.ERROR_401("没有公司ID，请重新登录");
            return
        }

        const res = await TeamController.handleTeamList(userId, userType, companyId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async getSimpleTeamList(ctx) {
        let userId = ""
        let userType = ""
        let companyId = ""
        if (ctx.user) {
            userId = ctx.user.userId
            userType = ctx.user.userType
            companyId = ctx.user.companyId
        } else {
            const param = ctx.request.body
            userId = param.userId
            userType = param.userType
            companyId = param.companyId
        }
        if (!companyId) {
            ctx.response.status = 401;
            ctx.body = statusCode.ERROR_401("没有公司ID，请重新登录");
            return
        }

        const res = await TeamModel.getTeamList(userId, userType, companyId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async getTeamMemberByUser(ctx) {
        const {members} = JSON.parse(ctx.request.body)
        const users = await UserModel.getUserListByMembers(members)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', users)
    }

    static async getTeamListWithoutToken(ctx) {
        const param = ctx.request.body
        const { userId, userType, companyId } = param
        if (!companyId) {
            ctx.response.status = 401;
            ctx.body = statusCode.ERROR_401("没有公司ID，请重新登录");
            return
        }
        const res = await TeamController.handleTeamList(userId, userType, companyId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async getTeams(ctx) {
        let userId = ""
        let userType = ""
        let companyId = ""
        if (ctx.user) {
            userId = ctx.user.userId
            userType = ctx.user.userType
            companyId = ctx.user.companyId
        } else {
            const param = ctx.request.body
            userId = param.userId
            userType = param.userType
            companyId = param.companyId
        }
        
        const res = await TeamModel.getTeamList(userId, userType, companyId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async addTeamMember(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id, members } = param
        await TeamModel.updateTeam(id, {members})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async updateTeamProjects(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id, webMonitorIds } = param
        // 获取id下这个team的webMonitorIds
        const teamResDetail = await TeamModel.getTeamDetail(id)
        const tempMonitorIds = teamResDetail ? teamResDetail.webMonitorIds.split(",") : ""
        const webMonitorIdArray = []
        tempMonitorIds.forEach((monitorId) => {
            if (webMonitorIds !== monitorId) {
                webMonitorIdArray.push(monitorId)
            }
        })
        await TeamModel.updateTeam(id, {webMonitorIds: webMonitorIdArray.toString()})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async getAllTeamList(ctx) {
        const res = await TeamModel.getAllTeamList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async getTeamMembersByWebMonitorId(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { webMonitorId } = param
        const memberRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        const members = memberRes && memberRes.length > 0 ? memberRes[0].members.split(",") : []
        const userRes = await UserModel.getUsersByUserIds(members)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', userRes)
    }

    static async resetTeamLeader(ctx) {
        let param = JSON.parse(ctx.request.body);
        const targetUserId = param.userId
        const teamId = param.teamId
        const { userId, userType } = ctx.user
        if (userType !== "admin" && userType !== "superAdmin") {
            // 判断当前这个登录人是不是team leader
            const teamListByLeader = await TeamModel.checkTeamLeader(teamId, userId)
            if (!teamListByLeader || !teamListByLeader.length) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('您不是团长，没有权限操作！')
                return
            }
        }
        
        // 判断目标userId是不是团队成员
        const teamListByMember = await TeamModel.checkTeamMember(teamId, targetUserId)
        if (!teamListByMember || !teamListByMember.length) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('目标不是团队成员，无法执行此操作！')
            return
        }
        // 更新新团长
        await TeamModel.updateTeam(teamId, {leaderId: targetUserId})

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }
    static async findTeamListByLeaderId(ctx) {
        let param = ctx.request.body
        const { userId } = param
        const teamList = await TeamModel.findTeamListByLeaderId(userId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', teamList)
    }
    static async getTeamDetail(ctx) {
        let param = ctx.request.body
        const { chooseTeamId } = param
        const teamResDetail = await TeamModel.getTeamDetail(chooseTeamId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', teamResDetail)
    }
    static async updateTeam(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorIds } = param
        const teamResDetail = await TeamModel.getTeamDetail(id)
        const finalWebMonitorIds = teamResDetail.webMonitorIds + "," + webMonitorIds
        await TeamModel.updateTeam(id, {webMonitorIds: finalWebMonitorIds})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async addViewers(ctx) {
        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        const {webMonitorId, viewerList, sysType} = JSON.parse(ctx.request.body)
        const viewers = viewerList.toString()
        if (sysType === "monitor") {
            // await Utils.postJson(`http://${monitor.serverDomain}${PROJECT_API.MONITOR_ADD_VIEWERS}`, {webMonitorId, viewers}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('观察者添加失败!')
            // })
            const addRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.MONITOR_ADD_VIEWERS}`, {webMonitorId, viewers})
            if (!addRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('观察者添加失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }

        } else if (sysType === "event") {
            // await Utils.postJson(`http://${event.serverDomain}${PROJECT_API.EVENT_ADD_VIEWERS}`, {webMonitorId, viewers}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('观察者添加失败!')
            // })
            const addRes = await Utils.requestForTwoProtocol("post", `${event.serverDomain}${PROJECT_API.EVENT_ADD_VIEWERS}`, {webMonitorId, viewers})
            if (!addRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('观察者添加失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }
        }
        
    }
    static async forbiddenRightCheck(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }


    static async forbiddenProject(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }

        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        if (sysType === "monitor") {
            const tempId = id.split("-")[1]
            // 更新监控项目禁用状态
            // await Utils.postJson(`http://${monitor.serverDomain}${PROJECT_API.FORBIDDEN_PROJECT}`, {id: tempId}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('禁用失败')
            // })

            const forbiddenRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.FORBIDDEN_PROJECT}`, {id: tempId})
            if (!forbiddenRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('禁用失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }
        } else if (sysType === "event") {
            // 更新埋点项目禁用状态
            
        }
    }
    static async deleteProjectRightCheck(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async deleteProject(ctx) {
        let param = JSON.parse(ctx.request.body)
        const { id, webMonitorId, sysType } = param
        const {userId, userType} = ctx.user
        // 判断这个人是不是管理员, 团长
        let leaderId = ""
        const teamRes = await TeamModel.getTeamMembersByWebMonitorId(webMonitorId)
        if (teamRes && teamRes.length) {
            leaderId = teamRes[0].leaderId
        }
        if (!(userType === "superAdmin" || userType === "admin" || leaderId === userId)) {
            ctx.response.status = 403;
            ctx.body = statusCode.ERROR_403('你没有权限执行此操作！');
            return
        }

        const appConfig = await TeamController.handleAllApplicationConfig()
        const { monitor, event } = appConfig

        if (sysType === "monitor") {
            const tempId = id.split("-")[1]
            // 更新监控项目禁用状态
            // await Utils.postJson(`http://${monitor.serverDomain}${PROJECT_API.DELETE_PROJECT}`, {id: tempId}).then(() => {
            //     ctx.response.status = 200;
            //     ctx.body = statusCode.SUCCESS_200('success', 0)
            // }).catch((e) => {
            //     log.printError(JSON.stringify(e))
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412('禁用失败')
            // })

            const delRes = await Utils.requestForTwoProtocol("post", `${monitor.serverDomain}${PROJECT_API.DELETE_PROJECT}`, {id: tempId})
            if (!delRes) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('删除失败!')
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', 0)
            }
        } else if (sysType === "event") {
            // 更新埋点项目禁用状态

        }


        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
}


class UserController {
  /**
   * webfunny
   */
  static sendEmail(email, title, content) {

    if (accountInfo.useCusEmailSys === true) {
      CusUtils.sendEmail(email, title, content, accountInfo.emailUser, accountInfo.emailPassword)
    } else {
      fetch("http://www.webfunny.cn/config/sendEmail",
      {
          method: "POST", 
          body: JSON.stringify({email, title, content}),
          headers: {
              "Content-Type": "application/json;charset=utf-8"
          }
      }).catch((e) => {
        console.log(e)
      })
    }
  }

  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { funnelName, funnelIds } = param
    const data = {funnelName, funnelIds}
    /* 判断参数是否合法 */
    if (param.funnelName) {
      let ret = await UserModel.createUser(data);
      let res = await UserModel.getUserDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res || {})
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await UserModel.getUserList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  /**
   * 获取当前项目所在团队的用户列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserListForTeam(ctx) {
    const {projectId} = JSON.parse(ctx.request.body)
    // 根据项目id获取团队
    const teamRes = await TeamModel.getTeamMembersByWebMonitorId(projectId)
    if (!teamRes || !teamRes.length) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', [])
      return
    }
    const { members } = teamRes[0]
    const userRes = await UserModel.getUserListByMembers(members)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', userRes)
  }
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async hasSuperAdminAccount(ctx) {
    // 检查是否有管理员账号
    const adminData = await UserModel.checkAdminAccount();
    const adminUserCount = adminData[0].count * 1

    const { registerEntry, resetPwdEntry } = accountInfo
  
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {adminUserCount,registerEntry, resetPwdEntry})
  }

  /**
   * 验证Token是否存在
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async checkTokenExist(ctx) {
    // 检查是否有管理员账号
    const tokenData = await UserModel.checkTokenExist();
  
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', adminUserCount)
  }

  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserInfo(ctx) {
    let param = {}
    if (typeof ctx.request.body === "string") {
      param = JSON.parse(ctx.request.body)
    } else {
      param = ctx.request.body
    }
    const { userId, projectId = "" } = param
    // 查询个人信息
    const res = await UserModel.getUserInfo(userId)
    const { companyId } = res[0]
    // 查询是不是团长
    let leaderId = ""
    if (projectId) {
      const teamRes = await TeamModel.getTeamMembersByWebMonitorId(projectId)
      if (teamRes && teamRes.length) {
        leaderId = teamRes[0].leaderId
      }
    }
    // 查询公司信息
    const company = await CompanyModel.getCompanyInfo(companyId);
    const finalRes = { ...res[0], isTeamLeader: leaderId === userId, company }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', finalRes)
  }

  /**
   * 管理员获取用户列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserListByAdmin(ctx) {
    let req = ctx.request.body
    const { status } = req
    const { userType, companyId = "" } = ctx.user
    if (userType !== "admin" && userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非管理员，无权调用此接口！');
      return
    }
    if (!companyId) {
      ctx.response.status = 401;
      ctx.body = statusCode.ERROR_401("没有公司ID，请重新登录");
      return
    }
    if (req) {
      const data = await UserModel.getUserListByAdmin(status, companyId);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }

  /**
   * 获取所有用户列表，只返回userId, name
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getAllUserInfoForSimple(ctx) {
    const data = await UserModel.getAllUserInfoForSimple();
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await UserModel.getUserDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let params = JSON.parse(ctx.request.body)
    let id = params.id;
  
    if (id && !isNaN(id)) {
      await UserModel.deleteUser(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await UserModel.updateUser(id, req);
      let data = await UserModel.getUserDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
  
  static async setValidateCode() {
    const charArr = "0123456789ABCDEFGHGKLMNOPQRSTUVWXYZabcdefghigkmnopqrstuvwxyz"
    let code = ""
    for (let i = 0; i < 4; i ++) {
      const tempIndex = Math.floor(Math.random() * (charArr.length - 1) + 1)
      code += charArr.charAt(tempIndex)
    }
    const loginValidateCodeRes = await ConfigModel.getConfigByConfigName("loginValidateCode")
    if (loginValidateCodeRes && loginValidateCodeRes.length > 0) {
        await ConfigModel.updateConfig("loginValidateCode", {configValue: code})
    } else {
        await ConfigModel.createConfig({configName: "loginValidateCode", configValue: code})
    }
    return code
  }

  static async refreshValidateCode(ctx) {
    const code = await UserController.setValidateCode()
    if (global.monitorInfo.loginValidateCodeTimer) {
      clearInterval(global.monitorInfo.loginValidateCodeTimer)
    } else {
      global.monitorInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
      }, 5 * 60 * 1000)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', code)
  }

  static async getValidateCode(ctx) {
    const loginValidateCodeRes = await ConfigModel.getConfigByConfigName("loginValidateCode")
    if (loginValidateCodeRes && loginValidateCodeRes.length) {
      const code = loginValidateCodeRes[0].configValue
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', code)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', code)
    }
    
  }
  /**
   * 登录并创建token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { emailName, password, code, webfunnyToken } = param

    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    // const loginValidateCode = global.monitorInfo.loginValidateCode.toLowerCase()
    const loginValidateCodeRes = await ConfigModel.getConfigByConfigName("loginValidateCode")
    const loginValidateCode = loginValidateCodeRes[0].configValue.toLowerCase()
    const loginCode = code.toLowerCase()
    if (loginValidateCode != loginCode) {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确，请重新输入！', 1)
      return
    }

    // registerStatus = 1 代表激活状态
    const data = {password: Utils.md5(decodePwd)}
    // 判断emailName是手机号，还是邮箱
    const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (phoneReg.test(emailName)) {
      data.phone = emailName
    } else {
      data.emailName = emailName
    }
    const userData = await UserModel.getUserForPwd(data)
    if (userData) {
      const { userId, companyId, userType, registerStatus, nickname } = userData
      if (registerStatus === 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('此账号尚未激活，请联系管理员激活！', 1)
        return
      }

      // 如果数据库里的token是无效的，则重新生成
      const accessToken = jwt.sign({userId, companyId, userType, emailName, nickname}, secret.sign, {expiresIn: 33 * 24 * 60 * 60 * 1000})
      UserController.setValidateCode()

      // 生成好的token存入数据库，如果已存在userId，则更新
      const userTokenInfo = await UserTokenModel.getUserTokenDetail(userId)
      if (userTokenInfo) {
        await UserTokenModel.updateUserToken(userId, {...userTokenInfo, accessToken})
      } else {
        await UserTokenModel.createUserToken({
          userId, accessToken
        })
      }

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('登录成功', accessToken)
    } else {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户名密码不正确！', 1)
    }
    
  }

  /**
   * 登出
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async logout(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId } = param

    // 如有token则设置为空，没有
    const userTokenInfo = await UserTokenModel.getUserTokenDetail(userId)
    if (userTokenInfo) {
      await UserTokenModel.updateUserToken(userId, {...userTokenInfo, accessToken: ""})
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('登出成功', 0)
  }

  /**
   * api登录并创建token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async loginForApi(ctx) {
    const param = ctx.request.body
    const { emailName, password } = param
    const decodePwd = password

    // registerStatus = 1 代表激活状态
    const data = {emailName, password: Utils.md5(decodePwd)}
    const userData = await UserModel.getUserForPwd(data)
    if (userData) {
      const { userId, userType, registerStatus, nickname } = userData
      if (registerStatus === 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('此账号尚未激活，请联系管理员激活！', 1)
        return
      }
      const accessToken = jwt.sign({userId, userType, emailName, nickname}, secret.sign, {expiresIn: 33 * 24 * 60 * 60 * 1000})
      UserController.setValidateCode()

      // 生成好的token存入数据库，如果已存在userId，则更新
      const userTokenInfo = await UserTokenModel.getUserTokenDetail(userId)
      if (userTokenInfo) {
        await UserTokenModel.updateUserToken(userId, {...userTokenInfo, accessToken})
      } else {
        await UserTokenModel.createUserToken({
          userId, accessToken
        })
      }

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('登录成功', accessToken)
    } else {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户名密码不正确！', 1)
    }
    
  }

  static async forgetPwd(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { email } = param
    // 判断是否为管理员
    let adminData = await UserModel.isAdminAccount(email, USER_INFO.USER_TYPE_ADMIN)
    if (adminData) {
      UserController.sendEmail(email, "密码找回", "管理员你好， 你的登录密码是：" + adminData.password)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('管理员你好，密码已发送至您的邮箱，请注意查收！', 0)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('非管理员账号，请联系管理员获取登录密码！', 1)
    }
  }
  

  /**
   * 发送注册验证码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async sendRegisterEmail(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { email } = param
    const charArr = "0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz"
    let code = ""
    for (let i = 0; i < 4; i ++) {
      const tempIndex = Math.floor(Math.random() * (charArr.length - 1) + 1)
      code += charArr.charAt(tempIndex)
    }
    if (global.monitorInfo.registerEmailCode[email]) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码发送太频繁', 1)
      return
    }
    global.monitorInfo.registerEmailCode[email] = code
    // 邮箱验证失败次数清零
    global.monitorInfo.registerEmailCodeCheckError[email] = 0
    // 1分钟后失效
    setTimeout(() => {
      delete global.monitorInfo.registerEmailCode[email]
    }, 2 * 60 * 1000)
    const title = "注册验证码：" + code
    const content = "<p>用户你好!</p>" + 
    "<p>Webfunny注册的验证码为：" + code + "</p>" +
    "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
    UserController.sendEmail(email, title, content)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('验证码已发送', 0)
  }
  /**
   * 获取注册验证码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getRegisterEmailForSupperAdmin(ctx) {
    const { userType } = ctx.user
    if (userType !== "superAdmin" && userType !== "admin") {
      ctx.response.status = 403;
      ctx.body = statusCode.ERROR_403('您没有权限执行此操作！')
      return
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', global.monitorInfo.registerEmailCode)
  }

  /**
   * 给管理员发送检查邮件
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerCheck(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { name, email, emailCode, password } = param
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('邮箱已存在！', 1)
      return
    }

    let adminData = await UserModel.getAdminByType("admin")

    if (!adminData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('请先初始化管理员账号', 1)
    } else {
      const adminEmail = adminData.emailName
      const { localServerDomain } = accountInfo
      // 此处需要支持http协议
      const confirmUrl = `http://${localServerDomain}/server/register?name=${name}&email=${email}&password=${password}`
      const title = "管理员确认申请"
      const content = "<p>管理员你好!</p>" + 
      "<p>有用户申请注册你的监控系统，请点击注册链接，以完成注册：<a href='" + confirmUrl + "'>" + confirmUrl + "</a></p>" +
      "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
      UserController.sendEmail(adminEmail, title, content)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }
  }

  /**
   * 注册用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async register(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const { name, email = "", phone = "", password, emailCode } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const userId = Utils.getUuid()
    const avatar = Math.floor(Math.random() * 10)
    // 注册用户是否需要激活
    const registerStatus = accountInfo.activationRequired === true ? 0 : 1
    const data = {nickname: name, emailName: email, phone, password: Utils.md5(decodePwd), userId, userType: "customer", registerStatus, avatar}

    // 记录注册邮箱
    Utils.postJson("http://www.webfunny.cn/config/recordEmail", {phone, email, purchaseCode: accountInfo.purchaseCode, source: "center-register"}).catch((e) => {})
    
    const registerEmailCodeCheckError = global.monitorInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      if (!registerEmailCodeCheckError[email]) {
        registerEmailCodeCheckError[email] = 1
      } else {
        registerEmailCodeCheckError[email] ++
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('邮箱已存在！', 1)
      return
    }
    // 创建团队
    // const team = { leaderId: userId, members: userId, webMonitorIds: ""}
    // TeamModel.createTeam(team);
    /* 判断参数是否合法 */
    if (data.nickname) {
      let ret = await UserModel.createUser(data);
      if (ret && ret.id) {
        // 通知用户注册的账号密码
        const title = "申请成功"
        const content = "<p>用户你好!</p>" + 
        "<p>你的账号已经申请成功，请联系管理员激活后，方可登录。</p>" +
        "<p>账号：" + email + " 、 密码：" + decodePwd + "</p>" +
        "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
        UserController.sendEmail(email, title, content)

        // 获取管理员账号
        const adminUser = await UserModel.getUserForAdmin()
        const contentArray = JSON.stringify([`您好，用户【${email}】正在申请注册webfunny账号，请及时处理！`])
        // 给管理员发送一条系统消息
        MessageModel.createMessage({
          userId: adminUser[0].userId,
          title: "用户注册通知",
          content: contentArray,
          type: "sys",
          isRead: 0,
          link: `http://${accountInfo.localAssetsDomain}/webfunny_center/teamList.html`
        })
        // 给管理员发送一封邮件
        const adminTitle = "用户注册通知"
        const adminContent = `
        <p>尊敬的管理员：</p>
        <p>您好，用户【${email}】正在申请注册webfunny账号，请及时处理！</p>
        <p>点击链接处理：http://${accountInfo.localAssetsDomain}/webfunny_center/userList.html</p>
        <p>如有疑问，请联系作者，微信号：webfunny_2020</p>
        `
        UserController.sendEmail(adminUser[0].emailName, adminTitle, adminContent)

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }

  /**
   * 注册用户(saas)
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerForSaas(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const { companyName, chooseCompanyId, name, email = "", phone = "", password, emailCode } = param
    const registerType = param.registerType * 1
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const userId = Utils.getUuid()
    let companyId = Utils.getUuid()
    const avatar = Math.floor(Math.random() * 10)
    // 注册用户是否需要激活
    let registerStatus = accountInfo.activationRequired === true ? 0 : 1
    let userType = "customer"
    // 如果注册是超级管理员，则默认激活
    if (registerType === 1) {
      registerStatus = 1
      userType = "superAdmin"
      // 创建一个公司
      await CompanyModel.createCompany({
        ownerId: userId,
        companyId,
        companyName
      })
    } else {
      companyId = chooseCompanyId
    }
    const data = {companyId, nickname: name, emailName: email, phone, password: Utils.md5(decodePwd), userId, userType, registerStatus, avatar}

    // 记录注册邮箱
    Utils.postJson(`${WEBFUNNY_CONFIG_URI}/config/recordEmail`, {phone, email, purchaseCode: accountInfo.purchaseCode, source: "center-register"}).catch((e) => {})
    
    const registerEmailCodeCheckError = global.monitorInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      if (!registerEmailCodeCheckError[email]) {
        registerEmailCodeCheckError[email] = 1
      } else {
        registerEmailCodeCheckError[email] ++
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('邮箱已存在！', 1)
      return
    }
    // 创建团队
    // const team = { leaderId: userId, members: userId, webMonitorIds: ""}
    // TeamModel.createTeam(team);
    /* 判断参数是否合法 */
    if (data.nickname) {
      let ret = await UserModel.createUser(data);
      if (ret && ret.id) {

        // 后台生成订单
        if (registerType === 1 && typeof CusUtils.onRegister === "function") {
          CusUtils.onRegister({
            email,
            memberName: companyName || "",
            productType: 60,
            orderAmount: 0,
            typeOfTax: "", // 是否收税点
            phone,
            name,
            months: 12,  // 默认12个月
            projectNum: 10, // 项目个数
            cardNum: 10, // 卡片数量
            flowCount: 100 * 10000, // 100万流量
            saveDays: 7,  // 存储周期
            companyId,
            channel: "saas"
          })
          ctx.response.status = 200;
          ctx.body = statusCode.SUCCESS_200('账号创建成功', 0)
        } else {
          // 通知用户注册的账号密码
          const title = "申请成功"
          const content = "<p>用户你好!</p>" + 
          "<p>你的账号已经申请成功，请联系管理员激活后，方可登录。</p>" +
          "<p>账号：" + email + " 、 密码：" + decodePwd + "</p>" +
          "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
          UserController.sendEmail(email, title, content)

          // 获取管理员账号
          const adminUser = await UserModel.getUserForAdmin(companyId)
          const contentArray = JSON.stringify([`您好，用户【${name}】正在申请注册webfunny账号，请及时处理！`])
          // 给管理员发送一条系统消息
          MessageModel.createMessage({
            userId: adminUser[0].userId,
            title: "用户注册通知",
            content: contentArray,
            type: "sys",
            isRead: 0,
            link: `http://${accountInfo.localAssetsDomain}/webfunny_center/teamList.html`
          })
          // 给管理员发送一封邮件
          const adminTitle = "用户注册通知"
          const adminContent = `
          <p>尊敬的管理员：</p>
          <p>您好，用户【${email}】正在申请注册webfunny账号，请及时处理！</p>
          <p>点击链接处理：http://${accountInfo.localAssetsDomain}/webfunny_center/userList.html</p>
          <p>如有疑问，请联系作者，微信号：webfunny_2020</p>
          `
          UserController.sendEmail(adminUser[0].emailName, adminTitle, adminContent)

          ctx.response.status = 200;
          ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
        }
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }

  /**
   * 注册用户API
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerForApi(ctx) {
    const { name, email, phone, password, company = "xx团队" } = ctx.request.body
    const decodePwd = password
    const userId = Utils.getUuid()
    const avatar = Math.floor(Math.random() * 10)
    const data = {nickname: name, emailName: email, phone, password: Utils.md5(decodePwd), userId, userType: "customer", registerStatus: 1, avatar}
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('邮箱已存在！', 1)
      return
    }

    // 创建团队
    // const team = {teamName: company, leaderId: userId, members: userId, webMonitorIds: ""}
    // TeamModel.createTeam(team);

    /* 判断参数是否合法 */
    if (data.nickname && data.emailName && data.password) {
      let ret = await UserModel.createUser(data);
      if (ret && ret.id) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('账号注册成功', {userId})
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }

  /**
   * 重置密码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async resetPwd(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const { email, password, emailCode } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const data = {emailName: email, password: Utils.md5(decodePwd), emailCode}

    const registerEmailCodeCheckError = global.monitorInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      if (!registerEmailCodeCheckError[email]) {
        registerEmailCodeCheckError[email] = 1
      } else {
        registerEmailCodeCheckError[email] ++
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }

    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (!emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('此邮箱不存在！', 1)
      return
    }
    let ret = await UserModel.resetPwd(email, data);
    if (ret) {
      // 通知用户注册的账号密码
      const title = "密码重置成功！"
      const content = "<p>用户你好!</p>" + 
      "<p>你的webfunny密码已重置。</p>" +
      "<p>账号：" + email + " 、 密码：" + decodePwd + "</p>" +
      "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
      UserController.sendEmail(email, title, content)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('重置密码失败！', 1)
    }
  }
  /**
   * 注册管理员账号
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerForAdmin(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { name, email, password, userType, phone } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const userId = Utils.getUuid()
    const avatar = Math.floor(Math.random() * 10)
    const data = {nickname: name, emailName: email, password: Utils.md5(decodePwd), userType, userId, registerStatus: 1, phone, avatar}

    // 记录注册邮箱
    Utils.postJson("http://www.webfunny.cn/config/recordEmail", {email, purchaseCode: accountInfo.purchaseCode}).catch((e) => {})

    /* 判断参数是否合法 */
    if (data.nickname) {
      const adminData = await UserModel.checkAdminAccount();
      const adminUserCount = adminData[0].count * 1
      if (adminUserCount > 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('超级管理员账号已存在，请勿重复创建', 1)
        return
      }
      await UserModel.createUser(data);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  /**
   * 激活注册用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async activeRegisterMember(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId, emailName } = param
    const { userType } = ctx.user
    if (userType !== "admin" && userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非管理员，无权调用此接口！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.activeRegisterMember(userId);

      MessageModel.createMessage({
        userId: userId,
        title: "欢迎登录！",
        content: JSON.stringify([
          "尊敬的用户您好，欢迎登录webfunny前端监控系统。",
          "webfunny致力于解决前端的各种问题，纯私有化部署，支持千万级PV的日活量。",
          "支持项目：H5前端、PC前端、微信小程序、uni-app。",
          "使用方法和常见问题请移步官网：www.webfunny.cn"
        ]),
        type: "sys",
        isRead: 0,
        link: `http://www.webfunny.cn`
      })
      // 给用户发送一封邮件
      const activeTitle = "用户激活通知"
      const activeContent = `
      <p>尊敬的用户：</p>
      <p>您好，您的账号已经被管理员激活了，快去登录吧！</p>
      <p>如有疑问，请联系作者，微信号：webfunny_2020</p>
      `
      UserController.sendEmail(emailName, activeTitle, activeContent)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户已激活', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('激活失败')
    }
  }
  /**
   * 删除
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async deleteRegisterMember(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId } = param
    const { userType } = ctx.user
    if (userType !== "admin" && userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非管理员，无权调用此接口！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.deleteUserByUserId(userId);
      await UserTokenModel.deleteUserToken(userId)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户信息删除成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('缺失userId！')
    }
  }

  /**
   * 将成员设置为管理员
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async setAdmin(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId, setType } = param
    const { userType } = ctx.user
    if (userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非超级管理员，无权设置管理员！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.setAdmin(userId, setType);
      await UserTokenModel.deleteUserToken(userId)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('管理员设置成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('缺失userId！')
    }
  }

  /**
   * 将成员设置为管理员
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async resetSuperAdmin(ctx) {
    const param = JSON.parse(ctx.request.body)
    const targetUserId = param.userId
    const { userType, userId } = ctx.user
    if (userType !== "superAdmin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非超级管理员，无权设置管理员！');
      return
    }
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.resetSuperAdmin(userId, targetUserId);
      await UserTokenModel.deleteUserToken(userId)
      await UserTokenModel.deleteUserToken(targetUserId)
      // 让数据库里的token失效

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('超级管理员移交成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('缺失userId！')
    }
  }

  /**
   * 检查sso的token是否有效
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async checkSsoToken(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { token } = param
    const ssoInfo = await Utils.postJson(accountInfo.ssoCheckUrl, {token})
    if (!ssoInfo) {
      ctx.response.status = 500;
      ctx.body = statusCode.ERROR_500('Token验证无效1！', 1)
      return
    }
    const { phone, email } = ssoInfo.data
    const accessToken = await UserController.createSsoToken(phone, email)
    if (accessToken) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', accessToken)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412("登录失败，账号无效或不存在！", 0)
    }
    
  }

  /**
   * sso登录成功，则根据手机号和邮箱生产token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createSsoToken(phone, email) {
    // 检查phone, email是否在本系统中
    const existUsers = await UserModel.checkUserByPhoneOrEmail(phone, email)
    if (!existUsers || !existUsers.length) {
      return 0
    }
    if (existUsers.length > 1) {
      return 0
    }
    const { userId, userType, emailName, nickname } = existUsers[0]
    // 账号存在，则说明账号有效，生成登录token
    const accessToken = jwt.sign({userId, userType, emailName, nickname}, secret.sign, {expiresIn: 33 * 24 * 60 * 60 * 1000})

    // 生成好的token存入数据库，如果已存在userId，则更新
    const userTokenInfo = await UserTokenModel.getUserTokenDetail(userId)
    if (userTokenInfo) {
      await UserTokenModel.updateUserToken(userId, {...userTokenInfo, accessToken})
    } else {
      await UserTokenModel.createUserToken({
        userId, accessToken
      })
    }
    return accessToken
  }
}
module.exports = {CommonTableController,ApplicationConfigController,FlowDataInfoByDayController,FlowDataInfoByHourController,UserTokenController,ProductController,CompanyController,OrderController,MessageController,ConfigController,TimerCalculateController,TeamController,UserController}