<template>
  <div class="personal-settings">
    <n-card class="profile-card" :bordered="false">
      <div class="profile-header">
        <div class="avatar-section">
          <n-upload
            ref="uploadRef"
            v-model:file-list="fileList"
            :max="1"
            :show-file-list="false"
            accept=".jpg,.jpeg,.png"
            :custom-request="customAvatarUpload"
            @before-upload="beforeAvatarUpload"
          >
            <n-avatar
              :src="userInfo?.avatar || '/default-avatar.png'"
              :size="80"
              round
              class="avatar-upload"
            />
          </n-upload>
        </div>
        <div class="user-info-brief">
          <h3>{{ userInfo?.nickName || userInfo?.username }}</h3>
          <n-tag v-for="role in userRoles" :key="role.id" class="role-tag" size="small">
            {{ role.roleName }}
          </n-tag>
        </div>
      </div>
    </n-card>

    <n-card class="info-card mt-4" :bordered="false">
      <n-tabs type="line" animated>
        <n-tab-pane name="basic" :tab="$t('settings.personal.basicInfo')">
          <n-form
            :model="personalForm"
            ref="formRef"
            label-placement="left"
            label-width="120"
            :rules="rules"
          >
            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="$t('auth.username')" path="username">
                  <n-input
                    v-model:value="personalForm.username"
                    :placeholder="$t('settings.personal.usernamePlaceholder')"
                    disabled
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="$t('settings.personal.nickname')" path="nickName">
                  <n-input
                    v-model:value="personalForm.nickName"
                    :placeholder="$t('settings.personal.nicknamePlaceholder')"
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="$t('settings.personal.email')" path="email">
                  <n-input
                    v-model:value="personalForm.email"
                    :placeholder="$t('settings.personal.emailPlaceholder')"
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="$t('settings.personal.phone')" path="mobile">
                  <n-input
                    v-model:value="personalForm.mobile"
                    :placeholder="$t('settings.personal.phonePlaceholder')"
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-form-item :label="$t('settings.personal.gender')" path="gender">
              <n-radio-group v-model:value="personalForm.gender">
                <n-space>
                  <n-radio :value="0">{{ $t('settings.personal.genderUnknown') }}</n-radio>
                  <n-radio :value="1">{{ $t('settings.personal.genderMale') }}</n-radio>
                  <n-radio :value="2">{{ $t('settings.personal.genderFemale') }}</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>

            <n-form-item :label="$t('settings.personal.lastLoginTime')">
              <span>{{ formatDateTime(userInfo?.lastLoginTime) }}</span>
            </n-form-item>

            <n-form-item>
              <n-space>
                <n-button type="primary" @click="savePersonalSettings">
                  {{ $t('common.save') }}
                </n-button>
                <n-button @click="resetForm">
                  {{ $t('common.reset') }}
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <n-tab-pane name="security" :tab="$t('settings.personal.security')">
          <n-space vertical>
            <n-card :bordered="false" size="small" class="password-card">
              <template #header>
                <div class="flex-between">
                  <span>{{ $t('settings.personal.changePassword') }}</span>
                  <n-button text type="primary" @click="showPasswordModal = true">
                    {{ $t('settings.personal.modify') }}
                  </n-button>
                </div>
              </template>
              <div>{{ $t('settings.personal.passwordDesc') }}</div>
            </n-card>

            <n-card :bordered="false" size="small" class="security-card">
              <template #header>
                <div class="flex-between">
                  <span>{{ $t('settings.personal.accountStatus') }}</span>
                  <n-tag :type="userInfo?.status === 0 ? 'success' : 'error'">
                    {{ userInfo?.status === 0 ? $t('settings.personal.statusNormal') : $t('settings.personal.statusDisabled') }}
                  </n-tag>
                </div>
              </template>
              <div>{{ $t('settings.personal.accountStatusDesc') }}</div>
            </n-card>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- 修改密码的弹窗 -->
    <n-modal v-model:show="showPasswordModal" preset="card" :title="$t('settings.personal.changePassword')" style="width: 500px;">
      <n-form
        :model="passwordForm"
        ref="passwordFormRef"
        label-placement="left"
        label-width="140"
        :rules="passwordRules"
      >
        <n-form-item :label="$t('settings.personal.currentPassword')" path="currentPassword">
          <n-input
            v-model:value="passwordForm.currentPassword"
            type="password"
            show-password-on="click"
            :placeholder="$t('settings.personal.currentPasswordPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('settings.personal.newPassword')" path="newPassword">
          <n-input
            v-model:value="passwordForm.newPassword"
            type="password"
            show-password-on="click"
            :placeholder="$t('settings.personal.newPasswordPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('settings.personal.confirmPassword')" path="confirmPassword">
          <n-input
            v-model:value="passwordForm.confirmPassword"
            type="password"
            show-password-on="click"
            :placeholder="$t('settings.personal.confirmPasswordPlaceholder')"
          />
        </n-form-item>
        <div class="flex-center mt-4">
          <n-space>
            <n-button type="primary" @click="changePassword">
              {{ $t('common.confirm') }}
            </n-button>
            <n-button @click="showPasswordModal = false">
              {{ $t('common.cancel') }}
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import type {FormInst, FormRules, UploadCustomRequestOptions, UploadFileInfo, UploadInst} from 'naive-ui'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {getDefaultSysUserProfileDTO, updateUserProfile} from '@/api/system/user'
import {getDefaultSysUserPasswordDTO, logout, updatePassword} from '@/api/auth/auth'
import {getDialogInstance, getMessageInstance} from '@/utils/http'
import type {SysUserProfileDTO} from '@/types/system/user'
import type {SysUserPasswordDTO} from '@/types/auth/auth'

