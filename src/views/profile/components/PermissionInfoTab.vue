<template>
  <div class="profile-section">
    <!-- Admin权限特殊显示 -->
    <div v-if="isAdmin" class="admin-permissions-section">
      <n-card :bordered="false" class="admin-permissions-card" title-placement="left">
        <template #header>
          <div class="admin-permissions-header">
            <h3 class="section-title">{{ t('profile.superAdmin') }}</h3>
          </div>
        </template>
        <div class="admin-permissions-content">
          <p class="admin-description">{{ t('profile.superAdminDescription') }}</p>
        </div>
      </n-card>
    </div>

    <!-- 非管理员用户显示权限详情 -->
    <n-card v-if="!isAdmin" :bordered="false" class="permissions-card">
      <template #header>
        <div class="permissions-header">
          <h3 class="section-title">{{ t('profile.yourPermissions') }}</h3>
        </div>
      </template>
      <n-tree
          :data="formattedPermissions"
          :default-expanded-keys="['root']"
          block-line
          children-field="children"
          class="permissions-tree"
          key-field="id"
          label-field="name"
      />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import type {SysPermissionVO} from '@/types/system'

const userStore = useUserStore()
const {t} = useI18n()

const userInfo = computed(() => userStore.userInfo)
const userRoles = computed(() => userStore.userInfo?.roles || [])

const userPermissions = computed(() => {
  // 如果userStore.permissions已经存在，则直接使用
  if (userStore.permissions && userStore.permissions.length > 0) {
    return userStore.permissions;
  }

  // 否则从用户信息中提取权限
  const allPermissions: SysPermissionVO[] = [];

  // 合并用户直接拥有的权�?
  if (userInfo.value && userInfo.value.permissions) {
    allPermissions.push(...userInfo.value.permissions);
  }

  // 合并角色中包含的权限
  if (userRoles.value && userRoles.value.length > 0) {
    userRoles.value.forEach(role => {
      if (role.permissions && role.permissions.length > 0) {
        allPermissions.push(...role.permissions);
      }
    });
  }

  // 去重
  const uniquePermissions = new Map<string, SysPermissionVO>();
  allPermissions.forEach(perm => {
    if (!uniquePermissions.has(perm.id)) {
      uniquePermissions.set(perm.id, perm);
    }
  });

  return Array.from(uniquePermissions.values());
})

// 检查是否为admin角色
const isAdmin = computed(() => {
  return userRoles.value.some(role => role.roleKey === 'ADMIN' || role.admin === true)
})

// 定义TreeOption接口
interface TreeOption {
  id: string;
  name: string;
  key?: string;
  children?: TreeOption[];
}

// 转换权限为树形结构以供渲�?
const formattedPermissions = computed<TreeOption[]>(() => {
  const permissions = userPermissions.value || [];

  // 如果没有权限数据，返回只有根节点的树
  if (!permissions.length) {
    return [{
      id: 'root',
      name: t('profile.allPermissions'),
      children: []
    }];
  }

  // 找到所有顶级权限（没有父级或父级为空）
  const rootPermissions = permissions.filter(p => !p.parentId);

  // 构建一个虚拟根节点
  const root: TreeOption = {
    id: 'root',
    name: t('profile.allPermissions'),
    children: []
  };

  // 递归构建�?
  const buildPermissionTree = (parentId: string): TreeOption[] => {
    const children = permissions
        .filter(p => p.parentId === parentId)
        .map(p => ({
          id: p.id,
          name: p.permissionName,
          key: p.permissionKey,
          children: buildPermissionTree(p.id)
        }));

    return children.length ? children : [];
  };

  // 将顶级权限添加到虚拟根节�?
  root.children = rootPermissions.map(p => ({
    id: p.id,
    name: p.permissionName,
    key: p.permissionKey,
    children: buildPermissionTree(p.id)
  }));

  return [root];
});
</script>

<style lang="scss" scoped>
@use '../index.scss';
</style>
