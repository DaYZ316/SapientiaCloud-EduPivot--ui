<template>
  <div class="smart-question-panel">
    <div class="smart-question-panel-header">
      <div class="smart-question-panel-title">
        <span class="smart-question-panel-text">
          {{ title }}
        </span>
        <n-tag :bordered="false" round size="small" type="info">
          {{ t('chat.toolsMenu.generationTraceTag') }}
        </n-tag>
        <n-tag v-if="resolvedStageLabel" :bordered="false" round size="small" type="success">
          {{ resolvedStageLabel }}
        </n-tag>
      </div>
      <div class="smart-question-panel-actions">
        <n-button
            :title="closeLabel"
            :aria-label="closeLabel"
            circle
            class="smart-question-panel-close"
            size="small"
            tertiary
            @click="emit('close')"
        >
          <template #icon>
            <n-icon :component="CloseOutline" size="16"/>
          </template>
        </n-button>
      </div>
    </div>

    <div
        ref="panelBodyRef"
        class="smart-question-panel-body"
        @scroll="handlePanelScroll"
    >
      <transition-group
          v-if="entries.length"
          class="trace-flow"
          name="trace-step-fade"
          tag="div"
      >
        <div
            v-for="(entry, index) in entries"
            :key="entry.entryId || `trace-entry-${index}`"
            :class="['trace-step', { 'is-last': index === entries.length - 1 }]"
        >
          <div class="trace-step-rail" aria-hidden="true">
            <span class="trace-step-dot"></span>
          </div>

          <div class="trace-step-content">
            <div class="trace-step-header">
              <div class="trace-step-stage">
                {{ resolveStageText(entry.stage) }}
              </div>
            </div>

            <div class="trace-step-title">
              {{ resolveEntryTitle(entry) }}
            </div>

            <transition-group
                class="trace-step-copy"
                name="trace-copy-fade"
                tag="div"
            >
              <div
                  v-if="entry.summary"
                  :key="`${entry.entryId || index}-summary-${entry.summary}`"
                  class="trace-step-summary"
              >
                {{ entry.summary }}
              </div>

              <div
                  v-for="(block, blockIndex) in buildEntryParagraphs(entry)"
                  :key="`${entry.entryId || index}-block-${blockIndex}-${block}`"
                  class="trace-step-paragraph"
              >
                {{ block }}
              </div>

              <div
                  v-if="shouldShowEntrySkeleton(entry, index)"
                  :key="`${entry.entryId || index}-loading`"
                  class="trace-step-loading"
              >
                <span class="trace-loading-line trace-loading-line--short"></span>
                <span class="trace-loading-line"></span>
                <span class="trace-loading-line"></span>
                <span class="trace-loading-line trace-loading-line--medium"></span>
              </div>
            </transition-group>
          </div>
        </div>
      </transition-group>

      <n-empty
          v-else
          :description="t('chat.toolsMenu.generationTraceEmpty')"
          class="trace-empty"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {NButton, NEmpty, NIcon, NTag} from 'naive-ui'
