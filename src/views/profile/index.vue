<template>
  <div class="profile-container">
    <div class="page-header">
      <n-button circle quaternary @click="goBack">
        <template #icon>
          <Icon :component="ArrowBackOutline" />
        </template>
      </n-button>
    </div>
    <div class="profile-header">
      <div class="profile-bg"></div>
      <div class="profile-avatar-container">
        <n-avatar
            :size="120"
            :src="userInfo?.avatar || '/default-avatar.png'"
            class="profile-avatar"
            round
        />
      </div>
      <h1 class="profile-name">{{ userInfo?.nickName || userInfo?.username }}</h1>
      <p class="profile-bio">{{ t('profile.userBio') }}</p>
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-value">{{ userRoles.length }}</span>
          <span class="stat-label">{{ t('profile.roles') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userPermissions.length }}</span>
          <span class="stat-label">{{ t('profile.permissions') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ accountAgeDays }}</span>
          <span class="stat-label">{{ t('profile.accountAge') }}</span>
        </div>
      </div>
    </div>

    <div class="profile-tabs">
      <n-tabs :default-value="'info'" animated class="custom-tabs" type="line">
        <n-tab-pane :tab="t('profile.basicInfo')" name="info">
          <div class="profile-section">
            <n-card :bordered="false" class="info-card">
              <n-descriptions bordered>
                <n-descriptions-item :label="t('auth.username')">
                  <span>{{ userInfo?.username }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('settings.personal.email')">
                  <span>{{ userInfo?.email || '-' }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('settings.personal.phone')">
                  <span>{{ userInfo?.mobile || '-' }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('settings.personal.gender')">
                  <span>{{ genderLabel }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('settings.personal.accountStatus')">
                  <n-tag :type="userInfo?.status === 0 ? 'success' : 'error'">
                    {{
                      userInfo?.status === 0 ? t('settings.personal.statusNormal') : t('settings.personal.statusDisabled')
                    }}
                  </n-tag>
                </n-descriptions-item>
                <n-descriptions-item :label="t('settings.personal.lastLoginTime')">
                  <span>{{ formatDateTime(userInfo?.lastLoginTime) }}</span>
                </n-descriptions-item>
              </n-descriptions>
              <div class="action-buttons">
                <n-button type="primary" @click="goToSettings">
                  {{ t('profile.editProfile') }}
                </n-button>
              </div>
            </n-card>
          </div>
        </n-tab-pane>

        <n-tab-pane :tab="t('profile.roleInfo')" name="roles">
          <div class="profile-section">
            <n-card :bordered="false" class="roles-card" title-placement="left">
              <template #header>
                <div class="roles-header">
                  <h3 class="section-title">{{ t('profile.yourRoles') }}</h3>
                </div>
              </template>
              <div class="roles-grid">
                <n-collapse accordion arrow-placement="right">
                  <n-collapse-item
                      v-for="role in userRoles"
                      :key="role.id"
                      :name="role.id"
                      :title="role.roleName"
                  >
                    <n-space vertical>
                      <div class="role-item">
                        <div class="role-content">
                          <div class="role-row">
                            <span class="role-label">{{ t('profile.roleKey') }}:</span>
                            <span class="role-value">{{ role.roleKey }}</span>
                          </div>
                          <div class="role-row">
                            <span class="role-label">{{ t('profile.roleStatus') }}:</span>
                            <n-tag :type="role.status === 0 ? 'success' : 'error'" size="small">
                              {{
                                role.status === 0 ? t('settings.personal.statusNormal') : t('settings.personal.statusDisabled')
                              }}
                            </n-tag>
                          </div>
                          <div class="role-row">
                            <span class="role-label">{{ t('profile.roleDescription') }}:</span>
                            <span class="role-value">{{ role.description || '-' }}</span>
                          </div>
                        </div>
                        <div v-if="role.permissions && role.permissions.length > 0" class="role-permissions">
                          <div class="permission-title">{{ t('profile.rolePermissions') }}:</div>
                          <div class="permission-tags">
                            <n-tag
                                v-for="perm in role.permissions"
                                :key="perm.id"
                                class="permission-tag"
                                size="small"
                                type="info"
                            >
                              {{ perm.permissionName }}
                            </n-tag>
                          </div>
                        </div>
                      </div>
                    </n-space>
                  </n-collapse-item>
                </n-collapse>
              </div>
            </n-card>
          </div>
        </n-tab-pane>

        <n-tab-pane :tab="t('profile.permissionInfo')" name="permissions">
          <div class="profile-section">
            <n-card :bordered="false" class="permissions-card">
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
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {ArrowBackOutline} from '@vicons/ionicons5'
import {useUserStore} from '@/store'
import {useI18n} from 'vue-i18n'
import type {SysPermissionVO} from '@/types/system'
import Icon from '@/components/common/Icon.vue'

const router = useRouter()
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

  // 合并用户直接拥有的权限
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

// 性别标签
const genderLabel = computed(() => {
  const gender = userInfo.value?.gender
  if (gender === 1) return t('settings.personal.genderMale')
  if (gender === 2) return t('settings.personal.genderFemale')
  return t('settings.personal.genderUnknown')
})

// 账户创建天数
const accountAgeDays = computed(() => {
  if (!userInfo.value?.createTime) return 0

  const createDate = new Date(userInfo.value.createTime)
  const today = new Date()
  const diffTime = today.getTime() - createDate.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})

// 定义TreeOption接口
interface TreeOption {
  id: string;
  name: string;
  key?: string;
  children?: TreeOption[];
}

// 转换权限为树形结构以供渲染
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

  // 递归构建树
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

  // 将顶级权限添加到虚拟根节点
  root.children = rootPermissions.map(p => ({
    id: p.id,
    name: p.permissionName,
    key: p.permissionKey,
    children: buildPermissionTree(p.id)
  }));

  return [root];
});

// 格式化日期时间
function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString()
  } catch (e) {
    return dateStr
  }
}

// 跳转到设置页面
function goToSettings() {
  router.push('/settings')
}

// 返回上一页
function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .profile-header {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    padding-bottom: 40px;
    margin-bottom: 30px;
    overflow: hidden;
    border-radius: 12px;
    text-align: center;

    .profile-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 180px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      z-index: 0;
    }

    .profile-avatar-container {
      position: relative;
      z-index: 2;
      margin-bottom: 16px;

      .profile-avatar {
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .profile-name {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;
      position: relative;
      z-index: 2;
    }

    .profile-bio {
      color: #64748b;
      margin: 0 0 20px 0;
      position: relative;
      z-index: 2;
    }

    .profile-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      position: relative;
      z-index: 2;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
        }
      }
    }
  }

  .profile-tabs {
    .custom-tabs {
      margin-bottom: 24px;
    }

    .profile-section {
      margin-bottom: 30px;
    }

    .info-card {
      .action-buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
      }
    }

    .section-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: #334155;
    }

    .roles-card {
      .roles-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;

        .role-item {
          padding: 16px;

          .role-content {
            margin-bottom: 16px;

            .role-row {
              display: flex;
              align-items: center;
              margin-bottom: 8px;

              .role-label {
                font-weight: 500;
                width: 120px;
                flex-shrink: 0;
              }

              .role-value {
                color: #64748b;
              }
            }
          }

          .role-permissions {
            .permission-title {
              font-weight: 500;
              margin-bottom: 12px;
            }

            .permission-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
          }
        }
      }
    }

    .permissions-card {
      .permissions-tree {
        max-height: 600px;
        overflow-y: auto;
      }
    }
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 12px;

    .profile-header {
      .profile-stats {
        gap: 24px;
      }
    }
  }
}
</style> 