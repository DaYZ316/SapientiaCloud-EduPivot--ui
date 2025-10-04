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
        unknownTeacher: '未知教师',
        chapters: '课程章节',
        forum: '课程论坛',
        courseInfo: '课程信息',
        basicInfo: '基本信息',
        quickActions: '快速操作',
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
        courseSuspended: '课程已停课'
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
        title: '教师学历分布',
        noDataDescription: '暂无教师学历数据，请先为课程分配教师'
    },

    // 学生状态分布
    studentStatus: {
        title: '学生状态分布',
        noDataDescription: '暂无学生状态数据，请等待学生选课'
    },

    // 学生入课统计图表
    enrollment: {
        title: '学生入课趋势',
        tooltip: '入课人数',
        barSeriesName: '每日入课人数',
        lineSeriesName: '累计学生总数',
        enrollmentCount: '入课人数',
        totalStudents: '累计学生数',
        noDataDescription: '暂无入课趋势数据，请等待学生选课'
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
        },
        noDataDescription: '暂无成绩分布数据，请先录入学生成绩'
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
    },

    // 教师跑马灯
    teacherMarquee: {
        noAssistantTeachers: '暂无助教信息'
    },

    // 课程功能导航
    navigation: {
        students: '学生',
        forum: '论坛',
        chapters: '章节',
        classroom: '课堂'
    },

    // 计数器
    counter: {
        teachers: '教师'
    },

    // 暂未开放提示
    comingSoon: {
        title: '功能暂未开放',
        studentsDescription: '学生管理功能正在开发中，敬请期待！',
        forumDescription: '课程论坛功能正在开发中，敬请期待！',
        chaptersDescription: '课程章节功能正在开发中，敬请期待！',
        classroomDescription: '在线课堂功能正在开发中，敬请期待！'
    },

    // 章节管理
    chapters: {
        title: '课程章节',
        searchLabel: '章节名称',
        searchPlaceholder: '请输入章节名称',
        addChapter: '添加章节',
        draft: '草稿',
        published: '已发布',
        draftChapters: '暂无草稿章节',
        publishedChapters: '暂无已发布章节',
        noChapters: '暂无章节内容',
        loadError: '章节加载失败',
        loadCourseInfoFailed: '加载课程信息失败',
        loadDraftChaptersFailed: '加载草稿章节失败',
        loadPublishedChaptersFailed: '加载已发布章节失败',
        deleteError: '章节删除失败',
        addChapterNotImplemented: '添加章节功能暂未实现',
        viewChapterNotImplemented: '查看章节详情功能暂未实现',
        editChapterNotImplemented: '编辑章节功能暂未实现',
        likeSuccess: '点赞成功',
        likeError: '点赞失败',
        unlikeSuccess: '取消点赞成功',
        unlikeError: '取消点赞失败',
        statusUpdateSuccess: '章节状态更新成功',
        statusUpdateError: '章节状态更新失败',
        sortUpdateSuccess: '章节排序更新成功',
        sortUpdateError: '章节排序更新失败',
        batchSortUpdateSuccess: '批量排序更新成功',
        batchSortUpdateError: '批量排序更新失败',
        attachmentUploadSuccess: '附件上传成功',
        attachmentUploadError: '附件上传失败',
        attachmentRemoveSuccess: '附件删除成功',
        attachmentRemoveError: '附件删除失败',
        deleteAttachmentSuccess: '附件删除成功',
        actions: {
            addChapter: '添加章节',
            viewChapter: '查看章节',
            editChapter: '编辑章节',
            deleteChapter: '删除章节',
            likeChapter: '点赞',
            unlikeChapter: '取消点赞'
        },
        form: {
            chapterName: '章节名称',
            chapterNamePlaceholder: '请输入章节名称',
            parentChapterId: '父章节',
            parentChapterIdPlaceholder: '请选择父章节（可选）',
            sortOrder: '排序权重',
            description: '章节描述',
            descriptionPlaceholder: '请输入章节描述（可选）',
            content: '章节内容',
            contentPlaceholder: '请输入章节内容',
            sortOrderPlaceholder: '请输入排序值（0-9999）',
            attachments: '章节附件',
            attachmentsPlaceholder: '请上传章节相关附件',
            attachmentsDescription: '支持上传文档、图片、视频等文件，最多10个文件，单个文件不超过50MB',
            attachmentsTitle: '章节附件',
            noAttachments: '暂无附件',
            attachmentCount: '个文件',
            attachmentExpired: '已过期',
            attachmentValidityPeriod: '有效期',
            attachmentPreview: '预览',
            attachmentDownload: '下载',
            attachmentDelete: '删除',
            attachmentUploadError: '附件上传失败',
            attachmentRemoveError: '附件删除失败',
            deleteAttachmentConfirm: '删除附件',
            deleteAttachmentConfirmContent: '确定要删除附件"{fileName}"吗？此操作不可恢复。',
            deleteAttachmentSuccess: '附件删除成功'
        },
        validation: {
            chapterNameRequired: '请输入章节名称',
            chapterNameLength: '章节名称长度应在1-100个字符之间',
            descriptionLength: '章节描述长度不能超过500个字符',
            sortOrderRange: '排序值应在0-9999之间'
        },
        selectChapterToView: '请选择章节查看详情',
        chapterOrder: '第{order}章',
        description: '章节描述',
        content: '章节内容',
        editChapter: '编辑章节',
        updateChapter: '更新章节',
        deleteChapter: '删除章节',
        deleteChapterNotImplemented: '删除章节功能暂未实现',
        cancelEdit: '取消编辑',
        deleteConfirm: '确认删除',
        deleteConfirmContent: '确定要删除章节"{chapterName}"吗？删除后无法恢复。',
        confirmDelete: '确定删除',
        cannotGetChapterInfo: '无法获取章节信息',
        getFileInfoFailed: '获取文件信息失败',
        saveFailed: '保存失败，请检查表单信息',
        status: {
            published: '已发布',
            draft: '草稿',
            archived: '已归档',
            unknown: '未知状态'
        },
        statusDraft: '草稿',
        statusPublished: '已发布',
        addSuccess: '章节添加成功',
        addFailed: '章节添加失败',
        updateSuccess: '章节更新成功',
        updateFailed: '章节更新失败',
        saveDraftSuccess: '草稿保存成功',
        saveDraftFailed: '草稿保存失败',
        deleteSuccess: '章节删除成功',
        deleteFailed: '章节删除失败',
        publish: '发布',
        saveDraft: '保存草稿'
    },

    // 章节状态
    chapterStatus: {
        DRAFT: '草稿',
        PUBLISHED: '发布',
        OFFLINE: '下架'
    },

    // 文件预览
    previewFeatureDeveloping: '预览功能开发中，敬请期待...'
}
