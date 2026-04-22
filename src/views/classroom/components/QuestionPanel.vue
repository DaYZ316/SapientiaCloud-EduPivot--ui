<template>
  <div v-if="show" class="question-panel">
    <NButton circle class="question-panel__close" quaternary size="small" @click="handleClose">
      <template #icon>
        <NIcon :component="CloseOutline" :size="18"/>
      </template>
    </NButton>
    <div class="question-panel__header">
      <div class="question-panel__title">{{ t('classroom.publishPractice') }}</div>
    </div>
    <div :class="{'is-detail': Boolean(selectedBankId)}" class="question-panel__body">
      <template v-if="!selectedBankId">
        <div class="question-panel__banks is-full">
          <div class="question-panel__section-title">题库列表</div>
          <div class="question-panel__bank-list" @scroll="handleBankScroll">
            <div
                v-for="bank in questionBanks"
                :key="bank.id"
                :class="{'is-active': bank.id === selectedBankId}"
                class="bank-item"
                @click="handleBankSelect(bank.id)"
            >
              <div class="bank-item__title is-clamped">{{ bank.bankName }}</div>
              <div class="bank-item__desc is-clamped-desc">{{ bank.description || '暂无简介' }}</div>
              <div class="bank-item__meta">
                <span>类型：{{ bankTypeText(bank.bankType) }}</span>
              </div>
            </div>
            <div v-if="loadingBanks" class="question-panel__loading">
              <NSpin size="small"/>
            </div>
            <div v-else-if="!questionBanks.length" class="question-panel__empty">暂无题库</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="question-panel__questions">
          <div class="question-panel__section-title question-panel__section-grid">
            <div class="section-return">
              <NButton circle quaternary size="small" @click="resetBank">
                <template #icon>
                  <NIcon :component="ArrowBackOutline" :size="16"/>
                </template>
              </NButton>
            </div>
            <div class="section-title">
              <div class="question-panel__bank-name is-clamped">{{ currentBank?.bankName || '题库' }}</div>
            </div>
            <div class="section-type">
              <span class="meta-tag">{{ bankTypeText(currentBank?.bankType) }}</span>
            </div>
            <div class="section-update">
              <NButton
                  :disabled="!resolvedClassroomId || !hasNewSelection || selectedQuestionIds.length === 0"
                  :loading="syncing === true"
                  secondary
                  size="small"
                  type="primary"
                  @click="openSyncDialog"
              >
                <span>发布题目</span>
                <span v-if="newSelectionCount > 0" class="publish-button__badge">{{ newSelectionCount }}</span>
              </NButton>
            </div>
          </div>
          <NModal
              v-model:show="syncDialogShow"
              :closable="false"
              :style="{width: '980px'}"
              preset="card"
          >
            <NCard :bordered="false" :segmented="false" :title="t('classroom.questionPanel.modalTitle')"
                   aria-modal="true"
                   role="dialog" size="small">
              <div class="sync-range">
                <div class="sync-range__item">
                  <span class="sync-range__label">{{ t('classroom.questionPanel.startTime') }}</span>
                  <NDatePicker
                      v-model:value="syncStartTime"
                      class="sync-range__picker"
                      clearable
                      type="datetime"
                  />
                </div>
                <div class="sync-range__item">
                  <span class="sync-range__label">{{ t('classroom.questionPanel.endTime') }}</span>
                  <NDatePicker
                      v-model:value="syncEndTime"
                      class="sync-range__picker"
                      clearable
                      type="datetime"
                  />
                </div>
              </div>
              <div v-if="syncFormRows.filter(row => row.isNew).length" class="sync-list">
                <div v-for="row in syncFormRows.filter(row => row.isNew)" :key="row.id" class="sync-item">
                  <div class="sync-item__left">
                    <div class="sync-item__order">#{{ row.order }}</div>
                    <div class="sync-item__title is-clamped">
                      {{ row.title || t('classroom.questionPanel.unnamedQuestion') }}
                    </div>
                  </div>
                  <div class="sync-item__right">
                    <NSelect
                        :options="isRequiredSelectOptions"
                        :placeholder="t('classroom.questionPanel.selectRequiredPlaceholder')"
                        :value="row.isRequired"
                        class="sync-item__select"
                        size="small"
                        @update:value="(val) => updateSyncRow(row.id, val as number | null)"
                    />
                  </div>
                </div>
              </div>
              <template #footer>
                <div class="sync-footer">
                  <NButton quaternary size="small" @click="syncDialogVisible = null">
                    {{ t('classroom.questionPanel.cancel') }}
                  </NButton>
                  <NButton
                      :disabled="syncing === true || newSyncRowsCount === 0"
                      :loading="syncing === true"
                      size="small"
                      type="primary"
                      @click="handleSyncPractice"
                  >
                    {{ t('classroom.questionPanel.confirmSync') }}
                  </NButton>
                </div>
              </template>
            </NCard>
          </NModal>
          <div class="question-panel__search">
            <NInput
                v-model:value="searchForm.questionTitle"
                clearable
                placeholder="搜索题目标题"
                @keydown.enter="handleSearch"
            />
            <NButton circle size="small" type="primary" @click="handleSearch">
              <template #icon>
                <NIcon :component="SearchOutline" :size="16"/>
              </template>
            </NButton>
          </div>
          <div class="question-list" @scroll="handleQuestionScroll">
            <div
                v-for="question in questions"
                :key="question.id"
                :class="{'is-active': selectedQuestionId === question.id}"
                class="question-item"
                @click="handleQuestionSelect(question)"
            >
              <div class="question-item__top">
                <div class="question-item__select" @click.stop>
                  <NCheckbox
                      :checked="isChecked(question.id)"
                      :disabled="isPublished(question.id)"
                      @update:checked="toggleQuestionCheck(question.id)"
                  >
                    <span v-if="getQuestionOrder(question.id)"
                          class="question-item__order">#{{ getQuestionOrder(question.id) }}</span>
                  </NCheckbox>
                </div>
                <div class="question-item__tag">{{ questionTypeText(question.questionType) }}</div>
              </div>
              <div class="question-item__header">
                <QuestionExplanationRenderer
                  class="question-item__title is-clamped"
                  :content="question.questionTitle || ''"
                  auto-wrap-bare-latex
              />
              </div>
              <QuestionExplanationRenderer
                  class="question-item__content is-clamped-desc"
                  :content="question.questionContent || '\u6682\u65e0\u5185\u5bb9'"
                  auto-wrap-bare-latex
              />
              <div class="question-item__meta">
                <span>难度：{{ difficultyText(question.difficulty) }}</span>
                <span>分值：{{ question.score ?? 0 }}</span>
              </div>
            </div>
            <div v-if="loadingQuestions" class="question-panel__loading">
              <NSpin size="small"/>
            </div>
            <div v-else-if="isLoadingMore" class="question-panel__loading">
              <NSpin size="small"/>
            </div>
            <div v-else-if="selectedBankId && !questions.length" class="question-panel__empty">该题库暂无题目</div>
          </div>
        </div>
        <div v-if="selectedQuestion" class="question-panel__detail">
          <div class="question-detail__header">
            <div class="question-detail__head-main">
              <QuestionExplanationRenderer
                class="question-detail__title"
                :content="selectedQuestion.questionTitle || ''"
                auto-wrap-bare-latex
            />
            </div>
            <div class="question-detail__meta">
              <span>{{ questionTypeText(selectedQuestion.questionType) }}</span>
              <span>难度：{{ difficultyText(selectedQuestion.difficulty) }}</span>
              <span>分值：{{ selectedQuestion.score ?? 0 }}</span>
            </div>
          </div>
          <QuestionExplanationRenderer
            class="question-detail__content"
            :content="selectedQuestion.questionContent || '\u6682\u65e0\u5185\u5bb9'"
            auto-wrap-bare-latex
        />
          <div v-if="hasOptions" class="question-detail__options">
            <div class="question-detail__section-title">选项</div>
            <div class="question-detail__option-list">
              <div
                  v-for="(option, optionIndex) in selectedQuestion.options"
                  :key="option.id ?? `option-${optionIndex}`"
                  :class="{'is-correct': showAnswers && option.isCorrect === 1}"
                  class="option-item"
              >
                <div class="option-item__main">
                  <span class="option-item__label">{{ getOptionLabel(option, optionIndex) }}</span>
                  <QuestionExplanationRenderer
                      class="option-item__content"
                      :content="option.optionContent || '\u6682\u65e0\u5185\u5bb9'"
                      auto-wrap-bare-latex
                  />
                  <div
                      v-if="showAnswers && option.score !== null && option.score !== undefined"
                      class="option-item__score"
                  >
                    {{ option.score }} 分
                  </div>
                </div>
                <QuestionExplanationRenderer
                    v-if="showAnswers && option.explanation"
                    class="option-item__explanation"
                    :content="option.explanation"
                    auto-wrap-bare-latex
                />
              </div>
            </div>
          </div>
          <div v-if="hasVisibleAnswers" class="question-detail__answers">
            <div class="question-detail__section-title">参考答案</div>
            <div class="question-detail__answer-list">
              <div
                  v-for="(answer, answerIndex) in selectedQuestion.answers"
                  :key="answer.id ?? `answer-${answerIndex}`"
                  class="answer-item"
              >
                <div class="answer-item__main">
                  <span class="answer-item__index">#{{ answer.sortOrder ?? answerIndex + 1 }}</span>
                  <QuestionExplanationRenderer
                      class="answer-item__content"
                      :content="answer.answerContent || '\u6682\u65e0\u7b54\u6848'"
                      auto-wrap-bare-latex
                      variant="answer"
                  />
                  <div
                      v-if="answer.score !== null && answer.score !== undefined"
                      class="answer-item__score"
                  >
                    {{ answer.score }} 分
                  </div>
                </div>
                <QuestionExplanationRenderer
                    v-if="answer.explanation"
                    class="answer-item__explanation"
                    :content="answer.explanation"
                    auto-wrap-bare-latex
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="question-panel__empty">请选择题目查看详情</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {NButton, NCard, NCheckbox, NDatePicker, NIcon, NModal, NSelect, NSpin, useMessage} from 'naive-ui';
import {ArrowBackOutline, CloseOutline, SearchOutline} from '@vicons/ionicons5';
import {listAllCourseQuestionBankByCourseId} from '@/api/course/courseQuestionBank';
import {getDefaultQuestionQuery, listQuestion} from '@/api/course';
import {useQuestionAnswerToggle} from '@/composables/useQuestionAnswerToggle';
import type {CourseQuestionBankVO, QuestionOptionVO, QuestionVO} from '@/types/course';
import {
  getDefaultClassroomQuestionDTO,
  listByClassroomId,
  syncClassroomPractice
} from '@/api/classroom/classroomPractice';
import type {ClassroomQuestionDTO, ClassroomQuestionVO} from '@/types/classroom';
import {IsRequiredEnum, isRequiredOptions} from '@/enum/classroom';
import {getQuestionTypeLabel} from '@/enum/course/questionTypeEnum';
import QuestionExplanationRenderer from '@/components/common/QuestionExplanationRenderer.vue';

