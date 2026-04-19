import type {FileReference} from './knowledge'

export type QuestionGenerationMode = 'question' | 'paper'

export interface QuestionGenerateRequestDTO {
    sessionId?: string | null
    courseId?: string | null
    questionBankId?: string | null
    chapterIds?: string[] | null
    questionCount?: number | null
    questionType?: number | null
    difficulty?: number | null
    scorePerQuestion?: number | null
    totalScore?: number | null
    totalEstimatedTime?: number | null
    paperName?: string | null
    paperType?: string | null
    requirement?: string | null
    useRag?: boolean | null
    fileReferences?: FileReference[] | null
    referenceQuestionIds?: string[] | null
    knowledgePoints?: string[] | null
    abilityGoals?: string[] | null
    saveToQuestionBank?: boolean | null
    saveStatus?: number | null
}

export interface QuestionGenerationSuccessPayload {
    mode: QuestionGenerationMode
    request: QuestionGenerateRequestDTO
}

export interface QuestionPaperExportRequestDTO {
    paperName?: string | null
    questions: QuestionResponseDTO[]
    includeAnswers?: boolean | null
}

export type QuestionGenerationStreamStatus = 'submitted' | 'completed' | 'error'

export interface QuestionGenerationStreamEvent {
    requestId?: string | null
    sessionId?: string | null
    status?: QuestionGenerationStreamStatus | null
    questionCount?: number | null
    message?: string | null
}

export interface QuestionOptionSimpleDTO {
    id?: string | null
    questionId?: string | null
    optionContent?: string | null
    optionLabel?: string | null
    isCorrect?: number | null
    score?: number | null
    imageUrls?: string[] | null
    explanation?: string | null
}

export interface QuestionAnswerSimpleDTO {
    id?: string | null
    questionId?: string | null
    answerContent?: string | null
    explanation?: string | null
    score?: number | null
    sortOrder?: number | null
}

export interface QuestionResponseDTO {
    id?: string | null
    sysUserId?: string | null
    questionTitle?: string | null
    questionContent?: string | null
    questionType?: number | null
    difficulty?: number | null
    score?: number | null
    estimatedTime?: number | null
    tags?: string[] | null
    options?: QuestionOptionSimpleDTO[] | null
    answers?: QuestionAnswerSimpleDTO[] | null
}

export function isPaperGenerationRequest(request?: QuestionGenerateRequestDTO | null): boolean {
    if (!request) {
        return false
    }

    return Boolean(
        request.paperName
        || request.paperType
        || request.totalScore !== null && request.totalScore !== undefined
        || request.totalEstimatedTime !== null && request.totalEstimatedTime !== undefined
        || request.knowledgePoints?.length
        || request.abilityGoals?.length
    )
}

export function resolveQuestionGenerationMode(request?: QuestionGenerateRequestDTO | null): QuestionGenerationMode {
    return isPaperGenerationRequest(request) ? 'paper' : 'question'
}
