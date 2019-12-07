//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const CustomerPV = Sequelize.import('../schema/customerPV');
CustomerPV.sync({force: false});
//Sequelize//
class CustomerPVModel {
  /**
   * 创建CustomerPV信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCustomerPV(data) {
    return await CustomerPV.create({
      ...data
    })
  }

  /**
   * 更新CustomerPV数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateCustomerPV(id, data) {
    await CustomerPV.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取CustomerPV列表
   * @returns {Promise<*>}
   */
  static async getCustomerPVList() {
    return await CustomerPV.findAndCountAll()
  }
}
//exports//
module.exports = CustomerPVModel
//exports//