const userStore = useUserStore()
const router = useRouter()
const dialog = getDialogInstance()
const message = getMessageInstance()
const { t } = useI18n()
const formRef = ref<FormInst | null>(null)
const passwordFormRef = ref<FormInst | null>(null)
const uploadRef = ref<UploadInst | null>(null)
const fileList = ref<UploadFileInfo[]>([])
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

// 表单验证规则
const rules: FormRules = {
  nickName: [
    { required: true, message: t('settings.personal.nicknameRequired'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('settings.personal.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('settings.personal.emailInvalid'), trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: t('settings.personal.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('settings.personal.phoneInvalid'), trigger: 'blur' }
  ]
}

// 密码表单验证规则
const passwordRules: FormRules = {
  currentPassword: [
    { required: true, message: t('settings.personal.currentPasswordRequired'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('settings.personal.newPasswordRequired'), trigger: 'blur' },
    { min: 6, message: t('settings.personal.passwordLengthInvalid'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('settings.personal.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_, value) => value === passwordForm.newPassword,
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
  formRef.value?.validate(async (errors) => {
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
  passwordFormRef.value?.validate(async (errors) => {
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
          
          // 重置密码表单
          passwordForm.currentPassword = null
          passwordForm.newPassword = null
          passwordForm.confirmPassword = null
          
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

// 头像上传相关

const beforeAvatarUpload = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}): boolean => {
  const { file } = data
  
  // 验证文件类型
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.file?.type || '')) {
    message.error(t('settings.personal.avatarTypeError'))
    return false
  }
  
  // 验证文件大小 (2MB)
  if ((file.file?.size || 0) > 2 * 1024 * 1024) {
    message.error(t('settings.personal.avatarSizeError'))
    return false
  }
  
  return true
}

const customAvatarUpload = ({
  file,
  onFinish,
  onError
}: UploadCustomRequestOptions) => {
  // 这里应该调用后端API上传头像
  // 以下为模拟上传成功
  
  const reader = new FileReader()
  reader.readAsDataURL(file.file as File)
  reader.onload = () => {
    // 模拟上传成功，更新头像
    personalForm.avatar = reader.result as string
    message.success(t('settings.personal.avatarUploadSuccess'))
    onFinish()
  }
  reader.onerror = () => {
    onError()
    message.error(t('settings.personal.avatarUploadFail'))
  }
}

// 初始化表单数据
onMounted(async () => {
  // 刷新用户信息，确保数据是最新的
  await userStore.refreshUserInfo()
  initFormData()
})
</script>

<style scoped lang="scss">
.personal-settings {
  .profile-card {
    border-radius: 8px;
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
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