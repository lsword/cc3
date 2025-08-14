<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <component
        :is="Component"
        v-if="Component && route.meta.ignoreCache"
        :key="route.fullPath"
      />
      <keep-alive v-else-if="Component" :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
      <!-- fallback: 兼容无 children 的一级菜单 -->
      <component
        v-else-if="route.name === 'AppsApplist'"
        :is="AppsApplistPage"
        :key="route.fullPath + '-applist'"
      />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';
  import AppsApplistPage from '@/views/apps/applist/index.vue';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less"></style>