const props = defineProps<{
  show: boolean;
  courseId: string | null;
  classroomId?: string | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const {t, locale} = useI18n();
const message = useMessage();

const loadingBanks = ref<boolean | null>(null);
const loadingQuestions = ref<boolean | null>(null);
const isLoadingMore = ref<boolean | null>(null);
const hasMore = ref<boolean | null>(null);
const syncing = ref<boolean | null>(null);
const syncDialogVisible = ref<boolean | null>(null);
const syncDialogShow = computed({
  get: () => Boolean(syncDialogVisible.value),
  set: (val: boolean) => {
    syncDialogVisible.value = val;
  }
});
const questionBanks = ref<CourseQuestionBankVO[]>([]);
const questions = ref<QuestionVO[]>([]);
const selectedBankId = ref<string | null>(null);
const selectedQuestionId = ref<string | null>(null);
const selectedQuestion = ref<QuestionVO | null>(null);
const selectedQuestionIds = ref<string[]>([]);
const syncFormRows = ref<Array<{
  id: string;
  title: string | null;
  isRequired: IsRequiredEnum | number | null;
  order: number;
  isNew: boolean;
  publishedId: string | null
}>>([]);
const syncStartTime = ref<number | null>(null);
const syncEndTime = ref<number | null>(null);
const publishedQuestionIds = ref<string[]>([]);
const publishedQuestions = ref<ClassroomQuestionVO[]>([]);
const currentBank = computed(() => questionBanks.value.find(bank => bank.id === selectedBankId.value) || null);
const resolvedClassroomId = computed(() => props.classroomId ?? null);

const hasNewSelection = computed(() => {
  const selected = selectedQuestionIds.value;
  const published = publishedQuestionIds.value;
  if (selected.length !== published.length) {
    return true;
  }
  const selectedSet = new Set(selected);
  const publishedSet = new Set(published);
  if (selectedSet.size !== publishedSet.size) {
    return true;
  }
  for (const id of selectedSet) {
    if (!publishedSet.has(id)) {
      return true;
    }
  }
  return false;
});

const newSelectionCount = computed(() => {
  const selected = selectedQuestionIds.value;
  const published = new Set(publishedQuestionIds.value);
  return selected.filter(id => !published.has(id)).length;
});

const newSyncRowsCount = computed(() => {
  return syncFormRows.value.filter(row => row.isNew).length;
});
const searchForm = ref<{ questionTitle: string | null }>({questionTitle: null});
const pagination = ref<{ pageNum: number; pageSize: number; total: number | null }>({
  pageNum: 1,
  pageSize: 10,
  total: null
});
const panelCache = ref<{
  courseId: string | null;
  classroomId: string | null;
  questionBanks: CourseQuestionBankVO[];
  questions: QuestionVO[];
  selectedBankId: string | null;
  selectedQuestionId: string | null;
  selectedQuestionIds: string[];
  selectedQuestion: QuestionVO | null;
  syncFormRows: Array<{
    id: string;
    title: string | null;
    isRequired: IsRequiredEnum | number | null;
    order: number;
    isNew: boolean;
    publishedId: string | null
  }>;
  syncStartTime: number | null;
  syncEndTime: number | null;
  searchForm: { questionTitle: string | null };
  pagination: { pageNum: number; pageSize: number; total: number | null };
  publishedQuestionIds: string[];
  publishedQuestions: ClassroomQuestionVO[];
  hasMore: boolean | null;
} | null>(null);

const handleClose = () => {
  emit('close');
};

const bankTypeText = (bankType: number | null | undefined) => {
  if (bankType === 0) return '练习题库';
  if (bankType === 1) return '考试题库';
  if (bankType === 2) return '作业题库';
  return '题库';
};

const questionTypeText = (questionType: number | null | undefined) => {
  const isEn = String(locale.value || '').toLowerCase().startsWith('en');
  return getQuestionTypeLabel(questionType ?? '', isEn);
};

const difficultyText = (difficulty: number | null | undefined) => {
  if (difficulty === 1) return '简单';
  if (difficulty === 2) return '中等';
  if (difficulty === 3) return '困难';
  return '未知';
};

const {showAnswers} = useQuestionAnswerToggle();
showAnswers.value = true;

const hasOptions = computed(() => Boolean(selectedQuestion.value?.options?.length));
const hasAnswers = computed(() => Boolean(selectedQuestion.value?.answers?.length));
const hasVisibleAnswers = computed(() => hasAnswers.value && showAnswers.value);

const getOptionLabel = (option: QuestionOptionVO | null | undefined, index: number) => {
  if (option?.optionLabel) {
    return option.optionLabel;
  }
  return String.fromCharCode(65 + index);
};

const resetPagination = () => {
  pagination.value.pageNum = 1;
  pagination.value.total = null;
  hasMore.value = null;
};

const loadBanks = async () => {
  if (!props.courseId) {
    questionBanks.value = [];
    return;
  }
  loadingBanks.value = true;
  const res = await listAllCourseQuestionBankByCourseId(props.courseId);
  questionBanks.value = Array.isArray(res?.data) ? res.data : [];
  loadingBanks.value = false;
  // 默认不选中题库，等待用户点击
  selectedBankId.value = null;
  selectedQuestionId.value = null;
  selectedQuestion.value = null;
  questions.value = [];
  resetPagination();
};

const loadQuestions = async (append = false) => {
  if (!selectedBankId.value) {
    questions.value = [];
    selectedQuestionId.value = null;
    selectedQuestion.value = null;
    resetPagination();
    return;
  }
  if (append) {
    if (isLoadingMore.value) return;
    isLoadingMore.value = true;
  } else {
    loadingQuestions.value = true;
    pagination.value.pageNum = 1;
  }
  const query = getDefaultQuestionQuery();
  query.questionBankId = selectedBankId.value;
  query.questionTitle = searchForm.value.questionTitle;
  query.pageNum = pagination.value.pageNum;
  query.pageSize = pagination.value.pageSize;

  const res = await listQuestion(query);
  const data = Array.isArray(res?.data) ? res.data : [];
  if (append) {
    questions.value = [...questions.value, ...data];
  } else {
    questions.value = data;
  }
  pagination.value.total = res?.total ?? null;
  if (pagination.value.total !== null) {
    const currentCount = questions.value.length;
    hasMore.value = currentCount < pagination.value.total;
  } else {
    hasMore.value = data.length >= pagination.value.pageSize;
  }
  if (questions.value.length > 0) {
    selectedQuestionId.value = questions.value[0].id;
    selectedQuestion.value = questions.value[0];
  } else {
    selectedQuestionId.value = null;
    selectedQuestion.value = null;
  }
  loadingQuestions.value = null;
  isLoadingMore.value = null;
};

const handleBankSelect = (bankId: string) => {
  if (selectedBankId.value === bankId) {
    return;
  }
  selectedBankId.value = bankId;
  selectedQuestionId.value = null;
  selectedQuestion.value = null;
  resetPagination();
  loadQuestions();
};

const handleQuestionSelect = (question: QuestionVO) => {
  selectedQuestionId.value = question.id;
  selectedQuestion.value = question;
};

const isChecked = (questionId: string) => selectedQuestionIds.value.includes(questionId);

const isPublished = (questionId: string) => publishedQuestionIds.value.includes(questionId);

const rebuildOrders = () => {
  selectedQuestionIds.value = [...selectedQuestionIds.value];
};

const restorePublishedSelections = () => {
  if (publishedQuestionIds.value.length > 0) {
    selectedQuestionIds.value = [...publishedQuestionIds.value];
    rebuildOrders();
  }
};

const getQuestionOrder = (questionId: string) => {
  const idx = selectedQuestionIds.value.findIndex(id => id === questionId);
  return idx >= 0 ? idx + 1 : null;
};

const loadPublishedSelections = async () => {
  if (!resolvedClassroomId.value) {
    return;
  }
  const res = await listByClassroomId(resolvedClassroomId.value);
  const published = Array.isArray(res?.data) ? res.data : [];
  const sorted = [...published].sort((a, b) => {
    const aOrder = a.publishOrder ?? 0;
    const bOrder = b.publishOrder ?? 0;
    return aOrder - bOrder;
  });
  publishedQuestions.value = sorted;
  publishedQuestionIds.value = sorted.map(item => item.questionId).filter((id): id is string => Boolean(id));
  restorePublishedSelections();
};

const toggleQuestionCheck = (questionId: string) => {
  if (isPublished(questionId)) {
    return;
  }
  if (isChecked(questionId)) {
    selectedQuestionIds.value = selectedQuestionIds.value.filter(id => id !== questionId);
  } else {
    selectedQuestionIds.value = [...selectedQuestionIds.value, questionId];
  }
  rebuildOrders();
};

const formatDateTime = (value: number | null) => {
  if (!value) return null;
  return new Date(value).toISOString();
};

const buildSyncPayload = (): ClassroomQuestionDTO[] => {
  const start = formatDateTime(syncStartTime.value);
  const end = formatDateTime(syncEndTime.value);
  return syncFormRows.value.map((row) => {
    const dto = getDefaultClassroomQuestionDTO();
    dto.id = row.publishedId;
    dto.courseId = props.courseId;
    dto.classroomId = resolvedClassroomId.value;
    dto.questionId = row.id;
    dto.questionTitle = row.title;
    dto.publishOrder = row.order;
    dto.isRequired = row.isRequired ?? null;
    dto.startTime = start;
    dto.endTime = end;
    return dto;
  });
};

const openSyncDialog = () => {
  if (!resolvedClassroomId.value) {
    return;
  }
  syncStartTime.value = null;
  syncEndTime.value = null;
  const publishedSet = new Set(publishedQuestionIds.value);
  const publishedMap = new Map(publishedQuestions.value.map(item => [item.questionId, item]));
  syncFormRows.value = selectedQuestionIds.value.map((id) => {
    const found = questions.value.find(q => q.id === id);
    const order = getQuestionOrder(id);
    const isNew = !publishedSet.has(id);
    const publishedItem = publishedMap.get(id);
    return {
      id,
      title: found?.questionTitle ?? null,
      isRequired: isNew ? IsRequiredEnum.REQUIRED : (publishedItem?.isRequired ?? IsRequiredEnum.REQUIRED),
      order: order ?? 0,
      isNew,
      publishedId: publishedItem?.id ?? null
    };
  });
  syncDialogVisible.value = true;
};

const handleSyncPractice = async () => {
  if (!resolvedClassroomId.value) {
    return;
  }
  syncing.value = true;
  await syncClassroomPractice(buildSyncPayload()).finally(() => {
    syncing.value = null;
  });
  syncDialogVisible.value = null;
  await loadPublishedSelections();
  message.success(t('common.operateSuccess'));
};

const handleSearch = () => {
  resetPagination();
  loadQuestions();
};

const handleLoadMore = () => {
  if (loadingQuestions.value || isLoadingMore.value || hasMore.value === false) {
    return;
  }
  pagination.value.pageNum += 1;
  loadQuestions(true);
};

const updateSyncRow = (id: string, isRequired: number | null) => {
  syncFormRows.value = syncFormRows.value.map(row => row.id === id ? {...row, isRequired} : row);
};

const isRequiredSelectOptions = isRequiredOptions.map(opt => ({...opt}));

const resetBank = () => {
  selectedBankId.value = null;
  selectedQuestionId.value = null;
  selectedQuestion.value = null;
  restorePublishedSelections();
  syncFormRows.value = [];
  syncStartTime.value = null;
  syncEndTime.value = null;
};

const resetPanelState = () => {
  selectedBankId.value = null;
  selectedQuestionId.value = null;
  selectedQuestion.value = null;
  questions.value = [];
  selectedQuestionIds.value = [];
  syncFormRows.value = [];
  syncStartTime.value = null;
  syncEndTime.value = null;
  questionBanks.value = [];
  pagination.value = {pageNum: 1, pageSize: 10, total: null};
  hasMore.value = null;
  publishedQuestionIds.value = [];
  publishedQuestions.value = [];
};

const savePanelCache = () => {
  panelCache.value = {
    courseId: props.courseId ?? null,
    classroomId: props.classroomId ?? null,
    questionBanks: [...questionBanks.value],
    questions: [...questions.value],
    selectedBankId: selectedBankId.value,
    selectedQuestionId: selectedQuestionId.value,
    selectedQuestionIds: [...selectedQuestionIds.value],
    selectedQuestion: selectedQuestion.value,
    syncFormRows: [...syncFormRows.value],
    syncStartTime: syncStartTime.value,
    syncEndTime: syncEndTime.value,
    searchForm: {...searchForm.value},
    pagination: {...pagination.value},
    publishedQuestionIds: [...publishedQuestionIds.value],
    publishedQuestions: [...publishedQuestions.value],
    hasMore: hasMore.value
  };
};

const restorePanelCache = () => {
  const cache = panelCache.value;
  const sameCourse = cache?.courseId === (props.courseId ?? null);
  const sameClassroom = cache?.classroomId === (props.classroomId ?? null);
  if (!cache || !sameCourse || !sameClassroom) {
    return false;
  }
  questionBanks.value = [...cache.questionBanks];
  questions.value = [...cache.questions];
  selectedBankId.value = cache.selectedBankId;
  selectedQuestionId.value = cache.selectedQuestionId;
  selectedQuestion.value = cache.selectedQuestion;
  selectedQuestionIds.value = [...cache.selectedQuestionIds];
  syncFormRows.value = [...cache.syncFormRows];
  syncStartTime.value = cache.syncStartTime;
  syncEndTime.value = cache.syncEndTime;
  searchForm.value = {...cache.searchForm};
  pagination.value = {...cache.pagination};
  publishedQuestionIds.value = [...cache.publishedQuestionIds];
  publishedQuestions.value = [...(cache.publishedQuestions || [])];
  hasMore.value = cache.hasMore;
  return true;
};

const handleBankScroll = () => {
  // 题库一次性返回，无需滚动加载
};

const handleQuestionScroll = (e: Event) => {
  const target = e.target as HTMLElement | null;
  if (!target || loadingQuestions.value || isLoadingMore.value || hasMore.value === false) {
    return;
  }
  const {scrollTop, clientHeight, scrollHeight} = target;
  if (scrollTop + clientHeight >= scrollHeight - 40) {
    handleLoadMore();
  }
};

watch(() => props.show, (val) => {
  if (val) {
    const restored = restorePanelCache();
    if (!restored) {
      loadBanks();
      loadPublishedSelections();
    } else {
      restorePublishedSelections();
      if (!publishedQuestionIds.value.length) {
        loadPublishedSelections();
      }
      if (!questionBanks.value.length) {
        loadBanks();
      }
    }
  } else {
    savePanelCache();
    resetPanelState();
  }
});

watch(() => props.courseId, (val) => {
  if (val && props.show) {
    panelCache.value = null;
    resetPanelState();
    loadBanks();
    loadPublishedSelections();
  }
});

watch(() => props.classroomId, (val) => {
  if (val && props.show) {
    panelCache.value = null;
    loadPublishedSelections();
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.question-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: question-panel-enter 0.25s ease;
  width: 78vw;
  max-width: 1280px;
  min-height: 82vh;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, color-mix(in srgb, var(--background-secondary-color) 80%, transparent), color-mix(in srgb, var(--background-tertiary-color) 95%, transparent));
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  border-radius: 16px;
  box-shadow: 0 18px 38px color-mix(in srgb, var(--shadow-color) 80%, transparent);
  overflow: hidden;
  z-index: 1003;
}

@keyframes question-panel-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.question-panel__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1004;
  color: var(--text-color);

  &:hover {
    color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  }
}

.question-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 90%, transparent);
}

