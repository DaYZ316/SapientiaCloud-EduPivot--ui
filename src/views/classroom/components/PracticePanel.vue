<template>
  <div v-if="show" class="practice-panel">
    <NButton circle class="practice-panel__close" quaternary size="small" @click="handleClose">
      <template #icon>
        <NIcon :component="CloseOutline" :size="18"/>
      </template>
    </NButton>
    <div class="practice-panel__header">
      <div class="practice-panel__title">{{ t('classroom.practicePanel.title') }}</div>
    </div>
    <div class="practice-panel__body">
      <div v-if="loading" class="practice-panel__loading">
        <NSpin size="small"/>
      </div>
      <div v-else-if="!practiceCards.length" class="practice-panel__empty">
        <NEmpty :description="t('classroom.practicePanel.empty')"/>
      </div>
      <div v-else class="practice-panel__content">
        <div class="practice-panel__sidebar" @scroll="handleScroll">
          <div
              v-for="card in practiceCards"
              :key="card.practice.id"
              :class="['practice-sidebar__item', {'is-active': card.practice.id === selectedPracticeId}]"
              @click="selectPractice(card.practice.id)"
          >
            <div class="practice-sidebar__order">#{{ card.practice.publishOrder }}</div>
            <div class="practice-sidebar__title">
              {{ card.practice.questionTitle || t('classroom.practicePanel.defaultQuestionTitle') }}
            </div>
          </div>
          <div v-if="loadingMore" class="practice-panel__loading-more">
            <NSpin size="small"/>
          </div>
          <div v-else-if="!hasMore && practiceCards.length > 0" class="practice-panel__no-more">
            {{ t('classroom.practicePanel.noMore') }}
          </div>
        </div>
        <div class="practice-panel__list">
          <div v-if="activeCard" class="practice-card">
            <div class="practice-card__header">
              <div class="practice-card__title-wrapper">
                <span class="practice-card__number">{{ activeCard.practice.publishOrder }}.</span>
                <div class="practice-card__title">
                  {{ activeCard.question?.questionTitle || t('classroom.practicePanel.defaultQuestionTitle') }}
                </div>
                <NTag :type="activeCard.practice.isRequired === IsRequiredEnum.REQUIRED ? 'success' : 'default'"
                      round size="small">
                  {{
                    activeCard.practice.isRequired === IsRequiredEnum.REQUIRED ? t('classroom.practicePanel.required') : t('classroom.practicePanel.optional')
                  }}
                </NTag>
              </div>
              <div v-if="activeCard.question" class="practice-card__info">
                <span class="practice-card__info-item">{{ questionTypeText(activeCard.question.questionType) }}</span>
                <span class="practice-card__info-item">难度:{{
                    getDifficultyText(activeCard.question.difficulty)
                  }}</span>
                <span class="practice-card__info-item">分值:{{ activeCard.question.score ?? 0 }}</span>
              </div>
            </div>
            <div class="practice-card__content"
                 v-html="activeCard.question?.questionContent || t('classroom.practicePanel.noContent')"></div>
            <div v-if="activeCard.question" class="practice-card__answer">
              <template v-if="isSingle(activeCard.question.questionType)">
                <template v-if="isAdminOrTeacher">
                  <div
                      v-for="option in activeCard.question.options || []"
                      :key="option.id"
                      :class="optionClass(option.id, activeCard.question, activeCard.submission)"
                  >
                    <div class="practice-option__row">
                      <span class="practice-option__label">{{ option.optionLabel }}</span>
                      <span class="practice-option__content" v-html="option.optionContent || '选项'"></span>
                    </div>
                    <div v-if="option.explanation" class="practice-option__explanation">{{ option.explanation }}</div>
                  </div>
                </template>
                <template v-else>
                  <NRadioGroup
                      v-if="canEdit"
                      :value="getSingleOptionValue(activeCard.question.id)"
                      @update:value="setSingleOptionValue(activeCard.question.id, $event as string)"
                  >
                    <div
                        v-for="option in activeCard.question.options || []"
                        :key="option.id"
                        :class="optionClass(option.id, activeCard.question, activeCard.submission)"
                    >
                      <NRadio :value="option.id">
                        <div class="practice-option__row">
                          <span class="practice-option__label">{{ option.optionLabel }}</span>
                          <span class="practice-option__content" v-html="option.optionContent || '选项'"></span>
                        </div>
                      </NRadio>
                    </div>
                  </NRadioGroup>
                  <template v-else>
                    <div
                        v-for="option in activeCard.question.options || []"
                        :key="option.id"
                        :class="optionClass(option.id, activeCard.question, activeCard.submission)"
                    >
                      <div class="practice-option__row">
                        <span class="practice-option__label">{{ option.optionLabel }}</span>
                        <span class="practice-option__content" v-html="option.optionContent || '选项'"></span>
                      </div>
                      <div v-if="option.explanation" class="practice-option__explanation">{{ option.explanation }}</div>
                    </div>
                  </template>
                </template>
              </template>
              <template v-else-if="isMultiple(activeCard.question.questionType)">
                <template v-if="isAdminOrTeacher">
                  <div
                      v-for="option in activeCard.question.options || []"
                      :key="option.id"
                      :class="optionClass(option.id, activeCard.question, activeCard.submission)"
                  >
                    <div class="practice-option__row">
                      <span class="practice-option__label">{{ option.optionLabel }}</span>
                      <span class="practice-option__content" v-html="option.optionContent || '选项'"></span>
                    </div>
                    <div v-if="option.explanation" class="practice-option__explanation">{{ option.explanation }}</div>
                  </div>
                </template>
                <template v-else>
                  <NCheckboxGroup
                      v-if="canEdit"
                      :value="getMultiOptionValues(activeCard.question.id)"
                      @update:value="setMultiOptionValues(activeCard.question.id, $event as string[])"
                  >
                    <div
                        v-for="option in activeCard.question.options || []"
                        :key="option.id"
                        :class="optionClass(option.id, activeCard.question, activeCard.submission)"
                    >
                      <NCheckbox :value="option.id">
                        <div class="practice-option__row">
                          <span class="practice-option__label">{{ option.optionLabel }}</span>
                          <span class="practice-option__content" v-html="option.optionContent || '选项'"></span>
                        </div>
                      </NCheckbox>
                    </div>
                  </NCheckboxGroup>
                  <template v-else>
                    <div
                        v-for="option in activeCard.question.options || []"
                        :key="option.id"
                        :class="optionClass(option.id, activeCard.question, activeCard.submission)"
                    >
                      <div class="practice-option__row">
                        <span class="practice-option__label">{{ option.optionLabel }}</span>
                        <span class="practice-option__content" v-html="option.optionContent || '选项'"></span>
                      </div>
                      <div v-if="option.explanation" class="practice-option__explanation">{{ option.explanation }}</div>
                    </div>
                  </template>
                </template>
              </template>
              <template v-else-if="isBlank(activeCard.question.questionType)">
                <template v-if="isAdminOrTeacher">
                  <div v-if="activeCard.question.answers?.length" class="practice-card__answer-display">
                    <div class="practice-card__answer-title">正确答案：</div>
                    <div class="practice-card__correct-answers">
                      <div
                          v-for="(answer, index) in activeCard.question.answers || []"
                          :key="answer.id || index"
                          class="practice-card__answer-item"
                      >
                        <span class="practice-card__answer-index">填空 {{ index + 1 }}：</span>
                        <span class="practice-card__answer-content">{{ answer.answerContent }}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div v-if="canEdit" class="practice-blanks">
                    <div
                        v-for="(blank, blankIndex) in getBlankValues(activeCard.question.id, activeCard.question.answers?.length || 1)"
                        :key="`blank-${blankIndex}`"
                        class="practice-blank"
                    >
                      <span class="practice-blank__label">{{
                          t('classroom.practicePanel.blankLabel', {index: blankIndex + 1})
                        }}</span>
                      <NInput
                          :placeholder="t('classroom.practicePanel.answerPlaceholder')"
                          :value="blank"
                          clearable
                          @update:value="setBlankValue(activeCard.question!.id, blankIndex, $event as string)"
                      />
                    </div>
                  </div>
                  <div v-if="activeCard.submission?.answer?.blanks" class="practice-card__answer-display">
                    <div class="practice-card__answer-title">我的回答：</div>
                    <div class="practice-card__correct-answers">
                      <div
                          v-for="(answer, index) in activeCard.submission.answer.blanks || []"
                          :key="`my-blank-${index}`"
                          class="practice-card__answer-item"
                      >
                        <span class="practice-card__answer-index">填空 {{ index + 1 }}：</span>
                        <span class="practice-card__answer-content">{{ answer ?? '' }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="shouldShowAnswer && activeCard.question.answers?.length"
                       class="practice-card__answer-display">
                    <div class="practice-card__answer-title">正确答案：</div>
                    <div class="practice-card__correct-answers">
                      <div
                          v-for="(answer, index) in activeCard.question.answers || []"
                          :key="answer.id || index"
                          class="practice-card__answer-item"
                      >
                        <span class="practice-card__answer-index">填空 {{ index + 1 }}：</span>
                        <span class="practice-card__answer-content">{{ answer.answerContent }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <template v-else-if="isShort(activeCard.question.questionType)">
                <template v-if="isAdminOrTeacher">
                  <div v-if="activeCard.question.answers?.length" class="practice-card__answer-display">
                    <div class="practice-card__answer-title">正确答案：</div>
                    <div class="practice-card__correct-answers">
                      <div
                          v-for="(answer, index) in activeCard.question.answers || []"
                          :key="answer.id || index"
                          class="practice-card__answer-item"
                      >
                        <div class="practice-card__answer-content" v-html="answer.answerContent"></div>
                        <div v-if="answer.explanation" class="practice-card__answer-explanation">
                          解析：{{ answer.explanation }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <NInput
                      v-if="canEdit"
                      :maxlength="2000"
                      :placeholder="t('classroom.practicePanel.answerPlaceholder')"
                      :rows="6"
                      :value="getContentValue(activeCard.question.id)"
                      clearable
                      show-count
                      type="textarea"
                      @update:value="setContentValue(activeCard.question.id, $event as string)"
                  />
                  <div v-if="activeCard.submission?.answer?.content" class="practice-card__answer-display">
                    <div class="practice-card__answer-title">我的回答：</div>
                    <div class="practice-card__correct-answers">
                      <div class="practice-card__answer-item">
                        <div class="practice-card__answer-content">{{ activeCard.submission.answer.content }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="shouldShowAnswer && activeCard.question.answers?.length"
                       class="practice-card__answer-display">
                    <div class="practice-card__answer-title">正确答案：</div>
                    <div class="practice-card__correct-answers">
                      <div
                          v-for="(answer, index) in activeCard.question.answers || []"
                          :key="answer.id || index"
                          class="practice-card__answer-item"
                      >
                        <div class="practice-card__answer-content" v-html="answer.answerContent"></div>
                        <div v-if="answer.explanation" class="practice-card__answer-explanation">
                          解析：{{ answer.explanation }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
            <div v-if="!isAdminOrTeacher" class="practice-card__footer">
              <div class="practice-card__status">
                <span v-if="activeCard.submission?.score !== null && activeCard.submission?.score !== undefined"
                      class="practice-card__score">
                  {{ t('classroom.practicePanel.scorePrefix') }}{{ activeCard.submission?.score ?? 0 }}
                </span>
              </div>
              <NButton
                  v-if="canEdit"
                  :disabled="!resolvedClassroomId || !activeCard.question || !hasAnswer(activeCard.question.id)"
                  :loading="isSubmitting(activeCard.question?.id)"
                  round
                  size="medium"
                  type="primary"
                  @click="submitPracticeAnswer(activeCard)"
              >
                {{ t('classroom.practicePanel.submit') }}
              </NButton>
            </div>
          </div>
          <div v-else class="practice-panel__empty">
            <NEmpty :description="t('classroom.practicePanel.empty')"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NEmpty,
  NIcon,
  NInput,
  NRadio,
  NRadioGroup,
  NSpin,
  NTag,
  useMessage
} from 'naive-ui';
import {CloseOutline} from '@vicons/ionicons5';
import {getDefaultClassroomQuestionPageQueryDTO, listClassroomPractice} from '@/api/classroom/classroomPractice';
import {getQuestionById} from '@/api/course/question';
import {
  getDefaultAnswerPayload,
  getDefaultQuestionStudentSubmitDTO,
  listPracticeByClassroomAndStudent,
  submitPractice
} from '@/api/student/practice';
import type {ClassroomQuestionVO} from '@/types/classroom';
import type {QuestionVO} from '@/types/course';
import type {AnswerPayload, QuestionStudent} from '@/types/student';
import {getQuestionTypeLabel, QuestionTypeEnum} from '@/enum/course/questionTypeEnum';
import {getQuestionBankDifficultyLabel} from '@/enum/course/questionBankDifficultyEnum';
import {IsRequiredEnum} from '@/enum/classroom/isRequiredEnum';
import {useUserStore} from '@/store';

type PracticeCard = {
  practice: ClassroomQuestionVO;
  question: QuestionVO | null;
  submission: QuestionStudent | null;
};

const props = defineProps<{
  show: boolean;
  classroomId: string | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const loading = ref<boolean | null>(null);
const loadingMore = ref<boolean | null>(null);
const practiceCards = ref<PracticeCard[]>([]);
const questionsCache = ref<Record<string, QuestionVO>>({});
const answers = ref<Record<string, AnswerPayload>>({});
const submittingMap = ref<Record<string, boolean | null>>({});
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const hasMore = ref<boolean>(true);
const queryParams = ref<ReturnType<typeof getDefaultClassroomQuestionPageQueryDTO>>(getDefaultClassroomQuestionPageQueryDTO());
const selectedPracticeId = ref<string | null>(null);
const activeCard = computed(() => practiceCards.value.find(item => item.practice.id === selectedPracticeId.value) || null);
const panelCache = ref<{
  classroomId: string | null;
  practiceCards: PracticeCard[];
  questionsCache: Record<string, QuestionVO>;
  answers: Record<string, AnswerPayload>;
  pageNum: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  selectedPracticeId: string | null;
} | null>(null);

const resolvedClassroomId = computed(() => props.classroomId ?? null);

const {t, locale} = useI18n();
const userStore = useUserStore();
const message = useMessage();

const isAdminOrTeacher = computed(() => {
  const userRoles = userStore.userInfo?.roles || [];
  const isAdmin = userRoles.some(role => role.roleKey === 'ADMIN' || role.admin === true);
  const isTeacher = userStore.hasRole('TEACHER') && userStore.teacherInfo !== null;
  return isAdmin || isTeacher;
});

const shouldShowAnswer = computed(() => {
  if (isAdminOrTeacher.value) {
    return true;
  }
  return activeCard.value?.submission !== null;
});

const canEdit = computed(() => {
  if (isAdminOrTeacher.value) {
    return false;
  }
  return activeCard.value?.submission === null;
});

const handleClose = () => {
  emit('close');
};

const selectPractice = async (practiceId: string) => {
  selectedPracticeId.value = practiceId;
  const target = practiceCards.value.find(item => item.practice.id === practiceId);
  if (target?.practice.questionId) {
    await loadQuestionForPractice(target.practice.id, target.practice.questionId, target.submission);
  }
};

const isSingle = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.SINGLE_CHOICE || questionType === QuestionTypeEnum.TRUE_FALSE;
const isMultiple = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.MULTIPLE_CHOICE;
const isBlank = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.FILL_BLANK;
const isShort = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.SHORT_ANSWER;

const questionTypeText = (questionType: number | null | undefined) => {
  const isEn = String(locale.value || '').toLowerCase().startsWith('en');
  return getQuestionTypeLabel(questionType ?? '', isEn);
};

const getDifficultyText = (difficulty: number | null | undefined) => {
  if (difficulty === null || difficulty === undefined) {
    return '';
  }
  const isEn = String(locale.value || '').toLowerCase().startsWith('en');
  return getQuestionBankDifficultyLabel(difficulty, isEn);
};


const buildDefaultAnswerByQuestion = (question: QuestionVO | null): AnswerPayload => {
  const base = getDefaultAnswerPayload();
  if (!question) {
    return base;
  }
  if (isBlank(question.questionType)) {
    const blanksCount = question.answers?.length || 1;
    return {...base, blanks: Array.from({length: blanksCount}, () => '')};
  }
  if (isShort(question.questionType)) {
    return {...base, content: null};
  }
  return {...base, options: []};
};

const optionClass = (optionId: string | null | undefined, question: QuestionVO | null, submission: QuestionStudent | null) => {
  if (!optionId || !question) return ['practice-option'];
  const option = question.options?.find(opt => opt.id === optionId);
  const optionLabel = option?.optionLabel ?? null;
  if (!optionLabel) return ['practice-option'];
  const isCorrect = option?.isCorrect === 1;
  const canShowAnswer = isAdminOrTeacher.value || submission !== null;

  if (!submission) {
    return [
      'practice-option',
      canShowAnswer && isCorrect ? 'is-correct' : ''
    ];
  }
  const userPicked = Array.isArray(submission.answer?.options) && submission.answer?.options.includes(optionLabel);
  return [
    'practice-option',
    userPicked ? 'is-user' : '',
    canShowAnswer && isCorrect ? 'is-correct' : '',
    userPicked && canShowAnswer && isCorrect ? 'is-user-correct' : ''
  ];
};

const ensureAnswer = (questionId: string, question: QuestionVO | null) => {
  if (!answers.value[questionId]) {
    answers.value[questionId] = buildDefaultAnswerByQuestion(question);
  }
  return answers.value[questionId];
};

const loadQuestionForPractice = async (practiceId: string, questionId: string, submission: QuestionStudent | null) => {
  if (!questionId) return;
  if (!questionsCache.value[questionId]) {
    const res = await getQuestionById(questionId);
    if (res?.data?.id) {
      questionsCache.value[questionId] = res.data;
    }
  }
  const question = questionsCache.value[questionId] || null;
  practiceCards.value = practiceCards.value.map(item => {
    if (item.practice.id === practiceId) {
      return {...item, question};
    }
    return item;
  });
  if (question) {
    const defaultAnswer = buildDefaultAnswerByQuestion(question);
    let submissionAnswer = submission?.answer;
    if (submissionAnswer && submissionAnswer.options && Array.isArray(submissionAnswer.options)) {
      const options = submissionAnswer.options;
      const hasIds = options.some((opt: string) => {
        return question.options?.some(qOpt => qOpt.id === opt);
      });
      if (hasIds) {
        submissionAnswer = {
          ...submissionAnswer,
          options: options.map((optId: string) => {
            const option = question.options?.find(qOpt => qOpt.id === optId);
            return option?.optionLabel ?? optId;
          }).filter((label): label is string => Boolean(label))
        };
      }
    }
    answers.value[questionId] = submissionAnswer
        ? {...defaultAnswer, ...submissionAnswer}
        : answers.value[questionId] || defaultAnswer;
  }
};

const getOptionLabelById = (question: QuestionVO | null, optionId: string | null): string | null => {
  if (!question || !optionId) return null;
  const option = question.options?.find(opt => opt.id === optionId);
  return option?.optionLabel ?? null;
};

const getOptionIdByLabel = (question: QuestionVO | null, optionLabel: string | null): string | null => {
  if (!question || !optionLabel) return null;
  const option = question.options?.find(opt => opt.optionLabel === optionLabel);
  return option?.id ?? null;
};

const getSingleOptionValue = (questionId: string) => {
  const answer = answers.value[questionId];
  const optionLabel = answer?.options?.[0] ?? null;
  if (!optionLabel) return null;
  const question = questionsCache.value[questionId] || activeCard.value?.question || null;
  return getOptionIdByLabel(question, optionLabel);
};

const setSingleOptionValue = (questionId: string, value: string | null) => {
  const question = questionsCache.value[questionId] || activeCard.value?.question || null;
  const optionLabel = getOptionLabelById(question, value);
  const answer = answers.value[questionId] ?? getDefaultAnswerPayload();
  answers.value = {
    ...answers.value,
    [questionId]: {...answer, options: optionLabel ? [optionLabel] : []}
  };
};

const getMultiOptionValues = (questionId: string) => {
  const answer = answers.value[questionId];
  const optionLabels = answer?.options || [];
  if (optionLabels.length === 0) return [];
  const question = questionsCache.value[questionId] || activeCard.value?.question || null;
  return optionLabels.map(label => getOptionIdByLabel(question, label)).filter((id): id is string => Boolean(id));
};

const setMultiOptionValues = (questionId: string, values: string[]) => {
  const question = questionsCache.value[questionId] || activeCard.value?.question || null;
  const optionLabels = values.map(id => getOptionLabelById(question, id)).filter((label): label is string => Boolean(label));
  const answer = answers.value[questionId] ?? getDefaultAnswerPayload();
  answers.value = {
    ...answers.value,
    [questionId]: {...answer, options: optionLabels}
  };
};

const getBlankValues = (questionId: string, length: number) => {
  ensureAnswer(questionId, null);
  const blanks = answers.value[questionId]?.blanks || [];
  if (blanks.length < length) {
    const filled = [...blanks];
    while (filled.length < length) {
      filled.push('');
    }
    answers.value = {
      ...answers.value,
      [questionId]: {...answers.value[questionId], blanks: filled}
    };
    return filled;
  }
  return blanks;
};

const setBlankValue = (questionId: string, index: number, value: string | null) => {
  const blanks = answers.value[questionId]?.blanks ? [...answers.value[questionId].blanks!] : [];
  blanks[index] = value ?? '';
  const answer = answers.value[questionId] ?? getDefaultAnswerPayload();
  answers.value = {
    ...answers.value,
    [questionId]: {...answer, blanks}
  };
};

const getContentValue = (questionId: string) => answers.value[questionId]?.content ?? null;

const setContentValue = (questionId: string, value: string | null) => {
  const answer = answers.value[questionId] ?? getDefaultAnswerPayload();
  answers.value = {
    ...answers.value,
    [questionId]: {...answer, content: value}
  };
};

const hasAnswer = (questionId: string) => {
  const answer = answers.value[questionId];
  if (!answer) {
    return false;
  }
  if (answer.options && answer.options.length > 0) {
    return true;
  }
  if (answer.blanks && answer.blanks.some(item => item !== null && item !== '')) {
    return true;
  }
  if (answer.content) {
    return true;
  }
  return false;
};

const isSubmitting = (questionId: string | null | undefined) => {
  if (!questionId) {
    return false;
  }
  return Boolean(submittingMap.value[questionId]);
};

const normalizeAnswer = (question: QuestionVO, answer: AnswerPayload | null) => {
  const base = buildDefaultAnswerByQuestion(question);
  const payload = {...base, ...(answer || {})};
  if (isBlank(question.questionType) && payload.blanks) {
    payload.blanks = payload.blanks.map(item => item ?? '');
  }
  if ((isSingle(question.questionType) || isMultiple(question.questionType)) && payload.options) {
    payload.options = payload.options
        .filter(item => item !== null && item !== undefined)
        .map(item => {
          if (!item) return item;
          const isId = question.options?.some(opt => opt.id === item);
          if (isId) {
            const option = question.options?.find(opt => opt.id === item);
            return option?.optionLabel ?? item;
          }
          return item;
        });
  }
  return payload;
};

const loadPracticeCards = async () => {
  const classroomId = resolvedClassroomId.value;
  if (!classroomId) {
    practiceCards.value = [];
    total.value = 0;
    hasMore.value = false;
    pageNum.value = 1;
    return;
  }
  loading.value = true;
  pageNum.value = 1;
  queryParams.value = getDefaultClassroomQuestionPageQueryDTO();
  queryParams.value.classroomId = classroomId;
  queryParams.value.pageNum = pageNum.value;
  queryParams.value.pageSize = pageSize.value;
  const practiceRes: any = await Promise.resolve().then(() => listClassroomPractice(queryParams.value));
  let practiceList: ClassroomQuestionVO[] = [];
  let responseTotal = 0;
  if (practiceRes) {
    if (Array.isArray(practiceRes.data)) {
      practiceList = practiceRes.data;
      responseTotal = practiceRes.total ?? 0;
    } else if (practiceRes.data && Array.isArray(practiceRes.data.data)) {
      practiceList = practiceRes.data.data;
      responseTotal = practiceRes.data.total ?? 0;
    } else if (Array.isArray(practiceRes)) {
      practiceList = practiceRes;
    }
  }
  total.value = responseTotal;
  hasMore.value = practiceList.length < total.value;
  practiceCards.value = practiceList.map(item => ({
    practice: item,
    question: item.questionVO ?? null,
    submission: (item as any).submission ?? null
  }));

  const studentId = userStore.studentInfo?.id ?? null;
  if (studentId && !isAdminOrTeacher.value) {
    const submissionRes = await Promise.resolve().then(() => listPracticeByClassroomAndStudent(classroomId, studentId));
    let submissionList: QuestionStudent[] = [];
    if (submissionRes && submissionRes.data) {
      if (Array.isArray(submissionRes.data)) {
        submissionList = submissionRes.data;
      }
    }
    const submissionMap = new Map<string, QuestionStudent>();
    submissionList.forEach(submission => {
      if (submission.questionId) {
        submissionMap.set(submission.questionId, submission);
      }
    });
    practiceCards.value = practiceCards.value.map(card => {
      const questionId = card.practice.questionId;
      if (questionId && submissionMap.has(questionId)) {
        return {...card, submission: submissionMap.get(questionId) ?? null};
      }
      return card;
    });
  }

  if (!selectedPracticeId.value && practiceCards.value.length > 0) {
    selectedPracticeId.value = practiceCards.value[0].practice.id;
  }
  const current = practiceCards.value.find(item => item.practice.id === selectedPracticeId.value);
  if (current && !current.question && current.practice.questionId) {
    await loadQuestionForPractice(current.practice.id, current.practice.questionId, current.submission);
  }
  loading.value = null;
};

const loadMorePracticeCards = async () => {
  const classroomId = resolvedClassroomId.value;
  if (!classroomId || !hasMore.value || loadingMore.value) {
    return;
  }
  loadingMore.value = true;
  pageNum.value += 1;
  queryParams.value.pageNum = pageNum.value;
  queryParams.value.pageSize = pageSize.value;
  const practiceRes: any = await Promise.resolve().then(() => listClassroomPractice(queryParams.value));
  let practiceList: ClassroomQuestionVO[] = [];
  if (practiceRes) {
    if (Array.isArray(practiceRes.data)) {
      practiceList = practiceRes.data;
    } else if (practiceRes.data && Array.isArray(practiceRes.data.data)) {
      practiceList = practiceRes.data.data;
    } else if (Array.isArray(practiceRes)) {
      practiceList = practiceRes;
    }
  }
  if (practiceList.length > 0) {
    const newCards = practiceList.map(item => ({
      practice: item,
      question: item.questionVO ?? null,
      submission: (item as any).submission ?? null
    }));
    practiceCards.value = [...practiceCards.value, ...newCards];
    if (!selectedPracticeId.value && practiceCards.value.length > 0) {
      selectedPracticeId.value = practiceCards.value[0].practice.id;
      await loadQuestionForPractice(practiceCards.value[0].practice.id, practiceCards.value[0].practice.questionId, null);
    }
    hasMore.value = practiceCards.value.length < total.value;
  } else {
    hasMore.value = false;
  }
  loadingMore.value = null;
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement | null;
  if (!target || loadingMore.value || !hasMore.value) {
    return;
  }
  const {scrollTop, clientHeight, scrollHeight} = target;
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    loadMorePracticeCards();
  }
};

const submitPracticeAnswer = async (card: PracticeCard) => {
  if (!card.question || !resolvedClassroomId.value) {
    return;
  }
  const payload = getDefaultQuestionStudentSubmitDTO();
  payload.questionId = card.question.id;
  payload.answer = normalizeAnswer(card.question, answers.value[card.question.id] || null);
  submittingMap.value = {...submittingMap.value, [card.question.id]: true};
  const res = await submitPractice(resolvedClassroomId.value, userStore.studentInfo?.id ?? null, payload, card.practice.id, card.practice.courseId);
  const isSuccess = Boolean(res?.success);
  submittingMap.value = {...submittingMap.value, [card.question.id]: null};

  if (isSuccess) {
    message.success('提交成功');
    const currentSelectedId = selectedPracticeId.value;
    await loadPracticeCards();
    if (currentSelectedId) {
      selectedPracticeId.value = currentSelectedId;
      const updatedCard = practiceCards.value.find(item => item.practice.id === currentSelectedId);
      if (updatedCard && updatedCard.practice.questionId) {
        await loadQuestionForPractice(updatedCard.practice.id, updatedCard.practice.questionId, updatedCard.submission);
      }
    }
  }
};

const resetPanelState = () => {
  practiceCards.value = [];
  questionsCache.value = {};
  answers.value = {};
  pageNum.value = 1;
  pageSize.value = 10;
  total.value = 0;
  hasMore.value = true;
  selectedPracticeId.value = null;
  queryParams.value = getDefaultClassroomQuestionPageQueryDTO();
};

const savePanelCache = () => {
  panelCache.value = {
    classroomId: props.classroomId ?? null,
    practiceCards: [...practiceCards.value],
    questionsCache: {...questionsCache.value},
    answers: {...answers.value},
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    total: total.value,
    hasMore: hasMore.value,
    selectedPracticeId: selectedPracticeId.value
  };
};

const restorePanelCache = () => {
  const cache = panelCache.value;
  const sameClassroom = cache?.classroomId === (props.classroomId ?? null);
  if (!cache || !sameClassroom) {
    return false;
  }
  practiceCards.value = [...cache.practiceCards];
  questionsCache.value = {...cache.questionsCache};
  answers.value = {...cache.answers};
  pageNum.value = cache.pageNum;
  pageSize.value = cache.pageSize;
  total.value = cache.total;
  hasMore.value = cache.hasMore;
  selectedPracticeId.value = cache.selectedPracticeId;
  return true;
};

watch(() => props.show, (val) => {
  if (val) {
    const restored = restorePanelCache();
    if (!restored) {
      loadPracticeCards();
    }
  } else {
    savePanelCache();
    resetPanelState();
  }
});

watch(() => props.classroomId, (val) => {
  if (val && props.show) {
    panelCache.value = null;
    resetPanelState();
    loadPracticeCards();
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.practice-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: practice-panel-enter 0.25s ease;
  width: 82vw;
  max-width: 1280px;
  min-height: 78vh;
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--background-secondary-color) 82%, transparent),
          color-mix(in srgb, var(--background-tertiary-color) 95%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
  border-radius: 16px;
  box-shadow: 0 18px 36px color-mix(in srgb, var(--shadow-color) 78%, transparent);
  overflow: hidden;
  z-index: 1003;
}

@keyframes practice-panel-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.practice-panel__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1004;
  color: var(--text-color);

  &:hover {
    color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 16%, transparent);
  }
}

.practice-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 88%, transparent);
}

.practice-panel__title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-color);
}

