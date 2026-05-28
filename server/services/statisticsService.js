import palaceModel from "../models/palaceModel.js";
import cache from "../utils/cache.js";

class StatisticsService {
  constructor() {
    this.cachePrefix = "statistics:";
    this.cacheTTL = 300;
  }

  async getOverview() {
    const cacheKey = `${this.cachePrefix}overview`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const statistics = await palaceModel.getStatistics();
    const topByArea = await palaceModel.getTopPalaces("area", 5);
    const topByHouses = await palaceModel.getTopPalaces("houses", 5);
    const topByDuration = await palaceModel.getTopPalaces("duration", 5);

    const result = {
      ...statistics,
      topPalaces: {
        byArea: topByArea,
        byHouses: topByHouses,
        byDuration: topByDuration,
      },
      generatedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, result, this.cacheTTL);

    return result;
  }

  async getDynastyDistribution() {
    const cacheKey = `${this.cachePrefix}dynasty`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const statistics = await palaceModel.getStatistics();
    const result = {
      dynasties: statistics.dynasties,
      totalPalaces: statistics.totalPalaces,
      chartData: statistics.dynasties.map((d) => ({
        name: d.name,
        value: d.count,
        percentage: d.percentage,
      })),
    };

    cache.set(cacheKey, result, this.cacheTTL);

    return result;
  }

  async getAreaComparison() {
    const cacheKey = `${this.cachePrefix}area`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const data = await palaceModel.findAll({ limit: 100 });
    const palaces = data.palaces;

    const result = {
      palaces: palaces.map((p) => ({
        id: p.id,
        name: p.name,
        dynasty: p.dynasty,
        area: p.area,
        rank: 0,
      })).sort((a, b) => b.area - a.area).map((p, idx) => ({ ...p, rank: idx + 1 })),
      maxArea: Math.max(...palaces.map((p) => p.area)),
      minArea: Math.min(...palaces.map((p) => p.area)),
      avgArea: Math.round(palaces.reduce((sum, p) => sum + p.area, 0) / palaces.length),
    };

    cache.set(cacheKey, result, this.cacheTTL);

    return result;
  }

  async getHousesComparison() {
    const cacheKey = `${this.cachePrefix}houses`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const data = await palaceModel.findAll({ limit: 100 });
    const palaces = data.palaces;

    const result = {
      palaces: palaces.map((p) => ({
        id: p.id,
        name: p.name,
        dynasty: p.dynasty,
        houses: p.houses,
        rank: 0,
      })).sort((a, b) => b.houses - a.houses).map((p, idx) => ({ ...p, rank: idx + 1 })),
      maxHouses: Math.max(...palaces.map((p) => p.houses)),
      minHouses: Math.min(...palaces.map((p) => p.houses)),
      avgHouses: Math.round(palaces.reduce((sum, p) => sum + p.houses, 0) / palaces.length),
    };

    cache.set(cacheKey, result, this.cacheTTL);

    return result;
  }

  async getYearTimeline() {
    const cacheKey = `${this.cachePrefix}timeline`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const data = await palaceModel.findAll({ limit: 100 });
    const palaces = data.palaces;

    const timeline = palaces
      .map((p) => ({
        id: p.id,
        name: p.name,
        dynasty: p.dynasty,
        startYear: p.start_year,
        endYear: p.end_year,
        duration: Math.abs(p.end_year - p.start_year),
      }))
      .sort((a, b) => a.startYear - b.startYear);

    const yearRange = {
      earliest: Math.min(...palaces.map((p) => p.start_year)),
      latest: Math.max(...palaces.map((p) => p.end_year)),
    };

    const result = {
      timeline,
      yearRange,
      totalYears: yearRange.latest - yearRange.earliest,
    };

    cache.set(cacheKey, result, this.cacheTTL);

    return result;
  }

  async getComprehensiveStats() {
    const cacheKey = `${this.cachePrefix}comprehensive`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const statistics = await palaceModel.getStatistics();
    const data = await palaceModel.findAll({ limit: 100 });
    const palaces = data.palaces;

    const result = {
      overview: {
        totalPalaces: statistics.totalPalaces,
        totalDynasties: statistics.dynasties.length,
        totalArea: statistics.area.total,
        totalHouses: statistics.houses.total,
      },
      averages: {
        avgArea: statistics.area.avg,
        avgHouses: statistics.houses.avg,
      },
      extremes: {
        largestArea: { name: "", area: 0 },
        smallestArea: { name: "", area: Infinity },
        mostHouses: { name: "", houses: 0 },
        leastHouses: { name: "", houses: Infinity },
      },
      dynasties: statistics.dynasties,
      yearRange: statistics.yearRange,
      generatedAt: new Date().toISOString(),
    };

    palaces.forEach((p) => {
      if (p.area > result.extremes.largestArea.area) {
        result.extremes.largestArea = { name: p.name, area: p.area };
      }
      if (p.area < result.extremes.smallestArea.area) {
        result.extremes.smallestArea = { name: p.name, area: p.area };
      }
      if (p.houses > result.extremes.mostHouses.houses) {
        result.extremes.mostHouses = { name: p.name, houses: p.houses };
      }
      if (p.houses < result.extremes.leastHouses.houses) {
        result.extremes.leastHouses = { name: p.name, houses: p.houses };
      }
    });

    cache.set(cacheKey, result, this.cacheTTL);

    return result;
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

export default new StatisticsService();
