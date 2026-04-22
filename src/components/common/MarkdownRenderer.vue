<template>
  <div class="markdown-renderer">
    <div
      v-if="props.streaming === true"
      ref="contentRef"
      class="markdown-body custom-markdown"
    >
      <div
        v-if="stableRenderedContent"
        class="markdown-stream-stable"
        v-html="stableRenderedContent"
      ></div>
      <span v-for="segment in streamTailSegments" :key="segment.id" class="markdown-stream-tail">{{ segment.text }}</span>
      <span
        v-if="hasBlockedStreamTail && streamPlaceholderMode === 'inline'"
        class="markdown-stream-placeholder markdown-stream-placeholder--inline"
        aria-hidden="true"
      >
        <span class="markdown-stream-placeholder__chip markdown-stream-placeholder__chip--long"></span>
        <span class="markdown-stream-placeholder__chip markdown-stream-placeholder__chip--medium"></span>
        <span class="markdown-stream-placeholder__chip markdown-stream-placeholder__chip--short"></span>
      </span>
      <div
        v-if="hasBlockedStreamTail && streamPlaceholderMode === 'block'"
        class="markdown-stream-placeholder markdown-stream-placeholder--block"
        aria-hidden="true"
      >
        <span class="markdown-stream-placeholder__line markdown-stream-placeholder__line--short"></span>
        <span class="markdown-stream-placeholder__line markdown-stream-placeholder__line--long"></span>
        <span class="markdown-stream-placeholder__line markdown-stream-placeholder__line--medium"></span>
      </div>
    </div>
    <div
      v-else
      ref="contentRef"
      class="markdown-body custom-markdown"
      v-html="renderedContent"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useMessage} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import type {Options} from 'markdown-it'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import markdownItKatex from '@traptitech/markdown-it-katex'
import 'katex/dist/katex.min.css'
import 'github-markdown-css/github-markdown.css'

const props = defineProps<{
  content: string
  options?: Options
  enableSanitize?: boolean
  maxLength?: number
  streaming?: boolean
}>()

const contentRef = ref<HTMLElement>()
const renderedContent = ref('')
const stableRenderedContent = ref('')
const lastRenderedSourceContent = ref('')
const committedSourceContent = ref('')
const tailSourceContent = ref('')
const blockedTailSourceContent = ref('')
const blockedTailKind = ref<StreamBlockedKind | null>(null)
const streamTailSegments = ref<Array<{ id: number; text: string }>>([])
const {t} = useI18n()
const messageApi = useMessage()
const STREAM_RENDER_INTERVAL = 48
let pendingRenderedSource = ''
let streamRenderTimerId: number | null = null
let streamTailSegmentId = 0

type StreamBlockedKind = 'fence' | 'inline-code' | 'math-block' | 'math-inline' | 'link'

type StreamTailAnalysis = {
  committedSource: string
  visibleTailSource: string
  blockedTailSource: string
  blockedTailKind: StreamBlockedKind | null
}

const highlightCode = (str: string, lang?: string): string => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(str, {language: lang}).value
      return `<pre class="hljs" data-lang="${lang}"><code class="language-${lang}">${highlighted}</code><button class="copy-button" type="button" title="复制代码"><svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button></pre>`
    } catch {
      const escaped = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<pre class="hljs"><code>${escaped}</code></pre>`
    }
  }

  const escaped = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<pre class="hljs"><code>${escaped}</code></pre>`
}

const defaultOptions: Options = {
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: highlightCode
}

const md = new MarkdownIt({
  ...defaultOptions,
  ...props.options
})

md.use(markdownItKatex)

const sanitizeConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'del', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'img', 'hr', 'span', 'div'],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'data-*', 'aria-*'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  KEEP_CONTENT: true,
  ADD_ATTR: ['target', 'rel']
}

const truncateContent = (content: string): string => {
  if (props.maxLength && content.length > props.maxLength) {
    return content.substring(0, props.maxLength) + '...'
  }
  return content
}