.practice-panel__body {
  display: flex;
  flex: 1;
  min-height: 360px;
  background: color-mix(in srgb, var(--background-secondary-color) 85%, transparent);
}

.practice-panel__loading,
.practice-panel__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary-color);
  padding: 16px;
}

.practice-panel__content {
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 0;
  flex: 1;
  min-height: 0;
}

.practice-panel__sidebar {
  border-right: 1px solid color-mix(in srgb, var(--border-secondary-color) 88%, transparent);
  padding: 12px;
  overflow-y: auto;
  background: color-mix(in srgb, var(--background-tertiary-color) 82%, transparent);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.practice-sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--background-secondary-color) 82%, transparent);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
    box-shadow: 0 10px 24px color-mix(in srgb, var(--shadow-secondary-color) 88%, transparent);
  }

  &.is-active {
    border-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
    background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-primary-light) 15%, transparent),
            color-mix(in srgb, var(--background-secondary-color) 82%, transparent)
    );
  }
}

.practice-sidebar__order {
  min-width: 28px;
  height: 24px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.practice-sidebar__title {
  flex: 1;
  min-width: 0;
  color: var(--text-color);
  font-weight: 600;
  line-height: 1.4;
}

.practice-panel__loading-more,
.practice-panel__no-more {
  text-align: center;
  color: var(--text-secondary-color);
  padding: 8px 0;
  font-size: 13px;
}

.practice-panel__list {
  padding: 12px;
  overflow-y: auto;
  background: color-mix(in srgb, var(--background-secondary-color) 85%, transparent);
}

.practice-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 20px;
  background: color-mix(in srgb, var(--background-secondary-color) 92%, transparent);
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--border-secondary-color) 60%, transparent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--shadow-color) 12%, transparent);
}

