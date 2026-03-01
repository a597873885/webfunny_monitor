/**
 * 自动追踪加载器（零侵入方案）
 * 通过拦截 require() 自动包装 Controller 和 Model
 * 
 * 使用方法：
 * 1. 在 app.js 中调用：initAutoTracer(tracingConfig)
 * 2. 不需要修改任何 Controller 或 Model 代码
 */

const Module = require('module');
const path = require('path');
const { wrapController, wrapModel } = require('./webfunnyOtelTracer');

// 存储配置
let tracingConfig = null;

// 保存原始的 require 方法
const originalRequire = Module.prototype.require;

// 记录已包装的模块（使用绝对路径作为 key）
const wrappedModules = new Set();

/**
 * 检查路径是否匹配配置的目录名和文件名
 * @param {string} filePath - 文件路径
 * @param {string[]} dirNames - 目录名数组
 * @param {string[]} fileNames - 文件名数组
 * @returns {boolean} 是否匹配
 */
function matchPath(filePath, dirNames, fileNames) {
  if (!dirNames || !fileNames || dirNames.length === 0 || fileNames.length === 0) {
    return false;
  }
  
  const normalizedPath = path.normalize(filePath);
  
  // 检查是否包含任一目录名
  const hasDirName = dirNames.some(dirName => {
    // 使用路径分隔符确保是完整的目录名，而不是文件名的一部分
    const dirPattern = new RegExp(`[\\/\\\\]${dirName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\/\\\\]`);
    return dirPattern.test(normalizedPath);
  });
  
  if (!hasDirName) {
    return false;
  }
  
  // 检查是否以任一文件名结尾
  const hasFileName = fileNames.some(fileName => {
    // 移除 .js 扩展名进行匹配（支持带或不带扩展名）
    const fileNameWithoutExt = fileName.replace(/\.js$/, '');
    const filePattern = new RegExp(`${fileNameWithoutExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\.js)?$`);
    return filePattern.test(normalizedPath);
  });
  
  return hasFileName;
}

/**
 * 从路径中提取 service 名称
 * @param {string} filePath - 文件路径
 * @param {string} type - 类型（'controller' 或 'model'）
 * @returns {string} service 名称
 */
function extractServiceName(filePath, type) {
  const normalizedPath = path.normalize(filePath);
  
  // 优先从 servers/*/ 路径中提取
  const serversMatch = normalizedPath.match(/[\/\\]servers[\/\\]([^\/\\]+)[\/\\]/);
  if (serversMatch) {
    return serversMatch[1];
  }
  
  // 如果没有 servers 前缀，尝试从目录名之前的路径段提取
  // 例如：src/monitor/controllers/controllers.js -> monitor
  // 或者：app/api/controllers/controllers.js -> api
  const pathParts = normalizedPath.split(/[\/\\]/);
  if (!tracingConfig) {
    return 'Unknown';
  }
  const pathMatchConfig = tracingConfig.business?.pathMatch?.[type];
  
  if (pathMatchConfig && pathMatchConfig.dirNames && pathMatchConfig.dirNames.length > 0) {
    // 找到目录名的位置
    const dirNameIndex = pathParts.findIndex(part => pathMatchConfig.dirNames.includes(part));
    if (dirNameIndex > 0) {
      // 返回目录名之前的路径段作为 service 名称
      return pathParts[dirNameIndex - 1];
    }
  }
  
  // 如果都提取不到，返回 'Unknown'
  return 'Unknown';
}

// 判断文件路径是否需要自动包装
function shouldAutoWrap(modulePath, resolvedPath) {
  if (!tracingConfig || !tracingConfig.enabled || !tracingConfig.business.enabled) {
    return null; // 追踪未启用
  }

  // 使用解析后的绝对路径进行匹配
  const pathToCheck = resolvedPath || modulePath;
  const normalizedPath = path.normalize(pathToCheck);
  
  const pathMatchConfig = tracingConfig.business.pathMatch || {};
  
  // 匹配 Controller 文件
  if (tracingConfig.business.traceController) {
    const controllerConfig = pathMatchConfig.controller || {};
    const controllerDirNames = controllerConfig.dirNames || ['controllers'];
    const controllerFileNames = controllerConfig.fileNames || ['controllers.js'];
    
    // 如果配置了路径匹配，使用配置；否则使用默认模式（向后兼容）
    if (controllerConfig.dirNames || controllerConfig.fileNames) {
      // 使用配置的目录名和文件名匹配
      if (matchPath(normalizedPath, controllerDirNames, controllerFileNames)) {
        const serviceName = extractServiceName(normalizedPath, 'controller');
        return { type: 'controller', service: serviceName };
      }
    } else {
      // 默认模式：servers/*/controllers/controllers.js（向后兼容）
      const controllerPattern = /(?:^|[\/\\])(?:\.\.\/)*servers[\/\\](\w+)[\/\\]controllers[\/\\]controllers(?:\.js)?$/;
      if (controllerPattern.test(normalizedPath)) {
        const serviceName = normalizedPath.match(/servers[\/\\](\w+)[\/\\]controllers/)?.[1] || 'Unknown';
        return { type: 'controller', service: serviceName };
      }
    }
  }
  
  // 匹配 Model 文件
  if (tracingConfig.business.traceModel) {
    const modelConfig = pathMatchConfig.model || {};
    const modelDirNames = modelConfig.dirNames || ['modules'];
    const modelFileNames = modelConfig.fileNames || ['models.js'];
    
    // 如果配置了路径匹配，使用配置；否则使用默认模式（向后兼容）
    if (modelConfig.dirNames || modelConfig.fileNames) {
      // 使用配置的目录名和文件名匹配
      if (matchPath(normalizedPath, modelDirNames, modelFileNames)) {
        const serviceName = extractServiceName(normalizedPath, 'model');
        return { type: 'model', service: serviceName };
      }
    } else {
      // 默认模式：servers/*/modules/models.js（向后兼容）
      const modelPattern = /(?:^|[\/\\])(?:\.\.\/)*servers[\/\\](\w+)[\/\\]modules[\/\\]models(?:\.js)?$/;
      if (modelPattern.test(normalizedPath)) {
        const serviceName = normalizedPath.match(/servers[\/\\](\w+)[\/\\]modules/)?.[1] || 'Unknown';
        return { type: 'model', service: serviceName };
      }
    }
  }
  
  return null;
}

