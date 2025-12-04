import {ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMessage} from 'naive-ui'
import {addChatSession} from '@/api/celestialHub/chatSession'
import {getFilesBySessionId, uploadFiles} from '@/api/celestialHub/fileDocument'
import type {FileDocumentUploadOptions} from '@/types/celestialHub/fileDocument'
import type {FileInfoDTO} from '@/types/minIO/file'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'
import type {Ref} from 'vue'

export function useFileManagement(
  activeSessionId: Ref<string | null>,
  currentSession: Ref<ChatSessionVO | null>,
  chatSidebarRef: Ref<{ loadSessions: () => void } | null>
) {
  const {t} = useI18n()
  const router = useRouter()
  const message = useMessage()

  // 文件选择器引用
  const filePickerRef = ref<HTMLInputElement | null>(null)

  // 文件上传状态
  const isUploadingFiles = ref(false)

  // 文件抽屉状态
  const isFileDrawerVisible = ref(false)
  const isFileListLoading = ref(false)
  const sessionFileInfos = ref<FileInfoDTO[]>([])
  const aiQaBucketCode = BusinessBucketCodeEnum.AI_QA_ASSET

  // 重置文件选择器
  const resetFilePicker = () => {
    if (filePickerRef.value) {
      filePickerRef.value.value = ''
    }
  }

  // 触发文件选择
  const handleTriggerFileSelect = () => {
    if (isUploadingFiles.value) {
      return
    }
    filePickerRef.value?.click()
  }

  // 处理文件变更
  const handleFileInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement | null
    const fileList = target?.files ? Array.from(target.files) : []
    resetFilePicker()
    if (!fileList.length) {
      return
    }
    uploadSelectedFiles(fileList)
  }

  // 确保存在用于绑定文件的会话
  const ensureSessionForUpload = async (): Promise<string | null> => {
    if (activeSessionId.value) {
      return activeSessionId.value
    }

    return addChatSession({
      sessionType: 0,
      title: t('chat.sidebar.newChat'),
      courseId: null
    })
        .then((response) => {
          if (response.data) {
            activeSessionId.value = response.data.id || null
            currentSession.value = response.data
            chatSidebarRef.value?.loadSessions()
            return activeSessionId.value
          }
          return null
        })
        .catch(() => null)
  }

  // 上传文件
  const uploadSelectedFiles = async (selectedFiles: File[]) => {
    if (!selectedFiles.length || isUploadingFiles.value) {
      return
    }

    const resolvedSessionId = await ensureSessionForUpload()
    if (!resolvedSessionId) {
      message.warning(t('common.fail'))
      return
    }

    isUploadingFiles.value = true
    const uploadOptions: FileDocumentUploadOptions = {
      courseId: null,
      sessionId: resolvedSessionId,
      autoVectorize: true
    }

    await uploadFiles(selectedFiles, uploadOptions)
        .then(() => {
          message.success(t('common.uploadSuccess'))
        })
        .catch(() => {
          message.warning(t('common.uploadFailed'))
        })
        .finally(() => {
          isUploadingFiles.value = false
        })
  }

  // 打开会话文件抽屉
  const handleShowSessionFiles = async () => {
    if (!currentSession.value?.id) {
      message.warning(t('chat.session.filesNoSession'))
      return
    }
    isFileDrawerVisible.value = true
    await loadSessionFiles()
  }

  // 加载会话关联文件
  const loadSessionFiles = async () => {
    if (!currentSession.value?.id) {
      sessionFileInfos.value = []
      return
    }

    isFileListLoading.value = true
    await getFilesBySessionId(String(currentSession.value.id))
        .then((response) => {
          sessionFileInfos.value = response.data ?? []
        })
        .catch(() => {
          sessionFileInfos.value = []
          message.warning(t('chat.session.filesLoadFailed'))
        })
        .finally(() => {
          isFileListLoading.value = false
        })
  }

  // 处理文件预览
  const handleFilePreview = (fileInfo: FileInfoDTO) => {
    router.push({
      name: 'FilePreview',
      query: {
        fileInfo: JSON.stringify(fileInfo),
        from: 'CelestialHub',
        sessionId: currentSession.value?.id ?? ''
      }
    })
  }

  // 监听会话ID变化，当文件抽屉打开且会话ID变化时重新加载文件
  watch(
      () => currentSession.value?.id,
      (newId, oldId) => {
        if (isFileDrawerVisible.value && newId && newId !== oldId) {
          loadSessionFiles()
        }
        if (!newId) {
          sessionFileInfos.value = []
        }
      }
  )

  return {
    // 状态
    filePickerRef,
    isUploadingFiles,
    isFileDrawerVisible,
    isFileListLoading,
    sessionFileInfos,
    aiQaBucketCode,

    // 方法
    handleTriggerFileSelect,
    handleFileInputChange,
    handleShowSessionFiles,
    handleFilePreview,
    loadSessionFiles
  }
}

