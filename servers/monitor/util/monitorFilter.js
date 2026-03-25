const Utils = require("./utils")

const DEFAULT_CONFIG = {
  s: true,
  pv: { s: true, ia: [""] },
  je: { s: true, ia: [""] },
  hl: { s: true, ia: [""] },
  rl: { s: true, ia: [""] }
}

function safeDecode(value) {
  if (!value || typeof value !== "string") return ""
  let result = value
  try {
    const b64Decoded = Utils.b64DecodeUnicode(result)
    if (b64Decoded) {
      result = b64Decoded
    }
  } catch (e) {
    // ignore
  }
  try {
    result = decodeURIComponent(result)
  } catch (e) {
    // ignore
  }
  return result
}

function normalizeIncludes(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map(item => (item || "").toString().trim()).filter(Boolean)
}

function hitIgnoreRule(text, includes) {
  if (!text) return false
  if (!includes || includes.length === 0) return false
  const target = String(text)
  return includes.some(key => target.indexOf(key) !== -1)
}

function getRuleByUploadType(uploadType, config) {
  const type = uploadType || ""
  if (type === "CUSTOMER_PV" || type === "PAGE_LOAD") {
    return { rule: config.pv || DEFAULT_CONFIG.pv, key: "pv" }
  }
  if (type === "JS_ERROR") {
    return { rule: config.je || DEFAULT_CONFIG.je, key: "je" }
  }
  if (type === "HTTP_LOG" || type === "HTTP_ERROR" || type === "HTTP_LOG_REQ") {
    return { rule: config.hl || DEFAULT_CONFIG.hl, key: "hl" }
  }
  if (type === "RESOURCE_LOAD" || type === "RESOURCE_PERF") {
    return { rule: config.rl || DEFAULT_CONFIG.rl, key: "rl" }
  }
  return { rule: null, key: "" }
}

function getTargetText(uploadType, logInfo = {}) {
  const type = uploadType || ""
  if (type === "CUSTOMER_PV" || type === "PAGE_LOAD") {
    return safeDecode(logInfo.simpleUrl || logInfo.completeUrl || "")
  }
  if (type === "JS_ERROR") {
    const simpleError = safeDecode(logInfo.simpleErrorMessage || "")
    const fullError = safeDecode(logInfo.errorMessage || "")
    return `${simpleError} ${fullError}`.trim()
  }
  if (type === "HTTP_LOG" || type === "HTTP_ERROR" || type === "HTTP_LOG_REQ") {
    return safeDecode(logInfo.simpleHttpUrl || logInfo.httpUrl || "")
  }
  if (type === "RESOURCE_LOAD" || type === "RESOURCE_PERF") {
    return safeDecode(logInfo.sourceUrl || "")
  }
  return ""
}

function shouldFilterLog(logInfo = {}, projectConfig = DEFAULT_CONFIG) {
  const uploadType = logInfo.uploadType || ""
  if (!uploadType) return false
  const cfg = projectConfig || DEFAULT_CONFIG
  if (cfg.s === false) {
    return true
  }
  const { rule } = getRuleByUploadType(uploadType, cfg)
  if (!rule) return false
  if (rule.s === false) {
    return true
  }
  const includes = normalizeIncludes(rule.ia)
  if (includes.length === 0) return false
  const targetText = getTargetText(uploadType, logInfo)
  return hitIgnoreRule(targetText, includes)
}

module.exports = {
  shouldFilterLog
}