const normalizeMathDelimiters = (content: string): string => {
  if (!content) {
    return content
  }

  const displayMathPattern = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g
  const fenceParts = content.split(/(```[\s\S]*?```)/g)

  return fenceParts
      .map((part) => {
        if (part.startsWith('```')) {
          return part
        }

        const inlineParts = part.split(/(`[^`]*`)/g)
        return inlineParts
            .map((piece) => {
              if (piece.startsWith('`')) {
                return piece
              }

              const displayParts = piece.split(displayMathPattern)
              return displayParts
                  .map((segment) => {
                    if (!segment) {
                      return segment
                    }

                    if (segment.startsWith('$$') && segment.endsWith('$$')) {
                      const mathContent = segment.slice(2, -2).trim()
                      return `\n\n$$\n${mathContent}\n$$\n\n`
                    }

                    if (segment.startsWith('\\[') && segment.endsWith('\\]')) {
                      const mathContent = segment.slice(2, -2).trim()
                      return `\n\n\\[\n${mathContent}\n\\]\n\n`
                    }

                    return segment.replace(/(^|[^\\])\$\s*([^\n\$][^\$]*?)\s*\$/g, (_match, prefix, inner) => {
                      return `${prefix}$${inner.trim()}$`
                    })
                  })
                  .join('')
            })
            .join('')
      })
      .join('')
}

