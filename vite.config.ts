import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import {fileURLToPath} from 'url'
import {copyFileSync, mkdirSync, existsSync, readdirSync} from 'fs'
import {defaultServerConfig, getProxyTarget} from './src/config/server'

// 获取当前文件的目录路径（ESM 兼容）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 复制 3D 模型文件的插件
function copy3DModelsPlugin() {
    return {
        name: 'copy-3d-models',
        writeBundle() {
            const srcDir = path.resolve(__dirname, 'src/assets/3Dmodel')
            const destDir = path.resolve(__dirname, 'dist/assets/3Dmodel')
            
            if (!existsSync(srcDir)) {
                console.warn('3D模型源目录不存在:', srcDir)
                return
            }
            
            function copyRecursive(src: string, dest: string) {
                if (!existsSync(dest)) {
                    mkdirSync(dest, {recursive: true})
                }
                
                const entries = readdirSync(src, {withFileTypes: true, encoding: 'utf8'})
                
                for (const entry of entries) {
                    const srcPath = path.join(src, entry.name)
                    const destPath = path.join(dest, entry.name)
                    
                    if (entry.isDirectory()) {
                        copyRecursive(srcPath, destPath)
                    } else {
                        try {
                            copyFileSync(srcPath, destPath)
                            console.log('已复制 3D 模型文件:', entry.name)
                        } catch (copyError) {
                            console.error('复制文件失败:', entry.name, copyError)
                        }
                    }
                }
            }
            
            try {
                console.log('开始复制 3D 模型文件...')
                copyRecursive(srcDir, destDir)
                console.log('3D 模型文件复制完成')
            } catch (error) {
                console.error('复制 3D 模型文件失败:', error)
            }
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), copy3DModelsPlugin()],
    define: {
        global: 'globalThis',
    },
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
            'three': path.resolve(__dirname, 'node_modules/three'),
            // 修复 @vue-office 包的入口点问题
            '@vue-office/pdf': path.resolve(__dirname, 'node_modules/@vue-office/pdf/lib/v3/index.js'),
            '@vue-office/docx': path.resolve(__dirname, 'node_modules/@vue-office/docx/lib/v3/index.js'),
            '@vue-office/excel': path.resolve(__dirname, 'node_modules/@vue-office/excel/lib/v3/index.js'),
            '@vue-office/pptx': path.resolve(__dirname, 'node_modules/@vue-office/pptx/lib/v3/index.js')
        },
        dedupe: ['vue', 'vue-router']
    },
    optimizeDeps: {
        include: [
            'three',
            '@vue-office/pdf',
            '@vue-office/docx',
            '@vue-office/excel',
            '@vue-office/pptx'
        ],
        force: true,
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/, /@vue-office/],
            transformMixedEsModules: true
        },
        rollupOptions: {
            external: [],
            output: {
                manualChunks: {
                    'vue-office': ['@vue-office/pdf', '@vue-office/docx', '@vue-office/excel', '@vue-office/pptx']
                }
            }
        }
    },
    assetsInclude: ['**/*.gltf', '**/*.bin'],
    publicDir: 'public',
    server: {
        host: '0.0.0.0', // 允许外部访问
        port: 80,
        strictPort: true, // 端口被占用时不会自动尝试下一个可用端口
        cors: true, // 启用CORS
        proxy: {
            // 配置代理 - 使用统一配置
            [defaultServerConfig.prefix]: {
                target: getProxyTarget(defaultServerConfig),
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path,
                bypass(req) {
                    // 检查请求头，区分API请求和浏览器直接访问
                    // API请求（axios）的Accept头通常是application/json或*/*
                    // 浏览器直接访问的Accept头通常是text/html
                    const accept = (req.headers.accept || '').toLowerCase()
                    if (req.url?.startsWith('/api/auth/oauth2/callback/')) {
                        // 如果Accept头包含text/html，说明是浏览器直接访问，由前端路由处理
                        if (accept.includes('text/html')) {
                            return req.url
                        }
                        // 否则是API请求，正常代理到后端（返回null或undefined）
                        return null
                    }
                },
                configure: (proxy) => {
                    proxy.on('error', () => {
                        // Proxy error handling
                    });
                    proxy.on('proxyReq', () => {
                        // Request logging
                    });
                    proxy.on('proxyRes', () => {
                        // Response logging
                    });
                }
            },
            // 代理celestial-hub服务
            '/celestial-hub': {
                target: getProxyTarget(defaultServerConfig),
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path,
                configure: (proxy) => {
                    proxy.on('error', () => {
                        // Proxy error handling
                    });
                    proxy.on('proxyReq', () => {
                        // Request logging
                    });
                    proxy.on('proxyRes', () => {
                        // Response logging
                    });
                }
            }
        }
    }
})
