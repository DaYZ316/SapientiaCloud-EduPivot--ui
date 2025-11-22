<template>
  <div class="question-sidebar">
    <n-spin :show="loading" class="sidebar-spin" size="large">
      <div class="sidebar-content">
        <div class="question-scroll-container">
          <n-list v-if="questionList.length > 0" class="question-list-wrapper">
            <n-list-item
                v-for="question in questionList"
                :key="question.id"
                :class="['question-list-item', { active: selectedQuestionId && selectedQuestionId === question.id }]"
                clickable
                @click="handleSelect(question)"
            >
              <n-thing>
                <template #header>
                  <div class="question-header">
                    <div class="question-title-section">
                      <span class="question-title">{{ question.questionTitle }}</span>
                      <div class="question-stats">
                        <n-text class="question-stat" depth="3">
                          {{ t('course.question.estimatedTime') }}: {{ formatEstimatedTime(question.estimatedTime) }}
                        </n-text>
                        <n-text class="question-stat" depth="3">
                          {{ t('course.question.viewCount') }}: {{ question.viewCount || 0 }}
                        </n-text>
                      </div>
                    </div>
                  </div>
                </template>
                <template #header-extra>
                  <div class="question-header-extra">
                    <div class="question-score">
                      <n-text strong type="primary">
                        {{ question.score }} {{ t('common.points') }}
                      </n-text>
                    </div>
                    <div class="question-meta">
                      <n-tag :type="getQuestionTypeTagType(question.questionType) as any" size="small">
                        {{ getQuestionTypeText(question.questionType) }}
                      </n-tag>
                      <n-tag :type="getDifficultyTagType(question.difficulty) as any" size="small">
                        {{ getDifficultyText(question.difficulty) }}
                      </n-tag>
                    </div>
                  </div>
                </template>
                <template #description>
                  <div class="question-content" v-html="question.questionContent"></div>
                  <div class="question-tags-actions">
                    <div class="question-tags">
                      <n-tag
                          v-for="tag in question.tags"
                          :key="tag"
                          class="question-tag"
                          size="tiny"
                          type="info"
                      >
                        {{ tag }}
                      </n-tag>
                    </div>
                    <div class="question-actions">
                      <n-space size="small">
                        <n-button
                            v-if="question.status === QuestionStatusEnum.DRAFT"
                            size="small"
                            text
                            type="success"
                            @click.stop="emitPublish(question)"
                        >
                          <template #icon>
                            <n-icon>
                              <SendOutlined/>
                            </n-icon>
                          </template>
                        </n-button>
                        <n-button
                            size="small"
                            text
                            type="primary"
                            @click.stop="emitEdit(question)"
                        >
                          <template #icon>
                            <n-icon>
                              <EditOutlined/>
                            </n-icon>
                          </template>
                        </n-button>
                        <n-button
                            size="small"
                            text
                            type="error"
                            @click.stop="emitDelete(question)"
                        >
                          <template #icon>
                            <n-icon>
                              <DeleteOutlined/>
                            </n-icon>
                          </template>
                        </n-button>
                      </n-space>
                    </div>
                  </div>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>

          <n-empty v-if="!loading && questionList.length === 0" :description="t('course.question.noData')">
            <template #extra>
              <slot name="empty-action"/>
            </template>
          </n-empty>

          <div
              v-if="questionList.length > 0"
              ref="loadMoreTrigger"
              class="load-more-trigger"
          >
            <n-spin v-if="isLoadingMore" size="small"/>
          </div>
        </div>
      </div>
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
import type {PropType} from 'vue'
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useDialog} from 'naive-ui'
import {DeleteOutlined, EditOutlined, SendOutlined} from '@vicons/antd'
import type {QuestionVO} from '@/types/course'
import {QuestionStatusEnum} from '@/enum/course/questionStatusEnum'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  isLoadingMore: {
    type: Boolean,
    default: false
  },
  questionList: {
    type: Array as PropType<QuestionVO[]>,
    default: () => []
  },
  selectedQuestionId: {
    type: String as PropType<string | null>,
    default: null
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  formatEstimatedTime: {
    type: Function as PropType<(time?: number | null) => string>,
    required: true
  },
  getQuestionTypeText: {
    type: Function as PropType<(type: number) => string>,
    required: true
  },
  getQuestionTypeTagType: {
    type: Function as PropType<(type: number) => string>,
    required: true
  },
  getDifficultyText: {
    type: Function as PropType<(difficulty: number) => string>,
    required: true
  },
  getDifficultyTagType: {
    type: Function as PropType<(difficulty: number) => string>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'select', question: QuestionVO): void
  (e: 'edit', question: QuestionVO): void
  (e: 'delete', question: QuestionVO): void
  (e: 'publish', question: QuestionVO): void
  (e: 'load-more'): void
}>()

