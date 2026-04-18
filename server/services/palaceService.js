import palaceModel from "../models/palaceModel.js";
import cache from "../utils/cache.js";

class PalaceService {
  constructor() {
    this.cachePrefix = "palace:";
    this.cacheTTL = 300;
  }

  async getAllPalaces(options = {}) {
    const cacheKey = `${this.cachePrefix}list:${JSON.stringify(options)}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await palaceModel.findAll(options);

    cache.set(cacheKey, result, this.cacheTTL);

    return result;
  }

  async getPalaceById(id) {
    const cacheKey = `${this.cachePrefix}${id}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const palace = await palaceModel.findById(id);
    if (!palace) {
      return null;
    }

    const detailed = await palaceModel.getPalaceByIdDetailed(id);

    cache.set(cacheKey, detailed, this.cacheTTL);

    return detailed;
  }

  async getPalacesByDynasty(dynasty) {
    return await palaceModel.findByDynasty(dynasty);
  }

  async searchPalaces(keyword) {
    return await palaceModel.findAll({ search: keyword, limit: 50 });
  }

  async getStatistics() {
    const cacheKey = `${this.cachePrefix}statistics`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const statistics = await palaceModel.getStatistics();

    cache.set(cacheKey, statistics, this.cacheTTL);

    return statistics;
  }

  async getTopPalaces(criteria = "area", limit = 5) {
    return await palaceModel.getTopPalaces(criteria, limit);
  }

  async getMaterials() {
    const cacheKey = `${this.cachePrefix}materials`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const materials = await palaceModel.getMaterials();

    cache.set(cacheKey, materials, this.cacheTTL);

    return materials;
  }

  async getCraftTimeline() {
    const cacheKey = `${this.cachePrefix}craftTimeline`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const timeline = await palaceModel.getCraftTimeline();

    cache.set(cacheKey, timeline, this.cacheTTL);

    return timeline;
  }

  clearCache() {
    const keys = cache.keys();
    keys.forEach((key) => {
      if (key.startsWith(this.cachePrefix)) {
        cache.delete(key);
      }
    });
  }
}

export default new PalaceService();