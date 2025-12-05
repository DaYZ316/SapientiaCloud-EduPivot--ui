import {onUnmounted, ref} from 'vue'

export interface SpeechRecognitionOptions {
    lang?: string
    continuous?: boolean
    interimResults?: boolean
    maxAlternatives?: number
}

export interface SpeechRecognitionResult {
    transcript: string
    confidence: number
    isFinal: boolean
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
    const isSupported = ref(false)
    const isListening = ref(false)
    const isError = ref(false)
    const errorMessage = ref<string | null>(null)
    const transcript = ref('')
    const interimTranscript = ref('')
    const finalTranscript = ref('')

    let recognition: any = null

    // 检查浏览器是否支持语音识别
    const checkSupport = () => {
        if (typeof window === 'undefined') {
            return false
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        return !!SpeechRecognition
    }

    // 初始化语音识别
    const initRecognition = () => {
        if (typeof window === 'undefined') {
            return null
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            return null
        }

        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.lang = options.lang || 'zh-CN'
        recognitionInstance.continuous = options.continuous ?? true
        recognitionInstance.interimResults = options.interimResults ?? true
        recognitionInstance.maxAlternatives = options.maxAlternatives ?? 1

        return recognitionInstance
    }

    // 开始语音识别
    const start = () => {
        if (!checkSupport()) {
            isError.value = true
            errorMessage.value = '浏览器不支持语音识别功能'
            return
        }

        if (isListening.value) {
            return
        }

        recognition = initRecognition()
        if (!recognition) {
            isError.value = true
            errorMessage.value = '无法初始化语音识别'
            return
        }

        // 重置状态
        isError.value = false
        errorMessage.value = null
        transcript.value = ''
        interimTranscript.value = ''
        finalTranscript.value = ''

        // 设置事件处理器
        recognition.onstart = () => {
            isListening.value = true
            isError.value = false
            errorMessage.value = null
        }

        recognition.onresult = (event: any) => {
            let interim = ''
            let final = ''

            // 从上次的结果索引开始处理新结果
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                const transcriptText = result[0].transcript

                if (result.isFinal) {
                    final += transcriptText + ' '
                } else {
                    interim += transcriptText
                }
            }

            // 更新最终转录文本
            if (final) {
                finalTranscript.value += final
            }

            // 更新临时转录文本
            interimTranscript.value = interim

            // 组合最终和临时文本
            transcript.value = finalTranscript.value + interimTranscript.value
        }

        recognition.onerror = (event: any) => {
            isListening.value = false
            isError.value = true

            switch (event.error) {
                case 'no-speech':
                    errorMessage.value = '未检测到语音输入'
                    break
                case 'audio-capture':
                    errorMessage.value = '无法访问麦克风'
                    break
                case 'not-allowed':
                    errorMessage.value = '麦克风权限被拒绝'
                    break
                case 'network':
                    errorMessage.value = '网络错误'
                    break
                case 'aborted':
                    errorMessage.value = '语音识别已中止'
                    break
                default:
                    errorMessage.value = `语音识别错误: ${event.error}`
            }
        }

        recognition.onend = () => {
            isListening.value = false
        }

        try {
            recognition.start()
        } catch (error) {
            isError.value = true
            errorMessage.value = '启动语音识别失败'
            isListening.value = false
        }
    }

    // 停止语音识别
    const stop = () => {
        if (recognition && isListening.value) {
            try {
                recognition.stop()
            } catch (error) {
                // 忽略停止错误
            }
        }
        isListening.value = false
    }

    // 中止语音识别
    const abort = () => {
        if (recognition && isListening.value) {
            try {
                recognition.abort()
            } catch (error) {
                // 忽略中止错误
            }
        }
        isListening.value = false
    }

    // 重置状态
    const reset = () => {
        stop()
        transcript.value = ''
        interimTranscript.value = ''
        finalTranscript.value = ''
        isError.value = false
        errorMessage.value = null
    }

    // 获取完整的识别结果
    const getFullTranscript = () => {
        return transcript.value
    }

    // 初始化时检查支持情况
    isSupported.value = checkSupport()

    // 组件卸载时清理
    onUnmounted(() => {
        if (recognition) {
            try {
                recognition.stop()
            } catch (error) {
                // 忽略错误
            }
            recognition = null
        }
    })

    return {
        isSupported,
        isListening,
        isError,
        errorMessage,
        transcript,
        interimTranscript,
        finalTranscript,
        start,
        stop,
        abort,
        reset,
        getFullTranscript
    }
}

