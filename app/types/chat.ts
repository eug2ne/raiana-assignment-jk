import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Attachment {
  id: string;
  message_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_url: string;
  created_at: Timestamp;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: Timestamp;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  last_message?: string;
}

// Lightweight version stored in localStorage
export interface CachedConversation {
  id: string;
  title: string;
  updated_at: Timestamp;
  messages: Message[]; // last N messages only
}