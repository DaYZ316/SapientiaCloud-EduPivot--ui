import {computed, ref, watch} from 'vue'
import {useUserStore} from '@/store/modules/user'
import {listAllCourseStudentByCourseId} from '@/api/course/courseStudent'
import {listCourseChapterTree} from '@/api/course/courseChapter'

/**
 * 课程积分进度 composable
 * 用于计算学生在课程中的积分占比，或获取根章节数量
 */
export function useCourseScoreProgress(courseId: string) {
    const userStore = useUserStore()

    // 加载状态
    const loading = ref(false)
    // 当前学生的积分
    const currentStudentScore = ref<number | null>(null)
    // 课程中学生最高分
    const maxScore = ref<number | null>(null)
    // 根章节数量
    const rootChapterCount = ref<number>(0)

    // 判断当前用户是否是学生
    const isStudent = computed(() => {
        return userStore.isLogin && userStore.studentInfo !== null
    })

    // 加载课程学生积分数据
    const loadCourseScoreData = async () => {
        if (!courseId) return

        loading.value = true
        try {
            // 获取学生积分数据
            const studentResponse = await listAllCourseStudentByCourseId(courseId)
            if (studentResponse.data && studentResponse.data.length > 0) {
                // 计算最高分
                const scores = studentResponse.data
                    .map(item => item.grade)
                    .filter((score): score is number => score !== null && score !== undefined && !isNaN(score))

                if (scores.length > 0) {
                    maxScore.value = Math.max(...scores)
                }

                // 获取当前学生的积分
                if (userStore.studentInfo) {
                    const currentStudent = studentResponse.data.find(
                        item => item.studentId === userStore.studentInfo!.id
                    )
                    if (currentStudent?.grade !== null && currentStudent?.grade !== undefined) {
                        currentStudentScore.value = currentStudent.grade
                    }
                }
            }

            // 获取章节树，计算根章节数量
            const chapterResponse = await listCourseChapterTree(courseId)
            if (chapterResponse.data && chapterResponse.data.length > 0) {
                // 根章节是 parentChapterId 为 null 的章节
                rootChapterCount.value = chapterResponse.data.filter(
                    chapter => chapter.parentChapterId === null
                ).length
            }
        } finally {
            loading.value = false
        }
    }

    // 计算进度百分比
    const scoreProgress = computed(() => {
        if (!isStudent.value) return null
        if (currentStudentScore.value === null || currentStudentScore.value === undefined) return 0
        if (maxScore.value === null || maxScore.value === undefined || maxScore.value === 0) return 0

        return Math.round((currentStudentScore.value / maxScore.value) * 100)
    })

    // 监听 courseId 变化，重新加载数据
    watch(() => courseId, () => {
        if (courseId) {
            loadCourseScoreData()
        }
    }, {immediate: true})

    return {
        loading,
        currentStudentScore,
        maxScore,
        rootChapterCount,
        isStudent,
        scoreProgress,
        loadCourseScoreData
    }
}