// 自动包装导出的类（直接修改原 exports 对象，避免重复包装）
function autoWrapExports(exports, wrapInfo, resolvedPath) {
  if (!exports || typeof exports !== 'object') {
    return exports;
  }

  // 检查是否已经包装过（使用绝对路径作为标识）
  if (resolvedPath && wrappedModules.has(resolvedPath)) {
    return exports; // 已经包装过，直接返回
  }

  const { type, service } = wrapInfo;
  
  // 直接修改原 exports 对象，而不是创建新对象
  Object.keys(exports).forEach(name => {
    const originalClass = exports[name];
    
    // 检查是否已经包装过（通过检查是否有标记）
    if (originalClass && originalClass.__otelWrapped) {
      return; // 已经包装过，跳过
    }
    
    // 只包装函数/类
    if (typeof originalClass === 'function' || (originalClass && typeof originalClass === 'object')) {
      if (!tracingConfig) {
        return; // 配置未初始化，跳过
      }
      if (type === 'controller' && tracingConfig.business.traceController) {
        // 生成 Controller 名称（首字母大写 + Service 前缀）
        const serviceCap = service.charAt(0).toUpperCase() + service.slice(1);
        const wrappedClass = wrapController(originalClass, `${serviceCap}${name}`);
        // 添加标记，防止重复包装
        wrappedClass.__otelWrapped = true;
        exports[name] = wrappedClass;
      } else if (type === 'model' && tracingConfig.business.traceModel) {
        // 生成 Model 名称
        const serviceCap = service.charAt(0).toUpperCase() + service.slice(1);
        const wrappedClass = wrapModel(originalClass, `${serviceCap}${name}`);
        // 添加标记，防止重复包装
        wrappedClass.__otelWrapped = true;
        exports[name] = wrappedClass;
      }
    }
  });
  
  // 记录已包装的模块
  if (resolvedPath) {
    wrappedModules.add(resolvedPath);
  }
  
  return exports;
}

// 重写 require 方法，拦截并自动包装
Module.prototype.require = function(modulePath) {
  // 先解析模块路径（获取绝对路径）
  let resolvedPath = modulePath;
  try {
    // 尝试从模块缓存中获取实际路径
    const resolvedFilename = Module._resolveFilename(modulePath, this.parent || this, false);
    if (resolvedFilename) {
      resolvedPath = resolvedFilename;
    }
  } catch (e) {
    // 如果解析失败，使用原始路径
    resolvedPath = modulePath;
  }
  
  // 检查是否需要自动包装（使用解析后的路径）
  const wrapInfo = shouldAutoWrap(modulePath, resolvedPath);
  
  // 调用原始 require 获取模块
  const exports = originalRequire.apply(this, arguments);
  
  if (wrapInfo) {
    // 自动包装并返回（直接修改原 exports 对象）
    return autoWrapExports(exports, wrapInfo, resolvedPath);
  }
  
  // 不需要包装，直接返回原始 exports
  return exports;
};

/**
 * 初始化自动追踪加载器
 * @param {Object} config - 追踪配置对象
 */
function initAutoTracer(config) {
  tracingConfig = config || {
    enabled: false,
    business: { enabled: false }
  };
  
  console.log('🎯 [AutoTracer] 自动追踪加载器已启用');
  console.log('   - Controller 自动包装:', tracingConfig.business?.traceController ? '✅' : '❌');
  console.log('   - Model 自动包装:', tracingConfig.business?.traceModel ? '✅' : '❌');
}

module.exports = {
  initAutoTracer,
};

