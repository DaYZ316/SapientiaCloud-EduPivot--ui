<template>
  <div class="profile-section">
    <!-- Admin角色特殊显示 -->
    <div v-if="isAdmin" class="admin-role-section">
      <n-card :bordered="false" class="admin-role-card" title-placement="left">
        <template #header>
          <div class="admin-role-header">
            <h3 class="section-title">{{ t('profile.superAdmin') }}</h3>
          </div>
        </template>
        <div class="admin-role-content">
          <p class="admin-description">{{ t('profile.superAdminDescription') }}</p>
        </div>
      </n-card>
    </div>

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
                    <n-tag :type="getStatusType(role.status)" size="small">
                      {{ getStatusText(role.status) }}
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
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'

const userStore = useUserStore()
const {t} = useI18n()

const userRoles = computed(() => userStore.userInfo?.roles || [])

// 检查是否为admin角色
const isAdmin = computed(() => {
  return userRoles.value.some(role => role.roleKey === 'ADMIN' || role.admin === true)
})

// 获取状态类�?
function getStatusType(status?: number | null): string {
  return status === 0 ? 'success' : 'error'
}

// 获取状态文�?
function getStatusText(status?: number | null): string {
  return status === 0 ? t('settings.personal.statusNormal') : t('settings.personal.statusDisabled')
}
</script>

<style lang="scss" scoped>
@use '../index.scss';
</style>
