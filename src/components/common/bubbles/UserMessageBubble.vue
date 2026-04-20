<template>
  <div class="user-message-bubble">
    <div
        v-if="userFileReferences && userFileReferences.length > 0"
        class="file-references-above"
    >
      <FileReferenceSelector :model-value="userFileReferences"/>
    </div>
    <div class="user-content">
      <div class="message-text-content">{{ message.content }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {FileReference} from '@/types/celestialHub/knowledge'
import {computed} from 'vue'
import FileReferenceSelector from '@/views/celestialHub/components/FileReferenceSelector.vue'

// Props
const props = defineProps<{
  message: ChatMessage
}>()

const userFileReferences = computed<FileReference[] | null>(() => {
  const metadata = props.message.metadata as any
  const metadataRefs = metadata?.fileReferences as FileReference[] | null | undefined
  const messageRefs = props.message.fileReferences
  const merged = [...(metadataRefs || []), ...(messageRefs || [])]
  if (!merged.length) {
    return null
  }
  const seen = new Set<string>()
  const unique = merged.filter((item) => {
    const key = item.id ?? `${item.fileName ?? ''}-${item.storagePath ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return unique
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.user-message-bubble {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  font-family: var(--markdown-font-family);

  .file-references-above {
    width: fit-content;
    max-width: 70%;
    align-self: flex-end;

    :deep(.remove-button) {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    :deep(.file-reference-item:hover .remove-button) {
      opacity: 0 !important;
      pointer-events: none !important;
    }
  }

  .user-content {
    max-width: min(74%, 760px);
    padding: 14px 18px;
    background:
      linear-gradient(135deg,
        color-mix(in srgb, var(--color-primary) 94%, white 6%) 0%,
        color-mix(in srgb, var(--color-primary-dark) 88%, var(--color-primary) 12%) 100%);
    color: white;
    border-radius: 24px 10px 24px 24px;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.82;
    letter-spacing: 0.012em;
    box-shadow: 0 18px 38px color-mix(in srgb, var(--color-primary-dark) 26%, transparent);

    .message-text-content {
      margin-bottom: 0;
      font-size: 15px;
      font-weight: 500;
    }
  }
}
</style>