.question-panel__title {
  font-weight: 600;
  color: var(--text-color);
}

.question-panel__body {
  display: flex;
  gap: 0;
  flex: 1;
  min-height: 360px;

  &.is-detail {
    .question-panel__banks {
      width: 32%;
    }

    .question-panel__detail-wrap {
      width: 68%;
      display: flex;
      gap: 12px;
      overflow: hidden;
    }
  }

  &:not(.is-detail) {
    .question-panel__banks {
      width: 100%;
    }
  }
}

.question-panel__banks {
  border-right: 1px solid color-mix(in srgb, var(--border-secondary-color) 90%, transparent);
  padding: 12px;
  overflow: hidden;
}

.question-panel__questions {
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 40%;
}

.question-panel__section-title {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 10px;
}

.question-panel__search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  :deep(.n-input) {
    flex: 1;
  }
}

.question-panel__section-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.question-panel__section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 8px 12px;
}

.section-return {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
}

.section-title {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  display: flex;
  justify-content: flex-end;
}

.section-type {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  display: flex;
  align-items: center;
}

.section-update {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  justify-content: flex-end;
}

.publish-button__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--background-tertiary-color) 40%, transparent);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
  margin-left: 6px;
}

.question-panel__bank-info {
  display: flex;
  gap: 6px;
  flex-direction: column;
  min-width: 0;
}

