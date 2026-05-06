import type {ChatMessage, ChatMessageMetadata} from '@/types/celestialHub/chatMessage'
import type {FileReference} from '@/types/celestialHub/knowledge'

const RESPONSE_VARIANT_GROUP_ID = 'responseVariantGroupId'
const RESPONSE_VARIANT_INDEX = 'responseVariantIndex'
const RESPONSE_VARIANT_COUNT = 'responseVariantCount'
const RESPONSE_VARIANT_SELECTED_INDEX = 'responseVariantSelectedIndex'
const RESPONSE_VARIANT_SOURCE_USER_MESSAGE_ID = 'responseVariantSourceUserMessageId'
const RESPONSE_VARIANT_SOURCE_ASSISTANT_MESSAGE_ID = 'responseVariantSourceAssistantMessageId'
const RESPONSE_VARIANT_SOURCE_REQUEST_ID = 'responseVariantSourceRequestId'

interface ChatTurn {
    userMessage: ChatMessage
    groupId: string
    assistantMessages: ChatMessage[]
}

export interface ResendSourceContext {
    userMessage: ChatMessage
    assistantMessage: ChatMessage | null
    assistantMessages: ChatMessage[]
    sourceRequestId: string | null
    groupId: string
    variantIndex: number
}

const isNonEmptyString = (value: unknown): value is string => {
    return typeof value === 'string' && value.trim().length > 0
}

const isFiniteNumber = (value: unknown): value is number => {
    return typeof value === 'number' && Number.isFinite(value)
}

const cloneFileReferences = (fileReferences?: FileReference[] | null) => {
    return fileReferences ? fileReferences.map(item => ({...item})) : fileReferences ?? null
}

const normalizeMetadata = (metadata?: ChatMessageMetadata | null): ChatMessageMetadata => {
    if (metadata && typeof metadata === 'object') {
        return {...metadata}
    }
    return {}
}

const cloneMessage = (message: ChatMessage): ChatMessage => {
    return {
        ...message,
        attachments: message.attachments ? [...message.attachments] : message.attachments ?? null,
        fileReferences: cloneFileReferences(message.fileReferences),
        metadata: normalizeMetadata(message.metadata)
    }
}

const clampVariantIndex = (variantIndex: number, variantCount: number) => {
    if (variantCount <= 0) {
        return 0
    }
    if (variantIndex < 0) {
        return 0
    }
    if (variantIndex >= variantCount) {
        return variantCount - 1
    }
    return variantIndex
}

const resolveMessageGroupId = (message: ChatMessage, fallbackGroupId: string | null = null) => {
    const metadata = normalizeMetadata(message.metadata)
    if (isNonEmptyString(metadata[RESPONSE_VARIANT_GROUP_ID])) {
        return metadata[RESPONSE_VARIANT_GROUP_ID]
    }
    if (isNonEmptyString(message.requestId)) {
        return message.requestId
    }
    if (isNonEmptyString(message.id)) {
        return message.id
    }
    return fallbackGroupId
}

const resolveSourceRequestId = (...candidates: Array<ChatMessage | null | undefined>) => {
    for (const candidate of candidates) {
        if (!candidate) {
            continue
        }
        const metadata = normalizeMetadata(candidate.metadata)
        if (isNonEmptyString(metadata[RESPONSE_VARIANT_SOURCE_REQUEST_ID])) {
            return metadata[RESPONSE_VARIANT_SOURCE_REQUEST_ID]
        }
        if (isNonEmptyString(candidate.requestId)) {
            return candidate.requestId
        }
    }
    return null
}

const resolveAssistantVariantIndex = (assistantMessage: ChatMessage, fallbackIndex: number) => {
    const metadata = normalizeMetadata(assistantMessage.metadata)
    if (isFiniteNumber(metadata[RESPONSE_VARIANT_INDEX])) {
        return metadata[RESPONSE_VARIANT_INDEX]
    }
    return fallbackIndex
}

