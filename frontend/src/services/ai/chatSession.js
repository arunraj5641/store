const chatMessagesKey = 'kirana_ai_assistant_messages'

const isChatMessage = (message) => (
  message
  && ['ai', 'user'].includes(message.sender)
  && ['string', 'number'].includes(typeof message.id)
  && typeof message.text === 'string'
  && typeof message.time === 'string'
)

export const loadStoredAssistantChatMessages = () => {
  try {
    const storedMessages = sessionStorage.getItem(chatMessagesKey)
    if (!storedMessages) return null

    const parsedMessages = JSON.parse(storedMessages)
    if (!Array.isArray(parsedMessages) || !parsedMessages.every(isChatMessage)) {
      sessionStorage.removeItem(chatMessagesKey)
      return null
    }

    return parsedMessages
  } catch {
    sessionStorage.removeItem(chatMessagesKey)
    return null
  }
}

export const storeAssistantChatMessages = (messages) => {
  sessionStorage.setItem(chatMessagesKey, JSON.stringify(messages))
}

export const clearStoredAssistantChatMessages = () => {
  sessionStorage.removeItem(chatMessagesKey)
}
