import { create } from "zustand";

export type GeneratedFile = {
  filename: string;
  base64: string;
  media_type: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  model?: string;
  files?: GeneratedFile[];
};

type ChatState = {
  messages: ChatMessage[];
  streaming: boolean;
  conversationId: string | null;
  setMessages: (m: ChatMessage[]) => void;
  appendMessage: (m: ChatMessage) => void;
  appendToLastAssistant: (chunk: string) => void;
  setLastAssistantModel: (model: string) => void;
  setLastAssistantFiles: (files: GeneratedFile[]) => void;
  setStreaming: (v: boolean) => void;
  setConversationId: (id: string | null) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  streaming: false,
  conversationId: null,
  setMessages: (m) => set({ messages: m }),
  appendMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  appendToLastAssistant: (chunk) =>
    set((s) => {
      const messages = [...s.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, content: last.content + chunk };
      }
      return { messages };
    }),
  setLastAssistantModel: (model) =>
    set((s) => {
      const messages = [...s.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, model };
      }
      return { messages };
    }),
  setLastAssistantFiles: (files) =>
    set((s) => {
      const messages = [...s.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, files };
      }
      return { messages };
    }),
  setStreaming: (v) => set({ streaming: v }),
  setConversationId: (id) => set({ conversationId: id }),
  reset: () => set({ messages: [], conversationId: null, streaming: false }),
}));
