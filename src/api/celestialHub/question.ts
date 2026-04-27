import http, {apiConfig} from '@/utils/http'
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
        generationMode: null,
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

function normalizeQuestionStreamError(error: unknown): Error {
    return error instanceof Error ? error : new Error('Question stream request failed')
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
            if (!response.ok || !response.headers.get('content-type')?.includes('text/event-stream')) {
                throw new Error(`Failed to connect to question stream: ${response.status} ${response.statusText}`)
            }

            callbacks.onOpen?.()
        },
        onmessage(event) {
            if (!callbacks.onMessage) {
                return
            }

            try {
                const payload = JSON.parse(event.data) as QuestionGenerationStreamEvent
                callbacks.onMessage(payload)
            } catch (error) {
                throw error instanceof Error ? error : new Error('Failed to parse question stream payload')
            }
        },
        onclose() {
            callbacks.onClose?.()
        },
        onerror(error) {
            // Throw to disable fetchEventSource automatic retries for long-running question tasks.
            throw normalizeQuestionStreamError(error)
        }
    }).catch((error) => {
        if (abortController.signal.aborted) {
            return
        }
        callbacks.onError?.(normalizeQuestionStreamError(error))
    })

    return controller
}

export function checkQuestionRequestStatus(requestId: string) {
    return http.get<boolean>(`/celestial-hub/question/status/${requestId}`)
}

interface DownloadFileResult {
    blob: Blob
    fileName: string
}

function extractHtmlErrorText(rawHtml: string): string {
    if (!rawHtml) {
        return ''
    }

    const titleMatch = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    if (titleMatch?.[1]) {
        return titleMatch[1].replace(/\s+/g, ' ').trim()
    }

    return rawHtml
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

async function resolveExportError(response: Response): Promise<Error> {
    const contentType = response.headers.get('content-type') || ''
    const rawText = await response.text()

    if (contentType.includes('application/json')) {
        try {
            const payload = JSON.parse(rawText) as { message?: string; msg?: string }
            const message = payload.message || payload.msg
            if (message) {
                return new Error(message)
            }
        } catch {
            // Ignore JSON parsing failure and fall back to raw text.
        }
    }

    if (contentType.includes('text/html') || /<!DOCTYPE html|<html\b/i.test(rawText)) {
        const htmlErrorText = extractHtmlErrorText(rawText)
        if (response.status === 504 || /gateway time-out/i.test(htmlErrorText)) {
            return new Error('导出请求超时，请稍后重试')
        }
        return new Error(htmlErrorText || `Export request failed: ${response.status} ${response.statusText}`)
    }

    return new Error(rawText || `Export request failed: ${response.status} ${response.statusText}`)
}

async function requestPaperExport(
    endpoint: string,
    data: QuestionPaperExportRequestDTO,
    fallbackFileName: string,
    expectedContentType: string
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
        throw await resolveExportError(response)
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes(expectedContentType)) {
        throw await resolveExportError(response)
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
    return requestPaperExport('/celestial-hub/question/paper/export/pdf', data, `${paperName}.pdf`, 'application/pdf')
}

export async function exportPaperWord(data: QuestionPaperExportRequestDTO): Promise<DownloadFileResult> {
    const paperName = data.paperName?.trim() || 'AI-generated-paper'
    return requestPaperExport(
        '/celestial-hub/question/paper/export/word',
        data,
        `${paperName}.docx`,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
}
