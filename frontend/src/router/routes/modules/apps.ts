import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// 注意：此配置无 children，菜单只显示一级菜单
// 需要在 layout 组件（如 default-layout.vue）中通过 route.name 判断，渲染“我的应用”页面内容
const APPS_APPLIST: AppRouteRecordRaw = {
  path: '/applist',
  name: 'AppsApplist',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.apps.applist',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 10,
  },
};

const APPS_APP_DETAIL: AppRouteRecordRaw = {
  path: '/app',
  name: 'AppsAppDetail',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.apps.appDetail',
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: ':name',
      name: 'AppsAppDetailPage',
      component: () => import('@/views/apps/app/index.vue'),
      meta: {
        locale: 'menu.apps.appDetail',
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default [APPS_APPLIST, APPS_APP_DETAIL];
