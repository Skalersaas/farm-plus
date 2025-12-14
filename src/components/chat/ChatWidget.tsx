import { useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, quickReplies } from '../../stores';
import { ChatMessage } from './ChatMessage';
import { QuickReplies } from './QuickReplies';
import styles from './ChatWidget.module.css';

export function ChatWidget() {
  const { isOpen, messages, toggleChat, closeChat } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.popup}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className={styles.title}>Farm+ Support</h3>
                  <span className={styles.subtitle}>Ask us anything about farming</span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={closeChat}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className={styles.quickRepliesSection}>
              <QuickReplies replies={quickReplies} />
            </div>

            {/* Input (Optional - for show) */}
            <div className={styles.inputSection}>
              <input
                type="text"
                placeholder="Select a topic above..."
                className={styles.input}
                disabled
              />
              <button className={styles.sendBtn} disabled>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        className={styles.floatingBtn}
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default ChatWidget;
