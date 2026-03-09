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
        isPublic: '是否公开',
        isPublicPlaceholder: '请选择是否公开',
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
        teacherName: '主讲教师',
        assistantTeachers: '辅助教师',
        assistantTeachersPlaceholder: '请选择辅助教师',
        semester: '学期',
        semesterPlaceholder: '请输入学期',
        location: '上课地点',
        locationPlaceholder: '请输入上课地点',
        coverImage: '封面图片',
        coverImagePlaceholder: '请上传封面图片',
        status: '课程状态',
        statusPlaceholder: '请选择课程状态',
        isPublic: '是否公开',
        isPublicLabel: '公开课程',
        isPublicPlaceholder: '请选择是否公开'
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

    // 课程公开状态
    coursePublic: {
        PRIVATE: '仅课程成员',
        PUBLIC: '公开'
    },

    // 表单验证
    validation: {
        courseNameRequired: '请输入课程名称',
        courseNameLength: '课程名称长度应在2-50个字符之间',
        courseTypeRequired: '请选择课程类型',
        teacherIdRequired: '请选择主讲教师',
        semesterLength: '学期长度不能超过20个字符',
        locationLength: '上课地点长度不能超过100个字符',
        descriptionLength: '课程描述长度不能超过500个字符',
        isPublicRequired: '请选择是否公开'
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
        loadingTasks: '正在加载课程任务...',
        loadingQuestions: '正在加载课程题库...',
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
        realName: '真实姓名',
        avatar: '头像',
        grade: '成绩',
        searchPlaceholder: '请输入学生真实姓名',
        enrollmentDate: '选课日期',
        status: '选课状态',
        createTime: '创建时间',
        updateGrade: '更新成绩',
        batchUpdateGrade: '批量更新成绩',
        view: '查看',
        edit: '编辑',
        remove: '移除',
        noStudents: '暂无选课学生',
        loadError: '加载学生列表失败',
        removeConfirm: '确认移除',
        removeConfirmContent: '确定要移除学生"{studentName}"吗？此操作不可恢复。',
        removeSuccess: '学生移除成功',
        removeFail: '学生移除失败',
        viewNotImplemented: '查看学生详情功能暂未实现',
        editNotImplemented: '编辑学生信息功能暂未实现',
        removeNotImplemented: '移除学生功能暂未实现',
        studentNotFound: '学生信息不存在',
        userLoggedOut: '该用户已注销，无法查看详细信息',
        editDialog: {
            title: '编辑学生信息',
            grade: '成绩',
            status: '选课状态',
            gradePlaceholder: '请输入成绩',
            gradeRequired: '请输入成绩',
            gradeInvalid: '成绩必须为0-100之间的数字',
            statusRequired: '请选择选课状态',
            cancel: '取消',
            confirm: '确认',
            editSuccess: '编辑成功',
            editFail: '编辑失败'
        }
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
        loadCourseFailed: '课程信息加载失败',
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

    // 帖子类型相关
    postTypeLabel: '帖子类型',
    postTypePlaceholder: '请选择帖子类型',
    postTypeRequired: '请选择帖子类型',

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
        individualTitle: '学生积分图表',
        scoreAxis: '积分',
        studentName: '学生姓名',
        studentCount: '学生人数',
        scoreUnit: '积分',
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
        classroom: '智慧课堂',
        tasks: '任务',
        questions: '题库',
        practice: '课堂练习'
    },

    // 计数器
    counter: {
        teachers: '教师'
    },

    // 课程论坛
    forum: {
        title: '课程论坛',
        createForum: '创建论坛',
        createPost: '发布帖子',
        createFirstForum: '创建第一个论坛',
        noForums: '暂无论坛',
        noDescription: '暂无描述',
        posts: '帖子',
        replies: '回复',
        anonymous: '匿名用户',
        realName: '实名',
        back: '返回',

        // 论坛类型
        forumType: {
            DISCUSSION: '讨论区',
            Q_AND_A: '问答区',
            ASSIGNMENT: '作业区',
            ANNOUNCEMENT: '公告区'
        },

        // 论坛状态
        forumStatus: {
            NORMAL: '正常',
            CLOSED: '关闭',
            MAINTENANCE: '维护'
        },

        // 表单字段
        forumName: '论坛名称',
        forumNamePlaceholder: '请输入论坛名称',
        forumNameRequired: '请输入论坛名称',
        description: '论坛描述',
        descriptionPlaceholder: '请输入论坛描述',
        forumTypeLabel: '论坛类型',
        forumTypePlaceholder: '请选择论坛类型',
        forumTypeRequired: '请选择论坛类型',
        isPublic: '是否公开',
        isPublicPlaceholder: '请选择是否公开',
        isPublicRequired: '请选择是否公开',
        private: '仅课程成员',
        public: '公开',
        allowAnonymous: '允许匿名',
        allowAnonymousRequired: '请选择是否允许匿名',
        disallow: '不允许',
        allow: '允许',
        rules: '论坛规则',
        rulesPlaceholder: '请输入论坛规则',

        // 帖子表单字段
        postTitle: '帖子标题',
        postTitlePlaceholder: '请输入帖子标题',
        postTitleRequired: '请输入帖子标题',
        postContent: '帖子内容',
        postContentPlaceholder: '请输入帖子内容',
        postContentRequired: '请输入帖子内容',
        postTypeLabel: '帖子类型',
        postTypePlaceholder: '请选择帖子类型',
        postTypeRequired: '请选择帖子类型',
        isAnonymous: '是否匿名',
        isAnonymousRequired: '请选择是否匿名',
        tags: '标签',
        tagsPlaceholder: '请输入标签，按回车添加',

        // 帖子类型
        postTypeDiscussion: '讨论',
        postTypeQuestion: '问题',
        postTypeAnnouncement: '公告',
        postTypeAssignment: '作业',

        // 论坛类型标签
        forumTypeDiscussion: '讨论区',
        forumTypeQa: '问答区',
        forumTypeAssignment: '作业区',
        forumTypeAnnouncement: '公告区',

        // 其他缺失的翻译
        selectForumToView: '请选择要查看的论坛',
        totalPosts: '总帖子数',
        loadForumFailed: '加载论坛失败',
        anonymousUser: '匿名用户无法查看主页',
        userNotFound: '用户信息不存在',
        loadPostsFailed: '加载帖子失败',
        createPostFailed: '发布帖子失败',
        likePostFailed: '点赞失败',
        shareFeatureComingSoon: '分享功能即将上线',
        postDetailComingSoon: '帖子详情功能即将上线',
        noPosts: '暂无帖子',

        // 分享相关
        sharePost: '分享帖子',
        shareLink: '分享链接',
        shareLinkCopied: '分享链接已复制到剪贴板',

        // 操作消息
        createForumSuccess: '论坛创建成功',
        createPostSuccess: '帖子发布成功',
        deletePostConfirm: '确定要删除帖子"{postTitle}"吗？',
        deletePostSuccess: '帖子删除成功',
        editForumNotImplemented: '编辑论坛功能开发中...',
        editPostNotImplemented: '编辑帖子功能开发中...',
        viewPostNotImplemented: '帖子详情功能开发中...',

        // 编辑和删除相关
        editPost: '编辑帖子',
        deletePost: '删除帖子',
        confirmDeletePost: '确定要删除这个帖子吗？此操作不可恢复。',
        deletePostFailed: '删除帖子失败',
        editPostSuccess: '帖子编辑成功',
        editPostFailed: '帖子编辑失败',

        // 置顶和精华操作
        setTopPost: '设为置顶',
        cancelTopPost: '取消置顶',
        setTopPostSuccess: '帖子置顶成功',
        setTopPostFailed: '帖子置顶失败',
        cancelTopPostSuccess: '取消置顶成功',
        cancelTopPostFailed: '取消置顶失败',
        setEssencePost: '设为精华',
        cancelEssencePost: '取消精华',
        setEssencePostSuccess: '帖子设为精华成功',
        setEssencePostFailed: '帖子设为精华失败',
        cancelEssencePostSuccess: '取消精华成功',
        cancelEssencePostFailed: '取消精华失败',
        editPostComingSoon: '编辑帖子功能即将上线',
        deletePostComingSoon: '删除帖子功能即将上线',

        // 论坛管理
        editForum: '编辑论坛',
        deleteForum: '删除论坛',
        deleteForumConfirm: '确定要删除论坛"{forumName}"吗？此操作不可恢复。',
        deleteForumSuccess: '论坛删除成功',
        updateForumSuccess: '论坛更新成功',
        updateForumFail: '论坛更新失败',

        // 点赞功能
        likeSystemDeveloping: '点赞系统开发中，敬请期待！',

        // 帖子详情页面
        postNotFound: '帖子不存在',
        loadPostFailed: '加载帖子失败',
        views: '浏览',
        likes: '点赞',
        like: '点赞',
        unlike: '取消点赞',
        likeSuccess: '点赞成功',
        likeFailed: '点赞失败',
        unlikeSuccess: '取消点赞成功',
        replyIdNotFound: '回复ID不存在',
        share: '分享',
        shareSuccess: '分享成功',
        shareFailed: '分享失败',
        collect: '收藏',
        uncollect: '取消收藏',
        collectSuccess: '收藏成功',
        uncollectSuccess: '取消收藏成功',
        attachments: '附件',
        images: '图片',
        topPost: '置顶',
        essencePost: '精华',
        lockedPost: '已锁定',

        // 组合标签
        topEssence: '置顶·精华',
        announcementTop: '公告·置顶',
        announcementEssence: '公告·精华',
        announcementTopEssence: '公告·置顶·精华',
        unlockPost: '解锁帖子',
        lockPost: '锁定帖子',
        lockPostSuccess: '锁定帖子成功',
        unlockPostSuccess: '解锁帖子成功',
        toggleLockFailed: '切换锁定状态失败',
        noReplies: '暂无回复',
        reply: '回复',
        replyContent: '回复内容',
        replyContentPlaceholder: '请输入回复内容',
        replyContentRequired: '请输入回复内容',
        replySuccess: '回复成功',
        replyFailed: '回复失败',
        confirmDeleteReply: '确定要删除这个回复吗？此操作不可恢复。',
        deleteReply: '删除回复',
        deleteReplySuccess: '删除回复成功',
        deleteReplyFailed: '删除回复失败',
        editReply: '编辑回复',
        editReplyComingSoon: '编辑回复功能即将上线',
        replyingTo: '正在回复',
        replyToUser: '回复用户',
        submitReply: '提交回复',
        acceptedAnswer: '已采纳',
        loadRepliesFailed: '加载回复失败',

        // 锁定/解锁确认
        confirmLockPost: '确定要锁定帖子吗？锁定后用户将无法回复。',
        confirmUnlockPost: '确定要解锁帖子吗？解锁后用户将可以正常回复。',

        // 图片加载
        imageLoadFailed: '图片加载失败',
        imageExpired: '图片已过期',

        // 回复相关
        cannotReplyToAnonymous: '匿名发言不能被回复',
        editReplySuccess: '回复编辑成功',
        editReplyFailed: '回复编辑失败',
        accepted: '已采纳',
        childReplies: '子回复',
        expand: '展开',
        collapse: '收回',
        replyTo: '回复',
        acceptReply: '采纳回复',
        unacceptReply: '取消采纳',
        acceptReplySuccess: '采纳回复成功',
        acceptReplyFailed: '采纳回复失败',
        unacceptReplySuccess: '取消采纳成功',
        unacceptReplyFailed: '取消采纳失败',
        loadChildRepliesFailed: '加载子回复失败',
        noChildReplies: '暂无子回复',
        anonymousCannotView: '匿名用户无法查看',
        anonymousCannotReply: '匿名用户无法回复',
        writeReply: '写回复',
        restoringState: '正在恢复页面状态...',
        messageNotVisible: '该消息不可见'
    },

    // 帖子类型
    postType: {
        NORMAL: '普通帖子',
        ANNOUNCEMENT: '公告'
    },

    // 暂未开放提示
    comingSoon: {
        title: '功能暂未开放',
        studentsDescription: '学生管理功能正在开发中，敬请期待！',
        forumDescription: '论坛描述',
        selectForumToView: '请选择要查看的论坛',
        chaptersDescription: '课程章节功能正在开发中，敬请期待！',
        classroomDescription: '在线课堂功能正在开发中，敬请期待！'
    },

    // 章节管理
    chapters: {
        title: '课程章节',
        searchLabel: '章节名称',
        searchPlaceholder: '请输入章节名称',
        addChapter: '添加章节',
        chapterManagement: '章节管理',
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
    previewFeatureDeveloping: '预览功能开发中，敬请期待...',

    // 状态恢复
    restoringState: '正在恢复页面状态...',

    // 任务管理
    tasks: {
        title: '课程任务',
        addTask: '添加任务',
        taskManagement: '任务管理',
        noTasks: '暂无任务',
        searchPlaceholder: '请输入任务名称',
        selectTaskToView: '请选择任务查看详情',
        deadline: '截止时间',
        points: '分值',
        description: '任务描述',
        content: '任务内容',
        requirements: '任务要求',
        attachments: '任务附件',
        statistics: '任务统计',
        dueDate: '截止日期',
        timeLimit: '时间限制',
        minutes: '分钟',
        sortOrder: '排序',
        publish: '发布',
        close: '关闭',
        publishConfirmContent: '确定要发布任务"{taskName}"吗？',
        closeConfirmContent: '确定要关闭任务"{taskName}"吗？',
        publishSuccess: '任务发布成功',
        closeSuccess: '任务关闭成功',
        deleteConfirmContent: '确定要删除任务"{taskName}"吗？此操作不可恢复。',
        deleteFailed: '任务删除失败',
        published: '已发布',
        draft: '草稿',
        publishedTasks: '已发布任务',
        draftTasks: '草稿任务',
        type: {
            HOMEWORK: '作业',
            QUIZ: '测验',
            PROJECT: '项目',
            EXPERIMENT: '实验',
            homework: '作业',
            quiz: '测验',
            project: '项目',
            experiment: '实验',
            unknown: '未知类型'
        },
        difficulty: {
            EASY: '简单',
            MEDIUM: '中等',
            HARD: '困难',
            easy: '简单',
            medium: '中等',
            hard: '困难',
            unknown: '未知难度'
        },
        status: {
            draft: '草稿',
            published: '已发布',
            inProgress: '进行中',
            ended: '已结束',
            unknown: '未知状态'
        },
        // 任务控制页面
        editTask: '编辑任务',
        taskName: '任务名称',
        taskNamePlaceholder: '请输入任务名称',
        taskNameRequired: '请输入任务名称',
        taskNameLength: '任务名称长度应在1-100个字符之间',
        taskType: '任务类型',
        taskTypePlaceholder: '请选择任务类型',
        taskTypeRequired: '请选择任务类型',
        difficultyLabel: '难度',
        difficultyPlaceholder: '请选择难度',
        difficultyRequired: '请选择难度',
        pointsPlaceholder: '请输入分值',
        pointsRequired: '请输入分值',
        pointsRange: '分值不能为负数',
        pointsCannotBeNegative: '分值不能为负数',
        pointsCannotExceed150: '分值不能超过150',
        startTime: '开始时间',
        startTimePlaceholder: '请选择开始时间',
        startTimeRequired: '请选择开始时间',
        endTime: '结束时间',
        endTimePlaceholder: '请选择结束时间',
        endTimeRequired: '请选择结束时间',
        dueDatePlaceholder: '请选择截止日期',
        timeLimitPlaceholder: '请输入时间限制（分钟）',
        timeLimitCannotBeNegative: '时间限制不能为负数',
        timeLimitCannotExceed9999: '时间限制不能超过9999',
        sortOrderPlaceholder: '请输入排序值',
        sortOrderRange: '排序值应在0-9999之间',
        descriptionPlaceholder: '请输入任务描述',
        contentPlaceholder: '请输入任务内容',
        requirementsPlaceholder: '请输入任务要求',
        saveDraft: '保存草稿',
        saveDraftSuccess: '草稿保存成功',
        saveDraftFailed: '草稿保存失败',
        publishFailed: '任务发布失败',
        loadFailed: '加载任务失败',
        createTime: '创建时间',
        updateTask: '更新任务',
        cancelEdit: '取消编辑',
        deleteTask: '删除任务',
        deleteConfirm: '确认删除任务',
        confirmDelete: '确认删除',
        deleteSuccess: '任务删除成功',
        updateSuccess: '任务更新成功',
        updateFailed: '任务更新失败',
        cannotGetTaskInfo: '无法获取任务信息',
        uploadFailed: '文件上传失败',
        loadFileInfoFailed: '加载文件信息失败',
        deleteAttachmentConfirm: '删除附件',
        deleteAttachmentConfirmContent: '确定要删除附件"{fileName}"吗？此操作不可恢复。',
        deleteAttachmentSuccess: '附件删除成功',
        deleteAttachmentFailed: '附件删除失败'
    },

    // 题库管理
    questionBank: {
        title: '题库管理',
        description: '管理课程题库，创建和管理题目',
        bankName: '题库名称',
        bankNamePlaceholder: '请输入题库名称',
        bankNameRequired: '请输入题库名称',
        bankDescription: '题库描述',
        descriptionPlaceholder: '请输入题库描述',
        bankType: '题库类型',
        bankTypePlaceholder: '请选择题库类型',
        bankTypeRequired: '请选择题库类型',
        difficulty: '难度等级',
        difficultyPlaceholder: '请选择难度等级',
        difficultyRequired: '请选择难度等级',
        isPublic: '是否公开',
        isPublicPlaceholder: '请选择是否公开',
        isPublicRequired: '请选择是否公开',
        private: '私有',
        public: '公开',
        practice: '练习题库',
        exam: '考试题库',
        homework: '作业题库',
        questionCount: '题目数量',
        noBanks: '暂无题库',
        noData: '暂无题库数据',
        createFirst: '创建第一个题库',
        noDescription: '暂无描述',
        questions: '题目',
        tags: '标签',
        tagsPlaceholder: '请输入标签，按回车添加',
        deleteConfirm: '删除确认',
        deleteConfirmContent: '确定要删除题库"{bankName}"吗？此操作不可恢复。',
        deleteSuccess: '题库删除成功',
        deleteFailed: '题库删除失败',
        share: '分享题库',
        edit: '编辑题库',
        delete: '删除题库',
        // 题库卡片
        card: {
            courseInfo: '课程信息',
            createdBy: '创建者',
            questionCount: '题目数量',
            difficulty: '难度',
            tags: '标签',
            createTime: '创建时间',
            updateTime: '更新时间',
            public: '公开',
            private: '私有',
            practice: '练习',
            exam: '考试',
            homework: '作业',
            easy: '简单',
            medium: '中等',
            hard: '困难'
        }
    },

    // 题目管理
    question: {
        title: '题目',
        description: '管理题库中的题目',
        detail: '题目详情',
        detailDescription: '查看和编辑题目详细信息',
        questionTitle: '题目标题',
        questionTitlePlaceholder: '请输入题目标题',
        questionTitleRequired: '请输入题目标题',
        questionContent: '题目内容',
        questionContentPlaceholder: '请输入题目内容',
        questionContentRequired: '请输入题目内容',
        questionType: '题目类型',
        questionTypePlaceholder: '请选择题目类型',
        questionTypeRequired: '请选择题目类型',
        difficulty: '难度等级',
        difficultyPlaceholder: '请选择难度等级',
        difficultyRequired: '请选择难度等级',
        score: '题目分数',
        scorePlaceholder: '请输入题目分数',
        scoreRequired: '请输入题目分数',
        estimatedTime: '预计答题时间',
        estimatedTimePlaceholder: '请输入预计答题时间（分钟）',
        unlimited: '不限',
        lessThanOneMinute: '< 1 分钟',
        status: '题目状态',
        statusPlaceholder: '请选择题目状态',
        statusRequired: '请选择题目状态',
        tags: '标签',
        allowPartialCredit: '允许部分得分',
        singleChoice: '单选题',
        multipleChoice: '多选题',
        trueFalse: '判断题',
        fillBlank: '填空题',
        shortAnswer: '简答题',
        draft: '草稿',
        published: '已发布',
        disabled: '已停用',
        myDraft: '我的草稿',
        content: '题目内容',
        options: '题目选项',
        answers: '题目答案',
        basicInfo: '基本信息',
        addOption: '添加选项',
        addAnswer: '添加答案',
        optionLabel: '选项标签',
        optionLabelPlaceholder: '请输入选项标签（如A、B、C、D）',
        optionLabelRequired: '请输入选项标签',
        optionContent: '选项内容',
        optionContentPlaceholder: '请输入选项内容',
        optionContentRequired: '请输入选项内容',
        isCorrect: '是否正确',
        isCorrectPlaceholder: '请选择是否正确',
        isCorrectRequired: '请选择是否正确',
        optionScore: '选项分数',
        optionScorePlaceholder: '请输入选项分数',
        answerContent: '答案内容',
        answerContentPlaceholder: '请输入答案内容',
        answerContentRequired: '请输入答案内容',
        answerText: '文本答案',
        answerTextPlaceholder: '请输入文本答案',
        answerScore: '答案分数',
        answerScorePlaceholder: '请输入答案分数',
        answerScoreRequired: '请输入答案分数',
        incorrect: '错误',
        correct: '正确',
        showAnswers: '开启答案',
        hideAnswers: '隐藏答案',
        partiallyCorrect: '部分正确',
        noData: '暂无题目数据',
        createFirst: '创建第一个题目',
        deleteConfirm: '确认删除题目',
        deleteConfirmContent: '确定要删除题目"{questionTitle}"吗？此操作不可撤销。',
        confirmDelete: '确认删除',
        deleteSuccess: '题目删除成功',
        deleteFailed: '题目删除失败',
        viewCount: '浏览次数',
        createQuestion: '创建题目',
        editQuestion: '编辑题目',
        createSuccess: '题目创建成功',
        createFailed: '题目创建失败',
        editSuccess: '题目编辑成功',
        editFailed: '题目编辑失败',
        saveDraft: '保存草稿',
        saveDraftSuccess: '草稿保存成功',
        saveDraftFailed: '草稿保存失败',
        publish: '一键发布',
        publishConfirm: '确认发布',
        publishConfirmContent: '确定要发布题目"{questionTitle}"吗？',
        publishSuccess: '题目发布成功',
        publishFailed: '题目发布失败',
        optionExplanation: '选项解析',
        optionExplanationPlaceholder: '请输入选项解析',
        noOptions: '暂无选项，请添加选项',
        noAnswers: '暂无答案，请添加答案',
        userNotLoggedIn: '用户未登录',
        optionsMinRequired: '单选题、多选题和判断题至少需要 {min} 个选项',
        optionsMaxRequired: '判断题最多只能有 {max} 个选项',
        atLeastOneCorrectRequired: '选项中必须至少有一个正确答案',
        answersMinRequired: '填空题和简答题至少需要 {min} 个答案',
        addToQuestionBank: '加入题库',
        addToQuestionBankTitle: '加入题库',
        addToQuestionBankContent: '确定要将该题目加入题库吗？',
        addToQuestionBankSuccess: '题目已成功加入题库',
        selectCourse: '选择课程',
        selectQuestionBank: '选择题库',
        tianshuQuestion: '天枢出题'
    },

    // 题目状态
    questions: {
        status: {
            DRAFT: '草稿',
            PUBLISHED: '已发布',
            DISABLED: '已停用'
        },
        type: {
            SINGLE_CHOICE: '单选题',
            MULTIPLE_CHOICE: '多选题',
            TRUE_FALSE: '判断题',
            FILL_BLANK: '填空题',
            SHORT_ANSWER: '简答题'
        }
    },

    // ClassPractice 课堂练习
    classPractice: {
        // PracticeDetail.vue
        unnamedQuestion: '未命名题目',
        startTime: '开始时间',
        endTime: '截止时间',
        classroom: '课堂',
        questionType: '题目类型',
        difficulty: '难度',
        score: '分数',
        estimatedTime: '预计时间',
        pointUnit: '分',
        minuteUnit: '分钟',
        notSet: '未设置',
        unlimitedTime: '不限时',
        studentAnswers: '学生回答',
        grade: '批阅',
        viewDetails: '查看详情',

        // PracticeList.vue
        start: '开始',
        end: '截止',
        unnamedClassroom: '未命名课堂',

        // PracticeStatisticsChart.vue
        practiceStatistics: '练习统计',
        noStatisticsData: '暂无统计数据',
        totalSubmissions: '提交总数',
        averageScore: '平均分',

        // AnswerDetailModal.vue
        studentAnswerDetails: '学生答案详情',
        studentName: '学生姓名',
        submissionTime: '提交时间',
        answerScore: '得分',
        ungraded: '未评分',
        status: '状态',
        studentAnswer: '学生答案',
        textAnswer: '文本答案',
        choiceAnswer: '选择答案',
        fillBlankAnswer: '填空答案',
        fillBlankPrefix: '填空',
        gradingAndScoring: '批阅给分',
        scoreLabel: '得分',
        previous: '上一个',
        next: '下一个',
        modifyScore: '修改得分',
        submitGrading: '提交批阅',
        noAnswerContent: '暂无答案内容',
        pleaseEnterScore: '请输入得分',

        // 表格列标题
        tableColumns: {
            studentName: '学生姓名',
            score: '得分',
            status: '状态',
            submitTime: '提交时间',
            reviewTime: '批阅时间',
            actions: '操作'
        },

        // 搜索表单
        searchForm: {
            questionTitle: '题目标题',
            questionTitlePlaceholder: '请输入题目标题',
            classroomId: '课堂',
            classroomIdPlaceholder: '请选择课堂',
            isRequired: '是否必答',
            isRequiredPlaceholder: '请选择是否必答',
            timeRange: '题目开始时间',
            timeRangePlaceholder: '请选择时间范围'
        },

        // 空状态
        selectPractice: '请选择左侧的课堂练习查看详情',
        noPractice: '暂无课堂练习'
    }
}