.question-panel__bank-name {
  font-weight: 700;
  color: var(--text-color);
}

.question-panel__bank-meta {
  display: flex;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary-color);
  flex-wrap: wrap;
  align-items: center;
}

.meta-tag {
  padding: 3px 8px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-tertiary-color) 80%, transparent);
  color: var(--text-secondary-color);
}

.question-panel__bank-list {
  height: calc(100% - 10px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bank-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-tertiary-color) 70%, transparent);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
    box-shadow: 0 10px 24px color-mix(in srgb, var(--shadow-secondary-color) 90%, transparent);
  }

  &.is-active {
    border-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
    background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-light) 15%, transparent), color-mix(in srgb, var(--background-tertiary-color) 80%, transparent));
  }
}

.bank-item__title {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
}

.bank-item__title.is-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  overflow: hidden;
}

.bank-item__desc {
  font-size: 13px;
  color: var(--text-secondary-color);
}

.bank-item__desc.is-clamped-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.bank-item__meta {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-secondary-color);
  display: flex;
  gap: 10px;
}

.question-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-item {
  padding: 12px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-tertiary-color) 70%, transparent);
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
    box-shadow: 0 8px 18px color-mix(in srgb, var(--shadow-secondary-color) 90%, transparent);
  }

  &.is-active {
    border-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
    background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-light) 15%, transparent), color-mix(in srgb, var(--background-tertiary-color) 80%, transparent));
  }
}

