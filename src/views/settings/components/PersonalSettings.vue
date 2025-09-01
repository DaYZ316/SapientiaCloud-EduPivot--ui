<template>
  <div class="personal-settings">
    <n-card :bordered="false" class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <AvatarUpload
              :model-value="personalForm.avatar || undefined"
              :size="80"
              @update:model-value="(value: string) => personalForm.avatar = value"
              @upload-success="handleAvatarUploadSuccess"
              @upload-error="handleAvatarUploadError"
          />
        </div>
        <div class="user-info-brief">
          <h3>{{ userInfo?.nickName || userInfo?.username }}</h3>
          <n-tag v-for="role in userRoles" :key="role.id" class="role-tag" size="small">
            {{ role.roleName }}
          </n-tag>
        </div>
      </div>
    </n-card>

    <n-card :bordered="false" class="info-card mt-4">
      <n-tabs animated type="line">
        <n-tab-pane :tab="t('settings.personal.basicInfo')" name="basic">
          <n-form
              ref="formRef"
              :model="personalForm"
              :rules="rules"
              label-placement="left"
              label-width="120"
          >
            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="t('auth.username')" path="username">
                  <n-input
                      v-model:value="personalForm.username"
                      :placeholder="t('settings.personal.usernamePlaceholder')"
                      disabled
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.personal.nickname')" path="nickName">
                  <n-input
                      v-model:value="personalForm.nickName"
                      :placeholder="t('settings.personal.nicknamePlaceholder')"
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.personal.email')" path="email">
                  <n-input
                      v-model:value="personalForm.email"
                      :placeholder="t('settings.personal.emailPlaceholder')"
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.personal.phone')" path="mobile">
                  <n-input
                      v-model:value="personalForm.mobile"
                      :placeholder="t('settings.personal.phonePlaceholder')"
                      :disabled="!!userInfo?.mobile"
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-form-item :label="t('settings.personal.gender')" path="gender">
              <n-radio-group v-model:value="personalForm.gender">
                <n-space>
                  <n-radio :value="0">{{ t('settings.personal.genderUnknown') }}</n-radio>
                  <n-radio :value="1">{{ t('settings.personal.genderMale') }}</n-radio>
                  <n-radio :value="2">{{ t('settings.personal.genderFemale') }}</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>

            <n-form-item :label="t('settings.personal.lastLoginTime')">
              <span>{{ formatDateTime(userInfo?.lastLoginTime) }}</span>
            </n-form-item>

            <n-form-item>
              <n-space>
                <n-button type="primary" @click="savePersonalSettings">
                  {{ t('common.save') }}
                </n-button>
                <n-button @click="resetForm">
                  {{ t('common.reset') }}
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <n-tab-pane :tab="t('settings.personal.security')" name="security">
          <n-space vertical>
            <n-card :bordered="false" class="password-card" size="small">
              <template #header>
                <div class="flex-between">
                  <span>{{ t('settings.personal.changePassword') }}</span>
                  <n-button text type="primary" @click="showPasswordModal = true">
                    {{ t('settings.personal.modify') }}
                  </n-button>
                </div>
              </template>
              <div>{{ t('settings.personal.passwordDesc') }}</div>
            </n-card>

            <n-card :bordered="false" class="security-card" size="small">
              <template #header>
                <div class="flex-between">
                  <span>{{ t('settings.personal.accountStatus') }}</span>
                  <n-tag :type="userInfo?.status === 0 ? 'success' : 'error'">
                    {{
                      userInfo?.status === 0 ? t('settings.personal.statusNormal') : t('settings.personal.statusDisabled')
                    }}
                  </n-tag>
                </div>
              </template>
              <div>{{ t('settings.personal.accountStatusDesc') }}</div>
            </n-card>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- 修改密码的弹窗 -->
    <n-modal v-model:show="showPasswordModal" :title="t('settings.personal.changePassword')" preset="card"
             style="width: 500px;">
      <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-placement="left"
          label-width="140"
      >
        <n-form-item :label="t('settings.personal.currentPassword')" path="currentPassword">
          <n-input
              v-model:value="passwordForm.currentPassword"
              :placeholder="t('settings.personal.currentPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <n-form-item :label="t('settings.personal.newPassword')" path="newPassword">
          <n-input
              v-model:value="passwordForm.newPassword"
              :placeholder="t('settings.personal.newPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <n-form-item :label="t('settings.personal.confirmPassword')" path="confirmPassword">
          <n-input
              v-model:value="passwordForm.confirmPassword"
              :placeholder="t('settings.personal.confirmPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <div class="flex-center mt-4">
          <n-space>
            <n-button type="primary" @click="changePassword">
              {{ t('common.confirm') }}
            </n-button>
            <n-button @click="showPasswordModal = false">
              {{ t('common.cancel') }}
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {getDefaultSysUserProfileDTO, updateUserProfile} from '@/api/system/user'
import {getDefaultSysUserPasswordDTO, logout, updatePassword} from '@/api/auth/auth'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import type {SysUserProfileDTO} from '@/types/system/user'
import type {SysUserPasswordDTO} from '@/types/auth/auth'
import AvatarUpload from '@/components/common/AvatarUpload.vue'

const userStore = useUserStore()
const router = useRouter()
const {dialog, message} = getDiscreteApi()
const {t} = useI18n()
const formRef = ref<FormInst | null>(null)
const passwordFormRef = ref<FormInst | null>(null)
const showPasswordModal = ref(false)

// 使用计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo)
const userRoles = computed(() => userStore.userInfo?.roles || [])

