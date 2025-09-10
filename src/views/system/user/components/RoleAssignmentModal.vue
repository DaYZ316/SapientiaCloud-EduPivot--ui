<template>
  <n-modal v-model:show="showModal" :title="t('settings.user.assignRole.title')" preset="card" style="width: 600px">
    <div v-if="currentUser" class="assign-header">
      <p>{{ t('settings.user.assignRole.user') }}: {{ currentUser.username }} ({{ currentUser.nickName }})</p>
    </div>

    <n-transfer
        v-model:value="selectedRoleIds"
        :options="getRoleOptions()"
    />

    <template #footer>
      <n-space justify="end">
        <n-button @click="handleCancel">{{ t('settings.user.assignRole.cancel') }}</n-button>
        <n-button :loading="submitting" type="primary" @click="handleSubmit">
          {{ t('settings.user.assignRole.submit') }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import type {SysRoleVO} from '@/types/system/role'
import type * as userType from '@/types/system/user'

interface Props {
  show: boolean
  currentUser: userType.SysUserVO | null
  availableRoles: SysRoleVO[]
  userRoles: SysRoleVO[]
  submitting: boolean
  selectedRoleIds: string[]
}

interface Emits {
  (e: 'update:show', value: boolean): void

  (e: 'update:selectedRoleIds', value: string[]): void

  (e: 'submit', roleIds: string[]): void

  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {t} = useI18n()

const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const selectedRoleIds = computed({
  get: () => props.selectedRoleIds,
  set: (value) => emit('update:selectedRoleIds', value)
})

// 监听用户变化，更新选中的角色
watch(() => props.userRoles, (newUserRoles) => {
  const newRoleIds = newUserRoles.map((r: SysRoleVO) => r.id)
  emit('update:selectedRoleIds', newRoleIds)
}, {immediate: true})

// 获取角色选项，实现教师和学生角色互斥选择
function getRoleOptions() {
  const selectedRoleKeys = selectedRoleIds.value
      .map(id => props.availableRoles.find(role => role.id === id)?.roleKey)
      .filter(Boolean)

  const hasTeacherRole = selectedRoleKeys.includes('TEACHER')
  const hasStudentRole = selectedRoleKeys.includes('STUDENT')

  return props.availableRoles.map(role => {
    let disabled = false

    // 管理员角色：如果当前没有选中，则禁用
    if (role.admin && !selectedRoleIds.value.includes(role.id)) {
      disabled = true
    }

    // 教师和学生角色互斥逻辑
    if (role.roleKey === 'TEACHER' && hasStudentRole) {
      disabled = true
    }
    if (role.roleKey === 'STUDENT' && hasTeacherRole) {
      disabled = true
    }

    return {
      label: role.roleName,
      value: role.id,
      disabled
    }
  })
}

function handleSubmit() {
  emit('submit', selectedRoleIds.value)
}

function handleCancel() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.assign-header {
  margin-bottom: 16px;

  p {
    margin: 0;
    font-size: 14px;
    color: var(--text-color-2);
  }
}
</style>
