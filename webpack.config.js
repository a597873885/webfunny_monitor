var path = require('path');
var webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);

module.exports = [
  // {
  //   entry: {
  //     'monitor' : ROOT_PATH + "/webmonitor.js",
  //   },
  //   //输出的文件名 合并以后的js会命名为index.js
  //   output: {
  //     path: ROOT_PATH + "/lib/",
  //     filename: '[name].min.js'
  //   },
  //   //添加我们的插件 会自动生成一个html文件
  //   plugins: [
  //     new webpack.optimize.UglifyJsPlugin({    //压缩代码
  //       compress: {
  //         warnings: false
  //       },
  //       except: ['$super', '$', 'exports', 'require']    //排除关键字
  //     })
  //   ]
  // },
  {
    entry: [ROOT_PATH + "/resource/html2canvas0.js", ROOT_PATH + "/webmonitor.js", ROOT_PATH + "/resource/fetchCode.js"],
    //输出的文件名 合并以后的js会命名为monitor.fetch.min.js
    output: {
      path: ROOT_PATH + "/lib/",
      filename: 'monitor.fetch.screen.min.js'
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
            uglifyOptions: {
              beautify: true,  
                output: {
                    comments: false
                },
                compress: {
                  collapse_vars: true,                                                      // 内嵌定义了但是只用到一次的变量
                  reduce_vars: true,        
                },
                except: ['$super', '$', 'exports', 'require', 'html2canvas']    //排除关键字
            }
        }),
      ]
    },
    //添加我们的插件 会自动生成一个html文件
    plugins: [
      // new webpack.optimize.UglifyJsPlugin({    //压缩代码
      //   compress: {
      //     warnings: false
      //   },
      //   except: ['$super', '$', 'exports', 'require', 'html2canvas']    //排除关键字
      // })
    ]
  },
  {
    entry: [ROOT_PATH + "/webmonitor.js", ROOT_PATH + "/resource/fetchCode.js"],
    //输出的文件名 合并以后的js会命名为monitor.fetch.min.js
    output: {
      path: ROOT_PATH + "/lib/",
      filename: 'monitor.fetch.min.js'
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
            uglifyOptions: {
              beautify: true,  
                output: {
                    comments: false
                },
                compress: {
                  collapse_vars: true,                                                      // 内嵌定义了但是只用到一次的变量
                  reduce_vars: true,        
                },
                except: ['$super', '$', 'exports', 'require', 'html2canvas']    //排除关键字
            }
        }),
      ]
    },
    //添加我们的插件 会自动生成一个html文件
    plugins: [
      // new webpack.optimize.UglifyJsPlugin({    //压缩代码
      //   compress: {
      //     warnings: false
      //   },
      //   except: ['$super', '$', 'exports', 'require', 'html2canvas']    //排除关键字
      // })
    ]
  }
];
