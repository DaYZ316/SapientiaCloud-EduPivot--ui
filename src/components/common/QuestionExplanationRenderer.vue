<template>
  <div :class="['question-explanation-renderer', `question-explanation-renderer--${props.variant}`]">
    <MarkdownRenderer :content="renderContent"/>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'

const props = withDefaults(defineProps<{
  content?: string | null
  autoWrapBareLatex?: boolean
  variant?: 'default' | 'answer' | 'explanation'
}>(), {
  content: '',
  autoWrapBareLatex: false,
  variant: 'default'
})

const LATEX_DELIMITER_RE = /(^|[^\\])\$(?!\$)[\s\S]+?(?<!\\)\$(?!\$)|\$\$[\s\S]+?\$\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/;
const KATEX_HTML_RE = /<span\s+class=(?:"|')katex(?:"|')|<katex\b/i
const HTML_TAG_RE = /<[^>]+>/
const CJK_RE = /[\u3400-\u9fff]/
const LATEX_TEXT_BLOCK_RE = /\\(?:text|textbf|textit|textrm|textsf|texttt|mathrm|mathbf|mathit)\s*\{[\s\S]*?\}/g
const LATEX_COMMAND_RE = /\\(?:frac|dfrac|tfrac|sqrt|sum|prod|int|lim|sin|cos|tan|cot|sec|csc|log|ln|exp|cdot|times|div|pm|mp|leq?|geq?|neq?|approx|alpha|beta|gamma|delta|theta|lambda|mu|pi|sigma|phi|omega|left|right|mathrm|mathbf|mathit|mathbb|mathcal|mathfrak|text|overline|underline|vec|hat|bar|begin|end|cdots|ldots|vdots|ddots|infty|partial|nabla|forall|exists|in|notin|ni|mid|subseteq?|supseteq?|cup|cap|setminus|varnothing|emptyset|to|rightarrow|leftarrow|leftrightarrow)\b/
const LATEX_SCRIPT_RE = /(?:^|[^\\])(?:\^|_)\s*\{?[^}\s]+/
const STANDALONE_LATEX_RE = /^[A-Za-z0-9\\{}[\]()^_+\-*/=<>|.,:;!%&\s]+$/

const normalizeLatexTextBlocks = (content: string) => {
  return content.replace(LATEX_TEXT_BLOCK_RE, (segment) => {
    return segment.replace(/\{[\s\S]*\}$/, '{text}')
  })
}

const looksLikeStandaloneLatex = (content: string) => {
  if (!content) {
    return false
  }

  if (HTML_TAG_RE.test(content) || KATEX_HTML_RE.test(content) || LATEX_DELIMITER_RE.test(content)) {
    return false
  }

  const normalizedSignalContent = normalizeLatexTextBlocks(content)

  if (CJK_RE.test(normalizedSignalContent) || !STANDALONE_LATEX_RE.test(normalizedSignalContent)) {
    return false
  }

  return LATEX_COMMAND_RE.test(normalizedSignalContent) || LATEX_SCRIPT_RE.test(normalizedSignalContent)
}

const normalizeBareLatex = (content?: string | null) => {
  const raw = content ?? ''
  const trimmed = raw.trim()
  if (!trimmed || !looksLikeStandaloneLatex(trimmed)) {
    return raw
  }
  return `$${trimmed}$`
}

const renderContent = computed(() => {
  if (!props.autoWrapBareLatex) {
    return props.content || ''
  }
  return normalizeBareLatex(props.content)
})
</script>

<style lang="scss" scoped>
.question-explanation-renderer {
  --question-renderer-font-family: var(--font-family-sans);
  --question-renderer-font-size: var(--markdown-font-size);
  --question-renderer-line-height: 1.72;
  --question-renderer-letter-spacing: 0.012em;
  --question-renderer-font-weight: 400;
  --question-renderer-text-color: inherit;
  --question-renderer-bg: transparent;
  --question-renderer-border-color: transparent;
  --question-renderer-border-width: 0;
  --question-renderer-padding: 0;
  --question-renderer-radius: 0;
  --question-renderer-katex-scale: 1;
  --question-renderer-katex-color: inherit;
  width: 100%;
  padding: var(--question-renderer-padding);
  border: var(--question-renderer-border-width) solid var(--question-renderer-border-color);
  border-radius: var(--question-renderer-radius);
  background: var(--question-renderer-bg);
  color: var(--question-renderer-text-color);
  font-family: var(--question-renderer-font-family);
  font-size: var(--question-renderer-font-size);
  line-height: var(--question-renderer-line-height);
  letter-spacing: var(--question-renderer-letter-spacing);
  font-weight: var(--question-renderer-font-weight);

  &.question-explanation-renderer--answer {
    --question-renderer-font-size: 15px;
    --question-renderer-line-height: 1.76;
    --question-renderer-letter-spacing: 0.01em;
    --question-renderer-font-weight: 500;
    --question-renderer-text-color: color-mix(in srgb, var(--text-color) 94%, transparent);
  }

  &.question-explanation-renderer--explanation {
    --question-renderer-font-family: "Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", "STSong", Georgia, serif;
    --question-renderer-font-size: 15px;
    --question-renderer-line-height: 1.88;
    --question-renderer-letter-spacing: 0.018em;
    --question-renderer-text-color: color-mix(in srgb, var(--text-color) 76%, var(--color-primary-dark) 24%);
    --question-renderer-bg: color-mix(in srgb, var(--background-secondary-color) 80%, var(--color-primary) 4%);
    --question-renderer-border-color: color-mix(in srgb, var(--color-primary) 14%, var(--border-color));
    --question-renderer-border-width: 1px;
    --question-renderer-padding: 12px 14px;
    --question-renderer-radius: 14px;
    --question-renderer-katex-scale: 1.04;
    --question-renderer-katex-color: color-mix(in srgb, var(--text-color) 68%, var(--color-primary-dark) 32%);
  }

  :deep(.markdown-renderer) {
    max-width: none;
    margin: 0;
  }

  :deep(.markdown-body.custom-markdown) {
    margin: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    font-weight: inherit;
  }

  :deep(.markdown-body.custom-markdown > :first-child) {
    margin-top: 0;
  }

  :deep(.markdown-body.custom-markdown > :last-child) {
    margin-bottom: 0;
  }

  :deep(.markdown-body.custom-markdown p) {
    margin: 0;
  }

  :deep(.katex),
  :deep(.katex-display) {
    color: var(--question-renderer-katex-color);
  }

  :deep(.katex) {
    font-size: calc(1em * var(--question-renderer-katex-scale));
  }

  :deep(.katex-display) {
    margin: 0.4em 0;
    padding: 0;
  }

  :deep(.markdown-body.custom-markdown strong) {
    color: inherit;
  }
}
</style>
