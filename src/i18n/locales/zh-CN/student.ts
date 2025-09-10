export default {
    title: '学生管理',
    back: '返回',

    // 搜索表单
    searchForm: {
        title: '搜索条件',
        studentCode: '学号',
        studentCodePlaceholder: '请输入学号',
        studentName: '学生姓名',
        studentNamePlaceholder: '请输入学生姓名',
        enrollmentYear: '入学年份',
        enrollmentYearPlaceholder: '请输入入学年份',
        major: '专业',
        majorPlaceholder: '请输入专业',
        status: '学籍状态',
        statusPlaceholder: '请选择学籍状态',
        createTimeRange: '创建时间',
        createTimeRangePlaceholder: '请选择创建时间范围'
    },

    // 学籍状态选项
    status: {
        0: '在读',
        1: '休学',
        2: '退学',
        3: '毕业',
        ACTIVE: '在读',
        GRADUATED: '毕业',
        SUSPENDED: '休学',
        DROPPED: '退学',
        ENROLLED: '在读'
    },

    // 表格列
    table: {
        studentCode: '学号',
        studentName: '学生姓名',
        realName: '姓名',
        admissionYear: '入学年份',
        enrollmentYear: '入学年份',
        major: '专业',
        academicStatus: '学籍状态',
        status: '学籍状态',
        description: '描述',
        createTime: '创建时间',
        updateTime: '更新时间',
        actions: '操作',
        operation: '操作'
    },

    // 操作按钮
    actions: {
        add: '新增学生',
        edit: '编辑',
        delete: '删除',
        view: '查看'
    },

    // 添加/编辑对话框
    addStudent: {
        title: '新增学生',
        studentCode: '学号',
        studentCodePlaceholder: '请输入学号',
        studentCodeRequired: '请输入学号',
        studentName: '学生姓名',
        studentNamePlaceholder: '请输入学生姓名',
        studentNameRequired: '请输入学生姓名',
        realName: '姓名',
        realNamePlaceholder: '请输入姓名',
        realNameRequired: '请输入姓名',
        birthDate: '出生日期',
        birthDatePlaceholder: '请选择出生日期',
        birthDateRequired: '请选择出生日期',
        enrollmentYear: '入学年份',
        enrollmentYearPlaceholder: '请输入入学年份',
        enrollmentYearRequired: '请输入入学年份',
        admissionYear: '入学年份',
        admissionYearPlaceholder: '请输入入学年份',
        admissionYearRequired: '请输入入学年份',
        major: '专业',
        majorPlaceholder: '请输入专业',
        majorRequired: '请输入专业',
        status: '学籍状态',
        statusPlaceholder: '请选择学籍状态',
        statusRequired: '请选择学籍状态',
        academicStatus: '学籍状态',
        academicStatusPlaceholder: '请选择学籍状态',
        academicStatusRequired: '请选择学籍状态',
        description: '描述',
        descriptionPlaceholder: '请输入描述',
        descriptionRequired: '请输入描述',
        cancel: '取消',
        submit: '提交'
    },
    editStudent: {
        title: '编辑学生',
        studentCode: '学号',
        studentCodePlaceholder: '请输入学号',
        studentCodeRequired: '请输入学号',
        studentName: '学生姓名',
        studentNamePlaceholder: '请输入学生姓名',
        studentNameRequired: '请输入学生姓名',
        realName: '姓名',
        realNamePlaceholder: '请输入姓名',
        realNameRequired: '请输入姓名',
        birthDate: '出生日期',
        birthDatePlaceholder: '请选择出生日期',
        birthDateRequired: '请选择出生日期',
        enrollmentYear: '入学年份',
        enrollmentYearPlaceholder: '请输入入学年份',
        enrollmentYearRequired: '请输入入学年份',
        admissionYear: '入学年份',
        admissionYearPlaceholder: '请输入入学年份',
        admissionYearRequired: '请输入入学年份',
        major: '专业',
        majorPlaceholder: '请输入专业',
        majorRequired: '请输入专业',
        status: '学籍状态',
        statusPlaceholder: '请选择学籍状态',
        statusRequired: '请选择学籍状态',
        academicStatus: '学籍状态',
        academicStatusPlaceholder: '请选择学籍状态',
        academicStatusRequired: '请选择学籍状态',
        description: '描述',
        descriptionPlaceholder: '请输入描述',
        descriptionRequired: '请输入描述',
        cancel: '取消',
        submit: '提交'
    },
    dialog: {
        addTitle: '新增学生',
        editTitle: '编辑学生'
    },

    // 删除确认
    deleteConfirm: {
        title: '删除确认',
        content: '确定要删除学生 "{0}" 吗？此操作不可撤销。',
        confirmText: '确定删除',
        cancelText: '取消'
    },

    // 消息提示
    messages: {
        addSuccess: '学生添加成功',
        addFail: '学生添加失败',
        updateSuccess: '学生更新成功',
        updateFail: '学生更新失败',
        editSuccess: '学生编辑成功',
        editFail: '学生编辑失败',
        deleteSuccess: '学生删除成功',
        deleteFail: '学生删除失败',
        deleteConfirm: '确定要删除该学生吗？',
        loadFail: '学生列表加载失败',
        getDetailFail: '获取学生详情失败',
        studentCodeExists: '学号已存在',
        invalidStudentCode: '学号格式不正确',
        invalidEnrollmentYear: '入学年份格式不正确',
        invalidId: '学生ID无效'
    },

    // 验证规则
    validation: {
        studentCodeRequired: '请输入学号',
        studentCodeFormat: '学号格式不正确',
        studentNameRequired: '请输入学生姓名',
        studentNameLength: '学生姓名长度不能超过50个字符',
        enrollmentYearRequired: '请输入入学年份',
        enrollmentYearFormat: '入学年份格式不正确',
        majorRequired: '请输入专业',
        majorLength: '专业名称长度不能超过100个字符',
        statusRequired: '请选择学籍状态'
    }
}
