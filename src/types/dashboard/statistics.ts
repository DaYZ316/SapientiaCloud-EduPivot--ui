/**
 * 统计数据接口
 */
export interface StatisticsVO {
    /** 学生总数 */
    studentCount: number | null
    /** 教师总数 */
    teacherCount: number | null
    /** 课程总数 */
    courseCount: number | null
}
