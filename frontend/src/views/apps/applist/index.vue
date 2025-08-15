<template>
  <div class="applist-table-container">
    <div class="applist-table-header">
      <a-input-search
        v-model="searchValue"
        placeholder="搜索应用名称"
        style="width: 240px"
        allow-clear
      />
    </div>
    <a-table
      :columns="columns"
      :data="filteredData"
      row-key="id"
      :pagination="false"
      bordered
    >
      <template #status="{ record }">
        <a-tag :color="record.status === '正常' ? 'green' : 'red'">
          {{ record.status }}
        </a-tag>
      </template>
      <template #actions>
        <a-space>
          <a-button type="primary" size="mini">查看</a-button>
          <a-button type="outline" size="mini">编辑</a-button>
          <a-button type="outline" size="mini" :danger="true">删除</a-button>
        </a-space>
      </template>
      <template #name="{ record }">
        <router-link :to="`/app/${record.name}`" style="color: #165dff; text-decoration: underline;">
          {{ record.name }}
        </router-link>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getApplist, type ApplistItem } from '@/api/applist';

const columns = [
  { title: '应用名称', dataIndex: 'name', slotName: 'name', align: 'center' },
  { title: '更新次数', dataIndex: 'updateCount', align: 'center' },
  { title: '状态', dataIndex: 'status', slotName: 'status', align: 'center' },
  { title: '安装包', dataIndex: 'package', align: 'center' },
  { title: '软件版本', dataIndex: 'version', align: 'center' },
  { title: '仓库', dataIndex: 'repo', align: 'center' },
  { title: '操作', slotName: 'actions', align: 'center', width: 180 },
];

const data = ref<ApplistItem[]>([]);

const searchValue = ref('');
const filteredData = computed(() =>
  data.value.filter((item) =>
    item.name.toLowerCase().includes(searchValue.value.trim().toLowerCase())
  )
);

onMounted(async () => {
  data.value = await getApplist();
  // 调试输出，确认数据已获取
  console.log('applist data:', data.value);
  console.log('applist data (array):', data.value.slice());
  console.log('filteredData:', filteredData.value);
});
</script>

<style scoped lang="less">
.applist-table-container {
  background: var(--color-bg-2);
  border-radius: 4px;
  padding: 24px;
  margin: 24px;
}
.applist-table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
</style>
