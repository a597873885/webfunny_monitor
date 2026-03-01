const DataTypes = {
  UINT: (len) => {
    return `UInt${len}`
  },
  INT: (len) => {
    return `Int${len}` // 在普遍观念中，常用Tinyint、Smallint、Int和Bigint指代整数的不同取值范围。而ClickHouse则直接使用Int8、Int16、Int32和Int64指代4种大小的Int类型，其末尾的数字正好表明了占用字节的大小（8位=1字节）。
  },
  FLOAT: (len) => {
    return `Float${len}` // ClickHouse直接使用Float32和Float64代表单精度浮点数以及双精度浮点数。在使用浮点数的时候，要意识到它是有限精度的。对Float32和Float64写入超过有效精度的数值，结果就会出现数据误差，会被截断。
  },
  DECIMAL: (len) => {
    return `Decimal${len}` // 要更高精度的数值运算，需要使用定点数。ClickHouse提供了Decimal32、Decimal64和Decimal128三种精度的定点数。
  },
  STRING: "String", // 字符串由String定义，长度不限。因此在使用String的时候无须声明大小。它完全代替了传统意义上数据库的Varchar、Text、Clob和Blob等字符类型。String类型不限定字符集，因为它根本就没有这个概念，所以可以将任意编码的字符串存入其中。
  FIXED_STRING: "FixedString",  // FixedString类型和传统意义上的Char类型有些类似，对于一些字符有明确长度的场合，可以使用固定长度的字符串。定长字符串通过FixedString(N)声明，其中N表示字符串长度。但与Char不同的是，FixedString使用null字节填充末尾字符，而Char通常使用空格填充。
  UUID: "UUID", // UUID是一种数据库常见的主键类型，在ClickHouse中直接把它作为一种数据类型。UUID共有32位，它的格式为8-4-4-4-12。如果一个UUID类型的字段在写入数据时没有被赋值，则会依照格式使用0填充。
  DATE: "Date", // Date类型不包含具体的时间信息，只精确到天。
  DATE_TIME: "DateTime", // DateTime类型包含时、分、秒信息，精确到秒。
  DATE_TIME_64: "DateTime64" // DateTime64可以记录亚秒，它在DateTime之上增加了精度的设置。
} 
module.exports = {
  DataTypes
}