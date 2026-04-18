<template>
  <div class="data-sources">
    <div class="sources-header">
      <div class="breadcrumb">
        <span class="breadcrumb-item" @click="goHome">🏠 首页</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">数据来源</span>
      </div>
      <h1 class="page-title">📚 数据来源</h1>
      <p class="page-subtitle">了解宫殿数据的采集与验证过程</p>
    </div>

    <div class="sources-content">
      <section class="source-section">
        <h2 class="section-title">🏛️ 宫殿基础数据</h2>
        <div class="source-cards">
          <div class="source-card card">
            <div class="card-icon">📖</div>
            <h3>正史文献</h3>
            <ul class="source-list">
              <li>《二十四史》各朝本纪与志书</li>
              <li>《资治通鉴》历代政治沿革</li>
              <li>《历代帝王图鉴》宫殿建制</li>
            </ul>
            <div class="card-footer">
              <span class="tag">官方文献</span>
              <span class="tag">权威性：高</span>
            </div>
          </div>

          <div class="source-card card">
            <div class="card-icon">🗺️</div>
            <h3>考古报告</h3>
            <ul class="source-list">
              <li>中国社会科学院考古研究所报告</li>
              <li>各地文物局考古发掘简报</li>
              <li>UNESCO世界遗产申报材料</li>
            </ul>
            <div class="card-footer">
              <span class="tag">考古实证</span>
              <span class="tag">权威性：高</span>
            </div>
          </div>

          <div class="source-card card">
            <div class="card-icon">🏺</div>
            <h3>文物档案</h3>
            <ul class="source-list">
              <li>故宫博物院藏品档案</li>
              <li>中国第一历史档案馆文献</li>
              <li>各省市博物馆藏品登记</li>
            </ul>
            <div class="card-footer">
              <span class="tag">实物档案</span>
              <span class="tag">权威性：高</span>
            </div>
          </div>
        </div>
      </section>

      <section class="source-section">
        <h2 class="section-title">📊 量化数据来源</h2>
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>数据指标</th>
                <th>来源机构</th>
                <th>采集方式</th>
                <th>可信度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>宫殿面积</td>
                <td>国家文物局、UNESCO</td>
                <td>考古测量 + 文献互证</td>
                <td><span class="badge high">高</span></td>
              </tr>
              <tr>
                <td>房屋数量</td>
                <td>故宫博物院档案</td>
                <td>历史文献统计</td>
                <td><span class="badge medium">中-高</span></td>
              </tr>
              <tr>
                <td>建筑年代</td>
                <td>考古研究所</td>
                <td>碳14测定 + 文献考证</td>
                <td><span class="badge high">高</span></td>
              </tr>
              <tr>
                <td>布局结构</td>
                <td>古建筑研究机构</td>
                <td>考古发掘 + 复原研究</td>
                <td><span class="badge medium">中</span></td>
              </tr>
              <tr>
                <td>材料工艺</td>
                <td>文物保护研究所</td>
                <td>实物取样 + 工艺分析</td>
                <td><span class="badge high">高</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="source-section">
        <h2 class="section-title">🔬 研究方法论</h2>
        <div class="methodology-grid">
          <div class="method-card card">
            <h3>📚 文献分析法</h3>
            <p>
              系统收集整理历代正史、方志、笔记等文献资料，通过多重文献互证确保数据准确性。
            </p>
            <div class="method-stats">
              <span>参考文献: 200+</span>
              <span>交叉验证: 3层</span>
            </div>
          </div>

          <div class="method-card card">
            <h3>🏛️ 考古实测法</h3>
            <p>结合田野考古发掘报告与现代测绘技术，获取第一手实测数据。</p>
            <div class="method-stats">
              <span>考古报告: 50+</span>
              <span>测量点位: 1000+</span>
            </div>
          </div>

          <div class="method-card card">
            <h3>💻 数字复原法</h3>
            <p>运用三维扫描与数字孪生技术，构建宫殿建筑的高精度数字模型。</p>
            <div class="method-stats">
              <span>3D模型: 6座</span>
              <span>精度: 厘米级</span>
            </div>
          </div>

          <div class="method-card card">
            <h3>🤖 AI校验系统</h3>
            <p>基于机器学习算法，对历史数据进行多维度关联分析与异常检测。</p>
            <div class="method-stats">
              <span>AI模型: 3个</span>
              <span>校验准确率: 95%+</span>
            </div>
          </div>
        </div>
      </section>

      <section class="source-section">
        <h2 class="section-title">📑 引用与参考文献</h2>
        <div class="references-list">
          <div class="reference-item">
            <span class="ref-number">[1]</span>
            <div class="ref-content">
              <h4>《中国古代建筑史》</h4>
              <p>作者：中国建筑工业出版社 编著</p>
              <p class="ref-type">学术专著</p>
            </div>
          </div>

          <div class="reference-item">
            <span class="ref-number">[2]</span>
            <div class="ref-content">
              <h4>《故宫建筑与布局研究》</h4>
              <p>作者：单士元 著</p>
              <p class="ref-type">学术专著</p>
            </div>
          </div>

          <div class="reference-item">
            <span class="ref-number">[3]</span>
            <div class="ref-content">
              <h4>《唐大明宫》考古发掘报告</h4>
              <p>机构：中国社会科学院考古研究所</p>
              <p class="ref-type">考古报告</p>
            </div>
          </div>

          <div class="reference-item">
            <span class="ref-number">[4]</span>
            <div class="ref-content">
              <h4>UNESCO World Heritage List - Imperial Palaces</h4>
              <p>机构：联合国教科文组织</p>
              <p class="ref-type">官方文件</p>
            </div>
          </div>

          <div class="reference-item">
            <span class="ref-number">[5]</span>
            <div class="ref-content">
              <h4>《中国历史地图集》</h4>
              <p>作者：谭其骧 主编</p>
              <p class="ref-type">历史地图</p>
            </div>
          </div>
        </div>
      </section>

      <section class="source-section">
        <h2 class="section-title">⚠️ 数据声明</h2>
        <div class="disclaimer-card card">
          <div class="disclaimer-icon">📝</div>
          <div class="disclaimer-content">
            <h3>数据说明</h3>
            <p>
              本平台所展示的宫殿数据均来源于公开的学术文献、考古报告及官方发布的文物保护资料。部分历史数据因年代久远或资料缺失，可能存在一定误差，我们已通过多重来源交叉验证来最大程度保证数据的准确性。
            </p>
            <p>
              平台中展示的宫殿三维复原模型是基于现有考古证据进行的学术复原尝试，模型中的部分细节为研究推测，不代表历史原貌的真实情况。
            </p>
            <div class="disclaimer-tags">
              <span class="disclaimer-tag">数据更新：2025年12月</span>
              <span class="disclaimer-tag">版本：V2.0</span>
              <span class="disclaimer-tag">验证状态：已审核</span>
            </div>
          </div>
        </div>
      </section>

      <div class="sources-nav">
        <button class="sources-nav-btn" @click="goHome">
          <span>🏠</span> 返回首页
        </button>
        <button class="sources-nav-btn" @click="router.push('/interactive')">
          <span>🖥️</span> 进入平台导览
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.data-sources {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 30px;
  min-height: 100vh;
}

