export default {
    title: '教师管理',
    back: '返回',

    // 搜索表单
    searchForm: {
        title: '搜索条件',
        teacherCode: '教师编号',
        teacherCodePlaceholder: '请输入教师编号',
        teacherName: '教师姓名',
        teacherNamePlaceholder: '请输入教师姓名',
        department: '所属部门',
        departmentPlaceholder: '请输入所属部门',
        education: '学历',
        educationPlaceholder: '请选择学历',
        createTimeRange: '创建时间',
        createTimeRangePlaceholder: '请选择创建时间范围'
    },

    // 学历选项
    education: {
        0: '专科',
        1: '本科',
        2: '硕士',
        3: '博士',
        COLLEGE: '专科',
        BACHELOR: '本科',
        MASTER: '硕士',
        DOCTOR: '博士'
    },

    // 表格列
    table: {
        teacherCode: '教师编号',
        teacherName: '教师姓名',
        department: '所属部门',
        education: '学历',
        createTime: '创建时间',
        updateTime: '更新时间',
        operation: '操作'
    },

    // 操作按钮
    actions: {
        add: '新增教师',
        edit: '编辑',
        delete: '删除',
        view: '查看'
    },

    // 添加/编辑对话框
    dialog: {
        addTitle: '新增教师',
        editTitle: '编辑教师',
        teacherCode: '教师编号',
        teacherCodePlaceholder: '请输入教师编号',
        teacherCodeRequired: '请输入教师编号',
        teacherName: '教师姓名',
        teacherNamePlaceholder: '请输入教师姓名',
        teacherNameRequired: '请输入教师姓名',
        department: '所属部门',
        departmentPlaceholder: '请输入所属部门',
        departmentRequired: '请输入所属部门',
        education: '学历',
        educationPlaceholder: '请选择学历',
        educationRequired: '请选择学历'
    },

    // 删除确认
    deleteConfirm: {
        title: '删除确认',
        content: '确定要删除教师 "{0}" 吗？此操作不可撤销。',
        confirmText: '确定删除',
        cancelText: '取消'
    },

    // 消息提示
    messages: {
        addSuccess: '教师添加成功',
        addFail: '教师添加失败',
        updateSuccess: '教师更新成功',
        updateFail: '教师更新失败',
        deleteSuccess: '教师删除成功',
        deleteFail: '教师删除失败',
        loadFail: '教师列表加载失败',
        teacherCodeExists: '教师编号已存在',
        invalidTeacherCode: '教师编号格式不正确'
    },

    // 验证规则
    validation: {
        teacherCodeRequired: '请输入教师编号',
        teacherCodeFormat: '教师编号格式不正确',
        teacherNameRequired: '请输入教师姓名',
        teacherNameLength: '教师姓名长度不能超过50个字符',
        departmentRequired: '请输入所属部门',
        departmentLength: '部门名称长度不能超过100个字符',
        educationRequired: '请选择学历'
    },

    // 教师个人主页
    profile: {
        notFound: '未找到教师信息',
        teacherCode: '教师编号',
        description: '个人简介',
        specialization: '专业领域',
        contactInfo: '联系信息'
    }
}