const {t} = useI18n()
const dialog = useDialog()

const loadMoreTrigger = ref<HTMLElement | null>(null)
const loadMoreObserver = ref<IntersectionObserver | null>(null)

const shouldObserve = computed(() => props.hasMore && !props.loading && !props.isLoadingMore)

const disconnectObserver = () => {
  if (loadMoreObserver.value) {
    loadMoreObserver.value.disconnect()
    loadMoreObserver.value = null
  }
}

const handleIntersection: IntersectionObserverCallback = (entries) => {
  const entry = entries[0]
  if (entry && entry.isIntersecting) {
    emit('load-more')
  }
}

const initObserver = () => {
  disconnectObserver()
  if (!shouldObserve.value || !loadMoreTrigger.value) {
    return
  }
  loadMoreObserver.value = new IntersectionObserver(handleIntersection)
  loadMoreObserver.value.observe(loadMoreTrigger.value)
}

const handleSelect = (question: QuestionVO) => {
  emit('select', question)
}

const emitEdit = (question: QuestionVO) => {
  emit('edit', question)
}

const emitDelete = (question: QuestionVO) => {
  emit('delete', question)
}

const emitPublish = (question: QuestionVO) => {
  dialog.warning({
    title: t('course.question.publishConfirm'),
    content: t('course.question.publishConfirmContent', {questionTitle: question.questionTitle}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      emit('publish', question)
    }
  })
}

watch(shouldObserve, async (canObserve) => {
  if (!canObserve) {
    disconnectObserver()
    return
  }
  await nextTick()
  initObserver()
})

watch(() => props.questionList.length, async () => {
  if (!shouldObserve.value) {
    disconnectObserver()
    return
  }
  await nextTick()
  initObserver()
})

onMounted(() => {
  if (shouldObserve.value) {
    initObserver()
  }
})

onBeforeUnmount(() => {
  disconnectObserver()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.question-sidebar {
  flex: 0 0 35%;
  min-width: 360px;
  max-width: 480px;
  height: 74vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  :deep(.sidebar-spin) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  :deep(.sidebar-spin .n-spin-container) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  :deep(.sidebar-spin .n-spin-content) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .sidebar-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .question-scroll-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  :deep(.question-list-wrapper) {
    padding: 0;
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  :deep(.question-list-wrapper .n-list-item) {
    padding: 0;
  }

  :deep(.question-list-item) {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--background-color);
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  :deep(.question-list-item:hover) {
    background-color: var(--background-secondary-color);
    border-color: var(--color-primary-light);
    box-shadow: 0 4px 12px var(--shadow-secondary-color);
  }

  :deep(.question-list-item.active) {
    border-color: var(--color-primary);
    background-color: var(--background-secondary-color);
    box-shadow: 0 6px 16px var(--shadow-secondary-color);
  }

  :deep(.question-list-item:hover .question-title),
  :deep(.question-list-item.active .question-title) {
    color: var(--color-primary);
  }

  :deep(.question-list-item .n-thing) {
    padding: 16px;
  }

  :deep(.question-list-item .n-list-item__main) {
    padding: 0;
  }

  :deep(.question-list-item .n-list-item__divider) {
    display: none;
  }

  .question-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;

    .question-title-section {
      flex: 1;

      .question-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
        display: block;
        margin-bottom: 4px;
        transition: color 0.2s ease;
      }

      .question-stats {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
    }
  }

  .question-header-extra {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;

    .question-score {
      margin-bottom: 4px;
      text-align: right;
    }

    .question-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }

  .question-content {
    margin-bottom: 12px;
    line-height: 1.6;
    color: var(--text-color);
    max-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .question-tags-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .question-tags {
    flex: 1;
  }

  .question-tag {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .question-actions {
    flex-shrink: 0;
    margin-left: 12px;
  }
}

.load-more-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 100%;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .question-sidebar {
    width: 100%;
    margin-right: 0;
    min-width: auto;
    max-width: none;
    padding: 12px 12px 0 12px;
    height: auto;

    .sidebar-content {
      overflow: visible;
    }

    .question-scroll-container {
      max-height: 360px;
      padding-right: 0;
    }

    .question-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .question-title-section {
        margin-right: 0;
        width: 100%;

        .question-stats {
          margin-top: 4px;
        }
      }
    }

    .question-header-extra {
      align-items: flex-start;
      width: 100%;

      .question-meta {
        justify-content: flex-start;
      }
    }

    .question-tags-actions {
      flex-direction: column;
      align-items: flex-start;
    }

    .question-actions {
      margin-left: 0;
      margin-top: 8px;
      align-self: flex-end;
    }
  }

  .load-more-trigger {
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .question-sidebar {
    padding: 12px;
    height: auto;
  }
}
</style>

