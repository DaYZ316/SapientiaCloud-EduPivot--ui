export default {
  title: '通知管理',
  searchForm: {
    title: '标题',
    titlePlaceholder: '请输入通知标题关键字',
    type: '通知类型',
    typePlaceholder: '请选择通知类型',
    status: '阅读状态',
    statusPlaceholder: '请选择阅读状态',
    senderName: '发送者',
    senderNamePlaceholder: '请输入发送者姓名',
    createTimeRange: '创建时间范围',
    createTimeRangePlaceholder: '请选择创建时间范围',
    search: '搜索',
    reset: '重置'
  },
  table: {
    title: '标题',
    content: '内容',
    type: '类型',
    status: '状态',
    senderName: '发送者',
    createTime: '创建时间',
    readTime: '阅读时间',
    actions: '操作'
  },
  actions: {
    add: '发送通知',
    edit: '编辑通知',
    delete: '删除通知',
    markAsRead: '标记已读',
    markAllAsRead: '全部标记已读',
    batchMarkAsRead: '批量标记已读',
    batchDelete: '批量删除',
    view: '查看详情'
  },
  addNotification: {
    title: '发送通知',
    titlePlaceholder: '请输入通知标题',
    content: '通知内容',
    contentPlaceholder: '请输入通知内容（支持富文本）',
    type: '通知类型',
    typePlaceholder: '请选择通知类型',
    recipientType: '接收者类型',
    recipientTypePlaceholder: '请选择接收者类型',
    recipients: '接收者',
    recipientsPlaceholder: '请选择接收者',
    attachments: '附件',
    attachmentsPlaceholder: '请上传附件（可选）',
    submit: '发送',
    cancel: '取消'
  },
  editNotification: {
    title: '编辑通知'
  },
  messages: {
    addSuccess: '通知发送成功',
    updateSuccess: '通知更新成功',
    deleteSuccess: '通知删除成功',
    batchDeleteSuccess: '批量删除成功',
    markAsReadSuccess: '标记已读成功',
    batchMarkAsReadSuccess: '批量标记已读成功',
    markAllAsReadSuccess: '全部标记已读成功',
    deleteConfirm: '确定要删除此通知吗？',
    markAsReadConfirm: '确定要将此通知标记为已读吗？',
    markAllAsReadConfirm: '确定要将所有通知标记为已读吗？'
  },
  status: {
    unread: '未读',
    read: '已读'
  },
  type: {
    system: '系统通知',
    course: '课程通知',
    homework: '作业通知',
    live: '直播通知',
    other: '其他'
  },
  recipientType: {
    all: '全部用户',
    role: '按角色',
    course: '按课程学生',
    users: '指定用户'
  },
  empty: {
    noData: '暂无通知',
    noUnread: '暂无未读通知'
  },
  detail: {
    title: '通知详情',
    attachments: '附件',
    attachment: '附件',
    readTime: '阅读时间'
  }
}