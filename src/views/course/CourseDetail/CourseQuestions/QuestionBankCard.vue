<template>
  <div class="question-bank-card" @click="handleCardClick">
    <!-- 顶部区域：题库名称和类型 -->
    <div class="card-header">
      <div class="bank-name">
        <h3>{{ bankData.bankName }}</h3>
      </div>
      <div class="header-actions">
        <div class="bank-type">
          <n-icon :component="getBankTypeIcon(bankData.bankType)"/>
          <span>{{ getBankTypeLabel(bankData.bankType) }}</span>
        </div>
        <n-dropdown
            :options="dropdownOptions"
            placement="bottom-end"
            trigger="hover"
            @select="handleMenuSelect"
        >
          <div class="three-dots-icon" @click.stop>
            <n-icon :component="EllipsisVerticalOutline"/>
          </div>
        </n-dropdown>
      </div>
    </div>

    <!-- 中间区域：描述和详细信息 -->
    <div class="card-content">
      <!-- 描述 -->
      <div v-if="bankData.description" class="description">
        <p>{{ bankData.description }}</p>
      </div>

      <!-- 课程信息 -->
      <div class="course-info">
        <!-- 教师信息 -->
        <div v-if="bankData.sysUserName" class="info-row teacher-info">
          <div class="info-item teacher-item" @click.stop="handleTeacherClick">
            <AvatarDisplay
                :avatar-src="teacherAvatar"
                :nick-name="bankData.sysUserName"
                :username="bankData.sysUserName"
                class="teacher-avatar"
                size="small"
            />
            <span class="teacher-name">{{ bankData.sysUserName }}</span>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="statistics">
        <div class="stat-item">
          <n-icon :component="DocumentTextOutline"/>
          <span class="stat-value">{{ bankData.questionCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <n-icon :component="getDifficultyIcon(bankData.difficulty)"/>
          <span class="stat-label">{{ getDifficultyLabel(bankData.difficulty) }}</span>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="bankData.tags && bankData.tags.length > 0" class="tags">
        <n-tag
            v-for="tag in bankData.tags"
            :key="tag"
            round
            size="small"
            type="info"
        >
          {{ tag }}
        </n-tag>
      </div>
    </div>

    <!-- 底部区域：时间和状态 -->
    <div class="card-footer">
      <div class="time-info">
        <n-icon :component="TimeOutline"/>
        <span>{{ formatTime(bankData.createTime) }}</span>
      </div>
      <div class="public-status">
        <n-icon :component="getPublicStatusIcon(bankData.isPublic)"/>
        <span>{{ getPublicStatusLabel(bankData.isPublic) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, h} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {NDropdown, NIcon, NTag} from 'naive-ui'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import type {CourseQuestionBankVO} from '@/types/course/courseQuestionBank'
import {
  getQuestionBankDifficultyLabel,
  getQuestionBankPublicLabel,
  getQuestionBankTypeLabel,
  QuestionBankDifficultyEnum,
  QuestionBankPublicEnum,
  QuestionBankTypeEnum
} from '@/enum/course'
import {formatDate} from '@/utils/dateUtil'
import {
  BriefcaseOutline,
  CreateOutline,
  DocumentTextOutline,
  EllipsisVerticalOutline,
  GlobeOutline,
  LockClosedOutline,
  SchoolOutline,
  ShareOutline,
  StarHalfOutline,
  StarOutline,
  StarSharp,
  TimeOutline,
  TrashOutline,
  TrophyOutline
} from '@vicons/ionicons5'

// Props
interface Props {
  bankData: CourseQuestionBankVO
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true
})

// Emits
const emit = defineEmits<{
  click: [bankData: CourseQuestionBankVO]
  share: [bankData: CourseQuestionBankVO]
  edit: [bankData: CourseQuestionBankVO]
  delete: [bankData: CourseQuestionBankVO]
}>()

// 国际化
const {t, locale} = useI18n()
const router = useRouter()

// 下拉菜单选项
const dropdownOptions = [
  {
    label: t('course.questionBank.share'),
    key: 'share',
    icon: () => h(NIcon, {component: ShareOutline})
  },
  {
    label: t('course.questionBank.edit'),
    key: 'edit',
    icon: () => h(NIcon, {component: CreateOutline})
  },
  {
    label: () => h('span', {style: 'color: #d03050'}, t('course.questionBank.delete')),
    key: 'delete',
    icon: () => h(NIcon, {component: TrashOutline, color: '#d03050'})
  }
]

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  switch (key) {
    case 'share':
      emit('share', props.bankData)
      break
    case 'edit':
      emit('edit', props.bankData)
      break
    case 'delete':
      emit('delete', props.bankData)
      break
  }
}

// 教师头像URL（从bankData对象中获取）
const teacherAvatar = computed(() => {
  // 从bankData对象中获取sysUserAvatar字段
  return props.bankData.sysUserAvatar || undefined
})

// 获取题库类型图标
const getBankTypeIcon = (bankType: number) => {
  switch (bankType) {
    case QuestionBankTypeEnum.PRACTICE:
      return SchoolOutline
    case QuestionBankTypeEnum.EXAM:
      return TrophyOutline
    case QuestionBankTypeEnum.HOMEWORK:
      return BriefcaseOutline
    default:
      return SchoolOutline
  }
}

// 获取题库类型标签
const getBankTypeLabel = (bankType: number) => {
  return getQuestionBankTypeLabel(bankType, locale.value === 'en-US')
}

// 获取难度图标
const getDifficultyIcon = (difficulty: number) => {
  switch (difficulty) {
    case QuestionBankDifficultyEnum.EASY:
      return StarOutline
    case QuestionBankDifficultyEnum.MEDIUM:
      return StarHalfOutline
    case QuestionBankDifficultyEnum.HARD:
      return StarSharp
    default:
      return StarOutline
  }
}

// 获取难度标签
const getDifficultyLabel = (difficulty: number) => {
  return getQuestionBankDifficultyLabel(difficulty, locale.value === 'en-US')
}

// 获取公开状态图标
const getPublicStatusIcon = (isPublic: number) => {
  return isPublic === QuestionBankPublicEnum.PUBLIC ? GlobeOutline : LockClosedOutline
}

// 获取公开状态标签
const getPublicStatusLabel = (isPublic: number) => {
  return getQuestionBankPublicLabel(isPublic, locale.value === 'en-US')
}

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return ''
  return formatDate(time)
}

