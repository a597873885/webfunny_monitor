module.exports = {
  /**
   * 标识符用反引号包裹，ClickHouse 与 MySQL 相同
   */
  esc: (name) => `\`${name}\``,

  /**
   * FIND_IN_SET 等价：ClickHouse 无此函数，用 has(splitByString(',', column), value)
   */
  findInSet: (value, column) => `has(splitByString(',', ${column}), '${value}')`,

  /**
   * 检查列的值是否在给定的逗号分隔字符串中
   * has(splitByString(',', 'val1,val2,...'), column)
   */
  columnInSet: (column, valuesStr) => `has(splitByString(',', '${valuesStr}'), ${column})`,

  /**
   * 日期格式化：ClickHouse 用 formatDateTime()，格式串与 MySQL 兼容
   */
  dateFormat: (column, format) => `formatDateTime(${column}, '${format}')`,

  /**
   * 当前日期：ClickHouse 用 today()
   */
  currentDate: () => 'today()',

  /**
   * 生成 UUID：ClickHouse 用 generateUUIDv4()
   */
  uuid: () => 'generateUUIDv4()',

  /**
   * 将 datetime 截断到日期：ClickHouse 用 toDate()
   */
  castDate: (column) => `toDate(${column})`,

  /**
   * 将列转为文本类型：ClickHouse 用 toString()
   */
  castToText: (col) => `toString(${col})`,

  /**
   * NOW() 减去 n 天（字面量数字）：ClickHouse 用 toIntervalDay
   */
  nowMinusDays: (n) => `now() - toIntervalDay(${n})`,

  /**
   * NOW() 减去某列表示的天数：ClickHouse 用 toIntervalDay(col)
   */
  nowMinusDaysCol: (col) => `now() - toIntervalDay(${col})`,

  /**
   * 分页：ClickHouse 支持标准 LIMIT count OFFSET offset
   */
  paginate: (count, offset) => `LIMIT ${count} OFFSET ${offset}`,

  /**
   * 条件聚合：ClickHouse 有原生 sumIf(value, condition)
   */
  sumIfEq: (condCol, condVal, valueCol) => `sumIf(${valueCol}, ${condCol}='${condVal}')`,

  /**
   * 按指定 ID 顺序排序：ClickHouse 用 indexOf(array, col)
   * valuesStr 形如 "'id1','id2','id3'"
   */
  orderByField: (col, valuesStr) => {
    const vals = valuesStr.split(',').map(v => v.trim()).join(',')
    return `ORDER BY indexOf([${vals}], ${col})`
  },

  /**
   * MasterLock 原子性抢锁 SQL
   * ClickHouse 不支持传统 UPSERT，此处抛出提示，MasterLock 应使用 MySQL/PG 主库
   */
  buildTryAcquireLockSql: () => {
    throw new Error('[sqlHelper/clickhouse] ClickHouse 不支持 MasterLock UPSERT，请将 MasterLock 表保留在 MySQL/PostgreSQL 中')
  }
}
