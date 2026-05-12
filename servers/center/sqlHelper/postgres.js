const e = (name) => `"${name}"`

module.exports = {
  /**
   * 为标识符加双引号，PostgreSQL 区分大小写，驼峰列名和表名必须加引号
   */
  esc: e,

  /**
   * 'value' = ANY(string_to_array(column, ','))
   */
  findInSet: (value, column) => `'${value}' = ANY(string_to_array(${column}, ','))`,

  /**
   * 检查列的值是否在给定的逗号分隔字符串中
   * column = ANY(string_to_array('val1,val2,...', ','))
   */
  columnInSet: (column, valuesStr) => `${column} = ANY(string_to_array('${valuesStr}', ','))`,

  /**
   * TO_CHAR(column, 'YYYY-MM-DD ...')，自动将 MySQL 格式符转换为 PG 格式符
   */
  dateFormat: (column, format) => {
    const pgFormat = format
      .replace('%Y', 'YYYY')
      .replace('%m', 'MM')
      .replace('%d', 'DD')
      .replace('%H', 'HH24')
      .replace('%i', 'MI')
      .replace('%s', 'SS')
    return `TO_CHAR(${column}, '${pgFormat}')`
  },

  /**
   * 当前日期函数，PostgreSQL 不加括号
   */
  currentDate: () => 'CURRENT_DATE',

  /**
   * 生成 UUID，PostgreSQL 用 gen_random_uuid()（需 pgcrypto 或 PG13+ 内置）
   */
  uuid: () => 'gen_random_uuid()',

  /**
   * 将 datetime 截断到日期，PostgreSQL 用 ::date 类型转换
   */
  castDate: (column) => `(${column})::date`,

  /**
   * 将列强制转为文本类型，PostgreSQL 需要 ::text 避免 uuid = varchar 报错
   */
  castToText: (col) => `${col}::text`,

  /**
   * NOW() 减去 n 天（字面量数字），PostgreSQL: NOW() - INTERVAL 'n days'
   */
  nowMinusDays: (n) => `NOW() - INTERVAL '${n} days'`,

  /**
   * NOW() 减去某列表示的天数，PostgreSQL: NOW() - col * INTERVAL '1 day'
   */
  nowMinusDaysCol: (col) => `NOW() - ${col} * INTERVAL '1 day'`,

  /**
   * 分页 LIMIT 语句，PostgreSQL 语法：LIMIT count OFFSET offset
   */
  paginate: (count, offset) => `LIMIT ${count} OFFSET ${offset}`,

  /**
   * sum(CASE WHEN col='val' THEN valueCol ELSE 0 END) 聚合，PostgreSQL 无 IF()
   */
  sumIfEq: (condCol, condVal, valueCol) => `sum(CASE WHEN ${condCol}='${condVal}' THEN ${valueCol} ELSE 0 END)`,

  /**
   * ORDER BY 按指定 ID 顺序排序，PostgreSQL 用 CASE WHEN 模拟 FIELD()
   * valuesStr 形如 "'id1','id2','id3'"
   */
  orderByField: (col, valuesStr) => {
    const vals = valuesStr.split(',')
    const cases = vals.map((v, i) => `WHEN ${col}=${v.trim()} THEN ${i}`).join(' ')
    return `ORDER BY CASE ${cases} END`
  },

  /**
   * MasterLock 原子性抢锁 SQL（INSERT ... ON CONFLICT DO UPDATE）
   * replacements 需包含：{ lockKey, nodeId, nodeIp, expireTime, now }
   */
  buildTryAcquireLockSql: () => `
    INSERT INTO "MasterLock" ("lockKey", "nodeId", "nodeIp", "expireTime", "createdAt", "updatedAt")
    VALUES (:lockKey, :nodeId, :nodeIp, :expireTime, :now, :now)
    ON CONFLICT("lockKey") DO UPDATE SET
      "nodeId"     = CASE WHEN "MasterLock"."expireTime" < :now THEN :nodeId     ELSE "MasterLock"."nodeId"     END,
      "nodeIp"     = CASE WHEN "MasterLock"."expireTime" < :now THEN :nodeIp     ELSE "MasterLock"."nodeIp"     END,
      "expireTime" = CASE WHEN "MasterLock"."expireTime" < :now THEN :expireTime ELSE "MasterLock"."expireTime" END,
      "updatedAt"  = CASE WHEN "MasterLock"."expireTime" < :now THEN :now        ELSE "MasterLock"."updatedAt"  END
  `
}
