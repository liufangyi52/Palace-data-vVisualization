import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import config from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PalaceModel {
  constructor() {
    this.palacesPath = join(__dirname, "..", "data", "palaces.json");
    this.databasePath = join(__dirname, "..", "data", "database.json");
    this.data = null;
    this.database = null;
    this.load();
  }

  load() {
    try {
      const rawPalaces = readFileSync(this.palacesPath, "utf-8");
      this.data = JSON.parse(rawPalaces);

      try {
        const rawDatabase = readFileSync(this.databasePath, "utf-8");
        this.database = JSON.parse(rawDatabase);
      } catch {
        this.database = { palaces: this.data.palaces || [] };
      }
    } catch (error) {
      console.error("Failed to load palace data:", error);
      this.data = { palaces: [] };
      this.database = { palaces: [] };
    }
  }

  findAll(options = {}) {
    return new Promise((resolve) => {
      const { limit = 100, offset = 0, dynasty, search } = options;
      let result = [...(this.data.palaces || [])];

      if (dynasty) {
        result = result.filter((p) => p.dynasty === dynasty);
      }

      if (search) {
        const keyword = search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(keyword) ||
            p.dynasty.toLowerCase().includes(keyword)
        );
      }

      const total = result.length;
      const paginated = result.slice(offset, offset + limit);

      resolve({
        palaces: paginated,
        total,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      });
    });
  }

  findById(id) {
    return new Promise((resolve) => {
      const palace = (this.data.palaces || []).find((p) => p.id === parseInt(id)) || null;
      resolve(palace);
    });
  }

  findByDynasty(dynasty) {
    return new Promise((resolve) => {
      resolve((this.data.palaces || []).filter((p) => p.dynasty === dynasty));
    });
  }

  getStatistics() {
    return new Promise((resolve) => {
      const palaces = this.data.palaces || [];
      const totalPalaces = palaces.length;

      const dynastyCount = {};
      const areaStats = { total: 0, max: 0, min: Infinity, avg: 0 };
      const houseStats = { total: 0, max: 0, min: Infinity, avg: 0 };
      const yearRange = { earliest: Infinity, latest: -Infinity };

      palaces.forEach((p) => {
        dynastyCount[p.dynasty] = (dynastyCount[p.dynasty] || 0) + 1;

        const area = p.area || 0;
        areaStats.total += area;
        areaStats.max = Math.max(areaStats.max, area);
        areaStats.min = Math.min(areaStats.min, area === 0 ? area : areaStats.min);

        const houses = p.houses || 0;
        houseStats.total += houses;
        houseStats.max = Math.max(houseStats.max, houses);
        houseStats.min = Math.min(houseStats.min, houses === 0 ? houses : houseStats.min);

        const startYear = p.startYear || 0;
        const endYear = p.endYear || 0;
        if (startYear < yearRange.earliest) yearRange.earliest = startYear;
        if (endYear > yearRange.latest) yearRange.latest = endYear;
      });

      areaStats.avg = totalPalaces > 0 ? Math.round(areaStats.total / totalPalaces) : 0;
      houseStats.avg = totalPalaces > 0 ? Math.round(houseStats.total / totalPalaces) : 0;
      if (areaStats.min === Infinity) areaStats.min = 0;
      if (houseStats.min === Infinity) houseStats.min = 0;

      const dynasties = Object.entries(dynastyCount).map(([name, count]) => ({
        name,
        count,
        percentage: ((count / totalPalaces) * 100).toFixed(1),
      }));

      resolve({
        totalPalaces,
        dynasties,
        area: areaStats,
        houses: houseStats,
        yearRange,
      });
    });
  }

  getTopPalaces(criteria = "area", limit = 5) {
    return new Promise((resolve) => {
      const sorted = [...(this.data.palaces || [])].sort((a, b) => {
        if (criteria === "area") return (b.area || 0) - (a.area || 0);
        if (criteria === "houses") return (b.houses || 0) - (a.houses || 0);
        if (criteria === "duration") {
          const durationA = Math.abs(b.endYear - b.startYear);
          const durationB = Math.abs(a.endYear - a.startYear);
          return durationA - durationB;
        }
        return 0;
      });

      resolve(sorted.slice(0, limit));
    });
  }

  getPalaceByIdDetailed(id) {
    return new Promise((resolve) => {
      const palace = (this.data.palaces || []).find((p) => p.id === parseInt(id));
      if (!palace) {
        resolve(null);
        return;
      }

      const duration = Math.abs(palace.endYear - palace.startYear);

      resolve({
        ...palace,
        duration,
        description: palace.description || `${palace.name}是${palace.dynasty}时期的重要宫殿建筑群。`,
        significance: palace.significance || "在中国古代建筑史上具有重要地位",
      });
    });
  }

  getMaterials() {
    return new Promise((resolve) => {
      const palaces = this.data.palaces || [];
      const materials = palaces.map((p) => ({
        palaceId: p.id,
        palaceName: p.name,
        dynasty: p.dynasty,
        materials: p.materials || { wood: 0, brick: 0, tile: 0 },
      }));
      resolve(materials);
    });
  }

  getCraftTimeline() {
    return new Promise((resolve) => {
      let timeline = [];
      if (this.database && this.database.craftTimeline) {
        timeline = this.database.craftTimeline;
      } else if (this.data && this.data.craftTimeline) {
        timeline = this.data.craftTimeline;
      }
      resolve(timeline);
    });
  }
}

const palaceModel = new PalaceModel();

export default palaceModel;