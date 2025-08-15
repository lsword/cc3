<template>
  <div class="app-detail">
    <h1 v-if="app && app.length">{{ app[0]?.metadata?.name || '应用详情' }}</h1>
    <h1 v-else>应用详情</h1>
    <div style="border-bottom:1px solid #e5e6eb;margin:16px 0 24px 0;"></div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="app && app.length">
      <!-- Service Table -->
      <div v-if="services.length">
        <h2>Service</h2>
        <a-table
          :columns="serviceColumns"
          :data="services"
          row-key="metadata.name"
          :pagination="false"
          bordered
        >
          <template #ports="{ record }">
            <div v-for="port in record.spec?.ports || []" :key="port.name || port.port">
              {{ port.port }}<span v-if="port.name">({{ port.name }})</span>
            </div>
          </template>
          <template #selector="{ record }">
            <div v-for="(val, key) in record.spec?.selector || {}" :key="key">
              {{ key }}={{ val }}
            </div>
          </template>
        </a-table>
      </div>
      <!-- Deployment Table -->
      <div v-if="deployments.length" style="margin-top:24px;">
        <h2>Deployment</h2>
        <a-table
          :columns="deploymentColumns"
          :data="deployments"
          row-key="metadata.name"
          :pagination="false"
          bordered
        >
          <template #images="{ record }">
            <div v-for="c in record.spec?.template?.spec?.containers || []" :key="c.name">
              {{ c.image }}
            </div>
          </template>
          <template #containerPorts="{ record }">
            <div v-for="c in record.spec?.template?.spec?.containers || []" :key="c.name">
              <span v-for="p in c.ports || []" :key="p.name || p.containerPort">
                {{ p.containerPort }}<span v-if="p.name">({{ p.name }})</span>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <!-- Ingress Table -->
      <div v-if="ingresses.length" style="margin-top:24px;">
        <h2>Ingress</h2>
        <a-table
          :columns="ingressColumns"
          :data="ingresses"
          row-key="metadata.name"
          :pagination="false"
          bordered
        >
          <template #hosts="{ record }">
            <div v-for="rule in record.spec?.rules || []" :key="rule.host">
              {{ rule.host }}
            </div>
          </template>
          <template #paths="{ record }">
            <div v-for="rule in record.spec?.rules || []" :key="rule.host">
              <div v-for="path in rule.http?.paths || []" :key="path.backend?.service?.name + '-' + path.backend?.service?.port?.number">
                {{ path.path || '/' }}
              </div>
            </div>
          </template>
          <template #servicePort="{ record }">
            <div v-for="rule in record.spec?.rules || []" :key="rule.host">
              <div v-for="path in rule.http?.paths || []" :key="path.backend?.service?.name + '-' + path.backend?.service?.port?.number">
                {{ path.backend?.service?.name }}:{{ path.backend?.service?.port?.number }}
              </div>
            </div>
          </template>
        </a-table>
      </div>
      <!-- 其他资源 -->
      <div v-if="others.length" style="margin-top:24px;">
        <h2>其他资源</h2>
        <a-table
          :columns="otherColumns"
          :data="others"
          row-key="metadata.name"
          :pagination="false"
          bordered
        >
          <template #spec="{ record }">
            <pre style="white-space:pre-wrap;word-break:break-all;">{{ JSON.stringify(record.spec, null, 2) }}</pre>
          </template>
        </a-table>
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
import { TableColumnData } from '@arco-design/web-vue';

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

// 分类资源
const services = ref<K8sManifest[]>([]);
const deployments = ref<K8sManifest[]>([]);
const ingresses = ref<K8sManifest[]>([]);
const others = ref<K8sManifest[]>([]);


onMounted(async () => {
  const name = String(route.params.name);
  if (name) {
    const detail = await getAppDetail(name);
    app.value = detail;
    // 分类
    if (detail && Array.isArray(detail)) {
      services.value = detail.filter(item => item.kind === 'Service');
      deployments.value = detail.filter(item => item.kind === 'Deployment');
      ingresses.value = detail.filter(item => item.kind === 'Ingress');
      others.value = detail.filter(item => !['Service', 'Deployment', 'Ingress'].includes(item.kind));
    }
  }
  loading.value = false;
});

// 通用资源表格列
const otherColumns: TableColumnData[] = [
  { title: 'Kind', dataIndex: 'kind', align: 'center' },
  { title: 'apiVersion', dataIndex: 'apiVersion', align: 'center' },
  { title: '名称', dataIndex: 'metadata.name', align: 'center' },
  { title: 'Spec', slotName: 'spec', align: 'center' }
];

// arco table columns
const serviceColumns: TableColumnData[] = [
  { title: '名称', dataIndex: 'metadata.name', align: 'center' },
  { title: '类型', dataIndex: 'spec.type', align: 'center' },
  { title: '端口', slotName: 'ports', align: 'center' },
  { title: 'Selector', slotName: 'selector', align: 'center' }
];

const deploymentColumns: TableColumnData[] = [
  { title: '名称', dataIndex: 'metadata.name', align: 'center' },
  { title: '副本数', dataIndex: 'spec.replicas', align: 'center' },
  { title: '镜像', slotName: 'images', align: 'center' },
  { title: '容器端口', slotName: 'containerPorts', align: 'center' }
];

const ingressColumns: TableColumnData[] = [
  { title: '名称', dataIndex: 'metadata.name', align: 'center' },
  { title: 'Host', slotName: 'hosts', align: 'center' },
  { title: 'Path', slotName: 'paths', align: 'center' },
  { title: 'Service/Port', slotName: 'servicePort', align: 'center' }
];
</script>

<style scoped>
.app-detail {
  background: var(--color-bg-2);
  border-radius: 4px;
  padding: 24px;
  margin: 24px;
}
</style>