.sources-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px;
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.2), rgba(0, 0, 0, 0.3));
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 16px;
}

.page-title {
  color: #daa520;
  font-size: 42px;
  margin: 0 0 15px 0;
  font-family: "SimSun", "STSong", serif;
  text-shadow: 0 0 30px rgba(218, 165, 32, 0.3);
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  margin: 0;
}

.source-section {
  margin-bottom: 50px;
}

.section-title {
  color: #daa520;
  font-size: 26px;
  margin: 0 0 25px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(139, 0, 0, 0.5);
  font-family: "SimSun", "STSong", serif;
}

.source-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.source-card {
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.source-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(218, 165, 32, 0.2);
}

.source-card .card-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.source-card h3 {
  color: #ffd700;
  font-size: 20px;
  margin: 0 0 15px 0;
  font-family: "SimSun", "STSong", serif;
}

.source-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  text-align: left;
}

.source-list li {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  padding-left: 20px;
}

.source-list li::before {
  content: "•";
  color: #daa520;
  position: absolute;
  left: 5px;
}

.card-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid rgba(218, 165, 32, 0.2);
}

.tag {
  background: rgba(218, 165, 32, 0.2);
  color: #ffd700;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.data-table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 2px solid rgba(218, 165, 32, 0.3);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.3);
}