import {CloseOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import type {
  QuestionGenerationMode,
  QuestionGenerationStage,
  QuestionGenerationTraceEntry
} from '@/types/celestialHub/question'
import {QuestionGenerationStageEnum} from '@/types/celestialHub/question'

const props = withDefaults(defineProps<{
  entries: QuestionGenerationTraceEntry[]
  title: string
  closeLabel: string
  stage?: QuestionGenerationStage | null
  updatedAt?: number | null
  mode?: QuestionGenerationMode | null
}>(), {
  entries: () => [],
  title: '',
  closeLabel: '',
  stage: null,
  updatedAt: null,
  mode: 'paper'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const {t} = useI18n()
const panelBodyRef = ref<HTMLElement | null>(null)
const autoFollowEnabled = ref(true)

const AUTO_FOLLOW_THRESHOLD_PX = 48
const AUTO_SCROLL_DURATION_MS = 320

let pendingScrollFrame = 0
let isProgrammaticScroll = false

const stageI18nKeys: Record<QuestionGenerationStageEnum, string> = {
  [QuestionGenerationStageEnum.RECEIVED]: 'chat.toolsMenu.stage.received',
  [QuestionGenerationStageEnum.CONTEXT_READY]: 'chat.toolsMenu.stage.contextReady',
  [QuestionGenerationStageEnum.PLANNED]: 'chat.toolsMenu.stage.planned',
  [QuestionGenerationStageEnum.GENERATED]: 'chat.toolsMenu.stage.generated',
  [QuestionGenerationStageEnum.VALIDATED]: 'chat.toolsMenu.stage.validated',
  [QuestionGenerationStageEnum.REPAIRED]: 'chat.toolsMenu.stage.repaired',
  [QuestionGenerationStageEnum.ASSEMBLED]: 'chat.toolsMenu.stage.assembled',
  [QuestionGenerationStageEnum.RESPONDED]: 'chat.toolsMenu.stage.responded',
  [QuestionGenerationStageEnum.FAILED]: 'chat.toolsMenu.stage.failed'
}

const resolvedStageLabel = computed(() => resolveStageText(props.stage))
const isTraceStreaming = computed(() => {
  return props.stage !== QuestionGenerationStageEnum.RESPONDED
      && props.stage !== QuestionGenerationStageEnum.FAILED
})

function isNearBottom() {
  const panel = panelBodyRef.value
  if (!panel) {
    return true
  }
  return panel.scrollHeight - panel.scrollTop - panel.clientHeight <= AUTO_FOLLOW_THRESHOLD_PX
}

function cancelPendingScroll() {
  if (!pendingScrollFrame) {
    isProgrammaticScroll = false
    return
  }
  cancelAnimationFrame(pendingScrollFrame)
  pendingScrollFrame = 0
  isProgrammaticScroll = false
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  cancelPendingScroll()
  pendingScrollFrame = requestAnimationFrame((frameTime) => {
    pendingScrollFrame = 0
    const panel = panelBodyRef.value
    if (!panel) {
      return
    }
    const targetTop = Math.max(panel.scrollHeight - panel.clientHeight, 0)
    if (behavior !== 'smooth') {
      isProgrammaticScroll = true
      panel.scrollTop = targetTop
      requestAnimationFrame(() => {
        isProgrammaticScroll = false
      })
      return
    }
    const startTop = panel.scrollTop
    const distance = targetTop - startTop
    if (Math.abs(distance) < 2) {
      panel.scrollTop = targetTop
      return
    }
    isProgrammaticScroll = true
    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - frameTime) / AUTO_SCROLL_DURATION_MS, 1)
      panel.scrollTop = startTop + distance * easeOutCubic(progress)
      if (progress < 1) {
        pendingScrollFrame = requestAnimationFrame(animate)
        return
      }
      panel.scrollTop = targetTop
      pendingScrollFrame = 0
      isProgrammaticScroll = false
    }
    pendingScrollFrame = requestAnimationFrame(animate)
  })
}

function shouldShowEntrySkeleton(entry: QuestionGenerationTraceEntry, index: number) {
  if (!isTraceStreaming.value) {
    return false
  }
  if (index !== props.entries.length - 1) {
    return false
  }
  if (entry.stage === QuestionGenerationStageEnum.RESPONDED || entry.stage === QuestionGenerationStageEnum.FAILED) {
    return false
  }
  return true
}

function handlePanelScroll() {
  if (isProgrammaticScroll) {
    return
  }
  autoFollowEnabled.value = isNearBottom()
}

function resolveStageText(stage?: QuestionGenerationStage | null) {
  if (!stage) {
    return t('chat.toolsMenu.generationTracePending')
  }
  const key = stageI18nKeys[stage as QuestionGenerationStageEnum]
  if (key) {
    return t(key)
  }
  return String(stage)
}

function resolvePayloadFieldText(fieldKey: string) {
  const labelMap: Record<string, string> = {
    query: t('chat.toolsMenu.generationTraceQuery'),
    evidenceCount: t('chat.toolsMenu.generationTraceEvidenceCount'),
    sectionCount: t('chat.toolsMenu.generationTraceSectionCount'),
    totalQuestionCount: t('chat.toolsMenu.questionCount'),
    questionCount: t('chat.toolsMenu.questionCount'),
    targetCount: t('chat.toolsMenu.questionCount'),
    totalScore: t('chat.toolsMenu.totalScore'),
    totalEstimatedTime: t('chat.toolsMenu.totalEstimatedTime'),
    sectionTotalEstimatedTime: t('chat.toolsMenu.totalEstimatedTime'),
    attemptNo: t('chat.toolsMenu.generationTraceAttempt'),
    issueCount: t('chat.toolsMenu.generationTraceIssueCount'),
    remainingIssueCount: t('chat.toolsMenu.generationTraceIssueCount'),
    generationStrategy: t('chat.toolsMenu.generationTraceStrategy')
  }
  return labelMap[fieldKey] || fieldKey
}

function resolveEntryTitle(entry: QuestionGenerationTraceEntry) {
  return entry.title || resolveStageText(entry.stage) || t('chat.toolsMenu.generationTraceUntitled')
}

function asRecord(value: unknown): Record<string, any> | null {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return null
  }
  return value as Record<string, any>
}

