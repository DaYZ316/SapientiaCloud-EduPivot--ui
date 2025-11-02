<template>
  <div class="course-management-container">
    <page-header :title="t('course.title')"/>

    <n-card size="small">
      <!-- 搜索表单 -->
      <course-search-form
          v-model="searchForm"
          @reset="handleResetSearch"
          @search="handleSearch"
      />

      <!-- 操作按钮 -->
      <div class="table-actions">
        <div class="actions-left">
          <n-button v-if="isAdmin" type="primary" @click="courseManageRef?.openAddModal">
            <template #icon>
              <Icon :component="AddOutline"/>
            </template>
            {{ t('course.actions.add') }}
          </n-button>
        </div>
      </div>

      <!-- 课程管理组件 -->
      <course-manage
          ref="courseManageRef"
          :course-api-function="courseApiFunction"
          :is-admin="isAdmin"
          :search-form="searchForm"
      />
    </n-card>

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {AddOutline} from '@vicons/ionicons5'
import type * as courseType from '@/types/course'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import CourseManage from './CourseManage/index.vue'
import CourseSearchForm from './components/CourseSearchForm.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import * as courseApi from '@/api/course'
import {useUserStore} from '@/store/modules/user'

const {t} = useI18n()
const userStore = useUserStore()

// 检查用户是否为管理员
const isAdmin = computed(() => userStore.hasRole('ADMIN'))

// 搜索表单
const searchForm = reactive<courseType.CourseQueryParams>(courseApi.getDefaultCourseQuery())

// 课程API函数
const courseApiFunction = computed(() => courseApi.listCourse)

// 课程管理组件引用
const courseManageRef = ref()

// 初始化搜索表单
function initializeSearchForm() {
  const defaultQuery = courseApi.getDefaultCourseQuery()
  Object.assign(searchForm, defaultQuery)

  // 非管理员根据用户角色设置查询条件
  if (!isAdmin.value && userStore.teacherInfo?.id) {
    searchForm.teacherId = userStore.teacherInfo.id
  }
}

// 搜索处理
function handleSearch() {
  courseManageRef.value?.refresh()
}

// 重置搜索处理
function handleResetSearch() {
  initializeSearchForm()
  courseManageRef.value?.refresh()
}


// 组件挂载时初始化
onMounted(() => {
  initializeSearchForm()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
