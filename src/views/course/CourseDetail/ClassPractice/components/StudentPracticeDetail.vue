<template>
  <div class="student-practice-panel">
    <n-card class="practice-detail-card">
      <template v-if="selectedPractice" #header>
        <div class="practice-detail-header">
          <div class="practice-detail-title">
            <span class="practice-number">{{ selectedPractice.publishOrder }}.</span>
            {{ selectedPractice.questionTitle || t('course.classPractice.unnamedQuestion') }}
          </div>
          <div class="practice-time-info">
            <n-space>
              <n-text depth="3">
                <template #icon>
                  <n-icon color="#52c41a" size="16">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                {{ t('course.classPractice.startTime') }}: {{ formatTime(selectedPractice.startTime) }}
              </n-text>
              <n-text depth="3">
                <template #icon>
                  <n-icon color="#fa541c" size="16">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                {{ t('course.classPractice.endTime') }}: {{ formatTime(selectedPractice.endTime) }}
              </n-text>
            </n-space>
          </div>
          <n-tag
              :type="selectedPractice.isRequired === IsRequiredEnum.REQUIRED ? 'success' : 'default'"
              round
              size="small"
          >
            {{ getIsRequiredLabel(selectedPractice.isRequired, isEn) }}
          </n-tag>
        </div>
      </template>

      <!-- 题目详情 -->
      <div v-if="loadingAll" class="loading-container">
        <n-spin size="large"/>
      </div>
      <div v-else-if="questionDetail" class="question-detail-content">
        <!-- 题目元信息 -->
        <div class="detail-header">
          <div class="detail-meta">
            <div class="meta-item">
              <div class="meta-label">{{ t('course.classPractice.questionType') }}</div>
              <div class="meta-value">{{ getQuestionTypeText(questionDetail.questionType) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">{{ t('course.classPractice.difficulty') }}</div>
              <div class="meta-value">{{ getDifficultyText(questionDetail.difficulty) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">{{ t('course.classPractice.score') }}</div>
              <div class="meta-value">{{ formatScore(questionDetail.score) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">{{ t('course.classPractice.estimatedTime') }}</div>
              <div class="meta-value">{{ formatEstimatedTime(questionDetail.estimatedTime) }}</div>
            </div>
          </div>
          <div v-if="questionDetail.tags && questionDetail.tags.length" class="detail-tags">
            <n-tag
                v-for="tag in questionDetail.tags"
                :key="tag"
                size="small"
                type="info"
            >
              {{ tag }}
            </n-tag>
          </div>
        </div>

        <!-- 题目内容 -->
        <div class="detail-section">
          <div class="section-block">
            <div class="section-body">
              <!-- 标题已移除，只展示题目内容 -->
              <div class="detail-content-row">
                <div class="detail-content" v-html="questionDetail.questionContent"></div>
                <n-tag
                    v-if="studentSubmission && studentSubmission.isCorrect !== null && studentSubmission.isCorrect !== undefined"
                    :type="getSubmissionStatusType(studentSubmission.isCorrect)"
                    class="submission-status-tag content-submission-status"
                    round
                    size="small"
                >
                  {{ getSubmissionStatusLabel(studentSubmission.isCorrect) }}
                </n-tag>
              </div>
            </div>
          </div>

          <!-- 选项 -->
          <div
              v-if="questionDetail.options && questionDetail.options.length > 0"
              class="section-block"
          >
            <div class="detail-options">
              <!-- 单选题 -->
              <template v-if="isSingle(questionDetail.questionType)">
                <template v-if="isAdminOrTeacher">
                  <!-- 管理员/老师显示选项 -->
                  <div
                      v-for="(option, optionIndex) in questionDetail.options"
                      :key="option.id ?? `option-${optionIndex}`"
                      :class="optionClass(option.id, questionDetail, studentSubmission)"
                  >
                    <div class="option-main">
                      <div class="option-content">
                        <span class="option-label">
                          {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                        </span>
                        <div v-html="option.optionContent"></div>
                      </div>
                      <div
                          v-if="option.score !== null && option.score !== undefined && studentSubmission"
                          class="option-score"
                      >
                        {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                      </div>
                    </div>
                    <div
                        v-if="option.explanation && shouldShowAnswer"
                        class="option-explanation"
                    >
                      {{ option.explanation }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- 学生显示单选框 -->
                  <n-radio-group
                      v-if="canEdit"
                      :value="getSingleOptionValue(questionDetail.id)"
                      @update:value="setSingleOptionValue(questionDetail.id, $event as string)"
                  >
                    <div
                        v-for="(option, optionIndex) in questionDetail.options"
                        :key="option.id ?? `option-${optionIndex}`"
                        :class="optionClass(option.id, questionDetail, studentSubmission)"
                    >
                      <n-radio :value="option.id">
                        <div class="option-main">
                          <div class="option-content">
                            <span class="option-label">
                              {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                            </span>
                            <div v-html="option.optionContent"></div>
                          </div>
                          <div
                              v-if="option.score !== null && option.score !== undefined && studentSubmission"
                              class="option-score"
                          >
                            {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                          </div>
                        </div>
                      </n-radio>
                      <div
                          v-if="option.explanation && shouldShowAnswer"
                          class="option-explanation"
                      >
                        {{ option.explanation }}
                      </div>
                    </div>
                  </n-radio-group>
                  <!-- 学生不可编辑时显示选项 -->
                  <template v-else>
                    <div
                        v-for="(option, optionIndex) in questionDetail.options"
                        :key="option.id ?? `option-${optionIndex}`"
                        :class="optionClass(option.id, questionDetail, studentSubmission)"
                    >
                      <div class="option-main">
                        <div class="option-content">
                          <span class="option-label">
                            {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                          </span>
                          <div v-html="option.optionContent"></div>
                        </div>
                        <div
                            v-if="option.score !== null && option.score !== undefined && studentSubmission"
                            class="option-score"
                        >
                          {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                        </div>
                      </div>
                      <div
                          v-if="option.explanation && shouldShowAnswer"
                          class="option-explanation"
                      >
                        {{ option.explanation }}
                      </div>
                    </div>
                  </template>
                </template>
              </template>

              <!-- 多选题 -->
              <template v-else-if="isMultiple(questionDetail.questionType)">
                <template v-if="isAdminOrTeacher">
                  <!-- 管理员/老师显示选项 -->
                  <div
                      v-for="(option, optionIndex) in questionDetail.options"
                      :key="option.id ?? `option-${optionIndex}`"
                      :class="optionClass(option.id, questionDetail, studentSubmission)"
                  >
                    <div class="option-main">
                      <div class="option-content">
                        <span class="option-label">
                          {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                        </span>
                        <div v-html="option.optionContent"></div>
                      </div>
                      <div
                          v-if="option.score !== null && option.score !== undefined && studentSubmission"
                          class="option-score"
                      >
                        {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                      </div>
                    </div>
                    <div
                        v-if="option.explanation && shouldShowAnswer"
                        class="option-explanation"
                    >
                      {{ option.explanation }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- 学生显示多选框 -->
                  <n-checkbox-group
                      v-if="canEdit"
                      :value="getMultiOptionValues(questionDetail.id)"
                      @update:value="setMultiOptionValues(questionDetail.id, $event as string[])"
                  >
                    <div
                        v-for="(option, optionIndex) in questionDetail.options"
                        :key="option.id ?? `option-${optionIndex}`"
                        :class="optionClass(option.id, questionDetail, studentSubmission)"
                    >
                      <n-checkbox :value="option.id">
                        <div class="option-main">
                          <div class="option-content">
                            <span class="option-label">
                              {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                            </span>
                            <div v-html="option.optionContent"></div>
                          </div>
                          <div
                              v-if="option.score !== null && option.score !== undefined && studentSubmission"
                              class="option-score"
                          >
                            {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                          </div>
                        </div>
                      </n-checkbox>
                      <div
                          v-if="option.explanation && shouldShowAnswer"
                          class="option-explanation"
                      >
                        {{ option.explanation }}
                      </div>
                    </div>
                  </n-checkbox-group>
                  <!-- 学生不可编辑时显示选项 -->
                  <template v-else>
                    <div
                        v-for="(option, optionIndex) in questionDetail.options"
                        :key="option.id ?? `option-${optionIndex}`"
                        :class="optionClass(option.id, questionDetail, studentSubmission)"
                    >
                      <div class="option-main">
                        <div class="option-content">
                          <span class="option-label">
                            {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                          </span>
                          <div v-html="option.optionContent"></div>
                        </div>
                        <div
                            v-if="option.score !== null && option.score !== undefined && studentSubmission"
                            class="option-score"
                        >
                          {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                        </div>
                      </div>
                      <div
                          v-if="option.explanation && shouldShowAnswer"
                          class="option-explanation"
                      >
                        {{ option.explanation }}
                      </div>
                    </div>
                  </template>
                </template>
              </template>

              <!-- 其他题型（显示选项但不带选择组件） -->
              <template v-else>
                <div
                    v-for="(option, optionIndex) in questionDetail.options"
                    :key="option.id ?? `option-${optionIndex}`"
                    :class="optionClass(option.id, questionDetail, studentSubmission)"
                >
                  <div class="option-main">
                    <div class="option-content">
                      <span class="option-label">
                        {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                      </span>
                      <div v-html="option.optionContent"></div>
                    </div>
                    <div
                        v-if="option.score !== null && option.score !== undefined && studentSubmission"
                        class="option-score"
                    >
                      {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                    </div>
                  </div>
                  <div
                      v-if="option.explanation && shouldShowAnswer"
                      class="option-explanation"
                  >
                    {{ option.explanation }}
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 填空题 -->
          <div
              v-if="isBlank(questionDetail.questionType)"
              class="section-block"
          >
            <div v-if="canEdit" class="practice-blanks">
              <div
                  v-for="(blank, blankIndex) in getBlankValues(questionDetail.answers?.length || 1)"
                  :key="`blank-${blankIndex}`"
                  class="practice-blank"
              >
                <span class="practice-blank__label">{{
                    t('classroom.practicePanel.blankLabel', {index: blankIndex + 1})
                  }}</span>
                <n-input
                    :placeholder="t('classroom.practicePanel.answerPlaceholder')"
                    :value="blank"
                    clearable
                    @update:value="setBlankValue(blankIndex, $event as string)"
                />
              </div>
            </div>
            <div v-if="studentSubmission?.answer?.blanks" class="practice-card__answer-display">
              <div class="practice-card__answer-title">{{ t('classroom.practicePanel.myAnswer') }}</div>
              <div class="practice-card__correct-answers">
                <div
                    v-for="(answer, index) in studentSubmission.answer.blanks || []"
                    :key="`my-blank-${index}`"
                    class="practice-card__answer-item"
                >
                  <span class="practice-card__answer-index">{{ t('classroom.practicePanel.blankLabel', {index: index + 1}) }}：</span>
                  <span class="practice-card__answer-content">{{ answer ?? '' }}</span>
                </div>
              </div>
            </div>
            <div v-if="shouldShowAnswer && questionDetail.answers?.length"
                 class="practice-card__answer-display">
              <div class="practice-card__answer-title">{{ t('classroom.practicePanel.correctAnswer') }}</div>
              <div class="practice-card__correct-answers">
                <div
                    v-for="(answer, index) in questionDetail.answers || []"
                    :key="answer.id || index"
                    class="practice-card__answer-item"
                >
                  <span class="practice-card__answer-index">{{ t('classroom.practicePanel.blankLabel', {index: index + 1}) }}：</span>
                  <span class="practice-card__answer-content">{{ answer.answerContent }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 简答题 -->
          <div
              v-if="isShort(questionDetail.questionType)"
              class="section-block"
          >
            <n-input
                v-if="canEdit"
                :maxlength="2000"
                :placeholder="t('classroom.practicePanel.answerPlaceholder')"
                :rows="6"
                :value="getContentValue()"
                clearable
                show-count
                type="textarea"
                @update:value="setContentValue($event as string)"
            />
            <div v-if="studentSubmission?.answer?.content" class="practice-card__answer-display">
              <div class="practice-card__answer-title">{{ t('classroom.practicePanel.myAnswer') }}</div>
              <div class="practice-card__correct-answers">
                <div class="practice-card__answer-item">
                  <div class="practice-card__answer-content">{{ studentSubmission.answer.content }}</div>
                </div>
              </div>
            </div>
            <div v-if="shouldShowAnswer && questionDetail.answers?.length"
                 class="practice-card__answer-display">
              <div class="practice-card__answer-title">{{ t('classroom.practicePanel.correctAnswer') }}</div>
              <div class="practice-card__correct-answers">
                <div
                    v-for="(answer, index) in questionDetail.answers || []"
                    :key="answer.id || index"
                    class="practice-card__answer-item"
                >
                  <div class="practice-card__answer-content" v-html="answer.answerContent"></div>
                  <div v-if="answer.explanation" class="practice-card__answer-explanation">
                    {{ t('classroom.practicePanel.explanation') }}：{{ answer.explanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 答案 -->
          <div
              v-if="questionDetail.answers && questionDetail.answers.length > 0 && !isBlank(questionDetail.questionType) && !isShort(questionDetail.questionType)"
              class="section-block"
          >
            <div class="detail-answers">
              <div
                  v-for="(answer, answerIndex) in questionDetail.answers"
                  :key="answer.id ?? `answer-${answerIndex}`"
                  class="answer-item"
              >
                <div class="answer-main">
                  <div class="answer-index">
                    #{{ answer.sortOrder ?? answerIndex + 1 }}
                  </div>
                  <div class="answer-content">
                    <div v-if="answer.answerContent" v-html="answer.answerContent"></div>
                  </div>
                  <div v-if="answer.score !== null && answer.score !== undefined" class="answer-score">
                    {{ answer.score }} {{ t('course.classPractice.pointUnit') }}
                  </div>
                </div>
                <div v-if="answer.explanation" class="answer-explanation">
                  {{ answer.explanation }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学生操作区域 -->
      <div v-if="!isAdminOrTeacher" class="practice-card__footer">
        <div class="practice-card__status">
          <span v-if="studentSubmission?.score !== null && studentSubmission?.score !== undefined"
                class="practice-card__score">
            {{ t('classroom.practicePanel.scorePrefix') }}{{ studentSubmission?.score ?? 0 }}
          </span>
        </div>
        <n-button
            v-if="canEdit"
            :disabled="!selectedPractice || !questionDetail || !hasAnswer()"
            :loading="isSubmitting"
            round
            size="medium"
            type="primary"
            @click="submitPracticeAnswer"
        >
          {{ t('classroom.practicePanel.submit') }}
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {CalendarOutline} from '@vicons/ionicons5'
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {NRadioGroup, NRadio, NCheckboxGroup, NCheckbox} from 'naive-ui'
import type {ClassroomQuestionVO} from '@/types/classroom'
import type {QuestionVO} from '@/types/course/question'
import type {AnswerPayload, QuestionStudent} from '@/types/student'
import {IsRequiredEnum} from '@/enum/classroom/isRequiredEnum'
import {getQuestionById} from '@/api/course/question'
import {getDefaultQuestionStudentAddDTO, addPractice, listPracticeByPracticeAndStudent} from '@/api/student/practice'
import {getIsRequiredLabel} from '@/enum/classroom/isRequiredEnum'
import {getQuestionBankDifficultyLabel} from '@/enum/course/questionBankDifficultyEnum'
import {getQuestionTypeLabel, QuestionTypeEnum} from '@/enum/course/questionTypeEnum'
import {useUserStore} from '@/store'
import {getAnswerStatusLabel} from '@/enum/student/answerStatusEnum'

// Props
interface Props {
  selectedPractice: ClassroomQuestionVO | null
  selectedClassroomInfo: any
}

const props = defineProps<Props>()

// 国际化
const {locale, t: t} = useI18n()
const isEn = computed(() => locale.value === 'en-US')

// 用户权限
const userStore = useUserStore()

const isAdminOrTeacher = computed(() => {
  const userRoles = userStore.userInfo?.roles || [];
  const isAdmin = userRoles.some(role => role.roleKey === 'ADMIN' || role.admin === true);
  const isTeacher = userStore.hasRole('TEACHER') && userStore.teacherInfo !== null;
  return isAdmin || isTeacher;
})

// 响应式数据
const fullQuestionDetail = ref<QuestionVO | null>(null)
const loadingQuestion = ref(false)
const studentSubmission = ref<QuestionStudent | null>(null)
const answers = ref<Record<string, AnswerPayload>>({})
const isSubmitting = ref(false)
const loadingAll = ref(true)

// 缓存对象
const questionDetailCache = new Map<string, QuestionVO>()
const studentSubmissionCache = new Map<string, QuestionStudent[]>()

// 清除缓存
const clearCache = (practiceId?: string | null, questionId?: string | null, studentId?: string | null) => {
  if (questionId) {
    questionDetailCache.delete(questionId)
  }
  if (practiceId && studentId) {
    const cacheKey = `${practiceId}_${studentId}`
    studentSubmissionCache.delete(cacheKey)
  }
}

// 计算属性
const questionDetail = computed(() => {
  return fullQuestionDetail.value || (props.selectedPractice?.questionVO as QuestionVO | undefined)
})

// 判断是否应该显示答案
const shouldShowAnswer = computed(() => {
  if (loadingAll.value) {
    return false // 确保所有数据加载完成后再显示答案
  }
  if (isAdminOrTeacher.value) {
    return true
  }
  return studentSubmission.value !== null
})

// 判断是否可以编辑（学生未提交过答案）
const canEdit = computed(() => {
  if (isAdminOrTeacher.value) {
    return false
  }
  return studentSubmission.value === null
})

// 题目类型判断
const isBlank = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.FILL_BLANK
const isShort = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.SHORT_ANSWER
const isSingle = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.SINGLE_CHOICE || questionType === QuestionTypeEnum.TRUE_FALSE
const isMultiple = (questionType: number | null | undefined) => questionType === QuestionTypeEnum.MULTIPLE_CHOICE

// 获取题目类型文本
const getQuestionTypeText = (type?: number | null) => {
  if (type === null || type === undefined) {
    return t('common.unknown')
  }
  return getQuestionTypeLabel(type, isEn.value)
}

// 获取难度文本
const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return t('common.unknown')
  }
  return getQuestionBankDifficultyLabel(difficulty, isEn.value)
}

// 获取提交状态对应的标签（正确/错误/半对/待批阅）
const getSubmissionStatusLabel = (isCorrect?: number | null) => {
  if (isCorrect === null || isCorrect === undefined) return getAnswerStatusLabel(3, isEn.value)
  return getAnswerStatusLabel(isCorrect, isEn.value)
}

// 获取提交状态对应的 tag 类型（用于显示颜色）
const getSubmissionStatusType = (isCorrect?: number | null) => {
  if (isCorrect === null || isCorrect === undefined) return 'info'
  switch (isCorrect) {
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 3:
      return 'info'
    default:
      return 'error'
  }
}

// 格式化分数
const formatScore = (score?: number | null) => {
  if (score === null || score === undefined) {
    return t('course.classPractice.score') + ': '
  }
  return `${score} ${t('course.classPractice.pointUnit')}`
}

// 格式化预计时间
const formatEstimatedTime = (time?: number | null) => {
  if (typeof time !== 'number' || time <= 0) {
    return t('course.classPractice.unlimitedTime')
  }
  return `${time} ${t('course.classPractice.minuteUnit')}`
}

// 构建默认答案
const buildDefaultAnswerByQuestion = (question: QuestionVO | null | undefined): AnswerPayload => {
  const base = {options: [], blanks: [], content: null}
  if (!question) {
    return base
  }
  if (isBlank(question.questionType)) {
    const blanksCount = question.answers?.length || 1
    return {...base, blanks: Array.from({length: blanksCount}, () => '')}
  }
  if (isShort(question.questionType)) {
    return {...base, content: null}
  }
  return {...base, options: []}
}

// 确保答案存在
const ensureAnswer = (questionId: string, question: QuestionVO | null) => {
  if (!answers.value[questionId]) {
    answers.value[questionId] = buildDefaultAnswerByQuestion(question)
  }
  return answers.value[questionId]
}

// 获取选项标签通过ID
const getOptionLabelById = (question: QuestionVO | null | undefined, optionId: string | null): string | null => {
  if (!question || !optionId) return null
  const option = question.options?.find(opt => opt.id === optionId)
  return option?.optionLabel ?? null
}

// 获取选项ID通过标签
const getOptionIdByLabel = (question: QuestionVO | null | undefined, optionLabel: string | null): string | null => {
  if (!question || !optionLabel) return null
  const option = question.options?.find(opt => opt.optionLabel === optionLabel)
  return option?.id ?? null
}

// 获取单选题选择值
const getSingleOptionValue = (questionId: string) => {
  const answer = answers.value[questionId]
  const optionLabel = answer?.options?.[0] ?? null
  if (!optionLabel) return null
  return getOptionIdByLabel(questionDetail.value, optionLabel)
}

// 设置单选题选择值
const setSingleOptionValue = (questionId: string, value: string | null) => {
  const optionLabel = getOptionLabelById(questionDetail.value, value)
  const answer = answers.value[questionId] ?? buildDefaultAnswerByQuestion(questionDetail.value)
  answers.value = {
    ...answers.value,
    [questionId]: {...answer, options: optionLabel ? [optionLabel] : []}
  }
}

// 获取多选题选择值
const getMultiOptionValues = (questionId: string) => {
  const answer = answers.value[questionId]
  const optionLabels = answer?.options || []
  if (optionLabels.length === 0) return []
  return optionLabels.map(label => getOptionIdByLabel(questionDetail.value, label)).filter((id): id is string => Boolean(id))
}

// 设置多选题选择值
const setMultiOptionValues = (questionId: string, values: string[]) => {
  const optionLabels = values.map(id => getOptionLabelById(questionDetail.value, id)).filter((label): label is string => Boolean(label))
  const answer = answers.value[questionId] ?? buildDefaultAnswerByQuestion(questionDetail.value)
  answers.value = {
    ...answers.value,
    [questionId]: {...answer, options: optionLabels}
  }
}

// 获取完整题目详情
const loadFullQuestionDetail = async () => {
  if (!props.selectedPractice?.questionId) {
    fullQuestionDetail.value = null
    return
  }

  // 检查缓存
  const cachedQuestion = questionDetailCache.get(props.selectedPractice.questionId)
  if (cachedQuestion) {
    fullQuestionDetail.value = cachedQuestion
    return
  }

  // 如果已有完整的 questionVO 数据，直接使用并缓存
  if (props.selectedPractice.questionVO &&
      props.selectedPractice.questionVO.questionContent &&
      props.selectedPractice.questionVO.questionTitle) {
    const questionVO = props.selectedPractice.questionVO as QuestionVO
    fullQuestionDetail.value = questionVO
    questionDetailCache.set(props.selectedPractice.questionId, questionVO)
    return
  }

  // 否则获取完整数据
  loadingQuestion.value = true
  const response = await getQuestionById(props.selectedPractice.questionId)
  const questionData = (response.success || response.code === 200)
      ? response.data
      : (props.selectedPractice.questionVO as QuestionVO || null)

  if (questionData) {
    questionDetailCache.set(props.selectedPractice.questionId, questionData)
  }

  fullQuestionDetail.value = questionData
  loadingQuestion.value = false
}

// 加载学生提交记录
const loadStudentSubmission = async () => {
  if (!props.selectedPractice?.id || isAdminOrTeacher.value || !userStore.studentInfo?.id) {
    studentSubmission.value = null
    return
  }

  const cacheKey = `${props.selectedPractice.id}_${userStore.studentInfo.id}`

  // 检查缓存
  const cachedSubmissions = studentSubmissionCache.get(cacheKey)
  if (cachedSubmissions !== undefined) {
    const submission = cachedSubmissions.length > 0 ? cachedSubmissions[0] : null
    studentSubmission.value = submission || null

    // 如果已提交，恢复答案数据用于显示
    if (submission?.answer) {
      answers.value[props.selectedPractice.questionId] = submission.answer
    }
    return
  }

  const response = await listPracticeByPracticeAndStudent(props.selectedPractice.id, userStore.studentInfo.id)
  const submissions: QuestionStudent[] = response.data || []
  // 由于是根据 practiceId 和 studentId 查询，应该只有一条记录或没有记录
  const submission = submissions.length > 0 ? submissions[0] : null
  studentSubmission.value = submission || null

  // 缓存提交记录
  studentSubmissionCache.set(cacheKey, submissions)

  // 如果已提交，恢复答案数据用于显示
  if (submission?.answer) {
    answers.value[props.selectedPractice.questionId] = submission.answer
  }
}

// 获取选项的CSS类
const optionClass = (optionId: string | null | undefined, question: any, submission: any) => {
  if (!optionId || !question) return ['option-item']
  const option = question.options?.find((opt: any) => opt.id === optionId)
  const optionLabel = option?.optionLabel ?? null
  if (!optionLabel) return ['option-item']
  const isCorrect = option?.isCorrect === 1
  const canShowAnswer = isAdminOrTeacher.value || submission !== null

  if (!submission) {
    return [
      'option-item',
      canShowAnswer && isCorrect ? 'is-correct' : ''
    ]
  }
  const userPicked = Array.isArray(submission.answer?.options) && submission.answer?.options.includes(optionLabel)
  return [
    'option-item',
    userPicked ? 'is-user' : '',
    canShowAnswer && isCorrect ? 'is-correct' : '',
    userPicked && canShowAnswer && isCorrect ? 'is-user-correct' : ''
  ]
}

// 获取填空题答案
const getBlankValues = (length: number) => {
  if (!questionDetail.value?.id) return []
  ensureAnswer(questionDetail.value.id, questionDetail.value)
  const blanks = answers.value[questionDetail.value.id]?.blanks || []
  if (blanks.length < length) {
    const filled = [...blanks]
    while (filled.length < length) {
      filled.push('')
    }
    if (questionDetail.value?.id) {
      answers.value[questionDetail.value.id] = {...answers.value[questionDetail.value.id], blanks: filled}
    }
    return filled
  }
  return blanks
}

// 设置填空题答案
const setBlankValue = (index: number, value: string) => {
  if (!questionDetail.value?.id) return
  const blanks = answers.value[questionDetail.value.id]?.blanks ? [...answers.value[questionDetail.value.id].blanks!] : []
  blanks[index] = value ?? ''
  answers.value[questionDetail.value.id] = {...answers.value[questionDetail.value.id], blanks}
}

// 获取简答题答案
const getContentValue = () => {
  if (!questionDetail.value?.id) return null
  return answers.value[questionDetail.value.id]?.content ?? null
}

// 设置简答题答案
const setContentValue = (value: string) => {
  if (!questionDetail.value?.id) return
  answers.value[questionDetail.value.id] = {...answers.value[questionDetail.value.id], content: value}
}

// 判断是否有答案
const hasAnswer = () => {
  if (!questionDetail.value?.id) return false
  const answer = answers.value[questionDetail.value.id]
  if (!answer) return false
  if (answer.options && answer.options.length > 0) return true
  if (answer.blanks && answer.blanks.some(item => item !== null && item !== '')) return true
  if (answer.content) return true
  return false
}

// 标准化答案
const normalizeAnswer = (question: QuestionVO, answer: AnswerPayload | null) => {
  const base = buildDefaultAnswerByQuestion(question)
  const payload = {...base, ...(answer || {})}

  // 根据题型只传递相应类型的答案数据
  if (isBlank(question.questionType)) {
    // 填空题只传递 blanks 数据
    if (payload.blanks) {
      payload.blanks = payload.blanks.map(item => item ?? '')
    }
    return {blanks: payload.blanks || []}
  } else if (isShort(question.questionType)) {
    // 简答题只传递 content 数据
    return {content: payload.content || null}
  } else if (isSingle(question.questionType) || isMultiple(question.questionType)) {
    // 选择题只传递 options 数据
    return {options: payload.options || []}
  } else {
    // 其他题型传递所有数据（保持兼容性）
    return payload
  }
}

// 提交答案
const submitPracticeAnswer = async () => {
  if (!questionDetail.value || !props.selectedPractice || !props.selectedClassroomInfo || !props.selectedClassroomInfo.id) return

  const payload = getDefaultQuestionStudentAddDTO()
  payload.classroomId = props.selectedClassroomInfo.id
  payload.studentId = userStore.studentInfo?.id || null
  payload.questionId = questionDetail.value.id
  payload.practiceId = props.selectedPractice.id || null
  payload.courseId = props.selectedPractice.courseId || null
  payload.answer = normalizeAnswer(questionDetail.value, answers.value[questionDetail.value.id] || null)

  isSubmitting.value = true
  const response = await addPractice(payload)
  const isSuccess = Boolean(response?.success)
  if (isSuccess) {
    // 清除相关缓存
    clearCache(props.selectedPractice.id, props.selectedPractice.questionId, userStore.studentInfo?.id)

    // 重新加载提交记录
    loadingAll.value = true
    await loadStudentSubmission()
    loadingAll.value = false
  }
  isSubmitting.value = false
}

// 监听 selectedPractice 变化
watch(() => props.selectedPractice, async (newPractice) => {
  loadingAll.value = true
  if (newPractice) {
    await Promise.all([
      loadFullQuestionDetail(),
      loadStudentSubmission()
    ])
  } else {
    fullQuestionDetail.value = null
    studentSubmission.value = null
  }
  loadingAll.value = false
}, {immediate: true})

// 方法
const formatTime = (time: string) => {
  if (!time) return t('course.classPractice.notSet')
  try {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return time
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.student-practice-panel {
  background-color: var(--background-color);
  max-height: 100vh;

  .practice-detail-card {
    background-color: var(--background-color);
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    border: none;
    box-shadow: none;

    :deep(.n-card__content) {
      height: 100%;
      overflow-y: auto;
      padding: 0 20px 20px 20px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--text-secondary-color);
      }
    }

    :deep(.n-card__header) {
      padding: 20px 20px 0 20px;
      border-bottom: none;
      background: transparent;
    }
  }

  .practice-number {
    color: var(--color-primary);
    margin-right: 8px;
    font-weight: 700;
  }

  .practice-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    .practice-detail-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
      flex: 1;
    }
  }

  .practice-classroom-info {
    margin: 0;
    color: var(--text-secondary-color);
    font-size: 14px;
  }

  .practice-time-info {
    margin: 12px 0;

    :deep(.n-text) {
      font-size: 14px;
      color: var(--text-secondary-color);
    }
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

  .question-detail-content {
    .detail-header {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      border-radius: 16px;
      background: var(--background-color);
      border: 1px solid var(--border-color);
      margin-bottom: 16px;
    }

    .detail-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      background: var(--background-secondary-color);
      transition: background-color 0.2s ease;
      user-select: none;

      &:hover {
        background: color-mix(in srgb, var(--color-primary) 5%, var(--background-secondary-color));
      }

      .meta-label {
        font-size: 12px;
        color: var(--text-secondary-color);
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .meta-value {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-color);
        line-height: 1.4;
      }
    }

    .detail-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 4px;
    }

    .detail-section {
      padding: 16px;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      background: var(--background-color);
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }

    .section-block {
      display: flex;
      flex-direction: column;
      gap: 12px;

      & + .section-block {
        padding-top: 12px;
        border-top: 1px dashed var(--border-color);
      }
    }

    .section-body {
      line-height: 1.7;
      color: var(--text-color);
    }

    .detail-content-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .detail-content {
      flex: 1;
      min-width: 0;
    }

    .content-submission-status {
      align-self: flex-start;
      margin-left: 8px;
      margin-top: 4px;
      white-space: nowrap;
    }

    .detail-content {
      line-height: 1.7;
      color: var(--text-color);
      font-size: 18px;
    }

    .detail-options {
      display: flex;
      flex-direction: column;
      gap: 12px;

      :deep(.n-radio-group),
      :deep(.n-checkbox-group) {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
    }

    .option-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: var(--background-color);

      &.is-correct {
        border-color: var(--success-color);
        background: color-mix(in srgb, var(--success-color) 8%, var(--background-color));

        .option-label {
          color: var(--success-color);
        }
      }

      &.is-user {
        border-color: var(--color-primary);
        background: color-mix(in srgb, var(--color-primary) 10%, var(--background-color));

        .option-label {
          color: var(--color-primary);
        }
      }

      &.is-user-correct {
        border-color: color-mix(in srgb, var(--color-primary) 70%, var(--success-color) 30%);
        background: linear-gradient(
                135deg,
                color-mix(in srgb, var(--color-primary) 8%, var(--background-color)),
                color-mix(in srgb, var(--success-color) 6%, var(--background-color))
        );

        .option-label {
          color: color-mix(in srgb, var(--color-primary) 70%, var(--success-color) 30%);
        }
      }
    }

    .option-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .option-content {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      flex: 1;

      :deep(p) {
        margin: 0;
      }
    }

    .option-label {
      font-size: var(--markdown-font-size);
      font-weight: 600;
      color: var(--color-primary);
      min-width: 8px;
    }

    .option-score {
      font-size: 13px;
      color: var(--text-secondary-color);
      white-space: nowrap;
      margin-left: 8px;
    }

    .option-explanation {
      font-size: 13px;
      color: var(--text-secondary-color);
      line-height: 1.5;
    }

    .detail-answers {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .answer-item {
      border: 1px dashed var(--border-color);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .answer-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .answer-index {
      font-size: var(--markdown-font-size);
      font-weight: 600;
      color: var(--color-primary);
      white-space: nowrap;
      margin-right: 8px;
    }

    .answer-content {
      flex: 1;

      :deep(p) {
        margin: 0;
      }
    }

    .answer-score {
      font-size: 13px;
      color: var(--text-secondary-color);
      white-space: nowrap;
      margin-left: 8px;
    }

    .answer-explanation {
      font-size: 13px;
      color: var(--text-secondary-color);
      line-height: 1.5;
    }
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

  .practice-card__answer-title {
    font-weight: 600;
    color: var(--color-primary);
    font-size: 14px;
  }

  .practice-card__answer-index {
    font-weight: 600;
    color: var(--color-primary);
  }

  .practice-card__answer-content {
    line-height: 1.5;
  }

  .practice-card__answer-explanation {
    font-size: 12px;
    color: var(--text-secondary-color);
    line-height: 1.4;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .student-practice-panel {
    .practice-detail-card {
      :deep(.n-card__content) {
        padding: 16px;
      }

      :deep(.n-card__header) {
        padding: 16px 16px 0 16px;
      }
    }

    .practice-detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .practice-detail-title {
        font-size: 18px;
      }
    }
  }
}

@media (max-width: 480px) {
  .student-practice-panel {
    .practice-detail-card {
      :deep(.n-card__content) {
        padding: 12px;
      }

      :deep(.n-card__header) {
        padding: 12px 12px 0 12px;
      }
    }

    .practice-detail-header {
      .practice-detail-title {
        font-size: 16px;
      }
    }
  }
}
</style>
