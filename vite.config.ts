import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import {defaultServerConfig, getProxyTarget} from './src/config/server'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            // 更改为更详细的路径别名配置
            '@': path.resolve(__dirname, './src'),
            '@api': path.resolve(__dirname, './src/api'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@components': path.resolve(__dirname, './src/components'),
            '@views': path.resolve(__dirname, './src/views'),
            '@router': path.resolve(__dirname, './src/router'),
            '@store': path.resolve(__dirname, './src/store'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@types': path.resolve(__dirname, './src/types'),
            '@i18n': path.resolve(__dirname, './src/i18n'),
            'three': path.resolve(__dirname, 'node_modules/three')
        }
    },
    optimizeDeps: {
        include: ['three']
    },
    server: {
        host: '0.0.0.0', // 允许外部访问
        port: 5173,
        strictPort: true, // 端口被占用时不会自动尝试下一个可用端口
        cors: true, // 启用CORS
        proxy: {
            // 配置代理 - 使用统一配置
            [defaultServerConfig.prefix]: {
                target: getProxyTarget(defaultServerConfig),
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path,
                configure: (proxy) => {
                    proxy.on('error', (err) => {
                        // Proxy error handling
                    });
                    proxy.on('proxyReq', (_proxyReq, req) => {
                        // Request logging
                    });
                    proxy.on('proxyRes', (proxyRes, req) => {
                        // Response logging
                    });
                }
            }
        }
    }
})
