export default {
    title: '课程管理',
    myCourses: '我的课程',
    home: '首页',

    // 搜索表单
    searchForm: {
        courseName: '课程名称',
        courseNamePlaceholder: '请输入课程名称',
        courseType: '课程类型',
        courseTypePlaceholder: '请选择课程类型',
        courseStatus: '课程状态',
        courseStatusPlaceholder: '请选择课程状态',
        semester: '学期',
        semesterPlaceholder: '请输入学期',
        location: '上课地点',
        locationPlaceholder: '请输入上课地点',
        createTimeRange: '创建时间',
        createTimeRangePlaceholder: '请选择创建时间范围'
    },

    // 表格列
    table: {
        courseName: '课程名称',
        courseType: '课程类型',
        courseStatus: '课程状态',
        teacherName: '主讲教师',
        semester: '学期',
        location: '上课地点',
        description: '课程描述',
        coverImage: '封面图片',
        createTime: '创建时间',
        updateTime: '更新时间',
        operation: '操作'
    },

    // 操作按钮
    actions: {
        add: '新增课程',
        edit: '编辑',
        delete: '删除',
        deleteConfirm: '确认删除',
        deleteConfirmContent: '确定要删除课程"{courseName}"吗？此操作不可恢复。',
        deleteSuccess: '课程删除成功',
        addSuccess: '课程添加成功',
        editSuccess: '课程编辑成功',
        batchDelete: '批量删除',
        assignTeacher: '分配教师',
        assignTeachers: '分配教师团队',
        batchAssignTeachers: '批量分配教师团队',
        enroll: '选课',
        drop: '退课',
        viewStudents: '查看学生',
        updateGrade: '更新成绩',
        batchUpdateGrade: '批量更新成绩',
        checkEnrolled: '检查选课状态'
    },

    // 对话框
    dialog: {
        addTitle: '新增课程',
        editTitle: '编辑课程',
        courseName: '课程名称',
        courseNamePlaceholder: '请输入课程名称',
        courseType: '课程类型',
        courseTypePlaceholder: '请选择课程类型',
        description: '课程描述',
        descriptionPlaceholder: '请输入课程描述',
        teacherId: '主讲教师',
        teacherIdPlaceholder: '请选择主讲教师',
        assistantTeachers: '辅助教师',
        assistantTeachersPlaceholder: '请选择辅助教师',
        semester: '学期',
        semesterPlaceholder: '请输入学期',
        location: '上课地点',
        locationPlaceholder: '请输入上课地点',
        coverImage: '封面图片',
        coverImagePlaceholder: '请上传封面图片',
        status: '课程状态',
        statusPlaceholder: '请选择课程状态'
    },

    // 课程类型
    courseType: {
        REQUIRED: '必修',
        ELECTIVE: '选修'
    },

    // 颜色声明
    colorDeclaration: {
        required: '必修',
        elective: '选修'
    },

    // 课程状态
    courseStatus: {
        NORMAL: '正常',
        SUSPENDED: '停课'
    },

    // 表单验证
    validation: {
        courseNameRequired: '请输入课程名称',
        courseNameLength: '课程名称长度应在2-50个字符之间',
        courseTypeRequired: '请选择课程类型',
        teacherIdRequired: '请选择主讲教师',
        semesterLength: '学期长度不能超过20个字符',
        locationLength: '上课地点长度不能超过100个字符',
        descriptionLength: '课程描述长度不能超过500个字符'
    },

    // 选课状态
    enrollmentStatus: {
        ENROLLED: '在读',
        DROPPED: '已退课',
        COMPLETED: '已完成'
    },

    // 删除确认
    deleteConfirm: {
        title: '确认删除',
        content: '确定要删除课程"{0}"吗？此操作不可恢复。',
        batchContent: '确定要删除选中的{0}个课程吗？此操作不可恢复。',
        confirmText: '确认删除'
    },

    // 消息提示
    messages: {
        loading: '正在加载课程信息...',
        loadingTeacher: '正在加载教师信息...',
        addSuccess: '课程添加成功',
        addFail: '课程添加失败',
        updateSuccess: '课程更新成功',
        updateFail: '课程更新失败',
        deleteSuccess: '课程删除成功',
        deleteFail: '课程删除失败',
        batchDeleteSuccess: '批量删除成功',
        batchDeleteFail: '批量删除失败',
        loadFail: '课程信息加载失败',
        enrollSuccess: '选课成功',
        enrollFail: '选课失败',
        dropSuccess: '退课成功',
        dropFail: '退课失败',
        assignTeacherSuccess: '教师分配成功',
        assignTeacherFail: '教师分配失败',
        batchAssignTeachersSuccess: '批量分配教师团队成功',
        batchAssignTeachersFail: '批量分配教师团队失败',
        updateGradeSuccess: '成绩更新成功',
        updateGradeFail: '成绩更新失败',
        batchUpdateGradeSuccess: '批量更新成绩成功',
        batchUpdateGradeFail: '批量更新成绩失败',
        checkEnrolledSuccess: '检查选课状态成功',
        checkEnrolledFail: '检查选课状态失败'
    },

    // 视图切换
    view: {
        table: '表格视图',
        card: '卡片视图'
    },

    // 空状态
    empty: {
        noData: '暂无课程数据',
        noStudents: '暂无选课学生',
        noCourses: '暂无课程记录'
    },

    // 课程卡片
    card: {
        instructor: '主讲教师',
        assistantTeachers: '辅助教师',
        startCourse: '进入课程',
        suspended: '已停课',
        enroll: '选课',
        drop: '退课',
        viewDetails: '查看详情',
        courseProgress: '课程进度'
    },

    // 学生管理
    student: {
        title: '课程学生管理',
        studentId: '学生ID',
        studentName: '学生姓名',
        grade: '成绩',
        enrollmentDate: '选课日期',
        status: '选课状态',
        updateGrade: '更新成绩',
        batchUpdateGrade: '批量更新成绩'
    },

    // 教师管理
    teacher: {
        title: '课程教师管理',
        assignTeacher: '分配教师',
        assignTeachers: '分配教师团队',
        mainTeacher: '主讲教师',
        assistantTeachers: '辅助教师'
    },

    // 教师个人主页
    profile: {
        notFound: '教师信息不存在',
        noName: '未设置姓名',
        noCode: '未设置工号',
        teacherCode: '工号',
        description: '个人简介',
        specialization: '专业领域',
        contactInfo: '联系信息'
    },

    // 加课功能
    enroll: {
        addCourse: '我要加课',
        addCourseTitle: '添加课程',
        courseId: '课程ID',
        courseIdPlaceholder: '请输入课程ID',
        courseIdRequired: '请输入课程ID',
        addSuccess: '加课成功',
        addFail: '加课失败',
        courseNotFound: '课程不存在',
        alreadyEnrolled: '您已经选修了该课程',
        confirmAdd: '确认加课',
        confirmAddContent: '确定要选修课程ID为"{courseId}"的课程吗？'
    },


    // 课程详情页面
    detail: {
        noDescription: '暂无课程描述',
        noChapters: '暂无章节内容',
        noThreads: '暂无论坛帖子',
        noStudents: '暂无选课学生',
        unknownTeacher: '未知教师',
        chapters: '课程章节',
        forum: '课程论坛',
        courseInfo: '课程信息',
        basicInfo: '基本信息',
        quickActions: '快速操作',
        addChapter: '添加章节',
        createThread: '发布帖子',
        view: '查看',
        pinned: '置顶',
        closed: '已关闭',
        views: '浏览',
        replies: '回复',
        teacher: '主讲教师',
        students: '选课学生',
        semester: '学期',
        location: '上课地点',
        courseName: '课程名称',
        courseType: '课程类型',
        status: '课程状态',
        createTime: '创建时间',
        description: '课程描述',
        enroll: '选课',
        manageStudents: '管理学生',
        editCourse: '编辑课程',
        viewProfile: '查看资料',
        noTeacher: '暂无教师信息',
        viewAllStudents: '查看全部学生 ({count}人)',
        threadTitle: '帖子标题',
        threadTitlePlaceholder: '请输入帖子标题',
        threadContent: '帖子内容',
        threadContentPlaceholder: '请输入帖子内容',
        threadTitleRequired: '请输入帖子标题',
        threadContentRequired: '请输入帖子内容',
        createThreadSuccess: '帖子发布成功',
        createThreadError: '帖子发布失败',
        enrollNotImplemented: '选课功能暂未实现',
        viewAllStudentsNotImplemented: '查看全部学生功能暂未实现',
        fetchCourseError: '获取课程信息失败',
        fetchChaptersError: '获取课程章节失败',
        fetchThreadsError: '获取课程论坛失败',
        fetchStudentsError: '获取选课学生失败',
        // 新增的课程详情页面内容
        error: {
            title: '加载失败',
            loadError: '课程信息加载失败，请稍后重试'
        },
        teacherInfo: '教师信息',
        mainTeacher: '主讲教师',
        startCourse: '开始学习',
        courseSuspended: '课程已停课',
        loadError: '课程信息加载失败'
    },

    // 教师信息
    teacherInfo: '开课教师',

    // 分享课程
    share: {
        title: '分享课程',
        courseId: '课程ID',
        copySuccess: '课程ID已复制到剪贴板',
        copyFail: '复制失败，请手动复制',
        shareTips: '快将知识分享给同学吧！',
        close: '关闭'
    },

    // 教师学历统计
    teacherEducation: {
        title: '教师学历分布'
    },

    // 学生状态分布
    studentStatus: {
        title: '学生状态分布'
    },

    // 学生入课统计图表
    enrollment: {
        title: '学生入课趋势',
        tooltip: '入课人数',
        barSeriesName: '每日入课人数',
        lineSeriesName: '累计学生总数',
        enrollmentCount: '入课人数',
        totalStudents: '累计学生数'
    },

    // 学生成绩分布图表
    studentGrade: {
        title: '学生成绩分布',
        studentCount: '学生人数',
        ranges: {
            fail: '不及格(0-59)',
            pass: '及格(60-69)',
            good: '良好(70-79)',
            veryGood: '优秀(80-89)',
            excellent: '卓越(90-100)'
        }
    },

    // 课程详情操作
    detailActions: {
        edit: '编辑课程',
        delete: '删除课程',
        deleteConfirm: '确认删除',
        deleteConfirmContent: '确定要删除课程"{courseName}"吗？此操作不可恢复。',
        deleteSuccess: '课程删除成功',
        deleteFail: '课程删除失败',
        editSuccess: '课程编辑成功',
        editFail: '课程编辑失败'
    }
}
