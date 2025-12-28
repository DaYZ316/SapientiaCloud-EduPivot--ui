<template>
  <div class="markdown-renderer">
    <div
        class="markdown-body custom-markdown"
        v-html="renderedContent"
        ref="contentRef"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, nextTick, onMounted, watch} from 'vue'
import {useMessage} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import type {Options} from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import markdownItKatex from '@traptitech/markdown-it-katex'
import 'katex/dist/katex.min.css'
import 'github-markdown-css/github-markdown.css'

// Props
const props = defineProps<{
  content: string
  options?: Options
  enableSanitize?: boolean
  maxLength?: number
}>()

// Refs
const contentRef = ref<HTMLElement>()

// 国际化
const {t} = useI18n()

// 消息提示
const messageApi = useMessage()

// 静态代码高亮函数
const highlightCode = (str: string, lang?: string): string => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(str, {language: lang}).value
      return `<pre class="hljs" data-lang="${lang}"><code class="language-${lang}">${highlighted}</code><button class="copy-button" type="button" title="复制代码"><svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button></pre>`
    } catch (err) {
      const escaped = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<pre class="hljs"><code>${escaped}</code></pre>`
    }
  }
  const escaped = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<pre class="hljs"><code>${escaped}</code></pre>`
}

// Markdown渲染器配置（静态渲染，禁用HTML）
const defaultOptions: Options = {
  html: false,        // 禁用HTML标签，提高安全性
  linkify: true,      // 自动识别URL
  typographer: true,  // 美化排版
  breaks: true,       // 换行符转换为<br>
  highlight: highlightCode
}

// 创建markdown-it实例
const md = new MarkdownIt({
  ...defaultOptions,
  ...props.options
})

// 启用 KaTeX 数学公式渲染
md.use(markdownItKatex)

// XSS 防护配置
const sanitizeConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'del', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'img', 'hr', 'span', 'div'],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'data-*', 'aria-*'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  KEEP_CONTENT: true,
  ADD_ATTR: ['target', 'rel']
}

// 内容长度限制
const truncateContent = (content: string): string => {
  if (props.maxLength && content.length > props.maxLength) {
    return content.substring(0, props.maxLength) + '...'
  }
  return content
}

// 规范化数学公式分隔符：允许 `$ ... $`、`$$ ... $$` 两端有多余空格
const normalizeMathDelimiters = (content: string): string => {
  if (!content) return content

  // 保护三反引号代码块不被处理
  const fenceParts = content.split(/(```[\s\S]*?```)/g)

  return fenceParts
    .map((part) => {
      // 代码块直接返回
      if (part.startsWith('```')) return part

      // 保护内联反引号
      const inlineParts = part.split(/(`[^`]*`)/g)
      return inlineParts
        .map((p) => {
          if (p.startsWith('`')) return p

          // 处理 $$...$$（展示公式），去除两端多余空白并保持换行
          let processed = p.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_m, g1) => {
            return `$$\n${g1.trim()}\n$$`
          })

          // 处理 $...$（行内公式），避免匹配已转义的 \$，去掉开/闭两端空格
          processed = processed.replace(/(^|[^\\])\$\s*([^\n\$][^\$]*?)\s*\$/g, (_m, pre, inner) => {
            return `${pre}$${inner.trim()}$`
          })

          return processed
        })
        .join('')
    })
    .join('')
}

// 静态渲染内容（不处理流式更新）
const renderedContent = computed(() => {
  if (!props.content) {
    return ''
  }

  try {
    // 内容长度限制
    const truncatedContent = truncateContent(props.content)
    // 规范化数学公式分隔符后再渲染 markdown
    const normalizedContent = normalizeMathDelimiters(truncatedContent)

    // 静态渲染 markdown
    let html = md.render(normalizedContent)

    // XSS 防护
    if (props.enableSanitize !== false) {
      html = DOMPurify.sanitize(html, sanitizeConfig)
    }

    return html
  } catch (e) {
    // 如果解析失败，显示原始内容（经过XSS防护）
    const safeContent = props.enableSanitize !== false
        ? DOMPurify.sanitize(props.content, sanitizeConfig)
        : props.content
    return safeContent
  }
})

