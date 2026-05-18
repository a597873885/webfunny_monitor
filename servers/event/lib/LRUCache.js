/**
 * LRU缓存实现，用于更智能的内存管理
 * 提取为独立类，避免静态字段嵌套类在某些 Node.js 版本中的兼容性问题
 */
module.exports = class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            // 更新访问时间
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return undefined;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // 删除最久未使用的项
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    has(key) {
        return this.cache.has(key);
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    get size() {
        return this.cache.size;
    }

    keys() {
        return this.cache.keys();
    }

    // 为了兼容性，提供entries方法
    entries() {
        return this.cache.entries();
    }

    // 提供forEach方法
    forEach(callback) {
        this.cache.forEach(callback);
    }
}
