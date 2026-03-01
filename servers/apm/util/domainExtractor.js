/**
 * 域名提取工具类
 * 用于从 URL 中提取域名或IP，并标准化格式
 */
class DomainExtractor {
  /**
   * 从 URL 中提取域名
   * @param {string} url - 完整URL或路径
   * @returns {string} 域名或IP，如果无法提取则返回空字符串
   */
  static extractDomain(url) {
    if (!url || typeof url !== 'string') {
      return '';
    }
    
    try {
      // 如果是完整URL（包含协议）
      if (url.startsWith('http://') || url.startsWith('https://')) {
        try {
          const urlObj = new URL(url);
          return urlObj.host; // 返回域名和端口（如果有）
        } catch (e) {
          // URL 解析失败，尝试正则匹配
        }
      }
      
      // 如果包含域名格式（如 api.example.com:8080 或 api.example.com/api/users）
      // 匹配域名格式：字母数字开头，可包含连字符，至少一个点，最后是顶级域名，可能包含端口号
      const domainMatch = url.match(/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d+)?/);
      if (domainMatch) {
        const domain = domainMatch[0];
        // 保留端口号（如果有）
        return domain;
      }
      
      // 如果是IP地址格式（IPv4），可能包含端口号
      const ipMatch = url.match(/\b(?:\d{1,3}\.){3}\d{1,3}(:\d+)?\b/);
      if (ipMatch) {
        return ipMatch[0];
      }
      
      return '';
    } catch (e) {
      console.error('[DomainExtractor] 域名提取失败:', url, e.message);
      return '';
    }
  }
  
  /**
   * 标准化域名（统一格式，便于匹配）
   * @param {string} domain - 域名或IP
   * @returns {string} 标准化后的域名
   */
  static normalizeDomain(domain) {
    if (!domain || typeof domain !== 'string') {
      return '';
    }
    
    // 转为小写并去除首尾空格
    domain = domain.toLowerCase().trim();
    
    // 保留端口号（如果有）
    // 不进行 split(':')[0] 操作，保留完整的 host:port 格式
    
    // 可选：去掉 www 前缀（根据需求决定是否启用）
    // domain = domain.replace(/^www\./, '');
    
    return domain;
  }
  
  /**
   * 从 URL 中提取并标准化域名（一步完成）
   * @param {string} url - 完整URL或路径
   * @returns {string} 标准化后的域名或IP
   */
  static extractAndNormalize(url) {
    const domain = this.extractDomain(url);
    return this.normalizeDomain(domain);
  }
}

module.exports = DomainExtractor;

