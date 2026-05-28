import app from "./app.js";
import config from "./config/index.js";
import logger from "./middleware/errorHandler.js";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_DIR = join(__dirname, "..", "logs");
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

const PORT = config.server.port;

const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 中华宫殿后端服务已启动`);
  logger.info(`❤️  健康检查: http://localhost:${PORT}/api/health`);
  logger.info(`🌐 环境: ${config.server.env}`);
  logger.info(`\n可用接口:`);
  logger.info(`  GET  /api/palaces            - 获取所有宫殿`);
  logger.info(`  GET  /api/palaces/:id        - 获取宫殿详情`);
  logger.info(`  GET  /api/palaces/statistics - 获取统计数据`);
  logger.info(`  GET  /api/palaces/overview   - 获取总览数据`);
  logger.info(`  GET  /api/palaces/compare    - 宫殿对比`);
  logger.info(`  GET  /api/materials           - 获取建筑材料`);
  logger.info(`  GET  /api/craft-timeline     - 获取工艺时间线`);
  logger.info(`  GET  /api/dynasty-distribution - 朝代分布`);
  logger.info(`  GET  /api/area-comparison    - 面积对比`);
  logger.info(`  GET  /api/houses-comparison  - 房屋数量对比`);
  logger.info(`  GET  /api/year-timeline      - 年代时间线`);
  logger.info(`  GET  /api/comprehensive-stats - 综合统计`);
  logger.info(`  GET  /api/top-palaces        - 排名宫殿`);
  logger.info(`  GET  /api/search             - 搜索宫殿`);
  logger.info(`  GET  /api/dynasty/:name     - 按朝代筛选`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated.");
    process.exit(0);
  });
});

export default server;