// 处理卡片点击
const handleCardClick = () => {
  if (props.clickable) {
    emit('click', props.bankData)
  }
}

// 处理教师信息点击
const handleTeacherClick = () => {
  // 如果有sysUserId，直接跳转
  if (props.bankData.sysUserId) {
    router.push(`/user/${props.bankData.sysUserId}`)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.question-bank-card {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-secondary-color);
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 24px var(--shadow-color);
    border-color: var(--primary-color);
  }

  // 卡片头部
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-secondary-color);

    .bank-name {
      flex: 1;
      margin-right: 12px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .bank-type {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: var(--background-secondary-color);
        border-radius: 20px;
        font-size: 12px;
        color: var(--text-secondary-color);
        white-space: nowrap;

        .n-icon {
          font-size: 14px;
        }
      }

      .three-dots-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: var(--text-secondary-color);
        cursor: pointer;
        transition: background-color 0.2s ease;

        .n-icon {
          font-size: 16px;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }

  // 卡片内容
  .card-content {
    margin-bottom: 16px;

    .description {
      margin-bottom: 16px;
      min-height: 42px; // 固定两行高度 (14px * 1.5 * 2)

      p {
        margin: 0;
        font-size: 14px;
        color: var(--text-secondary-color);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 42px; // 固定两行高度
      }
    }

    .course-info {
      margin-bottom: 20px;

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        &.teacher-info {
          .info-item {
            display: flex;
            align-items: center;
            gap: 8px;

            .teacher-avatar {
              flex-shrink: 0;
            }

            .teacher-name {
              font-size: 14px;
              color: var(--text-color);
              font-weight: 500;
            }

            &.teacher-item {
              cursor: pointer;
              padding: 0px;
              border-radius: 8px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              user-select: none;

              &:hover {
                background: rgba(var(--primary-color-rgb), 0.1);
                transform: translateY(-1px);

                .teacher-name {
                  color: var(--primary-color);
                  font-weight: 600;
                }

                :deep(.n-avatar) {
                  transform: scale(1.05);
                  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);
                }
              }

              &:active {
                transform: translateY(0);
                transition: all 0.1s ease;
              }
            }
          }
        }

        .info-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: var(--text-secondary-color);

          .info-icon {
            margin-right: 6px;
            font-size: 16px;
            color: var(--primary-color);
          }
        }
      }
    }

    .statistics {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;

        .n-icon {
          font-size: 16px;
          color: var(--primary-color);
        }

        .stat-value {
          font-weight: 600;
          color: var(--primary-color);
          font-size: 16px;
        }

        .stat-label {
          color: var(--text-secondary-color);
        }
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .n-tag {
        font-size: 12px;
      }
    }
  }

  // 卡片底部
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid var(--border-secondary-color);
    font-size: 12px;
    color: var(--text-disabled-color);

    .time-info,
    .public-status {
      display: flex;
      align-items: center;
      gap: 4px;

      .n-icon {
        font-size: 14px;
      }
    }

    .public-status {
      .n-icon {
        color: var(--primary-color);
      }
    }
  }
}

// 暗色主题适配
.dark {
  .question-bank-card {
    &:hover {
      border-color: var(--color-primary-light);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .question-bank-card {
    padding: 16px;

    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .bank-name {
        margin-right: 0;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;

        .bank-type {
          align-self: flex-start;
        }

        .three-dots-icon {
          align-self: flex-start;
        }
      }
    }

    .card-content {
      .statistics {
        flex-direction: column;
        gap: 12px;
      }
    }

    .card-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
}

@media (max-width: 480px) {
  .question-bank-card {
    padding: 12px;

    .card-header {
      .bank-name h3 {
        font-size: 16px;
      }
    }

    .card-content {
      .description p {
        font-size: 13px;
      }

      .course-info .info-item {
        font-size: 12px;
      }

      .statistics .stat-item {
        font-size: 12px;

        .stat-value {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
