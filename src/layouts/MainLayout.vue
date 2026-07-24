<template>
  <div class="app-root">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-title">紫微阁 · 八字命理</div>
      <div class="header-tagline">紫气东来观命局，洞察天机悟乾坤</div>
    </header>

    <div class="app-body">
      <!-- 左侧导航 -->
      <aside class="sidebar">
        <div class="sidebar-title">命理分析</div>
        <nav class="sidebar-nav">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.title }}</span>
          </router-link>
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-decor">山水之间 · 自有天命</div>
        </div>
      </aside>

      <!-- 右侧内容区 -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { path: '/caifu', title: '财富分析', icon: '💰' },
  { path: '/ernv', title: '子女运势', icon: '👶' },
  { path: '/jiankang', title: '健康分析', icon: '🏥' },
  { path: '/liuqin', title: '六亲关系', icon: '👨‍👩‍👧' },
  { path: '/qinggan', title: '婚姻分析', icon: '💑' },
  { path: '/shiye', title: '职场命理', icon: '💼' },
  { path: '/xingge', title: '性格分析', icon: '🧠' },
  { path: '/xueli', title: '学业测评', icon: '📚' }
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<style scoped>
.app-root {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 56px;
  background: linear-gradient(135deg, var(--ink-dark) 0%, #3a4e3f 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
}
.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #d4c8a0;
  letter-spacing: 4px;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
}
.header-tagline {
  font-size: 12px;
  color: rgba(212, 200, 160, 0.6);
  letter-spacing: 2px;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧导航 */
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #f5f0e8 0%, #eee8d9 100%);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
}
.sidebar::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(139, 119, 94, 0.3), transparent);
}
.sidebar-title {
  font-size: 12px;
  color: var(--text-muted);
  padding: 20px 20px 12px;
  letter-spacing: 4px;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  border-bottom: 1px dashed var(--border-color);
  margin-bottom: 8px;
}
.sidebar-nav {
  flex: 1;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
}
.nav-item:hover {
  background: rgba(139, 119, 94, 0.08);
  color: var(--accent);
}
.nav-item.active {
  background: rgba(139, 119, 94, 0.12);
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 600;
}
.nav-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
}
.nav-text {
  font-family: 'STKaiti', 'KaiTi', '楷体', 'PingFang SC', serif;
}
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px dashed var(--border-color);
}
.sidebar-decor {
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 2px;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
}

/* 右侧内容 */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(180deg, #fafaf7 0%, #f0ede5 50%, #f5f2ec 100%);
  background-image:
    radial-gradient(ellipse at 80% 20%, rgba(139, 119, 94, 0.03) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 80%, rgba(139, 119, 94, 0.03) 0%, transparent 60%);
}
.content-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 32px;
  height: calc(100vh - 56px);
  min-height: calc(100vh - 56px);
  overflow: scroll;
}
</style>