const wrapTables = (html: string): string => {
  if (!html || !html.includes('<table')) {
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild

  if (!root) {
    return html
  }

  root.querySelectorAll('table').forEach((table) => {
    if (table.parentElement?.classList.contains('markdown-table-wrapper')) {
      return
    }

    const wrapper = doc.createElement('div')
    wrapper.className = 'markdown-table-wrapper'
    table.parentNode?.insertBefore(wrapper, table)
    wrapper.appendChild(table)
  })

  return root.innerHTML
}

const renderMarkdownContent = (content: string): string => {
  try {
    const truncatedContent = truncateContent(content)
    const normalizedContent = normalizeMathDelimiters(truncatedContent)
    let html = wrapTables(md.render(normalizedContent))

    if (props.enableSanitize !== false) {
      html = DOMPurify.sanitize(html, sanitizeConfig)
    }

    return html
  } catch {
    return props.enableSanitize !== false
        ? DOMPurify.sanitize(content, sanitizeConfig)
        : content
  }
}

const clearStreamRenderTimer = () => {
  if (streamRenderTimerId !== null) {
    window.clearTimeout(streamRenderTimerId)
    streamRenderTimerId = null
  }
}

const hasBlockedStreamTail = computed(() => blockedTailSourceContent.value.length > 0)

const streamPlaceholderMode = computed<'inline' | 'block'>(() => {
  return blockedTailKind.value === 'fence' || blockedTailKind.value === 'math-block'
      ? 'block'
      : 'inline'
})

const resetStreamingSegments = () => {
  stableRenderedContent.value = ''
  committedSourceContent.value = ''
  tailSourceContent.value = ''
  blockedTailSourceContent.value = ''
  blockedTailKind.value = null
  streamTailSegments.value = []
}

const appendStreamTailSegment = (content: string) => {
  if (!content) {
    return
  }

  streamTailSegments.value = [
    ...streamTailSegments.value,
    {
      id: streamTailSegmentId++,
      text: content
    }
  ]
  tailSourceContent.value += content
}

const findSafeStreamingCommitIndex = (content: string): number => {
  if (!content) {
    return 0
  }

  let commitIndex = 0
  const closedFencePattern = /```[\w-]*\r?\n[\s\S]*?\r?\n```/g
  let match: RegExpExecArray | null = null

  while ((match = closedFencePattern.exec(content)) !== null) {
    commitIndex = Math.max(commitIndex, match.index + match[0].length)
  }

  const paragraphBoundaryIndex = content.lastIndexOf('\n\n')
  if (paragraphBoundaryIndex >= 0) {
    commitIndex = Math.max(commitIndex, paragraphBoundaryIndex + 2)
  }

  return commitIndex
}

const isEscapedCharacter = (content: string, index: number): boolean => {
  if (index <= 0) {
    return false
  }

  let slashCount = 0
  for (let cursor = index - 1; cursor >= 0 && content[cursor] === '\\'; cursor--) {
    slashCount += 1
  }

  return slashCount % 2 === 1
}

const isLikelyInlineMathDelimiter = (content: string, index: number): boolean => {
  const prevChar = index > 0 ? content[index - 1] : ''
  const nextChar = index + 1 < content.length ? content[index + 1] : ''

  if (!nextChar || nextChar === '$' || /\s/.test(nextChar)) {
    return false
  }

  if (/\d/.test(prevChar) && /\d/.test(nextChar)) {
    return false
  }

  return true
}

const findBlockedStreamTail = (content: string): { start: number; kind: StreamBlockedKind } | null => {
  if (!content) {
    return null
  }

  let fenceStart: number | null = null
  let inlineCodeStart: number | null = null
  let mathBlockState: { start: number; closing: '$$' | '\\]' } | null = null
  let mathInlineState: { start: number; closing: '$' | '\\)' } | null = null
  let linkUrlStart: number | null = null
  const linkLabelStarts: number[] = []

  for (let index = 0; index < content.length; index++) {
    if (fenceStart !== null) {
      if (content.startsWith('```', index) && !isEscapedCharacter(content, index)) {
        fenceStart = null
        index += 2
      }
      continue
    }

    if (inlineCodeStart !== null) {
      if (content[index] === '`' && !isEscapedCharacter(content, index)) {
        inlineCodeStart = null
      }
      continue
    }

    if (mathBlockState !== null) {
      if (mathBlockState.closing === '$$' && content.startsWith('$$', index) && !isEscapedCharacter(content, index)) {
        mathBlockState = null
        index += 1
        continue
      }
      if (mathBlockState.closing === '\\]' && content.startsWith('\\]', index) && !isEscapedCharacter(content, index)) {
        mathBlockState = null
        index += 1
        continue
      }
      continue
    }

    if (mathInlineState !== null) {
      if (mathInlineState.closing === '$' && content[index] === '$' && !isEscapedCharacter(content, index)) {
        mathInlineState = null
        continue
      }
      if (mathInlineState.closing === '\\)' && content.startsWith('\\)', index) && !isEscapedCharacter(content, index)) {
        mathInlineState = null
        index += 1
        continue
      }
      continue
    }

    if (linkUrlStart !== null) {
      if (content[index] === ')' && !isEscapedCharacter(content, index)) {
        linkUrlStart = null
      }
      continue
    }

    if (content.startsWith('```', index) && !isEscapedCharacter(content, index)) {
      fenceStart = index
      index += 2
      continue
    }

    if (content.startsWith('$$', index) && !isEscapedCharacter(content, index)) {
      mathBlockState = {
        start: index,
        closing: '$$'
      }
      index += 1
      continue
    }

    if (content.startsWith('\\[', index) && !isEscapedCharacter(content, index)) {
      mathBlockState = {
        start: index,
        closing: '\\]'
      }
      index += 1
      continue
    }

    if (content.startsWith('\\(', index) && !isEscapedCharacter(content, index)) {
      mathInlineState = {
        start: index,
        closing: '\\)'
      }
      index += 1
      continue
    }

    if (content[index] === '$' && !isEscapedCharacter(content, index) && isLikelyInlineMathDelimiter(content, index)) {
      mathInlineState = {
        start: index,
        closing: '$'
      }
      continue
    }

    if (content[index] === '`' && !isEscapedCharacter(content, index)) {
      inlineCodeStart = index
      continue
    }

    if (content[index] === '[' && !isEscapedCharacter(content, index)) {
      linkLabelStarts.push(index)
      continue
    }

    if (content[index] === ']' && !isEscapedCharacter(content, index) && linkLabelStarts.length > 0) {
      const labelStart = linkLabelStarts.pop() ?? index
      if (content[index + 1] === '(') {
        linkUrlStart = labelStart
        index += 1
      }
      continue
    }
  }

  const blockedCandidates: Array<{ start: number; kind: StreamBlockedKind }> = []

  if (fenceStart !== null) {
    blockedCandidates.push({start: fenceStart, kind: 'fence'})
  }
  if (inlineCodeStart !== null) {
    blockedCandidates.push({start: inlineCodeStart, kind: 'inline-code'})
  }
  if (mathBlockState !== null) {
    blockedCandidates.push({start: mathBlockState.start, kind: 'math-block'})
  }
  if (mathInlineState !== null) {
    blockedCandidates.push({start: mathInlineState.start, kind: 'math-inline'})
  }
  if (linkUrlStart !== null) {
    blockedCandidates.push({start: linkUrlStart, kind: 'link'})
  }
  if (linkLabelStarts.length > 0) {
    blockedCandidates.push({start: linkLabelStarts[linkLabelStarts.length - 1], kind: 'link'})
  }

  if (blockedCandidates.length === 0) {
    return null
  }

  return blockedCandidates.reduce((earliest, candidate) => {
    return candidate.start < earliest.start ? candidate : earliest
  })
}

const analyzeStreamingTail = (content: string, minimumCommittedLength = 0): StreamTailAnalysis => {
  const normalizedMinimumCommittedLength = Math.min(
      Math.max(minimumCommittedLength, 0),
      content.length
  )
  const incrementalTail = content.slice(normalizedMinimumCommittedLength)
  const blockedTail = findBlockedStreamTail(incrementalTail)

  if (blockedTail) {
    const blockedStart = normalizedMinimumCommittedLength + blockedTail.start
    return {
      committedSource: content.slice(0, blockedStart),
      visibleTailSource: '',
      blockedTailSource: content.slice(blockedStart),
      blockedTailKind: blockedTail.kind
    }
  }

  const commitIndex = normalizedMinimumCommittedLength + findSafeStreamingCommitIndex(incrementalTail)
  return {
    committedSource: content.slice(0, commitIndex),
    visibleTailSource: content.slice(commitIndex),
    blockedTailSource: '',
    blockedTailKind: null
  }
}

const rebuildStreamingState = (content: string) => {
  const nextSourceContent = content || ''
  const nextStreamState = analyzeStreamingTail(nextSourceContent)

  committedSourceContent.value = nextStreamState.committedSource
  stableRenderedContent.value = nextStreamState.committedSource
      ? renderMarkdownContent(nextStreamState.committedSource)
      : ''
  tailSourceContent.value = nextStreamState.visibleTailSource
  blockedTailSourceContent.value = nextStreamState.blockedTailSource
  blockedTailKind.value = nextStreamState.blockedTailKind
  streamTailSegments.value = nextStreamState.visibleTailSource
    ? [{id: streamTailSegmentId++, text: nextStreamState.visibleTailSource}]
    : []
  lastRenderedSourceContent.value = nextSourceContent
}

const applyStreamingRenderedContent = (content: string) => {
  const nextSourceContent = content || ''

  if (nextSourceContent === lastRenderedSourceContent.value) {
    return
  }

  if (!nextSourceContent.startsWith(lastRenderedSourceContent.value)) {
    rebuildStreamingState(nextSourceContent)
    return
  }

  // Keep the committed prefix monotonic to avoid rendered markdown regressing back to raw source.
  const nextStreamState = analyzeStreamingTail(nextSourceContent, committedSourceContent.value.length)
  const nextCommittedSource = nextStreamState.committedSource

  if (nextCommittedSource !== committedSourceContent.value) {
    committedSourceContent.value = nextCommittedSource
    stableRenderedContent.value = renderMarkdownContent(nextCommittedSource)
  }

  blockedTailSourceContent.value = nextStreamState.blockedTailSource
  blockedTailKind.value = nextStreamState.blockedTailKind

  if (nextStreamState.blockedTailSource) {
    tailSourceContent.value = ''
    streamTailSegments.value = []
    lastRenderedSourceContent.value = nextSourceContent
    return
  }

  if (!nextStreamState.visibleTailSource.startsWith(tailSourceContent.value)) {
    tailSourceContent.value = nextStreamState.visibleTailSource
    streamTailSegments.value = nextStreamState.visibleTailSource
      ? [{id: streamTailSegmentId++, text: nextStreamState.visibleTailSource}]
      : []
    lastRenderedSourceContent.value = nextSourceContent
    return
  }

  appendStreamTailSegment(nextStreamState.visibleTailSource.slice(tailSourceContent.value.length))
  lastRenderedSourceContent.value = nextSourceContent
}

const applyRenderedContent = (content: string) => {
  const nextSourceContent = content || ''

  if (props.streaming === true) {
    applyStreamingRenderedContent(nextSourceContent)
    return
  }

  resetStreamingSegments()
  const nextRenderedContent = nextSourceContent ? renderMarkdownContent(nextSourceContent) : ''
  if (nextRenderedContent !== renderedContent.value) {
    renderedContent.value = nextRenderedContent
  }
  lastRenderedSourceContent.value = nextSourceContent
}

const scheduleRenderedContent = (content: string, immediate = false) => {
  pendingRenderedSource = content

  if (immediate || props.streaming !== true) {
    clearStreamRenderTimer()
    applyRenderedContent(pendingRenderedSource)
    return
  }

  if (streamRenderTimerId !== null) {
    return
  }

  streamRenderTimerId = window.setTimeout(() => {
    streamRenderTimerId = null
    applyRenderedContent(pendingRenderedSource)
  }, STREAM_RENDER_INTERVAL)
}

const copyCodeBlock = async (codeBlock: HTMLElement) => {
  const codeElement = codeBlock.querySelector('code')
  if (!codeElement) {
    return
  }

  const codeText = codeElement.textContent || ''

  try {
    await navigator.clipboard.writeText(codeText)
    messageApi.success(t('chat.copySuccess'))
  } catch {
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
    } catch {
      messageApi.error('复制失败')
    }

    document.body.removeChild(textArea)
  }
}

