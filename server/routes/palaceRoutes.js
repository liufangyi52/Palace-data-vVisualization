import { Router } from "express";
import palaceController from "../controllers/palaceController.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = Router();

router.use(rateLimit);

router.get("/", palaceController.getAllPalaces);
router.get("/statistics", palaceController.getStatistics);
router.get("/top", palaceController.getTopPalaces);
router.get("/search", palaceController.searchPalaces);
router.get("/overview", palaceController.getOverview);
router.get("/dynasty-distribution", palaceController.getDynastyDistribution);
router.get("/area-comparison", palaceController.getAreaComparison);
router.get("/houses-comparison", palaceController.getHousesComparison);
router.get("/timeline", palaceController.getYearTimeline);
router.get("/comprehensive-stats", palaceController.getComprehensiveStats);
router.get("/compare", palaceController.comparePalaces);
router.get("/compare-multiple", palaceController.compareMultiple);
router.get("/dynasty/:dynasty", palaceController.getByDynasty);
router.get("/materials", palaceController.getMaterials);
router.get("/craft-timeline", palaceController.getCraftTimeline);
router.get("/:id", palaceController.getPalaceById);

export default router;