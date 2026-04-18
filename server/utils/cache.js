import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import config from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Cache {
  constructor() {
    this.store = new Map();
    this.ttl = config.cache.ttl * 1000;
    this.enabled = config.cache.enabled;
  }

  get(key) {
    if (!this.enabled) return null;
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, customTtl = null) {
    if (!this.enabled) return;
    const ttl = customTtl || this.ttl;
    this.store.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  keys() {
    return Array.from(this.store.keys());
  }

  size() {
    return this.store.size;
  }
}

const cache = new Cache();

export default cache;
