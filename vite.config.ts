import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import postcssCustomProperties from 'postcss-custom-properties'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
      '#': resolve(__dirname, './types')
    }
  },
  server: {
    port: 3000,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://172.16.0.10:31602', // 认证服务地址
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/api/system': {
        target: 'http://172.16.0.10:31601', // 系统服务地址
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 不再使用additionalData注入变量，改为在各组件中使用@use导入
      }
    },
    postcss: {
      plugins: [
        postcssCustomProperties({
          preserve: true
        })
      ]
    }
  }
})
