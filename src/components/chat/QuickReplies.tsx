import { Droplets, Bug, Leaf, HelpCircle, Shovel, Scissors } from 'lucide-react';
import { useChatStore } from '../../stores';
import type { QuickReply } from '../../stores';
import styles from './QuickReplies.module.css';

interface QuickRepliesProps {
  replies: QuickReply[];
}

const replyIcons: Record<string, typeof Droplets> = {
  watering: Droplets,
  pests: Bug,
  soil: Shovel,
  planting: Leaf,
  harvest: Scissors,
  disease: HelpCircle,
};

export function QuickReplies({ replies }: QuickRepliesProps) {
  const { selectQuickReply } = useChatStore();

  return (
    <div className={styles.container}>
      <span className={styles.label}>Quick topics:</span>
      <div className={styles.buttons}>
        {replies.map((reply) => {
          const Icon = replyIcons[reply.id] || HelpCircle;
          return (
            <button
              key={reply.id}
              className={styles.button}
              onClick={() => selectQuickReply(reply.id)}
            >
              <Icon size={14} />
              {reply.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickReplies;
