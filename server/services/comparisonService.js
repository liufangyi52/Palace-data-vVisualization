import palaceModel from "../models/palaceModel.js";

class ComparisonService {
  async compareTwoPalaces(id1, id2) {
    const palace1 = await palaceModel.findById(id1);
    const palace2 = await palaceModel.findById(id2);

    if (!palace1 || !palace2) {
      return null;
    }

    return {
      palace1: this.formatPalaceBasic(palace1),
      palace2: this.formatPalaceBasic(palace2),
      comparison: {
        area: {
          value1: palace1.area,
          value2: palace2.area,
          winner: palace1.area >= palace2.area ? 1 : 2,
          ratio: palace1.area && palace2.area ? (palace1.area / palace2.area).toFixed(2) : null,
        },
        houses: {
          value1: palace1.houses,
          value2: palace2.houses,
          winner: palace1.houses >= palace2.houses ? 1 : 2,
          ratio: palace1.houses && palace2.houses ? (palace1.houses / palace2.houses).toFixed(2) : null,
        },
        duration: {
          value1: Math.abs(palace1.endYear - palace1.startYear),
          value2: Math.abs(palace2.endYear - palace2.startYear),
          winner: Math.abs(palace1.endYear - palace1.startYear) >= Math.abs(palace2.endYear - palace2.startYear) ? 1 : 2,
        },
        timeline: {
          start1: palace1.startYear,
          start2: palace2.startYear,
          end1: palace1.endYear,
          end2: palace2.endYear,
          earlier: palace1.startYear <= palace2.startYear ? 1 : 2,
          later: palace1.endYear >= palace2.endYear ? 1 : 2,
        },
      },
      conclusion: this.generateConclusion(palace1, palace2),
    };
  }

  formatPalaceBasic(palace) {
    return {
      id: palace.id,
      name: palace.name,
      dynasty: palace.dynasty,
      area: palace.area,
      houses: palace.houses,
      startYear: palace.startYear,
      endYear: palace.endYear,
      location: palace.location || "",
    };
  }

  generateConclusion(p1, p2) {
    const conclusions = [];

    if (p1.area > p2.area) {
      conclusions.push(`${p1.name}占地面积更大，比${p2.name}大${p1.area - p2.area}万平方米`);
    } else if (p1.area < p2.area) {
      conclusions.push(`${p2.name}占地面积更大，比${p1.name}大${p2.area - p1.area}万平方米`);
    }

    if (p1.houses > p2.houses) {
      conclusions.push(`${p1.name}房屋数量更多，比${p2.name}多${p1.houses - p2.houses}间`);
    } else if (p1.houses < p2.houses) {
      conclusions.push(`${p2.name}房屋数量更多，比${p1.name}多${p2.houses - p1.houses}间`);
    }

    const duration1 = Math.abs(p1.endYear - p1.startYear);
    const duration2 = Math.abs(p2.endYear - p2.startYear);
    if (duration1 > duration2) {
      conclusions.push(`${p1.name}使用时间更长，达${duration1}年`);
    } else if (duration1 < duration2) {
      conclusions.push(`${p2.name}使用时间更长，达${duration2}年`);
    }

    return conclusions.length > 0 ? conclusions : ["两座宫殿各有特色"];
  }

  async compareMultiplePalaces(ids) {
    if (!ids || ids.length < 2) {
      return null;
    }

    const palaces = [];
    for (const id of ids) {
      const palace = await palaceModel.findById(id);
      if (palace) palaces.push(palace);
    }

    if (palaces.length < 2) {
      return null;
    }

    const rankings = {
      byArea: [...palaces].sort((a, b) => b.area - a.area),
      byHouses: [...palaces].sort((a, b) => b.houses - a.houses),
      byDuration: [...palaces].sort(
        (a, b) => Math.abs(b.endYear - b.startYear) - Math.abs(a.endYear - a.startYear)
      ),
    };

    return {
      palaces: palaces.map((p) => this.formatPalaceBasic(p)),
      rankings: {
        byArea: rankings.byArea.map((p, idx) => ({ rank: idx + 1, ...this.formatPalaceBasic(p) })),
        byHouses: rankings.byHouses.map((p, idx) => ({ rank: idx + 1, ...this.formatPalaceBasic(p) })),
        byDuration: rankings.byDuration.map((p, idx) => ({ rank: idx + 1, ...this.formatPalaceBasic(p) })),
      },
      statistics: {
        avgArea: Math.round(palaces.reduce((sum, p) => sum + p.area, 0) / palaces.length),
        avgHouses: Math.round(palaces.reduce((sum, p) => sum + p.houses, 0) / palaces.length),
      },
    };
  }

  async getAllComparisons() {
    const data = await palaceModel.findAll({ limit: 100 });
    const palaces = data.palaces;
    const results = [];

    for (let i = 0; i < palaces.length; i++) {
      for (let j = i + 1; j < Math.min(palaces.length, i + 5); j++) {
        results.push(await this.compareTwoPalaces(palaces[i].id, palaces[j].id));
      }
    }

    return results;
  }
}

export default new ComparisonService();