function getPayloadList(payload: unknown, key: string) {
  const record = asRecord(payload)
  const value = record?.[key]
  return Array.isArray(value) ? value as Record<string, any>[] : []
}

function getHighlightItems(payload: unknown) {
  const record = asRecord(payload)
  if (!record) {
    return [] as Array<{ key: string; label: string; value: string }>
  }

  const highlightKeys = [
    'query',
    'evidenceCount',
    'sectionCount',
    'totalQuestionCount',
    'questionCount',
    'targetCount',
    'totalScore',
    'totalEstimatedTime',
    'sectionTotalEstimatedTime',
    'attemptNo',
    'issueCount',
    'remainingIssueCount',
    'generationStrategy'
  ]

  return highlightKeys.flatMap((key) => {
    const value = record[key]
    if (value === null || value === undefined || value === '') {
      return []
    }
    return [{
      key,
      label: resolvePayloadFieldText(key),
      value: formatFieldValue(value)
    }]
  })
}

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  if (Array.isArray(value)) {
    return value.map(item => formatFieldValue(item)).join(', ')
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function asText(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}

function buildSectionMeta(section: Record<string, any>) {
  const parts: string[] = []
  if (section.targetCount !== null && section.targetCount !== undefined && section.targetCount !== '') {
    parts.push(`${t('chat.toolsMenu.questionCount')}: ${formatFieldValue(section.targetCount)}`)
  }
  const totalEstimatedTime = section.sectionTotalEstimatedTime ?? section.totalEstimatedTime
  if (totalEstimatedTime !== null && totalEstimatedTime !== undefined && totalEstimatedTime !== '') {
    parts.push(`${t('chat.toolsMenu.totalEstimatedTime')}: ${formatFieldValue(totalEstimatedTime)}`)
  }
  if (section.questionType !== null && section.questionType !== undefined && section.questionType !== '') {
    parts.push(`${t('chat.toolsMenu.questionType')}: ${formatFieldValue(section.questionType)}`)
  }
  if (section.difficulty !== null && section.difficulty !== undefined && section.difficulty !== '') {
    parts.push(`${t('chat.toolsMenu.difficulty')}: ${formatFieldValue(section.difficulty)}`)
  }
  return parts.join(' · ')
}

function joinTextLines(lines: Array<string | null | undefined>) {
  return lines
      .map(line => line?.trim() ?? '')
      .filter(Boolean)
      .join('\n')
}

function buildMetricSentence(payload: unknown) {
  const items = getHighlightItems(payload)
  if (!items.length) {
    return ''
  }
  return items.map(item => `${item.label}: ${item.value}`).join(' · ')
}

function buildEvidenceText(item: Record<string, any>) {
  return joinTextLines([
    asText(item.title) || t('chat.toolsMenu.generationTraceUntitled'),
    asText(item.excerpt)
  ])
}

function buildSectionText(section: Record<string, any>, index: number) {
  const title = asText(section.sectionTitle) || `${t('chat.toolsMenu.generationTraceSection')} ${section.sectionNo ?? index + 1}`
  const knowledgePoints = Array.isArray(section.knowledgePoints) && section.knowledgePoints.length
      ? `${t('chat.toolsMenu.knowledgePoints')}: ${section.knowledgePoints.map(item => formatFieldValue(item)).join('、')}`
      : ''
  return joinTextLines([
    title,
    buildSectionMeta(section),
    knowledgePoints
  ])
}

function buildQuestionText(question: Record<string, any>, index: number) {
  const title = asText(question.questionTitle) || `${t('chat.toolsMenu.questionResultTitle')} ${index + 1}`
  const metaParts: string[] = []
  if (question.questionType !== null && question.questionType !== undefined && question.questionType !== '') {
    metaParts.push(`${t('chat.toolsMenu.questionType')}: ${formatFieldValue(question.questionType)}`)
  }
  if (question.difficulty !== null && question.difficulty !== undefined && question.difficulty !== '') {
    metaParts.push(`${t('chat.toolsMenu.difficulty')}: ${formatFieldValue(question.difficulty)}`)
  }
  if (question.score !== null && question.score !== undefined && question.score !== '') {
    metaParts.push(`${t('chat.toolsMenu.scorePerQuestion')}: ${formatFieldValue(question.score)}`)
  }
  if (question.estimatedTime !== null && question.estimatedTime !== undefined && question.estimatedTime !== '') {
    metaParts.push(`${t('chat.toolsMenu.totalEstimatedTime')}: ${formatFieldValue(question.estimatedTime)}`)
  }
  if (Array.isArray(question.tags) && question.tags.length) {
    metaParts.push(`${t('chat.toolsMenu.knowledgePoints')}: ${question.tags.map(item => formatFieldValue(item)).join('、')}`)
  }
  return joinTextLines([
    title,
    metaParts.join(' · '),
    asText(question.questionContent)
  ])
}

function buildIssueText(issue: Record<string, any>, index: number) {
  const questionIndex = issue.questionIndex !== null && issue.questionIndex !== undefined && issue.questionIndex !== ''
      ? `${t('chat.toolsMenu.questionResultTitle')} ${Number(issue.questionIndex) + 1}`
      : `${t('chat.toolsMenu.generationTraceIssueFallback')} ${index + 1}`
  return joinTextLines([
    joinTextLines([
      questionIndex,
      asText(issue.message) || asText(issue.code) || t('chat.toolsMenu.generationTraceIssueFallback')
    ]),
    asText(issue.repairHint)
  ])
}

function buildEntryParagraphs(entry: QuestionGenerationTraceEntry) {
  const payload = asRecord(entry.payload)
  if (!payload) {
    return [] as string[]
  }

  const paragraphs: string[] = []
  const metricSentence = buildMetricSentence(payload)
  if (metricSentence) {
    paragraphs.push(metricSentence)
  }

  getPayloadList(payload, 'evidences').forEach((item) => {
    const block = buildEvidenceText(item)
    if (block) {
      paragraphs.push(block)
    }
  })

  getPayloadList(payload, 'sections').forEach((item, index) => {
    const block = buildSectionText(item, index)
    if (block) {
      paragraphs.push(block)
    }
  })

  getPayloadList(payload, 'questions').forEach((item, index) => {
    const block = buildQuestionText(item, index)
    if (block) {
      paragraphs.push(block)
    }
  })

  getPayloadList(payload, 'issues').forEach((item, index) => {
    const block = buildIssueText(item, index)
    if (block) {
      paragraphs.push(block)
    }
  })

  if (payload.error) {
    paragraphs.push(asText(payload.error))
  }

  return paragraphs
}

watch(() => [props.entries.length, props.updatedAt], async () => {
  await nextTick()
  if (!panelBodyRef.value) {
    return
  }
  if (!autoFollowEnabled.value && !isNearBottom()) {
    return
  }
  autoFollowEnabled.value = true
  scrollToBottom('smooth')
})

onMounted(async () => {
  await nextTick()
  scrollToBottom('auto')
})

onUnmounted(() => {
  cancelPendingScroll()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.smart-question-panel {
  display: flex;
  flex-direction: column;
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  overflow: hidden;
  background: var(--background-color);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin: 24px;
  border: 1px solid var(--border-color);

  .smart-question-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color);

    .smart-question-panel-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
      flex-wrap: wrap;

      .smart-question-panel-text {
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 0 1 auto;
        min-width: 0;
      }
    }

    .smart-question-panel-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .smart-question-panel-close {
        width: 32px;
        height: 32px;
        padding: 0;
      }
    }
  }

  .smart-question-panel-body {
    flex: 1;
    min-height: 0;
    padding: 24px;
    overflow-y: auto;
    background: var(--background-color);
  }
}