// 复制代码块内容
const copyCodeBlock = async (codeBlock: HTMLElement) => {
  const codeElement = codeBlock.querySelector('code')
  if (!codeElement) return

  const codeText = codeElement.textContent || ''

  try {
    await navigator.clipboard.writeText(codeText)
    messageApi.success(t('chat.copySuccess'))
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = codeText
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      messageApi.success(t('chat.copySuccess'))
    } catch (fallbackErr) {
      messageApi.error('复制失败')
    }

    document.body.removeChild(textArea)
  }
}

// 生命周期钩子
onMounted(() => {
  addCopyButtonListeners()
})

// 监听内容变化，重新绑定事件
watch(renderedContent, () => {
  addCopyButtonListeners()
})

// 在内容更新后添加复制按钮事件监听
const addCopyButtonListeners = () => {
  nextTick(() => {
    if (!contentRef.value) return

    const codeBlocks = contentRef.value.querySelectorAll('pre[data-lang]')
    codeBlocks.forEach((block) => {
      const copyButton = block.querySelector('.copy-button')
      if (copyButton) {
        copyButton.addEventListener('click', () => copyCodeBlock(block as HTMLElement))
      }
    })
  })
}
</script>

<style lang="scss">
@use '@assets/styles/index.scss';

.markdown-renderer {
  width: 100%;

  // 覆盖 GitHub Markdown 样式，使用项目定义的变量
  .markdown-body {
    color: var(--markdown-text-color);
    background-color: var(--markdown-bg-color);

    // 标题样式
    h1, h2, h3, h4, h5, h6 {
      color: var(--markdown-heading-color);
      border-bottom-color: var(--markdown-border-color);
    }

    // 代码块样式（带圆角、语言标签与复制按钮占位）
    pre {
      background-color: var(--markdown-code-bg);
      border-radius: 10px;
      padding: 12px;
      padding-top: 34px; // 为语言标签和操作按钮留出空间
      position: relative;
      overflow: auto;
      margin: 1em 0;

      code {
        color: var(--markdown-code-text);
        background-color: transparent;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
        font-size: 16px;
        line-height: 1.7;
        white-space: pre;
      }
    }

    // 顶部语言标签（使用 pre[data-lang] 的 data-lang 属性）
    pre[data-lang]::before {
      /* 更明显的纯文字标签，使用主色并加大加粗、增加字间距与轻微阴影 */
      content: attr(data-lang);
      position: absolute;
      top: 12px;
      left: 14px;
      font-size: 18px;
      line-height: 1;
      padding: 0;
      background: transparent;
      color: var(--primary-color);
      border: none;
      /* box-shadow removed per request */
      pointer-events: none;
      z-index: 3;
      font-weight: 800;
      letter-spacing: 0.4px;
      text-transform: none;
      /* text-shadow removed per request */
    }

    // 复制按钮样式
    .copy-button {
      position: absolute;
      top: 10px;
      right: 12px;
      padding: 2px;
      border: none;
      background: transparent;
      color: var(--markdown-link-color);
      cursor: pointer;
      z-index: 3;
      opacity: 0.7;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        opacity: 1;
        color: var(--color-primary);
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }

      .copy-icon {
        fill: currentColor;
        width: 16px;
        height: 16px;
      }
    }

    // 小屏设备内边距微调
    @media (max-width: 480px) {
      pre {
      padding: 12px;
      padding-top: 40px;
      border-radius: 12px;
      }

      pre[data-lang]::before,
      pre[data-lang]::after {
        top: 6px;
        padding: 3px 6px;
        font-size: 11px;
      }
    }

    // Highlight.js 语法高亮颜色重写
    .hljs {
      background-color: var(--markdown-code-bg) !important;
      color: var(--markdown-code-text) !important;

      // 注释
      .hljs-comment,
      .hljs-quote {
        color: var(--text-secondary-color) !important;
      }

      // 关键字
      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-subst {
        color: var(--color-primary) !important;
      }

      // 字符串
      .hljs-string,
      .hljs-doctag {
        color: var(--success-color) !important;
      }

      // 数字
      .hljs-number,
      .hljs-literal {
        color: var(--warning-color) !important;
      }

      // 函数名
      .hljs-title,
      .hljs-section,
      .hljs-name,
      .hljs-type,
      .hljs-class .hljs-title {
        color: var(--color-primary-light) !important;
      }

      // 变量名
      .hljs-tag,
      .hljs-name,
      .hljs-attr {
        color: var(--color-primary-dark) !important;
      }

      // 运算符
      .hljs-operator,
      .hljs-punctuation {
        color: var(--text-secondary-color) !important;
      }

      // 内置函数/对象
      .hljs-built_in,
      .hljs-bullet {
        color: var(--info-color) !important;
      }

      // 正则表达式
      .hljs-regexp,
      .hljs-symbol {
        color: var(--error-color) !important;
      }

      // 强调/加粗
      .hljs-strong {
        font-weight: bold;
        color: var(--text-color) !important;
      }

      // 斜体
      .hljs-emphasis {
        font-style: italic;
        color: var(--text-color) !important;
      }

      // 删除线
      .hljs-deletion {
        text-decoration: line-through;
        color: var(--error-color) !important;
      }

      // 添加
      .hljs-addition {
        text-decoration: underline;
        color: var(--success-color) !important;
      }

      // 高亮
      .hljs-highlight {
        background-color: var(--background-secondary-color) !important;
      }
    }

    // 内联代码样式
    code {
      color: var(--markdown-code-text);
      background-color: var(--markdown-code-bg);
    }

    // 引用块样式
    blockquote {
      color: var(--markdown-text-secondary-color);
      border-left-color: var(--markdown-blockquote-border);
      background-color: var(--markdown-blockquote-bg);
    }

    // 分割线样式
    hr {
      height: 1px;
      border: none;
      background-color: var(--markdown-text-color);
      margin: 1em 0;
    }

    // 链接样式
    a {
      color: var(--markdown-link-color);

      &:hover {
        color: var(--markdown-link-hover-color);
      }
    }

    // 表格样式
    table {
      border-collapse: collapse;
      margin: 1em 0;
      border: 1px solid var(--markdown-table-border);
      background-color: var(--markdown-bg-color);

      th, td {
        border: 1px solid var(--markdown-table-border);
        padding: 6px 13px;
        text-align: left;
      }

      th {
        background-color: var(--markdown-table-header-bg);
        color: var(--markdown-text-color);
        font-weight: 600;
      }

      td {
        color: var(--markdown-text-color);
      }

      // 表格行交替背景色
      tbody tr:nth-child(even) {
        background-color: var(--background-secondary-color);
      }

      tbody tr:nth-child(odd) {
        background-color: var(--markdown-bg-color);
      }
    }

    // 容器样式 (适用于 ::: 语法块)
    .markdown-alert {
      &.markdown-alert-note {
        background-color: var(--markdown-container-note-bg);
        border-color: var(--markdown-container-note-border);
        color: var(--markdown-container-note-text);
      }

      &.markdown-alert-tip {
        background-color: var(--markdown-container-tip-bg);
        border-color: var(--markdown-container-tip-border);
        color: var(--markdown-container-tip-text);
      }

      &.markdown-alert-info {
        background-color: var(--markdown-container-info-bg);
        border-color: var(--markdown-container-info-border);
        color: var(--markdown-container-info-text);
      }

      &.markdown-alert-warning {
        background-color: var(--markdown-container-warning-bg);
        border-color: var(--markdown-container-warning-border);
        color: var(--markdown-container-warning-text);
      }

      &.markdown-alert-error {
        background-color: var(--markdown-container-error-bg);
        border-color: var(--markdown-container-error-border);
        color: var(--markdown-container-error-text);
      }

      &.markdown-alert-success {
        background-color: var(--markdown-container-success-bg);
        border-color: var(--markdown-container-success-border);
        color: var(--markdown-container-success-text);
      }
    }
  }
}

// KaTeX 数学公式样式调整
.markdown-renderer {
  .katex {
    color: var(--markdown-text-color);
  }

  .katex-display {
    color: var(--markdown-text-color);
  }
}
</style>