const addCopyButtonListeners = () => {
  nextTick(() => {
    if (!contentRef.value) {
      return
    }

    const codeBlocks = contentRef.value.querySelectorAll('pre[data-lang]')
    codeBlocks.forEach((block) => {
      const copyButton = block.querySelector('.copy-button') as HTMLButtonElement | null
      if (!copyButton || copyButton.dataset.bound === 'true') {
        return
      }

      copyButton.dataset.bound = 'true'
      copyButton.addEventListener('click', () => copyCodeBlock(block as HTMLElement))
    })
  })
}

onMounted(() => {
  if (renderedContent.value) {
    addCopyButtonListeners()
  }
})

watch([renderedContent, stableRenderedContent], ([html, stableHtml]) => {
  if (!html && !stableHtml) {
    return
  }
  addCopyButtonListeners()
})

watch(
    () => props.content,
    (content) => {
      scheduleRenderedContent(content || '')
    },
    {immediate: true}
)

watch(
    () => props.streaming,
    (streaming, previousStreaming) => {
      if (streaming !== true && previousStreaming === true) {
        scheduleRenderedContent(props.content || '', true)
      }
    }
)

onUnmounted(() => {
  clearStreamRenderTimer()
})
</script>

<style lang="scss">
@use '@assets/styles/index.scss';