.trace-flow {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.trace-step {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.trace-step-rail {
  position: relative;
  display: flex;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    top: 16px;
    bottom: -22px;
    width: 2px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 18%, var(--border-color));
  }
}

.trace-step.is-last .trace-step-rail::after {
  display: none;
}

.trace-step-dot {
  width: 12px;
  height: 12px;
  margin-top: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.trace-step-content {
  padding: 2px 0 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trace-step-header {
  display: flex;
  align-items: center;
}

.trace-step-stage {
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary-color);
}

.trace-step-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.28;
  color: var(--text-color);
}

.trace-step-copy {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.trace-step-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}

.trace-loading-line {
  display: block;
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--border-color) 84%, transparent) 0%,
      color-mix(in srgb, var(--color-primary) 12%, var(--border-color)) 50%,
      color-mix(in srgb, var(--border-color) 84%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: trace-loading-shimmer 1.7s ease-in-out infinite;
}

.trace-loading-line--short {
  width: 52%;
}

.trace-loading-line--medium {
  width: 64%;
}

.trace-step-summary,
.trace-step-paragraph {
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-secondary-color);
  white-space: pre-wrap;
  word-break: break-word;
}

.trace-step-summary {
  color: var(--text-color);
  font-weight: 500;
}

.trace-empty {
  height: 100%;
}

.trace-step-fade-enter-active,
.trace-copy-fade-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.trace-step-fade-enter-from,
.trace-copy-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.trace-step-fade-enter-to,
.trace-copy-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

@keyframes trace-loading-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

