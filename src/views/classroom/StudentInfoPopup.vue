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
          <img
              v-if="student.studentAvatar"
              :src="student.studentAvatar"
              alt="头像"
              class="student-avatar"
          />
          <div v-else class="student-avatar-placeholder">
            {{ student.studentName?.charAt(0) || '学' }}
          </div>
          <div class="student-name-section">
            <div class="student-name">{{ student.studentName || '未知' }}</div>
            <div class="student-code">{{ student.studentCode || '' }}</div>
          </div>
        </div>
        <div class="student-details">
          <div class="detail-item">
            <span class="detail-label">座位编号：</span>
            <span class="detail-value">{{ student.seatIndex !== null ? student.seatIndex + 1 : '未分配' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">出勤状态：</span>
            <span
                :class="getAttendanceStatusClass(student.attendanceStatus)"
                class="detail-value"
            >
              {{ getAttendanceStatusText(student.attendanceStatus) }}
            </span>
          </div>
          <div v-if="student.participationScore !== null" class="detail-item">
            <span class="detail-label">互动得分：</span>
            <span class="detail-value">{{ student.participationScore }}</span>
          </div>
        </div>
      </template>
      <!-- 空座位时显示默认信息 -->
      <template v-else>
        <div class="empty-seat-header">
          <div class="empty-seat-icon">🪑</div>
          <div class="empty-seat-title">空座位</div>
        </div>
        <div class="student-details">
          <div class="detail-item">
            <span class="detail-label">座位编号：</span>
            <span class="detail-value">{{ seatIndex !== null ? seatIndex + 1 : '未知' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">状态：</span>
            <span class="detail-value empty-status">暂无学生</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {AttendanceStatusEnum} from '@/enum/classroom/attendanceStatusEnum';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: null
  },
  seatIndex: {
    type: Number,
    default: null
  },
  position: {
    type: Object,
    default: () => ({x: 0, y: 0})
  }
});

// 获取出勤状态文本
const getAttendanceStatusText = (status) => {
  if (status === null) return '未知';
  switch (status) {
    case AttendanceStatusEnum.NOT_SIGNED:
      return '未签到';
    case AttendanceStatusEnum.SIGNED:
      return '已签到';
    case AttendanceStatusEnum.ABSENT:
      return '缺席';
    default:
      return '未知';
  }
};

// 获取出勤状态样式类
const getAttendanceStatusClass = (status) => {
  if (status === null) return '';
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

.student-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
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