.question-item__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.question-item__select {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 8px;
  background: transparent;
  border: none;
}

.question-item__order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 12px;
}

.question-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.question-item__title {
  font-weight: 600;
  color: var(--text-color);
  flex: 1;
  min-width: 0;
}

.question-item__title.is-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  overflow: hidden;
}

.question-item__tag {
  padding: 4px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  font-size: 12px;
  flex-shrink: 0;
}

.question-item__content {
  color: var(--text-secondary-color);
  line-height: 1.4;
  margin-bottom: 6px;
}

.question-item__content.is-clamped-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}



.question-item__title,
.question-item__content {
  :deep(.markdown-renderer),
  :deep(.markdown-body.custom-markdown),
  :deep(.markdown-body.custom-markdown > p) {
    display: inline;
    margin: 0;
  }
}

.question-item__meta {
  font-size: 12px;
  color: var(--text-secondary-color);
  display: flex;
  gap: 10px;
}

.question-panel__loading,
.question-panel__empty {
  padding: 12px;
  text-align: center;
  color: var(--text-secondary-color);
}

.question-panel__detail {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: color-mix(in srgb, var(--background-secondary-color) 75%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-secondary-color) 80%, transparent);
}

.question-detail__header {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-detail__head-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-detail__title {
  font-weight: 700;
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.question-detail__meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-secondary-color);
  flex-wrap: wrap;
}

