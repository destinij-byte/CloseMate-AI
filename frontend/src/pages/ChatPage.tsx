import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

type Mode = 'objection' | 'script' | 'lead';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MODE_CONFIG = {
  objection: {
    label: 'Objection Handler',
    icon: '🛡️',
    description: 'Paste an objection you\'re facing, get a persuasive rebuttal script.',
    inputLabel: 'What objection are you hearing?',
    inputPlaceholder: 'e.g., "Your price is too high compared to competitors..."',
    contextLabel: 'Context (optional)',
    contextPlaceholder: 'e.g., Selling to a small business owner, they\'re budget-conscious...',
    buttonLabel: 'Handle Objection',
    hasContext: true,
  },
  script: {
    label: 'Script Generator',
    icon: '📝',
    description: 'Describe your scenario and product, get a tailored sales script.',
    inputLabel: 'Describe the sales scenario',
    inputPlaceholder: 'e.g., Cold calling a homeowner about insurance...',
    contextLabel: 'Product/Service',
    contextPlaceholder: 'e.g., Term life insurance with coverage up to $500k...',
    buttonLabel: 'Generate Script',
    hasContext: true,
  },
  lead: {
    label: 'Lead Responder',
    icon: '💬',
    description: 'Paste a lead\'s message and get a suggested response.',
    inputLabel: 'Lead\'s message',
    inputPlaceholder: 'e.g., "I\'m not interested right now, call me next month..."',
    contextLabel: 'Last interaction (optional)',
    contextPlaceholder: 'e.g., We spoke briefly last week about their coverage needs...',
    buttonLabel: 'Suggest Response',
    hasContext: true,
  },
};

export default function ChatPage() {
  const [mode, setMode] = useState<Mode>('objection');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const config = MODE_CONFIG[mode];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setError(null);
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      let result: { script?: string; suggestion?: string };

      switch (mode) {
        case 'objection':
          result = await api.objectionHandle(input, context);
          break;
        case 'script':
          result = await api.generateScript(input, context);
          break;
        case 'lead':
          result = await api.suggestResponse(input, context);
          break;
      }

      const responseContent = result.script || result.suggestion || '';
      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-4">
      {/* Mode selector tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
        {(Object.keys(MODE_CONFIG) as Mode[]).map((key) => {
          const cfg = MODE_CONFIG[key];
          const isActive = mode === key;
          return (
            <button
              key={key}
              onClick={() => {
                setMode(key);
                setMessages([]);
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white shadow-sm text-brand-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-base">{cfg.icon}</span>
              <span className="hidden sm:inline">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode description */}
      <p className="text-sm text-gray-500 mb-4 text-center">{config.description}</p>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar min-h-[300px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-4xl mb-3">{config.icon}</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">{config.label}</h3>
            <p className="text-sm text-gray-400 max-w-md">
              {config.description}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="p-3 space-y-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={config.inputPlaceholder}
            rows={2}
            className="w-full resize-none outline-none text-sm text-gray-800 placeholder-gray-400"
            disabled={loading}
          />
          {config.hasContext && (
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={config.contextPlaceholder}
              className="w-full px-3 py-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg border border-gray-100 outline-none focus:border-gray-200"
              disabled={loading}
            />
          )}
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">{loading ? 'Generating...' : 'Press Enter to send, Shift+Enter for new line'}</span>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '...' : config.buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}