const resolveSelectedVariantIndex = (
    userMessage: ChatMessage,
    assistantMessages: ChatMessage[],
    overrideSelectedIndex?: number | null
) => {
    const variantCount = assistantMessages.length
    if (variantCount <= 0) {
        return 0
    }

    if (isFiniteNumber(overrideSelectedIndex)) {
        return clampVariantIndex(overrideSelectedIndex, variantCount)
    }

    const metadata = normalizeMetadata(userMessage.metadata)
    if (isFiniteNumber(metadata[RESPONSE_VARIANT_SELECTED_INDEX])) {
        return clampVariantIndex(metadata[RESPONSE_VARIANT_SELECTED_INDEX], variantCount)
    }

    return variantCount - 1
}

const shouldGroupAssistantWithTurn = (assistantMessage: ChatMessage, activeTurn: ChatTurn | null) => {
    if (!activeTurn) {
        return false
    }
    const assistantGroupId = resolveMessageGroupId(assistantMessage)
    if (!assistantGroupId) {
        return true
    }
    return assistantGroupId === activeTurn.groupId
}

const buildUserDisplayMessage = (userMessage: ChatMessage, groupId: string) => {
    const displayMessage = cloneMessage(userMessage)
    const metadata = normalizeMetadata(displayMessage.metadata)
    metadata[RESPONSE_VARIANT_GROUP_ID] = groupId
    if (!isNonEmptyString(metadata[RESPONSE_VARIANT_SOURCE_REQUEST_ID]) && isNonEmptyString(displayMessage.requestId)) {
        metadata[RESPONSE_VARIANT_SOURCE_REQUEST_ID] = displayMessage.requestId
    }
    displayMessage.metadata = metadata
    return displayMessage
}

const buildAssistantDisplayMessage = (turn: ChatTurn) => {
    const selectedIndex = resolveSelectedVariantIndex(turn.userMessage, turn.assistantMessages)
    const selectedAssistant = cloneMessage(turn.assistantMessages[selectedIndex])
    const metadata = normalizeMetadata(selectedAssistant.metadata)
    metadata[RESPONSE_VARIANT_GROUP_ID] = turn.groupId
    metadata[RESPONSE_VARIANT_INDEX] = resolveAssistantVariantIndex(selectedAssistant, selectedIndex)
    metadata[RESPONSE_VARIANT_COUNT] = turn.assistantMessages.length
    metadata[RESPONSE_VARIANT_SELECTED_INDEX] = selectedIndex

    if (!isNonEmptyString(metadata[RESPONSE_VARIANT_SOURCE_USER_MESSAGE_ID]) && isNonEmptyString(turn.userMessage.id)) {
        metadata[RESPONSE_VARIANT_SOURCE_USER_MESSAGE_ID] = turn.userMessage.id
    }
    if (!isNonEmptyString(metadata[RESPONSE_VARIANT_SOURCE_ASSISTANT_MESSAGE_ID]) && isNonEmptyString(selectedAssistant.id)) {
        metadata[RESPONSE_VARIANT_SOURCE_ASSISTANT_MESSAGE_ID] = selectedAssistant.id
    }

    const sourceRequestId = resolveSourceRequestId(selectedAssistant, turn.userMessage)
    if (sourceRequestId) {
        metadata[RESPONSE_VARIANT_SOURCE_REQUEST_ID] = sourceRequestId
    }

    selectedAssistant.metadata = metadata
    return selectedAssistant
}

