const PurchaseCode = function (sequelize, DataTypes) {
    return sequelize.define('PurchaseCode', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 购置的唯一注册码
        purchaseCode: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        // 绑定的IP地址
        ipList: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        // 购买类型: 免费，试用，订阅，众筹
        purchaseType: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'purchaseType'
        },
        // 公司名称
        companyName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'companyName'
        },
        // 购买用户姓名
        customerName: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'customerName'
        },
        // 购买用户账号
        customerNumber: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'customerNumber'
        },
        // 暂停使用 0 暂停，1 激活
        pauseStatus: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'pauseStatus'
        },
        // 使用截止时间
        endTime: {
            type: DataTypes.STRING(13),
            allowNull: true,
            field: 'endTime'
        },
        // 申请邮箱，用于收取注册码
        mainEmail: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        // 创建时间
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        // 更新时间
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
}
//exports//
module.exports = PurchaseCode
//exports//