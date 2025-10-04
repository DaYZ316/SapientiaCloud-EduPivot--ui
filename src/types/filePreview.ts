/**
 * 文件预览模块类型定义
 */

// 支持的文件类型枚举
export enum FilePreviewType {
    PDF = 'pdf',
    DOCX = 'docx',
    EXCEL = 'excel',
    PPTX = 'pptx',
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    TEXT = 'text',
    UNSUPPORTED = 'unsupported'
}

// 文件类型字符串联合类型
export type FilePreviewTypeString =
    'pdf'
    | 'docx'
    | 'excel'
    | 'pptx'
    | 'image'
    | 'video'
    | 'audio'
    | 'text'
    | 'unsupported'

// 文件预览配置接口
export interface FilePreviewConfig {
    // 文件信息
    fileInfo: {
        fileName: string
        fileSize: number
        fileType: string
        lastModified: string
        url: string
    }
    // 预览配置
    preview: {
        // 是否显示工具栏
        showToolbar: boolean
        // 是否显示文件信息
        showFileInfo: boolean
        // 是否允许下载
        allowDownload: boolean
        // 是否允许打印
        allowPrint: boolean
        // 是否允许全屏
        allowFullscreen: boolean
        // 是否显示页码（PDF）
        showPageNumbers: boolean
        // 是否显示缩放控制
        showZoomControls: boolean
    }
    // 样式配置
    style: {
        // 预览区域高度
        height: string
        // 预览区域宽度
        width: string
        // 背景色
        backgroundColor: string
        // 边框样式
        borderStyle: string
    }
}

// 文件预览组件Props接口
export interface FilePreviewProps {
    // 文件信息
    fileInfo: {
        fileName: string
        fileSize: number
        fileType: string
        lastModified: string
        url: string
    }
    // 是否显示工具栏
    showToolbar?: boolean
    // 是否显示文件信息
    showFileInfo?: boolean
    // 是否允许下载
    allowDownload?: boolean
    // 是否允许打印
    allowPrint?: boolean
    // 是否允许全屏
    allowFullscreen?: boolean
    // 预览区域高度
    height?: string
    // 预览区域宽度
    width?: string
    // 是否加载中
    loading?: boolean
    // 错误信息
    error?: string
}

// 文件预览组件Emits接口
export interface FilePreviewEmits {
    'download': [fileInfo: FilePreviewProps['fileInfo']]
    'print': [fileInfo: FilePreviewProps['fileInfo']]
    'fullscreen': [isFullscreen: boolean]
    'error': [error: string]
    'load-success': [fileInfo: FilePreviewProps['fileInfo']]
    'load-error': [error: string]
}

// 文件预览工具栏配置
export interface FilePreviewToolbarConfig {
    // 显示下载按钮
    showDownload: boolean
    // 显示打印按钮
    showPrint: boolean
    // 显示全屏按钮
    showFullscreen: boolean
    // 显示文件信息按钮
    showFileInfo: boolean
    // 显示缩放控制（PDF/图片）
    showZoom: boolean
    // 显示页码控制（PDF）
    showPageControl: boolean
}

// 文件预览状态
export interface FilePreviewState {
    // 是否加载中
    loading: boolean
    // 是否全屏
    fullscreen: boolean
    // 错误信息
    error: string | null
    // 当前页码（PDF）
    currentPage: number
    // 总页数（PDF）
    totalPages: number
    // 缩放比例
    zoom: number
    // 是否显示文件信息
    showFileInfo: boolean
}
