import {computed, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import * as courseApi from '@/api/course'
import type * as courseType from '@/types/course'
import {getCourseStatusOptions, getCourseTypeOptions} from '@/enum/course'
import {useUserStore} from '@/store/modules/user'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {handleDateRangeChange} from '@/utils/dateUtil'

/**
 * 课程数据管理 Composable
 * 提供课程数据的统一管理和共享
 */
export function useCourseData() {
    const {message} = getDiscreteApi()
    const {t} = useI18n()
    const userStore = useUserStore()

    // 检查用户是否为管理员
    const isAdmin = computed(() => userStore.hasRole('ADMIN'))

    // 课程类型选项
    const courseTypeOptions = computed(() => getCourseTypeOptions(t))

    // 课程状态选项
    const courseStatusOptions = computed(() => getCourseStatusOptions(t))

    // 搜索表单
    const searchForm = reactive<courseType.CourseQueryParams>(courseApi.getDefaultCourseQuery())

    // 日期范围选择器
    const createTimeRange = ref<[number, number] | null>(null)

    // 课程列表数据
    const courseList = ref<courseType.CourseVO[]>([])

    // 加载状态
    const loading = ref(false)

    // 分页状态
    const pagination = reactive({
        pageNum: 1,
        pageSize: 12,
        total: 0
    })

    // 课程API函数
    const courseApiFunction = computed(() => courseApi.listCourse)

    // 初始化搜索表单
    function initializeSearchForm() {
        const defaultQuery = courseApi.getDefaultCourseQuery()
        Object.assign(searchForm, defaultQuery)

        // 非管理员根据用户角色设置查询条件
        if (!isAdmin.value && userStore.teacherInfo?.id) {
            searchForm.teacherId = userStore.teacherInfo.id
        }
    }

    // 加载课程数据
    async function loadCourseData() {
        loading.value = true
        try {
            const queryParams = {
                ...searchForm,
                pageNum: pagination.pageNum,
                pageSize: pagination.pageSize
            }

            const result = await courseApiFunction.value(queryParams)

            // 提取分页数据
            const {data = [], total = 0} = (result as any) || {}
            courseList.value = data
            pagination.total = total
        } catch (error) {
            message.error('加载课程数据失败')
            courseList.value = []
            pagination.total = 0
        } finally {
            loading.value = false
        }
    }

    // 处理日期范围变化
    function onDateRangeChange(value: [number, number] | null) {
        handleDateRangeChange(value, (startTime, endTime) => {
            searchForm.startTime = startTime || undefined
            searchForm.endTime = endTime || undefined
        })
    }

    // 数据更新处理函数
    function onDataUpdate(data: courseType.CourseVO[]) {
        courseList.value = data
    }

    // 重置搜索
    function resetSearch() {
        initializeSearchForm()
        createTimeRange.value = null
    }

    // 处理分页变化
    function onPageChange(newPagination: { pageNum: number, pageSize: number }) {
        pagination.pageNum = newPagination.pageNum
        pagination.pageSize = newPagination.pageSize
        loadCourseData()
    }

    return {
        // 状态
        isAdmin,
        courseTypeOptions,
        courseStatusOptions,
        searchForm,
        createTimeRange,
        courseList,
        loading,
        courseApiFunction,
        pagination,

        // 方法
        initializeSearchForm,
        loadCourseData,
        onDateRangeChange,
        onDataUpdate,
        resetSearch,
        onPageChange
    }
}

