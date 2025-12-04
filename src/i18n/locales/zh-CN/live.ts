export default {
    title: '直播',
    singleRoom: {
        title: '直播房间',
        roomName: '房间名称',
        courseName: '课程名称',
        teacher: '授课教师',
        maxParticipants: '最大并发人数',
        startTime: '开始时间',
        endTime: '结束时间',
        expectedEndTime: '预计结束时间',
        enterRoom: '进入直播间',
        courseSection: '课堂信息',
        empty: '当前课堂暂无直播房间',
        courseEmpty: '未找到课程记录',
        contextMissing: '缺少课堂上下文，无法创建直播房间'
    },
    form: {
        roomName: '房间名称',
        roomNamePlaceholder: '请输入直播房间名称',
        maxParticipants: '最大并发人数',
        maxParticipantsPlaceholder: '请输入最大并发人数（可选）',
        recordingEnabled: '开启录制',
        recordingEnabledOn: '已开启录制',
        recordingEnabledOff: '未开启录制',
        courseRecordMissing: '缺少课堂记录',
        courseRecordMissingDesc: '请先从课堂列表或课程详情进入相应课堂，再创建直播房间'
    },
    validation: {
        roomNameRequired: '请输入直播房间名称',
        roomNameLength: '房间名称长度不能超过 128 个字符'
    },
    actions: {
        create: '创建 / 更新直播房间',
        issueToken: '签发访问令牌'
    },
    token: {
        modalTitle: '签发直播访问令牌',
        roleLabel: '访问角色',
        issueButton: '生成令牌',
        issuedToken: '已生成的令牌',
        copyToken: '复制令牌',
        shareLink: '分享链接',
        copyLink: '复制链接'
    },
    room: {
        title: '直播间',
        statusUnknown: '状态未知',
        onlineCount: '在线人数',
        currentRole: '当前角色：{role}',
        sharedToken: '使用分享令牌加入',
        connectionState: '连接状态',
        join: '加入直播',
        leave: '离开直播',
        localVideo: '本地视频',
        chatTitle: '直播聊天',
        chatDescription: '与课堂成员实时交流',
        members: '人',
        connecting: '连接中',
        connected: '已连接',
        disconnected: '已断开',
        reconnecting: '重连中',
        connectFailed: '连接失败',
        system: '系统',
        welcomeMessage: '欢迎进入直播间，您可以在这里与老师和同学实时互动',
        unknown: '未知用户'
    }
}
