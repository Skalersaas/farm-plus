import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../stores';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'bot';

  return (
    <div className={`${styles.message} ${isBot ? styles.bot : styles.user}`}>
      <div className={styles.avatar}>
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div className={styles.content}>
        <div className={styles.bubble}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={styles.line}>
              {line.startsWith('•') ? (
                <span className={styles.bulletPoint}>{line}</span>
              ) : line.startsWith('**') ? (
                <strong>{line.replace(/\*\*/g, '')}</strong>
              ) : (
                line || <br />
              )}
            </p>
          ))}
        </div>
        <span className={styles.time}>
          {format(new Date(message.timestamp), 'h:mm a')}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
