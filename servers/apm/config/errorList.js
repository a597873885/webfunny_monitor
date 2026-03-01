export const JsErrorType = {
  syntaxerror: {
    name: "语法错误",
    des: "这种问题一般为：JSON格式转换、变量名的命名不规范，给关键字进行赋值，花括号没有成对儿出现等等"
  },
  referenceerror: {
    name: "引用错误",
    des: "这种问题一般为：引用一个不存在的变量、将一个值分配给无法分配的对象等等"
  },
  rangeerror: {
    name: "范围错误",
    des: "这种问题一般为：一个值超出有效范围时会发生的错误"
  },
  typeerror: {
    name: "类型错误",
    des: "这种问题一般为：变量或参数不是预期类型时发生的错误"
  },
  urierror: {
    name: "URL错误",
    des: "这种问题一般为：调用相关函数的参数不正确时发生的错误"
  },
  "script error": {
    name: "第三方脚本错误",
    des: "这种问题一般为：引入非同源的第三方js文件中发生的错误"
  },
  unhandledrejection: {
    name: "未处理的异常",
    des: "这种问题一般为：没有处理Promise异常结果时发生的错误"
  },
  customizeerror: {
    name: "自定义错误",
    des: "这种问题一般为：通过console.error打印的错误信息，一般用于提醒",
  },
  unknown: {
    name: "未知错误类型",
    des: ""
  }
}