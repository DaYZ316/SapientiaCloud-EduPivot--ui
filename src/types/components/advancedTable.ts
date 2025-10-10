import type {PageEntity} from '@/types/common/baseEntity'

/**
 * 头像列配置
 */
export interface AvatarColumnConfig {
    /** 头像字段名 */
    avatarSrcField?: string
    /** 用户名字段名 */
    usernameField?: string
    /** 昵称字段名 */
    nickNameField?: string
    /** 学生真实姓名字段名 */
    studentRealNameField?: string
    /** 教师真实姓名字段名 */
    teacherRealNameField?: string
    /** 头像尺寸 */
    avatarSize?: 'small' | 'medium' | 'large' | number
    /** 是否圆形头像 */
    avatarRound?: boolean
}

/**
 * 状态列配置
 */
export interface StatusColumnConfig {
    /** 状态字段名 */
    statusField?: string
    /** 状态映射配置 */
    statusMap?: Record<string | number, { label: string; type: string; color?: string }>
    /** 状态标签尺寸 */
    statusSize?: 'small' | 'medium' | 'large'
}

/**
 * 标签列配置
 */
export interface TagColumnConfig {
    /** 标签类型 */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
    /** 标签尺寸 */
    size?: 'small' | 'medium' | 'large'
    /** 是否圆角 */
    round?: boolean
    /** 标签颜色 */
    color?: string
}

/**
 * 操作按钮配置
 */
export interface ActionButtonConfig {
    /** 操作键 */
    key: string
    /** 按钮标签 */
    label: string
    /** 按钮类型 */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
    /** 按钮尺寸 */
    size?: 'small' | 'medium' | 'large'
    /** 是否文本按钮 */
    text?: boolean
    /** 是否虚线按钮 */
    dashed?: boolean
    /** 是否禁用（函数形式，接收行数据） */
    disabled?: (row: any) => boolean
}

/**
 * 操作列配置
 */
export interface ActionColumnConfig {
    /** 操作按钮列表 */
    actions: ActionButtonConfig[]
}

/**
 * 高级表格列类型
 */
export type AdvancedTableColumnType = 'avatar' | 'status' | 'tag' | 'action' | 'custom'

/**
 * 高级表格列定义
 */
export interface AdvancedTableColumn {
    /** 列标题 */
    title?: string
    /** 列键 */
    key?: string
    /** 列类型 */
    type?: AdvancedTableColumnType
    /** 字段名（用于数据绑定） */
    field?: string
    /** 列宽度 */
    width?: number | string
    /** 列对齐方式 */
    align?: 'left' | 'center' | 'right'
    /** 是否固定列 */
    fixed?: 'left' | 'right' | boolean
    /** 头像列配置 */
    avatarConfig?: AvatarColumnConfig
    /** 状态列配置 */
    statusConfig?: StatusColumnConfig
    /** 标签列配置 */
    tagConfig?: TagColumnConfig
    /** 操作列配置 */
    actionConfig?: ActionColumnConfig
    /** 自定义渲染函数 */
    render?: (row: any, index: number) => any
    /** 头像字段名 */
    avatarSrcField?: string
    /** 用户名字段名 */
    usernameField?: string
    /** 昵称字段名 */
    nickNameField?: string
    /** 学生真实姓名字段名 */
    studentRealNameField?: string
    /** 教师真实姓名字段名 */
    teacherRealNameField?: string
    /** 头像尺寸 */
    avatarSize?: 'small' | 'medium' | 'large' | number
    /** 是否圆形头像 */
    avatarRound?: boolean
    /** 状态字段名 */
    statusField?: string
    /** 状态映射配置 */
    statusMap?: Record<string | number, { label: string; type: string; color?: string }>
    /** 状态标签尺寸 */
    statusSize?: 'small' | 'medium' | 'large'
    /** 操作按钮列表 */
    actions?: ActionButtonConfig[]
}

/**
 * 高级表格属性
 */
export interface AdvancedTableProps {
    /** 表格列定义 */
    columns?: AdvancedTableColumn[]
    /** API请求函数 */
    apiFn?: <P extends PageEntity>(params: P) => Promise<any>
    /** 查询参数 */
    queryParams?: PageEntity
    /** 是否自动加载数据 */
    autoLoad?: boolean
    /** 是否在查询参数变化时自动搜索 */
    autoSearch?: boolean
    /** 表格边框 */
    bordered?: boolean
    /** 表格大小 */
    size?: 'small' | 'medium' | 'large'
    /** 表格最大高度 */
    maxHeight?: string | number | null
    /** 单行模式 */
    singleLine?: boolean
    /** 斑马纹 */
    striped?: boolean
    /** 页面大小选项 */
    pageSizes?: number[]
    /** 是否显示页大小选择器 */
    showSizePicker?: boolean
    /** 是否显示快速跳转 */
    showQuickJumper?: boolean
    /** 行键字段名 */
    rowKey?: string | ((row: any) => string | number)
}

/**
 * 操作点击事件参数
 */
export interface ActionClickEvent {
    /** 操作键 */
    actionKey: string
    /** 行数据 */
    row: any
    /** 操作配置 */
    action: ActionButtonConfig
}