const buildStandaloneAssistantMessage = (assistantMessage: ChatMessage) => {
    const displayMessage = cloneMessage(assistantMessage)
    const metadata = normalizeMetadata(displayMessage.metadata)
    const groupId = resolveMessageGroupId(displayMessage)
    if (groupId) {
        metadata[RESPONSE_VARIANT_GROUP_ID] = groupId
    }
    if (!isFiniteNumber(metadata[RESPONSE_VARIANT_INDEX])) {
        metadata[RESPONSE_VARIANT_INDEX] = 0
    }
    if (!isFiniteNumber(metadata[RESPONSE_VARIANT_COUNT])) {
        metadata[RESPONSE_VARIANT_COUNT] = 1
    }
    if (!isFiniteNumber(metadata[RESPONSE_VARIANT_SELECTED_INDEX])) {
        metadata[RESPONSE_VARIANT_SELECTED_INDEX] = 0
    }
    displayMessage.metadata = metadata
    return displayMessage
}

const findUserMessageIndexByGroupId = (messages: ChatMessage[], groupId: string) => {
    for (let index = 0; index < messages.length; index += 1) {
        const currentMessage = messages[index]
        if (currentMessage.role !== 0) {
            continue
        }
        if (resolveMessageGroupId(currentMessage) === groupId) {
            return index
        }
    }
    return -1
}

const findAssistantMessageIndex = (messages: ChatMessage[], targetMessage: ChatMessage, groupId: string) => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const currentMessage = messages[index]
        if (currentMessage.role !== 1) {
            continue
        }
        if (isNonEmptyString(targetMessage.id) && targetMessage.id === currentMessage.id) {
            return index
        }
        if (isNonEmptyString(targetMessage.requestId) && targetMessage.requestId === currentMessage.requestId) {
            return index
        }
        if (resolveMessageGroupId(currentMessage, groupId) === groupId) {
            return index
        }
    }
    return -1
}

const collectAssistantMessages = (messages: ChatMessage[], userMessageIndex: number, groupId: string) => {
    const assistantMessages: ChatMessage[] = []

    for (let index = userMessageIndex + 1; index < messages.length; index += 1) {
        const currentMessage = messages[index]
        if (currentMessage.role === 0) {
            break
        }
        if (currentMessage.role !== 1) {
            continue
        }

        const assistantGroupId = resolveMessageGroupId(currentMessage, groupId)
        if (assistantGroupId === groupId) {
            assistantMessages.push(currentMessage)
        }
    }

    return assistantMessages
}

const updateUserMessageMetadata = (
    messages: ChatMessage[],
    userMessageIndex: number,
    metadataUpdater: (metadata: ChatMessageMetadata, userMessage: ChatMessage) => ChatMessageMetadata
) => {
    if (userMessageIndex < 0 || userMessageIndex >= messages.length) {
        return
    }

    const userMessage = messages[userMessageIndex]
    const nextMetadata = metadataUpdater(normalizeMetadata(userMessage.metadata), userMessage)
    messages[userMessageIndex] = {
        ...userMessage,
        metadata: nextMetadata
    }
}

export function buildResendDisplayMessages(sourceMessages: ChatMessage[]) {
    const displayMessages: ChatMessage[] = []
    let activeTurn: ChatTurn | null = null

    const flushActiveTurn = () => {
        if (!activeTurn) {
            return
        }
        if (activeTurn.assistantMessages.length > 0) {
            displayMessages.push(buildAssistantDisplayMessage(activeTurn))
        }
        activeTurn = null
    }

    sourceMessages.forEach((message, index) => {
        if (message.role === 0) {
            flushActiveTurn()
            const groupId = resolveMessageGroupId(message, `response-variant-group-${index}`) ?? `response-variant-group-${index}`
            const displayUserMessage = buildUserDisplayMessage(message, groupId)
            displayMessages.push(displayUserMessage)
            activeTurn = {
                userMessage: displayUserMessage,
                groupId,
                assistantMessages: []
            }
            return
        }

        if (message.role === 1 && shouldGroupAssistantWithTurn(message, activeTurn)) {
            activeTurn?.assistantMessages.push(message)
            return
        }

        flushActiveTurn()
        if (message.role === 1) {
            displayMessages.push(buildStandaloneAssistantMessage(message))
            return
        }
        displayMessages.push(cloneMessage(message))
    })

    flushActiveTurn()
    return displayMessages
}

