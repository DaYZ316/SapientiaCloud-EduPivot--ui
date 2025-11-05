<template>
  <div class="oauth-redirect-container"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { oauth2Callback } from '@/api/auth/oauth2'
import { useUserStore, useTransitionStore } from '@/store'
import { useMessage } from 'naive-ui'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const transitionStore = useTransitionStore()
const message = useMessage()

// 处理OAuth回调
const handleOAuthCallback = async () => {
  // 显示过渡动画
  transitionStore.show()
  
  // 从路由参数中获取provider
  const provider = route.params.provider as string
  
  // 从URL查询参数中获取code和state
  const code = route.query.code as string | undefined
  const state = route.query.state as string | undefined

  // 验证必要参数
  if (!code || !state) {
    transitionStore.hide(1250)
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return
  }

  // 调用后端API处理回调
  const result = await oauth2Callback(provider, code, state).catch(() => {
    return null
  })

  if (result && result.success && result.data) {
    // 如果返回了accessToken，设置登录状态
    const accessToken = result.data.accessToken || (result.data as any).accessToken
    if (accessToken) {
      // 设置登录状态
      userStore.setLoginState(accessToken)
      
      // 刷新用户信息
      await userStore.refreshUserInfo()
      
      message.success(t('auth.loginSuccess'))
      
      // 隐藏过渡动画，确保至少持续1秒
      transitionStore.hide(1250)
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      transitionStore.hide(1250)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } else {
    transitionStore.hide(1250)
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}

onMounted(() => {
  handleOAuthCallback()
})
</script>

<style lang="scss" scoped>
.oauth-redirect-container {
  min-height: 100vh;
  background: var(--background-color);
}
</style>

