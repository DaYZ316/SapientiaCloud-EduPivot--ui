<template>
  <page-table
      ref="pageTableRef"
      :api-fn="courseApiFunction"
      :auto-search="false"
      :columns="columns"
      :query-params="searchForm"
      size="small"
      @update:data="onDataUpdate"
  />
</template>

<script lang="ts" setup>
import {computed, h, ref} from 'vue'
import {NEllipsis} from 'naive-ui'
import {CreateOutline, TrashOutline} from '@vicons/ionicons5'
import type * as courseType from '@/types/course'
import {getCourseStatusLabel, getCourseTypeLabel} from '@/enum/course'
import {useI18n} from 'vue-i18n'
import {renderIcon} from '@/utils/iconUtil'

const {t} = useI18n()

// Props
interface Props {
  searchForm: courseType.CourseQueryParams
  courseApiFunction: any
  isAdmin: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'update:data', data: courseType.CourseVO[]): void

  (e: 'edit', course: courseType.CourseVO): void

  (e: 'delete', course: courseType.CourseVO): void

  (e: 'refresh'): void
}

const emit = defineEmits<Emits>()

// 分页表格引用
const pageTableRef = ref()

// 表格列定义
const columns = computed(() => [
  {title: t('course.table.courseName'), key: 'courseName'},
  {
    title: t('course.table.courseType'),
    key: 'courseType',
    render(row: courseType.CourseVO) {
      if (row.courseType === null || row.courseType === undefined) return '-'
      return getCourseTypeLabel(row.courseType, false)
    }
  },
  {
    title: t('course.table.courseStatus'),
    key: 'status',
    render(row: courseType.CourseVO) {
      if (row.status === null || row.status === undefined) return '-'
      return getCourseStatusLabel(row.status, false)
    }
  },
  {title: t('course.table.teacherName'), key: 'teacherName'},
  {title: t('course.table.semester'), key: 'semester'},
  {title: t('course.table.location'), key: 'location'},
  {
    title: t('course.table.description'),
    key: 'description',
    render(row: courseType.CourseVO) {
      return h(NEllipsis, {
        style: {maxWidth: '200px'}
      }, {
        default: () => row.description || '-',
        tooltip: () => row.description || '-'
      })
    }
  },
  {title: t('course.table.createTime'), key: 'createTime', width: 180},
  {
    title: t('course.table.operation'),
    key: 'actions',
    width: 200,
    render(row: courseType.CourseVO) {
      const actions = []

      // 只有管理员才能编辑和删除课程
      if (props.isAdmin) {
        actions.push(
            h(
                'button',
                {
                  class: 'n-button n-button--primary n-button--small',
                  style: {marginRight: '8px'},
                  onClick: () => handleEdit(row)
                },
                [
                  renderIcon(CreateOutline)(),
                  ' ' + t('course.actions.edit')
                ]
            ),
            h(
                'button',
                {
                  class: 'n-button n-button--error n-button--small',
                  onClick: () => handleDelete(row)
                },
                [
                  renderIcon(TrashOutline)(),
                  ' ' + t('course.actions.delete')
                ]
            )
        )
      }

      return actions
    }
  }
])

// 数据更新处理函数
function onDataUpdate(data: courseType.CourseVO[]) {
  emit('update:data', data)
}

// 编辑课程
function handleEdit(course: courseType.CourseVO) {
  emit('edit', course)
}

// 删除课程
function handleDelete(course: courseType.CourseVO) {
  emit('delete', course)
}

// 刷新数据
function refresh() {
  pageTableRef.value?.fetchData()
}

// 重置搜索
function reset() {
  pageTableRef.value?.reset()
}

// 暴露方法给父组件
defineExpose({
  refresh,
  reset,
  fetchData: () => pageTableRef.value?.fetchData()
})
</script>
