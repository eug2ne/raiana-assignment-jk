import { useCallback } from 'react';
import { CachedConversation, Message } from '@/app/types/chat';

const CACHE_KEY = 'chat_cache';
const MAX_CACHED_CONVERSATIONS = 10;
const MAX_CACHED_MESSAGES = 20; // per conversation

function getCache(): Record<string, CachedConversation> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setCache(cache: Record<string, CachedConversation>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // quota exceeded — clear oldest entries
    const entries = Object.entries(cache);
    const trimmed = Object.fromEntries(
      entries
        .sort((a, b) => new Date(b[1].updated_at).getTime() - new Date(a[1].updated_at).getTime())
        .slice(0, MAX_CACHED_CONVERSATIONS / 2)
    );
    localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
  }
}

export function useChatCache() {
  const getCachedConversation = useCallback((id: string): CachedConversation | null => {
    const cache = getCache();
    return cache[id] ?? null;
  }, []);

  const getCachedConversationList = useCallback((): CachedConversation[] => {
    const cache = getCache();
    return Object.values(cache)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, MAX_CACHED_CONVERSATIONS);
  }, []);

  const updateCache = useCallback((conversation: CachedConversation, newMessages: Message[]) => {
    const cache = getCache();
    const existing = cache[conversation.id];
    const allMessages = existing
      ? [...existing.messages, ...newMessages].slice(-MAX_CACHED_MESSAGES)
      : newMessages.slice(-MAX_CACHED_MESSAGES);

    cache[conversation.id] = {
      ...conversation,
      messages: allMessages,
      updated_at: Date.now(),
    };

    // Evict oldest if over limit
    const entries = Object.entries(cache);
    if (entries.length > MAX_CACHED_CONVERSATIONS) {
      const sorted = entries.sort(
        (a, b) => new Date(b[1].updated_at).getTime() - new Date(a[1].updated_at).getTime()
      );
      const trimmed = Object.fromEntries(sorted.slice(0, MAX_CACHED_CONVERSATIONS));
      setCache(trimmed);
    } else {
      setCache(cache);
    }
  }, []);

  const setCachedConversation = useCallback((conversation: CachedConversation) => {
    const cache = getCache();
    cache[conversation.id] = conversation;
    setCache(cache);
  }, []);

  const removeCachedConversation = useCallback((id: string) => {
    const cache = getCache();
    delete cache[id];
    setCache(cache);
  }, []);

  return {
    getCachedConversation,
    getCachedConversationList,
    updateCache,
    setCachedConversation,
    removeCachedConversation,
  };
}