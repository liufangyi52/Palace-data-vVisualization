import { query } from "../db.js";

class PalaceModel {
  async findAll(options = {}) {
    const { limit = 100, offset = 0, dynasty, search } = options;

    let sql = "SELECT * FROM palaces WHERE 1=1";
    const params = [];

    if (dynasty) {
      sql += " AND dynasty = ?";
      params.push(dynasty);
    }

    if (search) {
      sql += " AND (name LIKE ? OR dynasty LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as total");
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;

    sql += " ORDER BY id LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const palaces = await query(sql, params);

    return {
      palaces,
      total,
      limit,
      offset,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    const sql = "SELECT * FROM palaces WHERE id = ?";
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  async findByDynasty(dynasty) {
    const sql = "SELECT * FROM palaces WHERE dynasty = ?";
    return await query(sql, [dynasty]);
  }

  async getStatistics() {
    const palacesSql = "SELECT * FROM palaces";
    const palaces = await query(palacesSql);

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

      const startYear = p.start_year || 0;
      const endYear = p.end_year || 0;
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

    return {
      totalPalaces,
      dynasties,
      area: areaStats,
      houses: houseStats,
      yearRange,
    };
  }

  async getTopPalaces(criteria = "area", limit = 5) {
    const orderColumn = criteria === "area" ? "area" : criteria === "houses" ? "houses" : "area";
    const sql = `SELECT * FROM palaces ORDER BY ${orderColumn} DESC LIMIT ?`;
    return await query(sql, [parseInt(limit)]);
  }

  async getPalaceByIdDetailed(id) {
    const palace = await this.findById(id);
    if (!palace) return null;

    const materialsSql = "SELECT * FROM palace_materials WHERE palace_id = ?";
    const materials = await query(materialsSql, [id]);

    const layoutSql = "SELECT * FROM palace_layout WHERE palace_id = ?";
    const layout = await query(layoutSql, [id]);

    const highlightsSql = "SELECT * FROM palace_highlights WHERE palace_id = ?";
    const highlights = await query(highlightsSql, [id]);

    const influencesSql = "SELECT * FROM palace_influences WHERE palace_id = ?";
    const influences = await query(influencesSql, [id]);

    const duration = Math.abs(palace.end_year - palace.start_year);

    const materialObj = {};
    materials.forEach((m) => {
      materialObj[m.material_type] = m.quantity;
    });

    const layoutObj = {};
    layout.forEach((l) => {
      layoutObj[l.zone_type] = l.percentage;
    });

    const influenceObj = {};
    influences.forEach((i) => {
      influenceObj[i.influence_type] = i.score;
    });

    return {
      id: palace.id,
      name: palace.name,
      dynasty: palace.dynasty,
      area: palace.area,
      houses: palace.houses,
      startYear: palace.start_year,
      endYear: palace.end_year,
      century: palace.century,
      location: {
        lat: palace.latitude,
        lng: palace.longitude,
        city: palace.city,
        province: palace.province,
      },
      layout: layoutObj,
      materials: materialObj,
      highlights: highlights.map((h) => h.highlight_text),
      influences: influenceObj,
      description: palace.description || `${palace.name}是${palace.dynasty}时期的重要宫殿建筑群。`,
      significance: palace.significance || "在中国古代建筑史上具有重要地位",
      architecture: palace.architecture || "",
      image: palace.image_url,
      thumbnail: palace.thumbnail_url,
      duration,
    };
  }

  async getMaterials() {
    const sql = `
      SELECT p.id as palaceId, p.name as palaceName, p.dynasty,
             m.material_type, m.quantity
      FROM palace_materials m
      JOIN palaces p ON m.palace_id = p.id
    `;
    const results = await query(sql);

    const palaces = {};
    results.forEach((r) => {
      if (!palaces[r.palaceId]) {
        palaces[r.palaceId] = {
          palaceId: r.palaceId,
          palaceName: r.palaceName,
          dynasty: r.dynasty,
          materials: {},
        };
      }
      palaces[r.palaceId].materials[r.material_type] = r.quantity;
    });

    return Object.values(palaces);
  }

  async getCraftTimeline() {
    const sql = "SELECT * FROM craft_timeline ORDER BY year";
    return await query(sql);
  }
}

const palaceModel = new PalaceModel();

export default palaceModel;
