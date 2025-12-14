import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface QuickReply {
  id: string;
  label: string;
  question: string;
  answer: string;
}

// Predefined Q&A for farming help
export const quickReplies: QuickReply[] = [
  {
    id: 'watering',
    label: 'Watering Help',
    question: 'How often should I water my plants?',
    answer: `Watering frequency depends on several factors:

• **Vegetables**: Most need 1-2 inches of water per week. Water deeply but less frequently to encourage deep root growth.

• **Seedlings**: Keep soil consistently moist but not waterlogged. Water daily or every other day.

• **Established plants**: Water when the top 1-2 inches of soil feels dry.

• **Hot weather**: Increase watering frequency during heat waves.

• **Tip**: Water in the early morning to reduce evaporation and prevent fungal diseases.`,
  },
  {
    id: 'pests',
    label: 'Pest Problems',
    question: 'How do I deal with common pests?',
    answer: `Here are effective pest control methods:

• **Prevention**: Rotate crops yearly, remove debris, and encourage beneficial insects.

• **Aphids**: Spray with water or use neem oil. Ladybugs are natural predators.

• **Caterpillars**: Hand-pick or use Bt (Bacillus thuringiensis) spray.

• **Slugs/Snails**: Use beer traps, copper tape, or diatomaceous earth.

• **Spider mites**: Increase humidity and spray with insecticidal soap.

• **Tip**: Inspect plants regularly - early detection makes control easier!`,
  },
  {
    id: 'soil',
    label: 'Soil Tips',
    question: 'What soil type is best for vegetables?',
    answer: `The ideal soil for most vegetables:

• **Loamy soil** is best - a balanced mix of sand, silt, and clay with good drainage and nutrients.

• **pH level**: Most vegetables prefer 6.0-7.0 (slightly acidic to neutral).

• **Improve clay soil**: Add compost, aged manure, or sand to improve drainage.

• **Improve sandy soil**: Add organic matter to increase water retention.

• **Testing**: Get a soil test every 2-3 years to check nutrient levels.

• **Tip**: Add 2-4 inches of compost to your garden beds each year!`,
  },
  {
    id: 'planting',
    label: 'Planting Tips',
    question: 'When is the best time to plant?',
    answer: `Planting timing depends on your climate and crop type:

• **Cool-season crops** (lettuce, spinach, peas): Plant 2-4 weeks before last frost or in fall.

• **Warm-season crops** (tomatoes, peppers, squash): Plant after last frost when soil is warm (60°F+).

• **Root vegetables** (carrots, beets): Plant directly in garden, as they don't transplant well.

• **Succession planting**: Plant every 2-3 weeks for continuous harvest.

• **Tip**: Check your local frost dates and count backwards to determine planting time!`,
  },
  {
    id: 'harvest',
    label: 'Harvest Guide',
    question: 'How do I know when to harvest?',
    answer: `Signs your crops are ready to harvest:

• **Tomatoes**: Fully colored, slightly soft when pressed, easily detaches from vine.

• **Peppers**: Firm, glossy skin, desired color reached (green, red, yellow).

• **Lettuce**: Leaves are full-sized but before bolting (flowering).

• **Cucumbers**: Firm, bright green, before yellowing. Pick frequently!

• **Carrots**: Tops are about 3/4 inch diameter. Pull one to test.

• **Tip**: Harvest in the morning when vegetables are crisp and cool!`,
  },
  {
    id: 'disease',
    label: 'Plant Health',
    question: 'My plant looks sick, what should I do?',
    answer: `Common plant disease symptoms and solutions:

• **Yellow leaves**: Could be overwatering, nutrient deficiency, or disease. Check soil moisture first.

• **Brown spots**: Often fungal - improve air circulation, avoid wetting leaves, apply fungicide if needed.

• **Wilting**: Check for underwatering, root rot, or pest damage at the base.

• **Powdery mildew**: White powdery coating - spray with baking soda solution (1 tbsp per gallon water).

• **Blossom end rot**: Black spots on bottom of tomatoes/peppers - caused by calcium deficiency or irregular watering.

• **Tip**: Remove affected leaves promptly and don't compost diseased plant material!`,
  },
];

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  selectQuickReply: (replyId: string) => void;
  clearMessages: () => void;
}

// Welcome message shown when chat opens
const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content: `Welcome to Farm+ Support! I'm here to help you with your farming questions.

Choose a topic below or type your own question:`,
  timestamp: new Date().toISOString(),
};

export const useChatStore = create<ChatState>()((set, get) => ({
  isOpen: false,
  messages: [welcomeMessage],

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  selectQuickReply: (replyId) => {
    const reply = quickReplies.find((r) => r.id === replyId);
    if (!reply) return;

    const { addMessage } = get();

    // Add user question
    addMessage({
      role: 'user',
      content: reply.question,
    });

    // Add bot response after a small delay for natural feel
    setTimeout(() => {
      addMessage({
        role: 'bot',
        content: reply.answer,
      });
    }, 500);
  },

  clearMessages: () => set({ messages: [welcomeMessage] }),
}));