.practice-card__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 50%, transparent);
}

.practice-card__title-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.practice-card__number {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 18px;
  line-height: 1.5;
  flex-shrink: 0;
  min-width: 28px;
}

.practice-card__title {
  font-weight: 700;
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.6;
  flex: 1;
  min-width: 0;
}

.practice-card__info {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 40px;
}

.practice-card__info-item {
  color: var(--text-secondary-color);
  font-size: 13px;
  font-weight: 400;
}

.practice-card__content {
  color: var(--text-color);
  line-height: 1.8;
  background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--color-primary) 2%, var(--background-tertiary-color) 98%),
          color-mix(in srgb, var(--background-secondary-color) 88%, transparent)
  );
  border-radius: 14px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 6%, var(--border-secondary-color) 94%);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--shadow-color) 8%, transparent);
  min-height: 60px;
}

.practice-card__answer {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.practice-card__answer :deep(.n-radio-group),
.practice-card__answer :deep(.n-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.practice-option {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--border-secondary-color) 82%, transparent);
  background: color-mix(in srgb, var(--background-tertiary-color) 86%, transparent);

  &.is-correct {
    border-color: color-mix(in srgb, var(--success-color) 55%, transparent);
    background: color-mix(in srgb, var(--success-color) 12%, var(--background-tertiary-color));

    .practice-option__label {
      color: var(--success-color);
    }
  }

  &.is-user {
    border-color: color-mix(in srgb, var(--color-primary) 60%, transparent);
    background: color-mix(in srgb, var(--color-primary) 10%, var(--background-tertiary-color));

    .practice-option__label {
      color: var(--color-primary);
    }
  }

  &.is-user-correct {
    border-color: color-mix(in srgb, var(--color-primary) 50%, var(--success-color) 50%);
    background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-primary) 16%, var(--background-tertiary-color)),
            color-mix(in srgb, var(--success-color) 12%, var(--background-tertiary-color))
    );

    .practice-option__label {
      color: color-mix(in srgb, var(--color-primary) 55%, var(--success-color) 45%);
    }
  }
}