export function setVariantSelection(messages: ChatMessage[], groupId: string, variantIndex: number) {
    if (!groupId) {
        return
    }

    const userMessageIndex = findUserMessageIndexByGroupId(messages, groupId)
    if (userMessageIndex === -1) {
        return
    }

    const assistantMessages = collectAssistantMessages(messages, userMessageIndex, groupId)
    const nextSelectedIndex = clampVariantIndex(variantIndex, assistantMessages.length)

    updateUserMessageMetadata(messages, userMessageIndex, (metadata, userMessage) => {
        metadata[RESPONSE_VARIANT_GROUP_ID] = groupId
        metadata[RESPONSE_VARIANT_SELECTED_INDEX] = nextSelectedIndex
        if (!isNonEmptyString(metadata[RESPONSE_VARIANT_SOURCE_REQUEST_ID]) && isNonEmptyString(userMessage.requestId)) {
            metadata[RESPONSE_VARIANT_SOURCE_REQUEST_ID] = userMessage.requestId
        }
        return metadata
    })
}

export function clearVariantSelection(messages: ChatMessage[], groupId: string) {
    if (!groupId) {
        return
    }

    const userMessageIndex = findUserMessageIndexByGroupId(messages, groupId)
    if (userMessageIndex === -1) {
        return
    }

    updateUserMessageMetadata(messages, userMessageIndex, (metadata) => {
        const nextMetadata = {...metadata}
        delete nextMetadata[RESPONSE_VARIANT_SELECTED_INDEX]
        return nextMetadata
    })
}

export function resolveResendSourceContext(messages: ChatMessage[], targetMessage: ChatMessage): ResendSourceContext | null {
    const groupId = resolveMessageGroupId(targetMessage)
    if (!groupId) {
        return null
    }

    let userMessageIndex = findUserMessageIndexByGroupId(messages, groupId)
    if (userMessageIndex === -1) {
        const assistantMessageIndex = findAssistantMessageIndex(messages, targetMessage, groupId)
        if (assistantMessageIndex === -1) {
            return null
        }
        for (let index = assistantMessageIndex - 1; index >= 0; index -= 1) {
            if (messages[index].role === 0) {
                userMessageIndex = index
                break
            }
        }
    }

    if (userMessageIndex === -1) {
        return null
    }

    const userMessage = messages[userMessageIndex]
    const assistantMessages = collectAssistantMessages(messages, userMessageIndex, groupId)
    const targetSelectedIndex = isFiniteNumber(targetMessage.metadata?.[RESPONSE_VARIANT_SELECTED_INDEX])
        ? targetMessage.metadata?.[RESPONSE_VARIANT_SELECTED_INDEX]
        : null
    const selectedIndex = resolveSelectedVariantIndex(userMessage, assistantMessages, targetSelectedIndex)
    const assistantMessage = assistantMessages[selectedIndex] ?? assistantMessages[assistantMessages.length - 1] ?? null

    return {
        userMessage,
        assistantMessage,
        assistantMessages,
        sourceRequestId: resolveSourceRequestId(targetMessage, assistantMessage, userMessage),
        groupId,
        variantIndex: selectedIndex
    }
}

export function resolveResendFileReferences(userMessage: ChatMessage) {
    const metadataReferences = Array.isArray(userMessage.metadata?.fileReferences)
        ? userMessage.metadata.fileReferences
        : []
    const messageReferences = Array.isArray(userMessage.fileReferences)
        ? userMessage.fileReferences
        : []
    const mergedReferences = [...metadataReferences, ...messageReferences]

    if (mergedReferences.length === 0) {
        return null
    }

    const seenKeys = new Set<string>()
    return mergedReferences.filter((item) => {
        const key = item.id ?? `${item.fileName ?? ''}-${item.storagePath ?? ''}`
        if (seenKeys.has(key)) {
            return false
        }
        seenKeys.add(key)
        return true
    })
}