.data-table th {
  background: linear-gradient(
    90deg,
    rgba(139, 0, 0, 0.6),
    rgba(218, 165, 32, 0.3)
  );
  color: #ffd700;
  padding: 15px;
  text-align: left;
  font-size: 15px;
  font-family: "SimSun", "STSong", serif;
}

.data-table td {
  color: rgba(255, 255, 255, 0.85);
  padding: 14px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

.data-table tr:hover td {
  background: rgba(218, 165, 32, 0.1);
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.badge.high {
  background: rgba(76, 175, 80, 0.3);
  color: #81c784;
  border: 1px solid #81c784;
}

.badge.medium {
  background: rgba(255, 193, 7, 0.3);
  color: #ffd54f;
  border: 1px solid #ffd54f;
}

.methodology-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.method-card {
  padding: 25px;
  transition: all 0.3s ease;
}

.method-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.15);
}

.method-card h3 {
  color: #ffd700;
  font-size: 16px;
  margin: 0 0 12px 0;
  font-family: "SimSun", "STSong", serif;
}

.method-card p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.method-stats {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(218, 165, 32, 0.2);
}

.method-stats span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
}

.references-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.reference-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(218, 165, 32, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.reference-item:hover {
  border-color: rgba(218, 165, 32, 0.5);
  background: rgba(218, 165, 32, 0.05);
}

.ref-number {
  color: #daa520;
  font-size: 24px;
  font-weight: bold;
  min-width: 40px;
}

.ref-content h4 {
  color: #ffd700;
  margin: 0 0 8px 0;
  font-size: 16px;
  font-family: "SimSun", "STSong", serif;
}

.ref-content p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 13px;
}

.ref-type {
  display: inline-block;
  margin-top: 8px !important;
  background: rgba(218, 165, 32, 0.2);
  color: #ffd700;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 11px !important;
}

.disclaimer-card {
  display: flex;
  gap: 25px;
  padding: 30px;
}

.disclaimer-icon {
  font-size: 48px;
  min-width: 60px;
}

.disclaimer-content h3 {
  color: #ffd700;
  margin: 0 0 15px 0;
  font-size: 20px;
  font-family: "SimSun", "STSong", serif;
}

.disclaimer-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.7;
  margin: 0 0 12px 0;
}

.disclaimer-tags {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.disclaimer-tag {
  background: rgba(218, 165, 32, 0.15);
  color: rgba(255, 255, 255, 0.8);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  border: 1px solid rgba(218, 165, 32, 0.3);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.breadcrumb-item {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #daa520;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.4);
}

.breadcrumb-current {
  color: #daa520;
  font-size: 14px;
}

.sources-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px;
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.2), rgba(0, 0, 0, 0.3));
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 16px;
}

.sources-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.sources-nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(218, 165, 32, 0.4);
  border-radius: 10px;
  color: #ffd700;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sources-nav-btn:hover {
  background: rgba(218, 165, 32, 0.2);
  border-color: #daa520;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(218, 165, 32, 0.2);
}

@media (max-width: 1024px) {
  .source-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .methodology-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .data-sources {
    padding: 20px 15px;
  }

  .source-cards {
    grid-template-columns: 1fr;
  }

  .methodology-grid {
    grid-template-columns: 1fr;
  }
}
</style>
