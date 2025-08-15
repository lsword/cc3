<template>
  <div class="app-detail">
    <h1>应用详情</h1>
    <div v-if="loading">加载中...</div>
    <div v-else-if="app && app.length">
      <div v-for="(item, idx) in app" :key="idx" class="manifest-block">
        <h2>{{ item.kind }}: {{ item.metadata?.name }}</h2>
        <div>
          <strong>apiVersion:</strong> {{ item.apiVersion }}
        </div>
        <div v-if="item.metadata?.labels">
          <strong>Labels:</strong>
          <span v-for="(val, key) in item.metadata.labels" :key="key">{{ key }}={{ val }} </span>
        </div>
        <div v-if="item.spec">
          <strong>Spec:</strong>
          <pre>{{ item.spec }}</pre>
        </div>
      </div>
    </div>
    <div v-else>
      未找到该应用或加载失败。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAppDetail } from '@/api/applist';

// K8s manifest 类型定义
interface K8sManifest {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    labels?: Record<string, string>;
    [key: string]: any;
  };
  spec?: any;
  [key: string]: any;
}

const route = useRoute();
const app = ref<K8sManifest[] | null>(null);
const loading = ref(true);

onMounted(async () => {
  const name = String(route.params.name);
  if (name) {
    const detail = await getAppDetail(name);
    // 调试输出
    console.log('app name:', name, 'detail:', detail);
    app.value = detail;
  }
  loading.value = false;
});
</script>

<style scoped>
.app-detail {
  background: var(--color-bg-2);
  border-radius: 4px;
  padding: 24px;
  margin: 24px;
}
</style>