.markdown-renderer {
  width: 100%;
  max-width: none;
  margin: 0;
  box-sizing: border-box;

  .markdown-body {
    margin: 0;
    color: var(--markdown-text-color);
    background-color: var(--markdown-bg-color);
    font-family: var(--markdown-font-family);
    font-size: var(--markdown-font-size);
    line-height: var(--markdown-line-height);
    letter-spacing: var(--markdown-letter-spacing);
    font-weight: 450;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    > *:first-child {
      margin-top: 0;
    }

    > *:last-child {
      margin-bottom: 0;
    }

    p,
    ul,
    ol,
    blockquote,
    pre,
    .markdown-table-wrapper {
      margin-top: 0;
      margin-bottom: 1em;
    }

    p {
      color: var(--markdown-text-color);
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--markdown-heading-color);
      border-bottom-color: var(--markdown-border-color);
      font-family: var(--markdown-heading-font-family);
      font-weight: 700;
      line-height: 1.24;
      letter-spacing: var(--markdown-heading-letter-spacing);
      margin-top: 1.2em;
      margin-bottom: 0.7em;
    }

    h1 {
      font-size: clamp(28px, 1.4vw + 20px, 34px);
    }

    h2 {
      font-size: clamp(24px, 1vw + 18px, 28px);
    }

    h3 {
      font-size: clamp(20px, 0.7vw + 17px, 24px);
    }

    h4,
    h5,
    h6 {
      font-size: clamp(17px, 0.3vw + 16px, 19px);
    }

    strong {
      font-weight: 700;
      color: var(--markdown-heading-color);
    }

    ul,
    ol {
      padding-left: 1.4em;
    }

    li + li {
      margin-top: 0.28em;
    }

    pre {
      position: relative;
      overflow: auto;
      padding: 16px;
      padding-top: 42px;
      border: 1px solid color-mix(in srgb, var(--markdown-border-color) 86%, transparent);
      border-radius: 18px;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--markdown-code-bg) 90%, var(--background-color)) 0%,
          color-mix(in srgb, var(--markdown-code-bg) 100%, var(--background-color)) 100%
        );
      box-shadow: 0 16px 36px color-mix(in srgb, var(--shadow-secondary-color) 70%, transparent);
    }

    pre[data-lang='latex'] {
      overflow: hidden;
    }

    pre[data-lang='latex'] code {
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: anywhere;
    }

    pre[data-lang]::before {
      content: attr(data-lang);
      position: absolute;
      top: 14px;
      left: 16px;
      padding: 6px 10px;
      border: 1px solid color-mix(in srgb, var(--color-primary) 18%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      color: var(--color-primary-dark);
      font-size: 12px;
      line-height: 1;
      font-weight: 700;
      letter-spacing: 0.08em;
      z-index: 3;
      pointer-events: none;
    }

    .copy-button {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: color-mix(in srgb, var(--background-color) 76%, transparent);
      color: var(--markdown-link-color);
      cursor: pointer;
      z-index: 3;
      opacity: 0.82;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);

      &:hover {
        opacity: 1;
        color: var(--color-primary);
        border-color: color-mix(in srgb, var(--color-primary) 22%, transparent);
        transform: translateY(-1px);
      }

      &:active {
        transform: scale(0.96);
      }

      .copy-icon {
        fill: currentColor;
        width: 16px;
        height: 16px;
      }
    }

    .hljs {
      background-color: var(--markdown-code-bg) !important;
      color: var(--markdown-code-text) !important;
    }

    .hljs-comment,
    .hljs-quote {
      color: var(--text-secondary-color) !important;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-subst {
      color: var(--color-primary) !important;
    }

    .hljs-string,
    .hljs-doctag {
      color: var(--success-color) !important;
    }

    .hljs-number,
    .hljs-literal {
      color: var(--warning-color) !important;
    }

    .hljs-title,
    .hljs-section,
    .hljs-type,
    .hljs-class .hljs-title {
      color: var(--color-primary-light) !important;
    }

    .hljs-tag,
    .hljs-name,
    .hljs-attr {
      color: var(--color-primary-dark) !important;
    }

    .hljs-operator,
    .hljs-punctuation {
      color: var(--text-secondary-color) !important;
    }

    .hljs-built_in,
    .hljs-bullet {
      color: var(--info-color) !important;
    }

    .hljs-regexp,
    .hljs-symbol {
      color: var(--error-color) !important;
    }

    .hljs-strong {
      font-weight: 700;
      color: var(--text-color) !important;
    }

    .hljs-emphasis {
      font-style: italic;
      color: var(--text-color) !important;
    }

    .hljs-deletion {
      text-decoration: line-through;
      color: var(--error-color) !important;
    }

    .hljs-addition {
      text-decoration: underline;
      color: var(--success-color) !important;
    }

    .hljs-highlight {
      background-color: var(--background-secondary-color) !important;
    }

    code {
      color: var(--markdown-code-text);
      background: color-mix(in srgb, var(--markdown-code-bg) 90%, var(--background-color));
      font-family: var(--markdown-code-font-family);
      padding: 0.16em 0.42em;
      border-radius: 8px;
      font-size: 0.92em;
    }

    pre code {
      padding: 0;
      border-radius: 0;
      background: transparent;
      font-size: 14px;
      line-height: 1.82;
      white-space: pre;
    }

    blockquote {
      color: var(--markdown-text-secondary-color);
      border-left: 4px solid var(--markdown-blockquote-border);
      background: color-mix(in srgb, var(--markdown-blockquote-bg) 86%, var(--background-color));
      border-radius: 0 14px 14px 0;
      padding: 0.9em 1em;
    }

    hr {
      height: 1px;
      border: none;
      background-color: var(--markdown-text-color);
      margin: 1em 0;
    }

    a {
      color: var(--markdown-link-color);
      text-decoration-thickness: 0.08em;
      text-underline-offset: 0.14em;

      &:hover {
        color: var(--markdown-link-hover-color);
      }
    }

    .markdown-table-wrapper {
      display: inline-block;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      vertical-align: top;
      -webkit-overflow-scrolling: touch;
    }

    table {
      width: max-content;
      max-width: none;
      border-collapse: collapse;
      border: 1px solid var(--markdown-table-border);
      background-color: var(--markdown-bg-color);
      border-radius: 14px;
      overflow: hidden;
      table-layout: auto;
    }

    th,
    td {
      border: 1px solid var(--markdown-table-border);
      padding: 10px 14px;
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

    tbody tr:nth-child(even) {
      background-color: var(--background-secondary-color);
    }

    tbody tr:nth-child(odd) {
      background-color: var(--markdown-bg-color);
    }

    .markdown-stream-stable {
      display: block;

      > :last-child {
        animation: stream-stable-reveal 0.24s ease-out;
      }
    }

    .markdown-stream-tail {
      display: inline;
      white-space: break-spaces;
      word-break: break-word;
      overflow-wrap: anywhere;
      animation: stream-tail-fade-in 0.18s ease-out;
    }

    .markdown-stream-placeholder {
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.22) 45%,
          transparent 100%
        );
        transform: translateX(-140%);
        animation: stream-placeholder-shimmer 1.35s ease-in-out infinite;
        pointer-events: none;
      }

      &--inline {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-left: 6px;
        padding: 0.14em 0;
        vertical-align: middle;
      }

      &--block {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: min(360px, 100%);
        margin-bottom: 1em;
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(0, 0, 0, 0.05);
        animation: stream-stable-reveal 0.24s ease-out;
      }
    }

    .markdown-stream-placeholder__chip,
    .markdown-stream-placeholder__line {
      display: block;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.18);
      animation: stream-placeholder-breathe 1.6s ease-in-out infinite;
    }

    .markdown-stream-placeholder__chip {
      height: 0.86em;

      &--long {
        width: 84px;
      }

      &--medium {
        width: 56px;
      }

      &--short {
        width: 34px;
      }
    }

    .markdown-stream-placeholder__line {
      height: 10px;

      &--short {
        width: 28%;
      }

      &--long {
        width: 92%;
      }

      &--medium {
        width: 68%;
      }
    }

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

    @media (max-width: 480px) {
      pre {
        padding: 14px;
        padding-top: 42px;
        border-radius: 12px;
      }

      pre[data-lang]::before {
        top: 10px;
        left: 12px;
        padding: 5px 8px;
        font-size: 11px;
      }
    }
  }

  .katex,
  .katex-display {
    color: var(--markdown-text-color);
    max-width: 100%;
    box-sizing: border-box;
    font-size: 1.03em;
  }

  .katex {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
  }

  .katex-display {
    display: block;
    margin: 0.85em auto;
    padding: 0.18em 12px 0.3em;
    overflow-x: auto;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
  }

  .katex-display > .katex {
    display: inline-block;
    min-width: max-content;
  }

  .katex img,
  .katex svg,
  .katex-display img,
  .katex-display svg {
    max-width: 100%;
    height: auto;
    display: block;
  }
}

@keyframes stream-tail-fade-in {
  from {
    opacity: 0.48;
    filter: blur(0.6px);
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes stream-stable-reveal {
  from {
    opacity: 0.58;
    transform: translateY(4px);
    filter: blur(1px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes stream-placeholder-shimmer {
  0% {
    transform: translateX(-140%);
  }

  100% {
    transform: translateX(180%);
  }
}

@keyframes stream-placeholder-breathe {
  0%, 100% {
    opacity: 0.62;
    transform: scaleX(0.98);
  }

  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}
</style>


