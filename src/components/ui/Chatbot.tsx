import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪' },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
          language: lang.label
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {

      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Premium Minimalist AI Avatar (Sparkle)
  const AbstractAvatar = ({ size = 48 }: { size?: number }) => (
    <div 
      className="rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-ink border border-line-soft shadow-[0_0_20px_rgba(201,162,75,0.05)]"
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="text-gold"
        style={{ width: size * 0.5, height: size * 0.5 }}
      >
        <path d="M12 2c0 5.523-4.477 10-10 10 5.523 0 10 4.477 10 10 0-5.523 4.477-10 10-10-5.523 0-10-4.477-10-10z" />
      </svg>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-body">
      {/* Chat Window (Open State) */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[380px] h-[550px] max-h-[80vh] bg-surface/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-line-soft">
          
          {/* Header - Language Selector */}
          <div className="flex justify-end p-4 relative z-20 bg-ink/30 border-b border-line-soft">
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 bg-ink border border-line-soft rounded-full px-4 py-2 text-sm text-grey hover:text-white transition-colors"
              >
                <span>{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${langOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-surface-2 border border-line-soft rounded-2xl shadow-xl overflow-hidden py-2 z-30">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-ink transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span className={lang.code === l.code ? 'font-medium text-gold' : 'text-grey'}>{l.label}</span>
                      </span>
                      {lang.code === l.code && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-2 p-2 text-grey-2 hover:text-white transition-colors rounded-full hover:bg-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area / Empty State */}
          <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col relative">
            {messages.length === 0 ? (
              /* Empty State Layout (No call button) */
              <div className="absolute inset-0 flex flex-col items-center justify-center -mt-10">
                <AbstractAvatar size={140} />
              </div>
            ) : (
              /* Chat Messages */
              <div className="flex flex-col gap-4 py-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-white text-ink rounded-tr-sm' 
                          : 'bg-surface-2 border border-line-soft text-grey rounded-tl-sm'
                      }`}
                      dangerouslySetInnerHTML={{ 
                        __html: msg.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold hover:underline font-medium">$1</a>')
                      }}
                    />
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 bg-surface-2 border border-line-soft flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 bg-ink/50 border-t border-line-soft relative z-20">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services..." 
                className="w-full bg-ink border border-line-soft rounded-2xl pl-4 pr-12 py-3 text-sm text-white placeholder-grey-3 focus:outline-none focus:border-gold/50 transition-colors shadow-inner"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center hover:bg-gold hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Closed State (Pure Circular Button) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:scale-[1.05] transition-transform duration-300 group"
          aria-label="Open Chat"
        >
          <div className="p-1.5 bg-surface border border-line-soft rounded-full">
            <AbstractAvatar size={56} />
          </div>
        </button>
      )}
    </div>
  );
}