// 表单数据
const personalForm = reactive<SysUserProfileDTO>(getDefaultSysUserProfileDTO())

// 监听用户信息变化，更新表单数据
const initFormData = () => {
  if (userInfo.value) {
    personalForm.username = userInfo.value.username || ''
    personalForm.nickName = userInfo.value.nickName || ''
    personalForm.email = userInfo.value.email || ''
    personalForm.mobile = userInfo.value.mobile || ''
    personalForm.gender = userInfo.value.gender || 0
    personalForm.avatar = userInfo.value.avatar || ''
  }
}

// 修改密码表单
const passwordForm = reactive<SysUserPasswordDTO>(getDefaultSysUserPasswordDTO())

// 头像上传成功处理
const handleAvatarUploadSuccess = (url: string) => {
  // 头像已经通过 v-model 更新到 personalForm.avatar
  // 这里可以添加额外的处理逻辑
}

// 头像上传失败处理
const handleAvatarUploadError = (error: Error) => {
  console.error('头像上传失败:', error)
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.currentPassword = null
  passwordForm.newPassword = null
  passwordForm.confirmPassword = null
  if (passwordFormRef.value) {
    passwordFormRef.value.restoreValidation()
  }
}

// 监听对话框关闭事件
watch(showPasswordModal, (newVal: boolean) => {
  if (!newVal) {
    // 当对话框关闭时重置表单
    resetPasswordForm()
  }
})

// 表单验证规则
const rules: FormRules = {
  nickName: [
    {required: true, message: t('settings.personal.nicknameRequired'), trigger: 'blur'}
  ],
  email: [
    {required: true, message: t('settings.personal.emailRequired'), trigger: 'blur'},
    {type: 'email', message: t('settings.personal.emailInvalid'), trigger: 'blur'}
  ],
  mobile: [
    {required: true, message: t('settings.personal.phoneRequired'), trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: t('settings.personal.phoneInvalid'), trigger: 'blur'}
  ]
}

// 密码表单验证规则
const passwordRules: FormRules = {
  currentPassword: [
    {required: true, message: t('settings.personal.currentPasswordRequired'), trigger: 'blur'}
  ],
  newPassword: [
    {required: true, message: t('settings.personal.newPasswordRequired'), trigger: 'blur'},
    {min: 6, message: t('settings.personal.passwordLengthInvalid'), trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: t('settings.personal.confirmPasswordRequired'), trigger: 'blur'},
    {
      validator: (_: any, value: any) => value === passwordForm.newPassword,
      message: t('settings.personal.passwordsNotMatch'),
      trigger: 'blur'
    }
  ]
}

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

// 保存个人设置
const savePersonalSettings = () => {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        if (!userInfo.value) {
          message.error(t('settings.personal.updateFail'))
          return
        }

        // 调用API更新用户个人信息
        const userData: SysUserProfileDTO = {
          username: personalForm.username,
          nickName: personalForm.nickName,
          email: personalForm.email,
          mobile: personalForm.mobile,
          gender: personalForm.gender,
          avatar: personalForm.avatar
        }

        const res = await updateUserProfile(userData)
        if (res.success && res.data) {
          message.success(t('settings.personal.updateSuccess'))

          // 更新本地存储的用户信息
          await userStore.refreshUserInfo()
        } else {
          message.error(res.message || t('settings.personal.updateFail'))
        }
      } catch (error) {
        console.error('更新用户信息失败:', error)
        message.error(t('settings.personal.updateFail'))
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  initFormData()
}

// 修改密码
const changePassword = () => {
  passwordFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        const passwordData: SysUserPasswordDTO = {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        }

        const res = await updatePassword(passwordData)
        if (res.success && res.data) {
          showPasswordModal.value = false

          // 重置密码表单已经在watch中处理，此处代码可以删除
          // passwordForm.currentPassword = null
          // passwordForm.newPassword = null
          // passwordForm.confirmPassword = null

          // 显示成功对话框
          dialog.success({
            title: t('settings.personal.passwordChangeSuccess'),
            content: t('settings.personal.passwordChangeRedirect'),
            positiveText: t('common.confirm'),
            onPositiveClick: async () => {
              try {
                // 登出当前用户
                await logout()

                // 清除用户状态
                userStore.resetUserState()

                // 跳转到登录页
                router.push('/login')
              } catch (error) {
                console.error('登出失败:', error)
                // 即使登出失败也跳转到登录页
                router.push('/login')
              }
            }
          })
        } else {
          message.error(res.message || t('settings.personal.passwordChangeFail'))
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        message.error(t('settings.personal.passwordChangeFail'))
      }
    }
  })
}


// 初始化表单数据
onMounted(async () => {
  // 刷新用户信息，确保数据是最新的
  await userStore.refreshUserInfo()
  initFormData()
})
</script>

<style lang="scss" scoped>
.personal-settings {
  .profile-card {
    border-radius: 8px;
    background-image: linear-gradient(135deg, var(--primary-color) 0%, var(--info-color) 100%);

    .profile-header {
      display: flex;
      align-items: center;

      .avatar-section {
        position: relative;
        margin-right: 24px;

        .avatar-upload {
          cursor: pointer;
          transition: opacity 0.3s, transform 0.2s;

          &:hover {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      }

      .user-info-brief {
        color: white;

        h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .role-tag {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
  }

  .info-card {
    border-radius: 8px;

    .password-card, .security-card {
      margin-bottom: 16px;
    }
  }
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mt-4 {
  margin-top: 16px;
}
</style> 