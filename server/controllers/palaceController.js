import palaceService from "../services/palaceService.js";
import statisticsService from "../services/statisticsService.js";
import comparisonService from "../services/comparisonService.js";
import { success, notFound, badRequest } from "../utils/response.js";
import { validatePalaceQuery, validatePalaceId } from "../utils/validator.js";
import config from "../config/index.js";

class PalaceController {
  async getAllPalaces(req, res, next) {
    try {
      const { limit, offset, dynasty, search } = req.query;

      const errors = validatePalaceQuery(req.query);
      if (errors.length > 0) {
        return badRequest(res, errors.join("; "));
      }

      const result = await palaceService.getAllPalaces({
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        dynasty,
        search,
      });

      return success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getPalaceById(req, res, next) {
    try {
      const { id } = req.params;

      try {
        validatePalaceId(id);
      } catch (error) {
        return badRequest(res, error.message);
      }

      const palace = await palaceService.getPalaceById(parseInt(id));

      if (!palace) {
        return notFound(res, "宫殿不存在");
      }

      return success(res, palace);
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const statistics = await palaceService.getStatistics();
      return success(res, statistics);
    } catch (error) {
      next(error);
    }
  }

  async getTopPalaces(req, res, next) {
    try {
      const { criteria = "area", limit = 5 } = req.query;
      const topPalaces = await palaceService.getTopPalaces(criteria, parseInt(limit));
      return success(res, { palaces: topPalaces });
    } catch (error) {
      next(error);
    }
  }

  async searchPalaces(req, res, next) {
    try {
      const { keyword } = req.query;

      if (!keyword || keyword.trim().length === 0) {
        return badRequest(res, "搜索关键词不能为空");
      }

      const result = await palaceService.searchPalaces(keyword);
      return success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getByDynasty(req, res, next) {
    try {
      const { dynasty } = req.params;
      const palaces = await palaceService.getPalacesByDynasty(dynasty);
      return success(res, { palaces, total: palaces.length });
    } catch (error) {
      next(error);
    }
  }

  async getOverview(req, res, next) {
    try {
      const overview = await statisticsService.getOverview();
      return success(res, overview);
    } catch (error) {
      next(error);
    }
  }

  async getDynastyDistribution(req, res, next) {
    try {
      const distribution = await statisticsService.getDynastyDistribution();
      return success(res, distribution);
    } catch (error) {
      next(error);
    }
  }

  async getAreaComparison(req, res, next) {
    try {
      const comparison = await statisticsService.getAreaComparison();
      return success(res, comparison);
    } catch (error) {
      next(error);
    }
  }

  async getHousesComparison(req, res, next) {
    try {
      const comparison = await statisticsService.getHousesComparison();
      return success(res, comparison);
    } catch (error) {
      next(error);
    }
  }

  async getYearTimeline(req, res, next) {
    try {
      const timeline = await statisticsService.getYearTimeline();
      return success(res, timeline);
    } catch (error) {
      next(error);
    }
  }

  async getComprehensiveStats(req, res, next) {
    try {
      const stats = await statisticsService.getComprehensiveStats();
      return success(res, stats);
    } catch (error) {
      next(error);
    }
  }

  async comparePalaces(req, res, next) {
    try {
      const { id1, id2 } = req.query;

      if (!id1 || !id2) {
        return badRequest(res, "请提供两个宫殿的ID进行对比");
      }

      const comparison = await comparisonService.compareTwoPalaces(id1, id2);

      if (!comparison) {
        return notFound(res, "宫殿不存在");
      }

      return success(res, comparison);
    } catch (error) {
      next(error);
    }
  }

  async compareMultiple(req, res, next) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length < 2) {
        return badRequest(res, "请提供至少两个宫殿ID进行对比");
      }

      const comparison = await comparisonService.compareMultiplePalaces(ids);

      if (!comparison) {
        return notFound(res, "宫殿不存在");
      }

      return success(res, comparison);
    } catch (error) {
      next(error);
    }
  }

  async getMaterials(req, res, next) {
    try {
      const materials = await palaceService.getMaterials();
      return success(res, materials);
    } catch (error) {
      next(error);
    }
  }

  async getCraftTimeline(req, res, next) {
    try {
      const timeline = await palaceService.getCraftTimeline();
      return success(res, timeline);
    } catch (error) {
      next(error);
    }
  }

  async healthCheck(req, res, next) {
    try {
      return success(res, {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config?.server?.env || "development",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PalaceController();