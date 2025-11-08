import http, {apiConfig} from '@/utils/http'
import type {ChatMessage, ChatRequestDTO, ChatResponseVO} from '@/types/celestialHub/chatMessage'
import {useUserStore} from '@/store'
import {fetchEventSource} from '@microsoft/fetch-event-source'

/**
 * 获取默认聊天请求DTO
 */
export function getDefaultChatRequestDTO(): ChatRequestDTO {
    return {
        sessionId: null,
        message: null,
        courseId: null,
        chapterId: null,
        sessionType: 0,
        useRag: true,
        stream: true,
        temperature: null,
        maxTokens: null,
        attachments: null
    }
}

/**
 * 通过消息的唯一ID获取其详细信息
 * @param id 消息ID
 */
export function getChatMessageById(id: string) {
    return http.get<ChatMessage>(`/celestial-hub/message/${id}`)
}

/**
 * 对AI回复进行反馈（有用/无用）
 * @param id 消息ID
 * @param feedback 反馈类型: 1-有用, -1-无用
 */
export function feedbackMessage(id: string, feedback: number) {
    return http.post<boolean>(`/celestial-hub/message/${id}/feedback`, null, {
        params: {feedback}
    })
}

/**
 * 发送消息给AI助手并获取回复
 * @param data 聊天请求DTO
 */
export function chat(data: ChatRequestDTO) {
    return http.post<ChatResponseVO>('/celestial-hub/message/send', data)
}

/**
 * 获取指定会话的消息列表
 * @param sessionId 会话ID
 * @param limit 限制数量
 */
export function listMessagesBySessionId(sessionId: string, limit?: number) {
    return http.get<ChatMessage[]>(`/celestial-hub/message/session/${sessionId}`, {
        params: {limit}
    })
}

/**
 * SSE事件回调接口
 */
export interface SSEEventCallbacks {
    /** 接收到数据事件时调用 */
    onMessage?: (data: string) => void
    /** 连接打开时调用 */
    onOpen?: () => void
    /** 发生错误时调用 */
    onError?: (error: Error) => void
    /** 连接关闭时调用 */
    onClose?: () => void
}

/**
 * 可控制的SSE连接控制器
 */
export class SSEController {
    private abortController: AbortController | null = null

    /**
     * 关闭连接
     */
    close(): void {
        if (this.abortController) {
            this.abortController.abort()
            this.abortController = null
        }
    }

    /**
     * 设置AbortController
     */
    setAbortController(controller: AbortController): void {
        this.abortController = controller
    }
}

/**
 * 发送消息并以流式方式接收AI回复（基于SSE协议）
 * @param data 聊天请求DTO
 * @param callbacks SSE事件回调
 * @returns SSEController实例，用于关闭连接
 */
export function chatStream(data: ChatRequestDTO, callbacks: SSEEventCallbacks): SSEController {
    // 同步获取token和baseURL
    const userStore = useUserStore()
    const token = userStore.token
    const baseURL = apiConfig.getBaseUrl()

    // 构建完整URL
    const fullURL = `${baseURL}/celestial-hub/message/stream/kafka`

    // 创建AbortController用于控制连接
    const abortController = new AbortController()
    const controller = new SSEController()
    controller.setAbortController(abortController)

    // 使用fetchEventSource替代EventSource，支持自定义请求头和POST请求
    fetchEventSource(fullURL, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify(data),
        signal: abortController.signal,
        async onopen(response) {
            if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
                if (callbacks.onOpen) {
                    callbacks.onOpen()
                }
            } else {
                const error = new Error(`Failed to connect to stream: ${response.status} ${response.statusText}`)
                if (callbacks.onError) {
                    callbacks.onError(error)
                }
                abortController.abort()
            }
        },
        onmessage(event) {
            if (callbacks.onMessage) {
                callbacks.onMessage(event.data)
            }
        },
        onclose() {
            if (callbacks.onClose) {
                callbacks.onClose()
            }
        },
        onerror(err) {
            if (callbacks.onError) {
                callbacks.onError(err)
            }
            abortController.abort()
        }
    }).catch((error) => {
        if (callbacks.onError) {
            callbacks.onError(error)
        }
    })

    return controller
}

