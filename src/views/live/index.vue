<template>
  <div class="live-management-container">
    <page-header :title="t('live.title')"/>

    <n-alert v-if="!hasContext" class="context-alert" type="warning">
      {{ t('live.singleRoom.contextMissing') }}
    </n-alert>

    <!-- 上侧：基本信息展示 -->
    <div class="info-section">
      <n-card class="course-info-card" size="small">
        <template #header>
          <div class="card-header">
            <span>{{ t('live.singleRoom.courseSection') }}</span>
          </div>
        </template>
        <n-skeleton v-if="loadingCourse" :repeat="4" text/>
        <div v-else>
          <n-descriptions v-if="courseRecord" :column="4" bordered label-placement="left" size="small">
            <n-descriptions-item :label="t('live.singleRoom.courseName')">
              {{ courseRecord.courseName }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('live.singleRoom.teacher')">
              {{ courseRecord.teacherName }}
            </n-descriptions-item>
            <!-- 开始时间和结束时间来自 CourseRecordVO，通过 loadCourseRecord 从后端 API courseRecordApi.getCourseRecordById 获取 -->
            <n-descriptions-item :label="t('live.singleRoom.startTime')">
              {{ courseRecord.startTime }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('live.singleRoom.endTime')">
              {{ courseRecord.overTime }}
            </n-descriptions-item>
          </n-descriptions>
          <n-empty v-else :description="t('live.singleRoom.courseEmpty')"/>
        </div>
      </n-card>
    </div>

    <!-- 下侧：左右分栏布局 -->
    <div class="content-section">
      <!-- 左侧：房间信息的创建与更新 -->
      <div class="left-panel">
        <live-room-create-form
            :course-id="resolvedCourseId"
            :course-record-id="courseRecordId"
            :live-room="liveRoom"
            @success="handleLiveRoomUpdated"
        />
      </div>

      <!-- 右侧：房间信息展示 -->
      <div class="right-panel">
        <live-room-manage
            :course-record="courseRecord"
            :live-room="liveRoom"
            :loading="loadingLive"
            @refresh="handleLiveRoomUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import type {CourseRecordVO} from '@/types/classroom'
import type * as liveType from '@/types/live'
import PageHeader from '@/components/common/PageHeader.vue'
import LiveRoomCreateForm from './components/LiveRoomCreateForm.vue'
import LiveRoomManage from './LiveRoomManage/index.vue'
import * as liveApi from '@/api/live'
import * as courseRecordApi from '@/api/classroom/courseRecord'

const {t} = useI18n()
const route = useRoute()

const courseRecord = ref<CourseRecordVO | null>(null)
const liveRoom = ref<liveType.LiveRoomVO | null>(null)
const loadingCourse = ref<boolean | null>(null)
const loadingLive = ref<boolean | null>(null)

const courseRecordId = computed(() => {
  if (typeof route.params.courseRecordId === 'string') {
    return route.params.courseRecordId
  }
  if (typeof route.query.courseRecordId === 'string') {
    return route.query.courseRecordId
  }
  return null
})

const resolvedCourseId = computed(() => {
  if (typeof route.params.courseId === 'string') {
    return route.params.courseId
  }
  if (courseRecord.value?.courseId) {
    return courseRecord.value.courseId
  }
  return null
})

const hasContext = computed(() => Boolean(courseRecordId.value))

onMounted(() => {
  bootstrapData()
})

watch(courseRecordId, () => {
  bootstrapData()
})

function bootstrapData() {
  if (!courseRecordId.value) {
    courseRecord.value = null
    liveRoom.value = null
    return
  }
  loadCourseRecord(courseRecordId.value)
  loadLiveRoom(courseRecordId.value)
}

async function loadCourseRecord(recordId: string) {
  loadingCourse.value = true
  courseRecord.value = await courseRecordApi.getCourseRecordById(recordId).then((res) => res?.data ?? null, () => null)
  loadingCourse.value = null
}

async function loadLiveRoom(recordId: string) {
  loadingLive.value = true
  liveRoom.value = await liveApi.getLiveRoomById(recordId).then((res) => res?.data ?? null, () => null)
  loadingLive.value = null
}

function handleLiveRoomUpdated() {
  if (!courseRecordId.value) return
  loadLiveRoom(courseRecordId.value)
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;

.context-alert {
  margin-bottom: 16px;
}
</style>
