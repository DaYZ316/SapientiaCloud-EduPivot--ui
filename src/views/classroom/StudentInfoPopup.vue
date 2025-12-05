<template>
  <div
      v-if="show"
      :class="{ 'empty-seat': !student }"
      :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
      class="student-info-popup"
  >
    <div class="student-info-content">
      <!-- 有学生时显示学生信息 -->
      <template v-if="student">
        <div class="student-header">
          <AvatarDisplay
              :avatar-src="student.studentAvatar || null"
              :username="student.studentName || null"
              avatar-class="student-avatar"
              size="medium"
          />
          <div class="student-name-section">
            <div class="student-name">{{ student.studentName || t('classroom.studentInfo.unknown') }}</div>
            <div class="student-code">{{ student.studentCode || '' }}</div>
          </div>
        </div>
        <div class="student-details">
          <div class="detail-item">
            <span class="detail-label">{{ t('classroom.studentInfo.seatNumber') }}</span>
            <span class="detail-value">{{ student.seatIndex !== null ? student.seatIndex + 1 : t('classroom.studentInfo.unassigned') }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('classroom.studentInfo.attendanceStatus') }}</span>
            <span
                :class="getAttendanceStatusClass(student.attendanceStatus)"
                class="detail-value"
            >
              {{ getAttendanceStatusText(student.attendanceStatus) }}
            </span>
          </div>
          <div v-if="student.participationScore !== null" class="detail-item">
            <span class="detail-label">{{ t('classroom.studentInfo.participationScore') }}</span>
            <span class="detail-value">{{ student.participationScore }}</span>
          </div>
        </div>
      </template>
      <!-- 空座位时显示默认信息 -->
      <template v-else>
        <div class="empty-seat-header">
          <div class="empty-seat-icon">🪑</div>
          <div class="empty-seat-title">{{ t('classroom.studentInfo.emptySeat') }}</div>
        </div>
        <div class="student-details">
          <div class="detail-item">
            <span class="detail-label">{{ t('classroom.studentInfo.seatNumber') }}</span>
            <span
                class="detail-value">{{ seatIndex !== null ? seatIndex + 1 : t('classroom.studentInfo.unknown') }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('classroom.studentInfo.status') }}</span>
            <span class="detail-value empty-status">{{ t('classroom.studentInfo.noStudent') }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {AttendanceStatusEnum} from '@/enum/classroom/attendanceStatusEnum';
import {getAttendanceStatusLabel} from '@/enum/classroom/attendanceStatusEnum';
import type {CourseRecordStudentVO} from '@/types/classroom';
import AvatarDisplay from '@/components/common/AvatarDisplay.vue';

const {t, locale} = useI18n();

interface Props {
  show: boolean
  student: CourseRecordStudentVO | null
  seatIndex: number | null
  position: { x: number; y: number }
}

defineProps<Props>();

// 获取出勤状态文本
const getAttendanceStatusText = (status: AttendanceStatusEnum | null | undefined) => {
  if (status === null || status === undefined) return t('classroom.studentInfo.unknown');
  return getAttendanceStatusLabel(status, locale.value === 'en-US');
};

// 获取出勤状态样式类
const getAttendanceStatusClass = (status: AttendanceStatusEnum | null | undefined) => {
  if (status === null || status === undefined) return '';
  switch (status) {
    case AttendanceStatusEnum.NOT_SIGNED:
      return 'status-warning';
    case AttendanceStatusEnum.SIGNED:
      return 'status-success';
    case AttendanceStatusEnum.ABSENT:
      return 'status-error';
    default:
      return '';
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.student-info-popup {
  position: fixed;
  z-index: 1000;
  pointer-events: auto;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.student-info-content {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: 16px;
  min-width: 280px;
  max-width: 320px;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-secondary-color);
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.student-name-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
}

.student-code {
  font-size: 14px;
  color: var(--text-secondary-color);
  line-height: 1.4;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.5;
}

.detail-label {
  color: var(--text-secondary-color);
  min-width: 80px;
}

.detail-value {
  color: var(--text-color);
  font-weight: 500;

  &.status-success {
    color: var(--success-color);
  }

  &.status-warning {
    color: var(--warning-color);
  }

  &.status-error {
    color: var(--error-color);
  }

  &.empty-status {
    color: var(--text-secondary-color);
    font-style: italic;
  }
}

// 空座位样式
.student-info-popup.empty-seat {
  .student-info-content {
    opacity: 0.9;
  }
}

.empty-seat-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-secondary-color);
}

.empty-seat-icon {
  font-size: 48px;
  opacity: 0.6;
}

.empty-seat-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary-color);
}
</style>