.question-detail__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-detail__content {
  color: var(--text-secondary-color);
  line-height: 1.6;
  white-space: pre-wrap;
}

.question-detail__section-title {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.question-detail__options,
.question-detail__answers {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed color-mix(in srgb, var(--border-secondary-color) 80%, transparent);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-detail__option-list,
.question-detail__answer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sync-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 60vh;
  overflow: auto;
}

.sync-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--border-secondary-color) 80%, transparent);
  border-radius: 10px;
  background: var(--background-tertiary-color);
}

.sync-item__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.sync-item__order {
  min-width: 32px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-primary) 18%, transparent);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 12px;
}

.sync-item__title.is-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  overflow: hidden;
  color: var(--text-color);
}

.sync-item__right {
  flex-shrink: 0;
}

.sync-item__select {
  width: 180px;
}

.sync-range {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.sync-range__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sync-range__label {
  font-size: 12px;
  color: var(--text-secondary-color);
}

.sync-range__picker {
  width: 100%;
}

.sync-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.option-item {
  border: 1px solid color-mix(in srgb, var(--border-secondary-color) 85%, transparent);
  border-radius: 10px;
  padding: 10px;
  background: color-mix(in srgb, var(--background-tertiary-color) 70%, transparent);
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.is-correct {
    border-color: color-mix(in srgb, var(--success-color) 60%, transparent);
    background: color-mix(in srgb, var(--success-color) 12%, var(--background-tertiary-color));

    .option-item__label {
      color: var(--success-color);
    }
  }
}

.option-item__main {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.option-item__label {
  font-weight: 700;
  color: var(--color-primary);
  min-width: 18px;
}

.option-item__content {
  flex: 1;
  color: var(--text-secondary-color);
  line-height: 1.4;
}

.option-item__score {
  font-size: 12px;
  color: var(--text-secondary-color);
  white-space: nowrap;
}

.option-item__explanation {
  font-size: 12px;
  color: var(--text-secondary-color);
  line-height: 1.5;
}

.answer-item {
  border: 1px dashed color-mix(in srgb, var(--border-secondary-color) 85%, transparent);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-item__main {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.answer-item__index {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.answer-item__content {
  flex: 1;
  color: var(--text-secondary-color);
  line-height: 1.5;
}

.answer-item__explanation {
  font-size: 12px;
  color: var(--text-secondary-color);
  line-height: 1.5;
}

.answer-item__score {
  font-size: 12px;
  color: var(--text-secondary-color);
  white-space: nowrap;
}



.question-item__title,
.question-item__content,
.question-detail__title,
.question-detail__content,
.option-item__content,
.option-item__explanation,
.answer-item__content,
.answer-item__explanation {
  --question-renderer-font-family: inherit;
  --question-renderer-font-size: inherit;
  --question-renderer-line-height: inherit;
  --question-renderer-letter-spacing: inherit;
  --question-renderer-font-weight: inherit;
  --question-renderer-text-color: inherit;
}

.question-panel__placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary-color);
  font-size: 14px;
  padding: 12px;
}
</style>

