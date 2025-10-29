<template>
  <div class="markdown-renderer">
    <div
        class="markdown-body custom-markdown"
        v-html="renderedContent"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import MarkdownIt from 'markdown-it'
import type {Options} from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import DOMPurify from 'dompurify'

// Props
const props = defineProps<{
  content: string
  options?: Options
  enableSanitize?: boolean
  maxLength?: number
}>()

// 静态代码高亮函数
const highlightCode = (str: string, lang?: string): string => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(str, {language: lang}).value
      return `<pre class="hljs" data-lang="${lang}"><code class="language-${lang}">${highlighted}</code></pre>`
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

// 静态渲染内容（不处理流式更新）
const renderedContent = computed(() => {
  if (!props.content) {
    return ''
  }

  try {
    // 内容长度限制
    const truncatedContent = truncateContent(props.content)

    // 静态渲染 markdown
    let html = md.render(truncatedContent)

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
</script>

<style lang="scss">
@use '@/assets/styles' as *;

.markdown-renderer {
  width: 100%;
  padding: 0;

  .markdown-body.custom-markdown {
    // 基础样式
    font-size: var(--markdown-font-size);
    line-height: var(--markdown-line-height);
    color: var(--markdown-text-color);
    background-color: var(--markdown-bg-color);
    padding: 0;
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;

    // 标题样式
    h1, h2, h3, h4, h5, h6 {
      color: var(--markdown-heading-color);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 16px;
      line-height: 1.25;
    }

    h1 {
      font-size: 2em;
      border-bottom: 1px solid var(--markdown-border-color);
      padding-bottom: 0.3em;
    }

    h2 {
      font-size: 1.5em;
      border-bottom: 1px solid var(--markdown-border-color);
      padding-bottom: 0.3em;
    }

    h3 {
      font-size: 1.25em;
    }

    h4 {
      font-size: 1em;
    }

    h5 {
      font-size: 0.875em;
    }

    h6 {
      font-size: 0.85em;
      color: var(--markdown-text-secondary-color);
    }

    // 段落和文本样式
    p {
      margin-bottom: 16px;
    }

    a {
      color: var(--markdown-link-color);
      text-decoration: none;

      &:hover {
        color: var(--markdown-link-hover-color);
        text-decoration: underline;
      }
    }

    strong {
      font-weight: 600;
    }

    em {
      font-style: italic;
    }

    del {
      text-decoration: line-through;
    }

    // 代码样式
    code {
      background-color: var(--markdown-code-bg);
      color: var(--markdown-code-text);
      padding: 0.2em 0.4em;
      font-size: 85%;
      border-radius: 6px;
    }

    pre {
      background-color: var(--markdown-code-bg);
      color: var(--markdown-code-text);
      padding: 16px;
      border-radius: 6px;
      overflow: auto;
      margin: 16px 0;

      code {
        background: none;
        padding: 0;
        font-size: 85%;
      }
    }

    // 引用块样式
    blockquote {
      padding: 0 1em;
      color: var(--markdown-text-secondary-color);
      border-left: 0.25em solid var(--markdown-blockquote-border);
      background-color: var(--markdown-blockquote-bg);
      margin: 0 0 16px 0;
    }

    // 列表样式
    ul, ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }

    li {
      margin-bottom: 0.25em;
    }

    // 表格样式
    table {
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      margin-bottom: 16px;

      th, td {
        padding: 6px 13px;
        border: 1px solid var(--markdown-table-border);
      }

      th {
        background-color: var(--markdown-table-header-bg);
        font-weight: 600;
      }

      tr:nth-child(2n) {
        background-color: var(--markdown-table-header-bg);
      }
    }

    // 其他元素
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: var(--markdown-border-color);
      border: 0;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
    }

    // 响应式设计
    @media (max-width: 1200px) {
      max-width: 100%;
      padding: 0 20px;
    }

    @media (max-width: 768px) {
      padding: 0 15px;
      font-size: 14px;

      h1 {
        font-size: 1.8em;
      }
      h2 {
        font-size: 1.4em;
      }
      h3 {
        font-size: 1.2em;
      }

      pre {
        padding: 12px;
        font-size: 80%;
      }

      table {
        font-size: 14px;

        th, td {
          padding: 4px 8px;
        }
      }
    }

    @media (max-width: 480px) {
      padding: 0 10px;
      font-size: 13px;

      h1 {
        font-size: 1.6em;
      }
      h2 {
        font-size: 1.3em;
      }
      h3 {
        font-size: 1.1em;
      }

      pre {
        padding: 8px;
        font-size: 75%;
      }

      table {
        font-size: 12px;

        th, td {
          padding: 2px 4px;
        }
      }

      a {
        min-height: 44px;
        display: inline-block;
        line-height: 44px;
      }
    }

    // 打印样式
    @media print {
      background: white !important;
      color: black !important;

      pre {
        background: #f5f5f5 !important;
        color: black !important;
      }
    }

    // 高对比度模式
    @media (prefers-contrast: high) {
      --markdown-text-color: #000000;
      --markdown-heading-color: #000000;
      --markdown-link-color: #0000ff;
      --markdown-border-color: #000000;
    }

    // 减少动画效果
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  }
}
</style>