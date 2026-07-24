module.exports = {
  /**
   * 标识符原样返回，MySQL 不需要双引号
   */
  esc: (name) => name,

  /**
   * FIND_IN_SET('value', column)
   */
  findInSet: (value, column) => `FIND_IN_SET('${value}', ${column})`,

  /**
   * 检查列的值是否在给定的逗号分隔字符串中
   * FIND_IN_SET(column, 'val1,val2,...')
   */
  columnInSet: (column, valuesStr) => `FIND_IN_SET(${column}, '${valuesStr}')`,

  /**
   * DATE_FORMAT(column, '%Y-%m-%d')
   */
  dateFormat: (column, format) => `DATE_FORMAT(${column}, '${format}')`,

  /**
   * 当前日期函数
   */
  currentDate: () => 'CURRENT_DATE()',

  /**
   * 生成 UUID，MySQL 用内置函数
   */
  uuid: () => 'UUID()',

  /**
   * 将 datetime 截断到日期，MySQL 用 DATE()
   */
  castDate: (column) => `DATE(${column})`,

  /**
   * 将列强制转为文本类型，MySQL 原样返回（隐式转型），PostgreSQL 用 ::text
   */
  castToText: (col) => col,

  /**
   * NOW() 减去 n 天（字面量数字），MySQL: DATE_SUB(NOW(), INTERVAL n DAY)
   */
  nowMinusDays: (n) => `DATE_SUB(NOW(), INTERVAL ${n} DAY)`,

  /**
   * NOW() 减去某列表示的天数，MySQL: DATE_SUB(NOW(), INTERVAL col DAY)
   */
  nowMinusDaysCol: (col) => `DATE_SUB(NOW(), INTERVAL ${col} DAY)`,

  /**
   * 分页 LIMIT 语句，MySQL 语法：LIMIT offset, count
   */
  paginate: (count, offset) => `LIMIT ${offset}, ${count}`,

  /**
   * sum(if(col='val', valueCol, 0)) 聚合，MySQL 用 IF()
   */
  sumIfEq: (condCol, condVal, valueCol) => `sum(if(${condCol}='${condVal}', ${valueCol}, 0))`,

  /**
   * ORDER BY FIELD(col, val1, val2, ...) 按指定顺序排序
   * valuesStr 形如 "'id1','id2','id3'"
   */
  orderByField: (col, valuesStr) => `ORDER BY FIELD(${col}, ${valuesStr})`,

  /**
   * MasterLock 原子性抢锁 SQL（INSERT ... ON DUPLICATE KEY UPDATE）
   * replacements 需包含：{ lockKey, nodeId, nodeIp, expireTime, now }
   */
  buildTryAcquireLockSql: () => `
    INSERT INTO MasterLock (lockKey, nodeId, nodeIp, expireTime, createdAt, updatedAt)
    VALUES (:lockKey, :nodeId, :nodeIp, :expireTime, :now, :now)
    ON DUPLICATE KEY UPDATE
      nodeId     = IF(MasterLock.expireTime < :now, :nodeId,     MasterLock.nodeId),
      nodeIp     = IF(MasterLock.expireTime < :now, :nodeIp,     MasterLock.nodeIp),
      expireTime = IF(MasterLock.expireTime < :now, :expireTime, MasterLock.expireTime),
      updatedAt  = IF(MasterLock.expireTime < :now, :now,        MasterLock.updatedAt)
  `
}
