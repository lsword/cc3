<template>
  <div class="app-detail">
    <h1>应用详情</h1>
    <div v-if="loading">加载中...</div>
    <div v-else-if="app">
      <p><strong>名称：</strong>{{ app.name }}</p>
      <p><strong>状态：</strong>{{ app.status }}</p>
      <p><strong>更新次数：</strong>{{ app.updateCount }}</p>
      <p><strong>安装包：</strong>{{ app.package }}</p>
      <p><strong>软件版本：</strong>{{ app.version }}</p>
      <p><strong>仓库：</strong>{{ app.repo }}</p>
    </div>
    <div v-else>
      未找到该应用或加载失败。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAppDetail, type ApplistItem } from '@/api/applist';

const route = useRoute();
const app = ref<ApplistItem | null>(null);
const loading = ref(true);

onMounted(async () => {
  const name = String(route.params.name);
  if (name) {
    app.value = await getAppDetail(name);
  }
  loading.value = false;
});
</script>

<style scoped>
.app-detail {
  padding: 24px;
}
</style>
