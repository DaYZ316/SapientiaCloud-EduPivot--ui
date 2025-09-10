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
import type {DataTableColumns} from 'naive-ui'
import {NEllipsis, useDialog, useMessage} from 'naive-ui'
import {CreateOutline, TrashOutline} from '@vicons/ionicons5'
import type * as courseType from '@/types/course'
import {getCourseStatusLabel, getCourseTypeLabel} from '@/enum/course'
import {useI18n} from 'vue-i18n'
import {renderIcon} from '@/utils/iconUtil'
import PageTable from '@/components/common/PageTable.vue'

const {t} = useI18n()
const dialog = useDialog()
const message = useMessage()

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
const columns = computed((): DataTableColumns => [
  {title: t('course.table.courseName'), key: 'courseName'},
  {
    title: t('course.table.courseType'),
    key: 'courseType',
    render(rowData: any) {
      if (rowData.courseType === null || rowData.courseType === undefined) return '-'
      return getCourseTypeLabel(rowData.courseType, false)
    }
  },
  {
    title: t('course.table.courseStatus'),
    key: 'status',
    render(rowData: any) {
      if (rowData.status === null || rowData.status === undefined) return '-'
      return getCourseStatusLabel(rowData.status, false)
    }
  },
  {title: t('course.table.teacherName'), key: 'teacherName'},
  {title: t('course.table.semester'), key: 'semester'},
  {title: t('course.table.location'), key: 'location'},
  {
    title: t('course.table.description'),
    key: 'description',
    render(rowData: any) {
      return h(NEllipsis, {
        style: {maxWidth: '200px'}
      }, {
        default: () => rowData.description || '-',
        tooltip: () => rowData.description || '-'
      })
    }
  },
  {title: t('course.table.createTime'), key: 'createTime', width: 180},
  {
    title: t('course.table.operation'),
    key: 'actions',
    width: 200,
    render(rowData: any) {
      const actions = []

      // 只有管理员才能编辑和删除课程
      if (props.isAdmin) {
        actions.push(
            h(
                'button',
                {
                  class: 'n-button n-button--text',
                  style: {marginRight: '8px'},
                  onClick: () => handleEdit(rowData)
                },
                [
                  renderIcon(CreateOutline)(),
                  ' ' + t('course.actions.edit')
                ]
            ),
            h(
                'button',
                {
                  class: 'n-button n-button--text',
                  onClick: () => handleDelete(rowData)
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
  dialog.warning({
    title: t('course.actions.deleteConfirm'),
    content: t('course.actions.deleteConfirmContent', {courseName: course.courseName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      emit('delete', course)
      message.success(t('course.actions.deleteSuccess'))
    }
  })
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
