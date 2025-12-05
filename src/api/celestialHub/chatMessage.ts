import type {AxiosRequestConfig} from 'axios'
import http, {apiConfig} from '@/utils/http'
import type {
    CancelChatStreamKafkaDTO,
    ChatMessage,
    ChatRequestDTO,
    ChatResponseVO,
    KafkaChatRequestDTO,
    SSEEventCallbacks
} from '@/types/celestialHub/chatMessage'
import {useUserStore} from '@/store'
import {fetchEventSource} from '@microsoft/fetch-event-source'

/**
 * 获取默认聊天请求DTO
 */
export function getDefaultChatRequestDTO(): ChatRequestDTO {
    return {
        sessionId: null,
        userId: null,
        message: null,
        courseId: null,
        chapterId: null,
        sessionType: null,
        useRag: null,
        stream: null,
        temperature: null,
        maxTokens: null,
        attachments: null,
        fileReferences: null
    }
}

/**
 * 获取默认Kafka聊天请求DTO
 */
export function getDefaultKafkaChatRequestDTO(): KafkaChatRequestDTO {
    return {
        ...getDefaultChatRequestDTO(),
        requestId: null
    }
}

/**
 * 获取默认取消Kafka流式请求DTO
 */
export function getDefaultCancelChatStreamKafkaDTO(): CancelChatStreamKafkaDTO {
    return {
        requestId: null,
        reason: null
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
 * @param config Axios 请求配置
 */
export function listMessagesBySessionId(sessionId: string, limit?: number, config?: AxiosRequestConfig) {
    return http.get<ChatMessage[]>(`/celestial-hub/message/session/${sessionId}`, {limit}, config)
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
function createChatStreamRequest(
    endpoint: string,
    data: ChatRequestDTO,
    callbacks: SSEEventCallbacks
): SSEController {
    const userStore = useUserStore()
    const token = userStore.token
    const baseURL = apiConfig.getBaseUrl()

    // 构建完整URL
    const fullURL = `${baseURL}${endpoint}`

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
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify(data || {}),
        signal: abortController.signal,
        // 允许在页面不可见（切到其他窗口或最小化）时依然建立和保持连接
        openWhenHidden: true,
        async onopen(response) {
            if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
                if (callbacks.onOpen) {
                    callbacks.onOpen()
                }
            } else {
                if (callbacks.onError) {
                    callbacks.onError(new Error(`Failed to connect to stream: ${response.status} ${response.statusText}`))
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
        onerror(error) {
            if (callbacks.onError) {
                callbacks.onError(error)
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

/**
 * 发送消息并以流式方式接收AI回复（标准SSE）
 * @param data 聊天请求DTO
 * @param callbacks SSE事件回调
 */
export function chatStream(data: ChatRequestDTO, callbacks: SSEEventCallbacks): SSEController {
    return createChatStreamRequest('/celestial-hub/message/stream', data, callbacks)
}

/**
 * 发送消息并以流式方式接收AI回复（Kafka管道）
 * @param data 聊天请求DTO
 * @param callbacks SSE事件回调
 */
export function chatStreamKafka(data: KafkaChatRequestDTO, callbacks: SSEEventCallbacks): SSEController {
    return createChatStreamRequest('/celestial-hub/message/stream/kafka', data, callbacks)
}

/**
 * 取消Kafka流式聊天请求
 * @param data 取消请求DTO
 */
export function cancelChatStreamKafka(data: CancelChatStreamKafkaDTO) {
    if (!data.requestId) {
        return Promise.resolve(false)
    }
    return http.post<boolean>(
        `/celestial-hub/message/stream/kafka/${data.requestId}/cancel`,
        null,
        {
            params: {
                reason: data.reason
            }
        }
    )
}


