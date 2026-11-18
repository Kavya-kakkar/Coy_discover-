import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ShieldCheck, Sparkles, MapPin, GraduationCap, Heart } from 'lucide-react';
import { fetchMatchMessages, sendMatchMessage } from '../services/api.js';

export function ChatPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    let active = true;

    async function loadChat() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMatchMessages(matchId);
        if (active) {
          setPartner(data.partner);
          setMessages(data.messages || []);
          setTimeout(() => scrollToBottom(false), 50);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load conversation');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadChat();

    return () => {
      active = false;
    };
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.port === '3000' ? 'localhost:5000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws?matchId=${matchId}`;

    let socket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'JOIN_MATCH', matchId, userId: 'user_001' }));
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'NEW_MESSAGE' && payload.message) {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === payload.message.id);
              if (exists) return prev;
              return [...prev, payload.message];
            });
            setTimeout(() => scrollToBottom(true), 60);
          } else if (payload.type === 'TYPING') {
            setIsPartnerTyping(Boolean(payload.isTyping));
            if (payload.isTyping) {
              setTimeout(() => scrollToBottom(true), 60);
            }
          }
        } catch {}
      };
    } catch {}

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isPartnerTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || sending) return;

    const optimisticId = `temp_${Date.now()}`;
    const optimisticMessage = {
      id: optimisticId,
      matchId,
      senderId: 'user_001',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');
    setSending(true);

    try {
      const response = await sendMatchMessage(matchId, text);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? response.message : m))
      );
    } catch (err) {
      alert(`Message could not be sent: ${err.message}`);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full border-2 border-coral-500 border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-semibold text-coy-muted">Opening private conversation...</p>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-4 rounded-3xl bg-white border border-rose-200 shadow-card text-center w-full">
          <p className="text-sm font-bold text-rose-600 mb-2">Conversation Unavailable</p>
          <p className="text-xs text-stone-600 mb-4">{error || 'Could not find this conversation'}</p>
          <button
            onClick={() => navigate('/matches')}
            className="px-4 py-2 rounded-2xl bg-stone-900 text-white text-xs font-bold"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  const icebreakers = [
    `Hey ${partner.name.split(' ')[0]}! Great to match with you 😊`,
    `Loved your profile! What kind of coffee do you usually drink? ☕`,
    `Excited to connect! How is your week going? ✨`
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-65px)] max-w-2xl mx-auto w-full bg-[#FAF8F5] pb-16 md:pb-0">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-coy-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/matches')}
            className="w-9 h-9 rounded-2xl bg-coy-warm hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Back to matches"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={partner.photo}
              alt={partner.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-coral-100"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-stone-900 text-base leading-tight">
                {partner.name}
              </h2>
              <span className="text-xs font-medium text-stone-500">
                {partner.age}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <MapPin className="w-3 h-3 text-coral-500" />
              <span>{partner.city}</span>
              {isPartnerTyping && (
                <span className="ml-1 text-coral-600 font-bold animate-pulse">
                  • typing...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-coral-700 border border-coral-200 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Private Match</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="my-4 p-5 rounded-3xl bg-white border border-coy-border text-center shadow-sm max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-coral-500 flex items-center justify-center mx-auto mb-2.5 border border-coral-100">
            <Heart className="w-6 h-6 fill-coral-500" />
          </div>
          <p className="text-sm font-bold text-stone-900">
            You matched with {partner.name}!
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Your interest is only revealed because it’s mutual. This is a private one-to-one conversation.
          </p>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'user_001';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={partner.photo}
                  alt={partner.name}
                  className="w-7 h-7 rounded-full object-cover mb-1 ring-1 ring-coral-100 flex-shrink-0"
                />
              )}

              <div className={`max-w-[78%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-tr from-coral-500 to-rose-400 text-white rounded-br-sm shadow-sm'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        {isPartnerTyping && (
          <div className="flex items-end gap-2 justify-start">
            <img
              src={partner.photo}
              alt={partner.name}
              className="w-7 h-7 rounded-full object-cover mb-1 ring-1 ring-coral-100 flex-shrink-0"
            />
            <div className="px-4 py-3 rounded-2xl bg-white border border-stone-200 rounded-bl-sm shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-coral-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-coral-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-coral-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <p className="text-[11px] font-semibold text-stone-400 mb-2 uppercase tracking-wider text-center">
            Suggested Icebreakers
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {icebreakers.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 text-stone-700 hover:text-coral-600 text-xs font-medium border border-coy-border transition-colors shadow-2xs text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 sm:p-4 bg-white border-t border-coy-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${partner.name.split(' ')[0]}...`}
            disabled={sending}
            autoFocus
            className="flex-1 bg-coy-warm px-4 py-3 rounded-2xl border border-coy-border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-coral-400/50 focus:bg-white transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            aria-label="Send message"
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-coral-500 to-rose-400 hover:from-coral-600 hover:to-rose-500 text-white flex items-center justify-center shadow-md shadow-coral-500/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
