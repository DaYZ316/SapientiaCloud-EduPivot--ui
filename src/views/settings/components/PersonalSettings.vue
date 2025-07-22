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
import { ref, computed, reactive, onMounted } from 'vue'
import type { FormInst, FormRules, UploadInst, UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'
import { useUserStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { updateUser } from '@/api/system/user'
import { getMessageInstance } from '@/utils/http'

const userStore = useUserStore()
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
const personalForm = reactive({
  username: '',
  nickName: '',
  email: '',
  mobile: '',
  gender: 0,
  avatar: '',
})

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
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

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
      validator: (_, value) => value === passwordForm.value.newPassword,
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
        if (!userInfo.value || !userInfo.value.id) {
          message.error(t('settings.personal.updateFail'))
          return
        }

        // 调用API更新用户信息
        const userData = {
          id: userInfo.value.id,
          nickName: personalForm.nickName,
          email: personalForm.email,
          mobile: personalForm.mobile,
          gender: personalForm.gender,
          avatar: personalForm.avatar
        }

        const res = await updateUser(userData)
        if (res.success && res.data) {
          message.success(t('settings.personal.updateSuccess'))
          
          // 更新本地存储的用户信息
          await userStore.refreshUserInfo()
        } else {
          message.error(t('settings.personal.updateFail'))
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
      // 这里应该调用后端API修改密码
      // 以下为模拟修改成功
      message.success(t('settings.personal.passwordChangeSuccess'))
      showPasswordModal.value = false
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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