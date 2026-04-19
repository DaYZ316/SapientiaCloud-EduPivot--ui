import {apiConfig} from '@/utils/http'
import {useUserStore} from '@/store'
import {fetchEventSource} from '@microsoft/fetch-event-source'
import {SSEController} from '@/api/celestialHub/chatMessage'
import type {
    QuestionPaperExportRequestDTO,
    QuestionGenerateRequestDTO,
    QuestionGenerationStreamEvent
} from '@/types/celestialHub/question'

export function getDefaultQuestionGenerateRequestDTO(): QuestionGenerateRequestDTO {
    return {
        sessionId: null,
        courseId: null,
        questionBankId: null,
        chapterIds: null,
        questionCount: null,
        questionType: null,
        difficulty: null,
        scorePerQuestion: null,
        totalScore: null,
        totalEstimatedTime: null,
        paperName: null,
        paperType: null,
        requirement: null,
        useRag: null,
        fileReferences: null,
        referenceQuestionIds: null,
        knowledgePoints: null,
        abilityGoals: null,
        saveToQuestionBank: null,
        saveStatus: null
    }
}

export interface QuestionStreamCallbacks {
    onMessage?: (event: QuestionGenerationStreamEvent) => void
    onOpen?: () => void
    onError?: (error: Error) => void
    onClose?: () => void
}

export function generateQuestionsStream(
    data: QuestionGenerateRequestDTO,
    callbacks: QuestionStreamCallbacks
): SSEController {
    const userStore = useUserStore()
    const token = userStore.token
    const baseURL = apiConfig.getBaseUrl()
    const fullURL = `${baseURL}/celestial-hub/question/stream`

    const abortController = new AbortController()
    const controller = new SSEController()
    controller.setAbortController(abortController)

    fetchEventSource(fullURL, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify(data || {}),
        signal: abortController.signal,
        openWhenHidden: true,
        credentials: 'include',
        async onopen(response) {
            if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
                callbacks.onOpen?.()
                return
            }

            callbacks.onError?.(new Error(`Failed to connect to question stream: ${response.status} ${response.statusText}`))
            abortController.abort()
        },
        onmessage(event) {
            if (!callbacks.onMessage) {
                return
            }

            try {
                const payload = JSON.parse(event.data) as QuestionGenerationStreamEvent
                callbacks.onMessage(payload)
            } catch (error) {
                callbacks.onError?.(error instanceof Error ? error : new Error('Failed to parse question stream payload'))
                abortController.abort()
            }
        },
        onclose() {
            callbacks.onClose?.()
        },
        onerror(error) {
            callbacks.onError?.(error)
            abortController.abort()
        }
    }).catch((error) => {
        callbacks.onError?.(error)
    })

    return controller
}

interface DownloadFileResult {
    blob: Blob
    fileName: string
}

async function requestPaperExport(
    endpoint: string,
    data: QuestionPaperExportRequestDTO,
    fallbackFileName: string
): Promise<DownloadFileResult> {
    const userStore = useUserStore()
    const token = userStore.token
    const baseURL = apiConfig.getBaseUrl()
    const fullURL = `${baseURL}${endpoint}`

    const response = await fetch(fullURL, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Export request failed: ${response.status} ${response.statusText}`)
    }

    return {
        blob: await response.blob(),
        fileName: resolveDownloadFileName(response.headers.get('content-disposition'), fallbackFileName)
    }
}

function resolveDownloadFileName(contentDisposition: string | null, fallbackFileName: string): string {
    if (!contentDisposition) {
        return fallbackFileName
    }

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Match?.[1]) {
        try {
            return decodeURIComponent(utf8Match[1])
        } catch {
            return utf8Match[1]
        }
    }

    const plainMatch = contentDisposition.match(/filename=\"?([^\";]+)\"?/i)
    if (plainMatch?.[1]) {
        return plainMatch[1]
    }

    return fallbackFileName
}

export async function exportPaperPdf(data: QuestionPaperExportRequestDTO): Promise<DownloadFileResult> {
    const paperName = data.paperName?.trim() || 'AI-generated-paper'
    return requestPaperExport('/celestial-hub/question/paper/export/pdf', data, `${paperName}.pdf`)
}

export async function exportPaperWord(data: QuestionPaperExportRequestDTO): Promise<DownloadFileResult> {
    const paperName = data.paperName?.trim() || 'AI-generated-paper'
    return requestPaperExport('/celestial-hub/question/paper/export/word', data, `${paperName}.docx`)
}
