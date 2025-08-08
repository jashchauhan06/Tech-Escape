'use client'

interface Message {
  id: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface MessageContainerProps {
  messages: Message[]
}

export default function MessageContainer({ messages }: MessageContainerProps) {
  const getMessageIcon = (type: string) => {
    const icons = {
      success: '<i class="fas fa-check-circle"></i>',
      error: '<i class="fas fa-exclamation-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      info: '<i class="fas fa-info-circle"></i>'
    }
    return icons[type as keyof typeof icons] || icons.info
  }

  return (
    <div className="message-container">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.type}`}>
          <span dangerouslySetInnerHTML={{ __html: getMessageIcon(message.type) }}></span>
          <span>{message.text}</span>
        </div>
      ))}
    </div>
  )
}
