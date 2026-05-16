import type {FileReference} from './knowledge'

export interface ChatMessageMetadata {
    fileReferences?: FileReference[] | null
    responseVariantGroupId?: string | null
    responseVariantIndex?: number | null
    responseVariantCount?: number | null
    responseVariantSelectedIndex?: number | null
    responseVariantSourceUserMessageId?: string | null
    responseVariantSourceAssistantMessageId?: string | null
    responseVariantSourceRequestId?: string | null
    [key: string]: unknown
}

/**
 * 鑱婂ぉ娑堟伅瀹炰綋
 */
export interface ChatMessage {
    /** 鍒涘缓鏃堕棿 */
    createTime?: string | null
    /** 鏇存柊鏃堕棿 */
    updateTime?: string | null
    /** 鍒犻櫎鏍囪 */
    deleted?: number | null
    /** 娑堟伅ID */
    id?: string | null
    /** 浼氳瘽ID */
    sessionId?: string | null
    /** 瑙掕壊: 0-鐢ㄦ埛, 1-AI鍔╂墜, 2-绯荤粺 */
    role?: number | null
    /** 娑堟伅鍐呭 */
    content?: string | null
    /** 娑堟伅绫诲瀷: 0-鏂囨湰, 1-浠ｇ爜, 2-鍥剧墖, 3-鏂囦欢 */
    messageType?: number | null
    /** token鏁伴噺 */
    tokenCount?: number | null
    /** 浣跨敤鐨勬ā鍨嬪悕绉?*/
    modelName?: string | null
    /** 寮曠敤鐨勫弬鑰冨唴瀹?*/
    references?: any[] | null
    /** 闄勪欢URL鍒楄〃 */
    attachments?: string[] | null
    /** 寮曠敤鏂囦欢鏁扮粍锛堢敤浜庣储寮曟枃浠跺悜閲忔暟鎹級 */
    fileReferences?: FileReference[] | null
    /** 璇锋眰ID锛堢敤浜庡箓绛夛級 */
    requestId?: string | null
    /** 鐢ㄦ埛鍙嶉: 0-鏃? 1-鏈夌敤, -1-鏃犵敤 */
    isFeedback?: number | null
    /** 鍏冩暟鎹?*/
    metadata?: ChatMessageMetadata | null
    /** 鍑洪璇锋眰鍙傛暟锛圝SON锛夛紝褰撹鑹蹭负鍑洪璇锋眰鑰呮椂浣跨敤 */
    questionRequest?: string | null
    /** AI鍑洪鐢熸垚缁撴灉锛圝SON锛夛紝褰撹鑹蹭负鍑洪鑰呮椂浣跨敤 */
    questionResponse?: string | null
    /** 闊抽鐘舵€? 0-鏃犻煶棰? 1-寰呯敓鎴? 2-鐢熸垚涓? 3-鍙挱鏀? 4-鐢熸垚澶辫触, 5-宸插彇娑?*/
    audioStatus?: number | null
    /** 闊抽鎾斁鍦板潃 */
    audioUrl?: string | null
    /** 闊抽鏍煎紡 */
    audioFormat?: string | null
    /** 闊抽鏃堕暱锛堟绉掞級 */
    audioDurationMs?: number | null
    /** TTS浠诲姟ID */
    audioTaskId?: string | null
    /** 闊抽鐢熸垚澶辫触淇℃伅 */
    audioErrorMessage?: string | null
    /** 闊抽鐢熸垚瀹屾垚鏃堕棿 */
    audioGenerateTime?: string | null
    /** 闊宠壊缂栫爜 */
    audioVoiceCode?: string | null
}

/**
 * 鍙戦€佹秷鎭姹侱TO
 */
