<template>
  <div class="profile-container">
    <div class="page-header">
      <n-button circle quaternary @click="goBack">
        <template #icon>
          <Icon :component="ArrowBackOutline"/>
        </template>
      </n-button>
    </div>
    <div class="profile-header">
      <div class="profile-bg"></div>
      <div class="profile-avatar-container">
        <n-avatar
            :size="120"
            :src="userInfo?.avatar || '/src/assets/image/default-userAvatar.png'"
            class="profile-avatar"
            round
        />
      </div>
      <h1 class="profile-name">{{ userInfo?.nickName || userInfo?.username }}</h1>
      <p class="profile-bio">{{ t('profile.userBio') }}</p>
      <!-- Admin角色特殊标识 -->
      <div v-if="isAdmin" class="admin-badge">
        <n-tag round size="large" type="success">
          <template #icon>
            <Icon :component="ShieldCheckmarkOutline"/>
          </template>
          {{ t('profile.superAdmin') }}
        </n-tag>
      </div>
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
            <!-- Admin角色特殊显示 -->
            <div v-if="isAdmin" class="admin-role-section">
              <n-card :bordered="false" class="admin-role-card" title-placement="left">
                <template #header>
                  <div class="admin-role-header">
                    <Icon :component="ShieldCheckmarkOutline" class="admin-icon"/>
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
            <!-- Admin权限特殊显示 -->
            <div v-if="isAdmin" class="admin-permissions-section">
              <n-card :bordered="false" class="admin-permissions-card" title-placement="left">
                <template #header>
                  <div class="admin-permissions-header">
                    <Icon :component="ShieldCheckmarkOutline" class="admin-icon"/>
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
        </n-tab-pane>

        <!-- 学生信息标签页 -->
        <n-tab-pane v-if="studentInfo" :tab="t('profile.studentInfo')" name="student">
          <div class="profile-section">
            <n-card :bordered="false" class="info-card">
              <template #header>
                <div class="section-header">
                  <h3 class="section-title">{{ t('profile.studentInfo') }}</h3>
                </div>
              </template>
              <n-descriptions bordered>
                <n-descriptions-item :label="t('profile.studentCode')">
                  <span>{{ studentInfo.studentCode }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.realName')">
                  <span>{{ studentInfo.realName }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.birthDate')">
                  <span>{{ formatDate(studentInfo.birthDate) }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.admissionYear')">
                  <span>{{ studentInfo.admissionYear || '-' }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.major')">
                  <span>{{ studentInfo.major || '-' }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.academicStatus')">
                  <n-tag :type="getAcademicStatusType(studentInfo.academicStatus)">
                    {{ getAcademicStatusText(studentInfo.academicStatus) }}
                  </n-tag>
                </n-descriptions-item>
                <n-descriptions-item v-if="studentInfo.description" :label="t('profile.description')">
                  <span>{{ studentInfo.description }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.createTime')">
                  <span>{{ formatDateTime(studentInfo.createTime) }}</span>
                </n-descriptions-item>
              </n-descriptions>
            </n-card>
          </div>
        </n-tab-pane>

        <!-- 教师信息标签页 -->
        <n-tab-pane v-if="teacherInfo" :tab="t('profile.teacherInfo')" name="teacher">
          <div class="profile-section">
            <n-card :bordered="false" class="teacher-info-card">
              <template #header>
                <div class="teacher-info-header">
                  <Icon :component="PersonOutline" class="teacher-icon"/>
                  <h3 class="section-title">{{ t('profile.teacherInfo') }}</h3>
                </div>
              </template>
              <n-descriptions bordered>
                <n-descriptions-item :label="t('profile.teacherCode')">
                  <span>{{ teacherInfo.teacherCode }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.realName')">
                  <span>{{ teacherInfo.realName }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.birthDate')">
                  <span>{{ formatDate(teacherInfo.birthDate) }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.department')">
                  <span>{{ teacherInfo.department || '-' }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.education')">
                  <n-tag :type="getEducationType(teacherInfo.education)">
                    {{ getEducationLabel(teacherInfo.education) }}
                  </n-tag>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.specialization')">
                  <span>{{ teacherInfo.specialization || '-' }}</span>
                </n-descriptions-item>
                <n-descriptions-item v-if="teacherInfo.description" :label="t('profile.description')">
                  <span>{{ teacherInfo.description }}</span>
                </n-descriptions-item>
                <n-descriptions-item :label="t('profile.createTime')">
                  <span>{{ formatDateTime(teacherInfo.createTime) }}</span>
                </n-descriptions-item>
              </n-descriptions>
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
import {ArrowBackOutline, PersonOutline, ShieldCheckmarkOutline} from '@vicons/ionicons5'
import {useUserStore} from '@/store'
import {useI18n} from 'vue-i18n'
import type {SysPermissionVO} from '@/types/system'
import Icon from '@/components/common/Icon.vue'

const router = useRouter()
const userStore = useUserStore()
const {t} = useI18n()
const userInfo = computed(() => userStore.userInfo)
const userRoles = computed(() => userStore.userInfo?.roles || [])
const studentInfo = computed(() => userStore.studentInfo)
const teacherInfo = computed(() => userStore.teacherInfo)
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

// 检查是否为admin角色
const isAdmin = computed(() => {
  return userRoles.value.some(role => role.roleKey === 'ADMIN' || role.admin === true)
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

// 格式化日期
function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  } catch (e) {
    return dateStr
  }
}

// 获取学业状态标签
function getAcademicStatusText(status?: number): string {
  switch (status) {
    case 0:
      return t('profile.academicStatusStudying')
    case 1:
      return t('profile.academicStatusSuspended')
    case 2:
      return t('profile.academicStatusDropped')
    case 3:
      return t('profile.academicStatusGraduated')
    default:
      return '-'
  }
}

// 获取学业状态类型
function getAcademicStatusType(status?: number): string {
  switch (status) {
    case 0:
      return 'success'
    case 1:
      return 'warning'
    case 2:
      return 'error'
    case 3:
      return 'info'
    default:
      return 'default'
  }
}

// 获取学历标签
function getEducationLabel(education?: number): string {
  switch (education) {
    case 0:
      return t('profile.educationAssociate')
    case 1:
      return t('profile.educationBachelor')
    case 2:
      return t('profile.educationMaster')
    case 3:
      return t('profile.educationDoctor')
    default:
      return '-'
  }
}

// 获取学历类型
function getEducationType(education?: number): string {
  switch (education) {
    case 0:
      return 'default'
    case 1:
      return 'info'
    case 2:
      return 'warning'
    case 3:
      return 'success'
    default:
      return 'default'
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
@use './index.scss';
</style> 