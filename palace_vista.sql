/*
 Navicat Premium Dump SQL

 Source Server         : palace-vista
 Source Server Type    : MySQL
 Source Server Version : 80026 (8.0.26)
 Source Host           : <local database host>
 Source Schema         : palace_vista

 Target Server Type    : MySQL
 Target Server Version : 80026 (8.0.26)
 File Encoding         : 65001

 Date: 30/04/2026 16:21:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for craft_timeline
-- ----------------------------
DROP TABLE IF EXISTS `craft_timeline`;
CREATE TABLE `craft_timeline`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` int NULL DEFAULT NULL,
  `dynasty` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `craft_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `event_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of craft_timeline
-- ----------------------------
INSERT INTO `craft_timeline` VALUES (1, -500, '春秋', '斗拱', '斗拱雏形出现');
INSERT INTO `craft_timeline` VALUES (2, -200, '汉', '榫卯', '榫卯技术成熟');
INSERT INTO `craft_timeline` VALUES (3, 600, '唐', '斗拱', '斗拱发展至鼎盛');
INSERT INTO `craft_timeline` VALUES (4, 1100, '宋', '彩绘', '《营造法式》颁布');
INSERT INTO `craft_timeline` VALUES (5, 1400, '明', '斗拱', '斗拱装饰化');

-- ----------------------------
-- Table structure for palace_highlights
-- ----------------------------
DROP TABLE IF EXISTS `palace_highlights`;
CREATE TABLE `palace_highlights`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `palace_id` int NOT NULL,
  `highlight_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `palace_id`(`palace_id` ASC) USING BTREE,
  CONSTRAINT `palace_highlights_ibfk_1` FOREIGN KEY (`palace_id`) REFERENCES `palaces` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of palace_highlights
-- ----------------------------
INSERT INTO `palace_highlights` VALUES (1, 1, '世界文化遗产');
INSERT INTO `palace_highlights` VALUES (2, 1, '明清两代皇宫');
INSERT INTO `palace_highlights` VALUES (3, 1, '约8700间房屋');
INSERT INTO `palace_highlights` VALUES (4, 1, '72万平方米');
INSERT INTO `palace_highlights` VALUES (5, 2, '盛唐皇宫代表');
INSERT INTO `palace_highlights` VALUES (6, 2, '3.2平方公里');
INSERT INTO `palace_highlights` VALUES (7, 2, '含元殿壮丽巍峨');
INSERT INTO `palace_highlights` VALUES (8, 2, '丝绸之路起点');
INSERT INTO `palace_highlights` VALUES (9, 3, '元朝皇宫');
INSERT INTO `palace_highlights` VALUES (10, 3, '草原文化融合');
INSERT INTO `palace_highlights` VALUES (11, 3, '政治文化中心');
INSERT INTO `palace_highlights` VALUES (12, 3, '4.8平方公里');
INSERT INTO `palace_highlights` VALUES (13, 4, '北宋皇宫');
INSERT INTO `palace_highlights` VALUES (14, 4, '繁华东京城');
INSERT INTO `palace_highlights` VALUES (15, 4, '文化繁荣');
INSERT INTO `palace_highlights` VALUES (16, 4, '2.5平方公里');
INSERT INTO `palace_highlights` VALUES (17, 5, '西汉皇宫');
INSERT INTO `palace_highlights` VALUES (18, 5, '4.84平方公里');
INSERT INTO `palace_highlights` VALUES (19, 5, '丝绸之路起点');
INSERT INTO `palace_highlights` VALUES (20, 5, '长乐未央');
INSERT INTO `palace_highlights` VALUES (21, 6, '隋朝皇宫');
INSERT INTO `palace_highlights` VALUES (22, 6, '1.92平方公里');
INSERT INTO `palace_highlights` VALUES (23, 6, '隋唐过渡');
INSERT INTO `palace_highlights` VALUES (24, 6, '建筑典范');

-- ----------------------------
-- Table structure for palace_influences
-- ----------------------------
DROP TABLE IF EXISTS `palace_influences`;
CREATE TABLE `palace_influences`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `palace_id` int NOT NULL,
  `influence_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `score` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `palace_id`(`palace_id` ASC) USING BTREE,
  CONSTRAINT `palace_influences_ibfk_1` FOREIGN KEY (`palace_id`) REFERENCES `palaces` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of palace_influences
-- ----------------------------
INSERT INTO `palace_influences` VALUES (1, 1, 'palace', 95);
INSERT INTO `palace_influences` VALUES (2, 1, 'government', 90);
INSERT INTO `palace_influences` VALUES (3, 1, 'international', 98);
INSERT INTO `palace_influences` VALUES (4, 2, 'palace', 98);
INSERT INTO `palace_influences` VALUES (5, 2, 'government', 85);
INSERT INTO `palace_influences` VALUES (6, 2, 'international', 90);
INSERT INTO `palace_influences` VALUES (7, 3, 'palace', 85);
INSERT INTO `palace_influences` VALUES (8, 3, 'government', 80);
INSERT INTO `palace_influences` VALUES (9, 3, 'international', 85);
INSERT INTO `palace_influences` VALUES (10, 4, 'palace', 80);
INSERT INTO `palace_influences` VALUES (11, 4, 'government', 75);
INSERT INTO `palace_influences` VALUES (12, 4, 'international', 80);
INSERT INTO `palace_influences` VALUES (13, 5, 'palace', 100);
INSERT INTO `palace_influences` VALUES (14, 5, 'government', 90);
INSERT INTO `palace_influences` VALUES (15, 5, 'international', 85);
INSERT INTO `palace_influences` VALUES (16, 6, 'palace', 88);
INSERT INTO `palace_influences` VALUES (17, 6, 'government', 82);
INSERT INTO `palace_influences` VALUES (18, 6, 'international', 75);

-- ----------------------------
-- Table structure for palace_layout
-- ----------------------------
DROP TABLE IF EXISTS `palace_layout`;
CREATE TABLE `palace_layout`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `palace_id` int NOT NULL,
  `zone_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `percentage` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `palace_id`(`palace_id` ASC) USING BTREE,
  CONSTRAINT `palace_layout_ibfk_1` FOREIGN KEY (`palace_id`) REFERENCES `palaces` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of palace_layout
-- ----------------------------
INSERT INTO `palace_layout` VALUES (1, 1, 'outerCourt', 60);
INSERT INTO `palace_layout` VALUES (2, 1, 'innerCourt', 30);
INSERT INTO `palace_layout` VALUES (3, 1, 'garden', 10);
INSERT INTO `palace_layout` VALUES (4, 2, 'outerCourt', 55);
INSERT INTO `palace_layout` VALUES (5, 2, 'innerCourt', 35);
INSERT INTO `palace_layout` VALUES (6, 2, 'garden', 10);
INSERT INTO `palace_layout` VALUES (7, 3, 'outerCourt', 50);
INSERT INTO `palace_layout` VALUES (8, 3, 'innerCourt', 40);
INSERT INTO `palace_layout` VALUES (9, 3, 'garden', 10);
INSERT INTO `palace_layout` VALUES (10, 4, 'outerCourt', 52);
INSERT INTO `palace_layout` VALUES (11, 4, 'innerCourt', 38);
INSERT INTO `palace_layout` VALUES (12, 4, 'garden', 10);
INSERT INTO `palace_layout` VALUES (13, 5, 'outerCourt', 48);
INSERT INTO `palace_layout` VALUES (14, 5, 'innerCourt', 42);
INSERT INTO `palace_layout` VALUES (15, 5, 'garden', 10);
INSERT INTO `palace_layout` VALUES (16, 6, 'outerCourt', 50);
INSERT INTO `palace_layout` VALUES (17, 6, 'innerCourt', 40);
INSERT INTO `palace_layout` VALUES (18, 6, 'garden', 10);

-- ----------------------------
-- Table structure for palace_materials
-- ----------------------------
DROP TABLE IF EXISTS `palace_materials`;
CREATE TABLE `palace_materials`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `palace_id` int NOT NULL,
  `material_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `quantity` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `palace_id`(`palace_id` ASC) USING BTREE,
  CONSTRAINT `palace_materials_ibfk_1` FOREIGN KEY (`palace_id`) REFERENCES `palaces` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of palace_materials
-- ----------------------------
INSERT INTO `palace_materials` VALUES (1, 1, 'wood', 200000);
INSERT INTO `palace_materials` VALUES (2, 1, 'brick', 5000000);
INSERT INTO `palace_materials` VALUES (3, 1, 'tile', 1500000);
INSERT INTO `palace_materials` VALUES (4, 2, 'wood', 150000);
INSERT INTO `palace_materials` VALUES (5, 2, 'brick', 3200000);
INSERT INTO `palace_materials` VALUES (6, 2, 'tile', 1200000);
INSERT INTO `palace_materials` VALUES (7, 3, 'wood', 120000);
INSERT INTO `palace_materials` VALUES (8, 3, 'brick', 2800000);
INSERT INTO `palace_materials` VALUES (9, 3, 'tile', 1000000);
INSERT INTO `palace_materials` VALUES (10, 4, 'wood', 100000);
INSERT INTO `palace_materials` VALUES (11, 4, 'brick', 2500000);
INSERT INTO `palace_materials` VALUES (12, 4, 'tile', 900000);
INSERT INTO `palace_materials` VALUES (13, 5, 'wood', 180000);
INSERT INTO `palace_materials` VALUES (14, 5, 'brick', 3500000);
INSERT INTO `palace_materials` VALUES (15, 5, 'tile', 1400000);
INSERT INTO `palace_materials` VALUES (16, 6, 'wood', 160000);
INSERT INTO `palace_materials` VALUES (17, 6, 'brick', 3000000);
INSERT INTO `palace_materials` VALUES (18, 6, 'tile', 1100000);

-- ----------------------------
-- Table structure for palaces
-- ----------------------------
DROP TABLE IF EXISTS `palaces`;
CREATE TABLE `palaces`  (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dynasty` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `area` bigint NULL DEFAULT NULL COMMENT '占地面积(平方米)',
  `houses` int NULL DEFAULT NULL COMMENT '房屋数量',
  `start_year` int NULL DEFAULT NULL COMMENT '始建年份(负数表示公元前)',
  `end_year` int NULL DEFAULT NULL COMMENT '终止年份',
  `century` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `latitude` decimal(10, 6) NULL DEFAULT NULL,
  `longitude` decimal(10, 6) NULL DEFAULT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `significance` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `architecture` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `thumbnail_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of palaces
-- ----------------------------
INSERT INTO `palaces` VALUES (1, '明清紫禁城', '明、清', 720000, 8700, 1406, 1924, '15th-20th', 39.916300, 116.397200, '北京', '北京市', '世界现存规模最大、保存最为完整的木质结构古建筑群，是中国古代宫廷文化的巅峰之作。', '紫禁城是中华民族的瑰宝，见证了明清两代24位皇帝的统治，承载着深厚的历史文化内涵。', '建筑风格融合了汉、满、蒙等民族特色，体现了中国古代建筑的最高成就。', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80', '2026-04-28 22:29:51');
INSERT INTO `palaces` VALUES (2, '唐代大明宫', '唐', 3200000, 4000, 634, 904, '7th-10th', 34.273300, 108.966700, '西安', '陕西省', '盛唐时期的皇宫典范，中国古代宫殿建筑的巅峰之作，见证了唐朝的繁荣与辉煌。', '大明宫是唐代最重要的皇宫，被誉为中国历史的中心，对后世宫殿建筑影响深远。', '大明宫的建筑布局严谨对称，殿宇宏伟壮丽，代表了唐代建筑的极高成就。', 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1920&q=80', 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&q=80', '2026-04-28 22:29:51');
INSERT INTO `palaces` VALUES (3, '元代大都皇宫', '元', 4800000, 4000, 1267, 1368, '13th-14th', 39.904200, 116.407400, '北京', '北京市', '元朝帝国的政治中心，展现了蒙古族与汉族文化交融的独特建筑风格。', '大都皇宫是元朝的权力中心，见证了蒙古族入主中原的历史，促进了民族融合。', '融合了蒙古族帐幕文化与汉族宫殿建筑传统，具有独特的建筑风格。', 'https://images.unsplash.com/photo-1578328819058-b69f4c6c5f1b?w=1920&q=80', 'https://images.unsplash.com/photo-1578328819058-b69f4c6c5f1b?w=600&q=80', '2026-04-28 22:29:51');
INSERT INTO `palaces` VALUES (4, '宋代东京皇宫', '宋', 2500000, 5000, 962, 1127, '10th-12th', 34.803600, 114.307200, '开封', '河南省', '繁华市井与皇家园林的完美融合，展现了宋代高度发达的城市文明。', '宋代东京皇宫见证了北宋的繁荣经济和文化昌盛，是当时世界上最繁华的城市之一。', '皇宫布局精致典雅，园林设计精巧，体现了宋代建筑的文化品位和艺术成就。', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', '2026-04-28 22:29:51');
INSERT INTO `palaces` VALUES (5, '汉代未央宫', '汉', 4840000, 4000, -200, 190, '2nd BCE-6th', 34.323300, 108.916700, '西安', '陕西省', '丝绸之路的起点，西汉帝国的政治文化中心，中国古代宫殿的典范之作。', '未央宫是西汉帝国的权力中枢，开创了天人合一的宫殿建筑理念，影响深远。', '未央宫建筑规模宏大，布局严谨，体现了汉代建筑的雄伟气势和精密规划。', 'https://images.unsplash.com/photo-1582653291997-079a1b04e6a1?w=1920&q=80', 'https://images.unsplash.com/photo-1582653291997-079a1b04e6a1?w=600&q=80', '2026-04-28 22:29:51');
INSERT INTO `palaces` VALUES (6, '隋代大兴宫', '隋', 1920000, 3500, 582, 662, '6th-10th', 34.263300, 108.956700, '西安', '陕西省', '隋唐盛世的开端，中国古代宫殿建筑从秦汉向盛唐过渡的重要见证。', '大兴宫是隋朝皇宫，为唐代大明宫的建设奠定了基础，在中国宫殿建筑史上具有重要地位。', '大兴宫建筑规模宏大，继承了汉代宫殿建筑的优秀传统，并有所创新发展。', 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=1920&q=80', 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=600&q=80', '2026-04-28 22:29:51');

SET FOREIGN_KEY_CHECKS = 1;