export interface ChatRequestDTO {
    /** 浼氳瘽ID锛堟柊瀵硅瘽鏃跺彲涓虹┖锛?*/
    sessionId?: string | null
    /** 鐢ㄦ埛ID锛圞afka鍦烘櫙涓嬮渶瑕侊級 */
    userId?: string | null
    /** 鐢ㄦ埛娑堟伅鍐呭 */
    message: string | null
    /** 璇剧▼ID锛堣绋嬬浉鍏抽棶绛旀椂鎻愪緵锛?*/
    courseId?: string | null
    /** 绔犺妭ID锛堢珷鑺傜浉鍏抽棶绛旀椂鎻愪緵锛?*/
    chapterId?: string | null
    /** 浼氳瘽绫诲瀷: 0-鏅€氬璇? 1-璇剧▼闂瓟, 2-棰樼洰杈呭, 3-鐭ヨ瘑妫€绱?*/
    sessionType?: number | null
    /** 鏄惁浣跨敤RAG妫€绱?*/
    useRag?: boolean | null
    /** 鏄惁娴佸紡杈撳嚭 */
    stream?: boolean | null
    /** 娓╁害鍙傛暟(0.0-1.0) */
    temperature?: number | null
    /** 鏈€澶oken鏁?*/
    maxTokens?: number | null
    /** 闄勪欢URL鍒楄〃 */
    attachments?: string[] | null
    /** 鏂囦欢寮曠敤淇℃伅 */
    fileReferences?: FileReference[] | null
    /** 閲嶅彂鏃剁殑婧愮敤鎴锋秷鎭疘D */
    resendSourceUserMessageId?: string | null
    /** 閲嶅彂鏃剁殑婧怉I娑堟伅ID */
    resendSourceAssistantMessageId?: string | null
    /** 閲嶅彂鏃剁殑婧愯姹侷D */
    resendSourceRequestId?: string | null
}

/**
 * Kafka娴佸紡鑱婂ぉ璇锋眰DTO
 */
export interface KafkaChatRequestDTO extends ChatRequestDTO {
    /** 璇锋眰ID锛堢敤浜嶬afka骞傜瓑鍙婂彇娑堬級 */
    requestId?: string | null
}

/**
 * 寮曠敤鍐呭VO
 */
export interface ReferenceVO {
    /** 鍐呭ID */
    contentId?: string | null
    /** 鍐呭绫诲瀷: 0-绔犺妭, 1-闂, 2-浠诲姟, 3-璁哄潧 */
    contentType?: number | null
    /** 鏍囬 */
    title?: string | null
    /** 鍐呭鐗囨 */
    snippet?: string | null
    /** 鐩镐技搴﹀垎鏁?*/
    similarityScore?: number | null
    /** 鏉ユ簮URL */
    sourceUrl?: string | null
}

/**
 * 鑱婂ぉ鍝嶅簲VO
 */
export interface ChatResponseVO {
    /** 浼氳瘽ID */
    sessionId?: string | null
    /** 娑堟伅ID */
    messageId?: string | null
    /** AI鍥炲鍐呭 */
    content?: string | null
    /** 浣跨敤鐨勬ā鍨?*/
    model?: string | null
    /** token浣跨敤閲?*/
    tokenCount?: number | null
    /** 寮曠敤鏂囦欢鏁扮粍锛堢敤浜庣储寮曟枃浠跺悜閲忔暟鎹級 */
    fileReferences?: FileReference[] | null
    /** 寮曠敤鍐呭 */
    references?: ReferenceVO[] | null
    /** 鍝嶅簲鏃堕棿 */
    responseTime?: string | null
    /** 鏄惁瀹屾垚 */
    finished?: boolean | null
    /** 鍏冩暟鎹?*/
    metadata?: ChatMessageMetadata | null
    /** 闊抽鐘舵€? 0-鏃犻煶棰? 1-寰呯敓鎴? 2-鐢熸垚涓? 3-鍙挱鏀? 4-鐢熸垚澶辫触, 5-宸插彇娑?*/
    audioStatus?: number | null
    /** 闊抽鎾斁鍦板潃 */
    audioUrl?: string | null
    /** 闊抽鏍煎紡 */
    audioFormat?: string | null
    /** TTS浠诲姟ID */
    audioTaskId?: string | null
}

/**
 * 鍙栨秷Kafka娴佸紡鑱婂ぉ璇锋眰DTO
 */
export interface CancelChatStreamKafkaDTO {
    /** 璇锋眰ID */
    requestId?: string | null
    /** 鍙栨秷鍘熷洜 */
    reason?: string | null
}

/**
 * SSE浜嬩欢鍥炶皟
 */
export interface SSEEventCallbacks {
    /** 鎺ユ敹鍒版暟鎹簨浠舵椂璋冪敤 */
    onMessage?: (data: string) => void
    /** 杩炴帴鎵撳紑鏃惰皟鐢?*/
    onOpen?: () => void
    /** 鍙戠敓閿欒鏃惰皟鐢?*/
    onError?: (error: Error) => void
    /** 杩炴帴鍏抽棴鏃惰皟鐢?*/
    onClose?: () => void
}
