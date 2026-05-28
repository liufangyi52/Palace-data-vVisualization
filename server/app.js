import express from "express";
import cors from "cors";
import { rateLimit } from "./middleware/rateLimit.js";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./middleware/errorHandler.js";
import palaceController from "./controllers/palaceController.js";
import config from "./config/index.js";

const app = express();

app.use(cors(config.cors));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(requestLogger);

app.get("/api/health", palaceController.healthCheck);
app.get("/api", palaceController.getAllPalaces);
app.get("/api/palaces", palaceController.getAllPalaces);
app.get("/api/palaces/statistics", palaceController.getStatistics);
app.get("/api/palaces/overview", palaceController.getOverview);
app.get("/api/palaces/compare", palaceController.comparePalaces);
app.get("/api/palaces/top", palaceController.getTopPalaces);
app.get("/api/palaces/search", palaceController.searchPalaces);
app.get("/api/palaces/:id", palaceController.getPalaceById);
app.get("/api/materials", palaceController.getMaterials);
app.get("/api/craft-timeline", palaceController.getCraftTimeline);
app.get("/api/dynasty-distribution", palaceController.getDynastyDistribution);
app.get("/api/area-comparison", palaceController.getAreaComparison);
app.get("/api/houses-comparison", palaceController.getHousesComparison);
app.get("/api/year-timeline", palaceController.getYearTimeline);
app.get("/api/comprehensive-stats", palaceController.getComprehensiveStats);
app.get("/api/top-palaces", palaceController.getTopPalaces);
app.get("/api/search", palaceController.searchPalaces);
app.get("/api/dynasty/:dynasty", palaceController.getByDynasty);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
