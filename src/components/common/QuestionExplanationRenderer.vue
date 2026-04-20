<template>
  <div class="question-explanation-renderer">
    <MarkdownRenderer :content="renderContent"/>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'

const props = withDefaults(defineProps<{
  content?: string | null
  autoWrapBareLatex?: boolean
}>(), {
  content: '',
  autoWrapBareLatex: false
})

const LATEX_DELIMITER_RE = /(^|[^\\])\$(?!\$)[\s\S]+?(?<!\\)\$(?!\$)|\$\$[\s\S]+?\$\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/;
const KATEX_HTML_RE = /<span\s+class=(?:"|')katex(?:"|')|<katex\b/i
const HTML_TAG_RE = /<[^>]+>/
const CJK_RE = /[\u3400-\u9fff]/
const LATEX_COMMAND_RE = /\\(?:frac|dfrac|tfrac|sqrt|sum|prod|int|lim|sin|cos|tan|cot|sec|csc|log|ln|exp|cdot|times|div|pm|mp|leq?|geq?|neq?|approx|alpha|beta|gamma|delta|theta|lambda|mu|pi|sigma|phi|omega|left|right|mathrm|mathbf|mathit|text|overline|underline|vec|hat|bar|begin|end|cdots|ldots|infty|partial|nabla|forall|exists)\b/
const LATEX_SCRIPT_RE = /(?:^|[^\\])(?:\^|_)\s*\{?[^}\s]+/
const STANDALONE_LATEX_RE = /^[A-Za-z0-9\\{}[\]()^_+\-*/=<>|.,:;!%&\s]+$/

const looksLikeStandaloneLatex = (content: string) => {
  if (!content) {
    return false
  }
  if (CJK_RE.test(content) || HTML_TAG_RE.test(content) || KATEX_HTML_RE.test(content) || LATEX_DELIMITER_RE.test(content)) {
    return false
  }
  if (!STANDALONE_LATEX_RE.test(content)) {
    return false
  }
  return LATEX_COMMAND_RE.test(content) || LATEX_SCRIPT_RE.test(content)
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
  width: 100%;

  :deep(.markdown-renderer) {
    max-width: none;
    margin: 0;
  }

  :deep(.markdown-body.custom-markdown) {
    margin: 0;
    background: transparent;
    color: inherit;
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
    color: inherit;
  }

  :deep(.katex-display) {
    margin: 0.4em 0;
    padding: 0;
  }
}
</style>