.practice-option__row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.practice-option__label {
  font-weight: 700;
  color: var(--color-primary);
  min-width: 18px;
}

.practice-option__content {
  color: var(--text-secondary-color);
  line-height: 1.4;
}

.practice-option__explanation {
  font-size: 12px;
  color: var(--text-secondary-color);
  line-height: 1.4;
}

.practice-blanks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.practice-blank {
  display: flex;
  align-items: center;
  gap: 10px;
}

.practice-blank__label {
  min-width: 70px;
  color: var(--text-secondary-color);
}

.practice-card__answer-display {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed color-mix(in srgb, var(--border-secondary-color) 78%, transparent);
  background: color-mix(in srgb, var(--background-tertiary-color) 90%, transparent);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.practice-card__correct-answers {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.practice-card__answer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--text-secondary-color);
}

.practice-card__answer-index {
  font-weight: 600;
  color: var(--color-primary);
}

.practice-card__answer-content,
.practice-card__answer-explanation {
  line-height: 1.5;
}

.practice-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
}

.practice-card__status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary-color);
}

.practice-card__score {
  font-weight: 600;
  color: var(--text-color);
}

@media (max-width: 1024px) {
  .practice-panel {
    width: 96vw;
    height: 92vh;
  }

  .practice-panel__content {
    grid-template-columns: 1fr;
  }

  .practice-panel__sidebar {
    min-height: 180px;
    max-height: 240px;
  }
}
</style>

