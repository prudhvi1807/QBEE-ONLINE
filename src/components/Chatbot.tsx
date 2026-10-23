import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Send, X } from 'lucide-react';
import { answer, STARTER_CHIPS, type BotReply } from '../lib/assistant';
import { useStore } from '../lib/store';
import { cx } from './ui';

type Msg = { from: 'bot'; reply: BotReply } | { from: 'me'; text: string };

const WELCOME: Msg = {
  from: 'bot',
  reply: { text: 'Hi, I’m the QBee assistant. Ask me about courses, fees, bundles, internships or batch timings.', chips: STARTER_CHIPS },
};

export function Chatbot() {
  const { chatOpen: open, setChatOpen: setOpen } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loc = useLocation();
  const raised = /^\/courses\/[^/]+$/.test(loc.pathname); // course pages have a mobile enrol bar

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', k);
    return () => {
      document.removeEventListener('keydown', k);
    };
  }, [setOpen]);

  if (loc.pathname.startsWith('/portal/labs')) return null; // keep the lab editor clear

  const ask = (q: string) => {
    const t = q.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: 'me', text: t }]);
    setText('');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: 'bot', reply: answer(t) }]);
    }, 450);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(text);
  };

  const lastBot = [...msgs].reverse().find((m) => m.from === 'bot') as Extract<Msg, { from: 'bot' }> | undefined;

  return (
    <>
      {open && (
        <div
          className="chat-in fixed inset-x-0 bottom-0 z-50 flex h-[min(620px,88vh)] flex-col rounded-t-2xl border border-line bg-white shadow-[0_30px_70px_-20px_rgba(10,35,80,.45)] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[390px] sm:rounded-2xl"
          role="dialog"
          aria-label="QBee assistant"
        >
          <div className="flex items-center gap-3 rounded-t-2xl bg-ink px-4 py-3.5 text-white">
            <img src="./logo.png" alt="" className="h-9 w-9 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">QBee assistant</p>
              <p className="text-xs text-white/65">Answers from the 2026 course catalogue</p>
            </div>
            <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10 cursor-pointer" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-mist px-4 py-4" aria-live="polite">
            {msgs.map((m, i) =>
              m.from === 'me' ? (
                <p key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[15px] text-white">{m.text}</p>
              ) : (
                <div key={i} className="max-w-[90%]">
                  <p className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[15px] text-text shadow-sm">{m.reply.text}</p>
                  {m.reply.links && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.reply.links.map((l) => (
                        <Link key={l.to + l.label} to={l.to} onClick={() => window.innerWidth < 640 && setOpen(false)} className="rounded-lg border border-blue/30 bg-white px-3 py-1.5 text-sm font-semibold text-blue hover:bg-blue-soft">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
            {typing && (
              <p className="inline-flex gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm" aria-label="Assistant is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </p>
            )}
          </div>

          {lastBot?.reply.chips && !typing && (
            <div className="flex gap-2 overflow-x-auto border-t border-line bg-white px-4 py-2.5">
              {lastBot.reply.chips.map((c) => (
                <button key={c} onClick={() => ask(c)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm text-ink hover:border-ink cursor-pointer">
                  {c}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="flex gap-2 border-t border-line bg-white p-3">
            <label htmlFor="chat-input" className="sr-only">Your question</label>
            <input
              id="chat-input"
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask about a course, fee or batch"
              className="h-11 min-w-0 flex-1 rounded-lg border border-line px-3 text-[15px]"
              autoComplete="off"
            />
            <button type="submit" disabled={!text.trim()} className="grid h-11 w-11 place-items-center rounded-lg bg-honey text-ink disabled:opacity-40 cursor-pointer" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={cx(
          'fixed right-4 z-50 flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-ink sm:w-auto sm:pl-4 sm:pr-5 text-white shadow-[0_12px_30px_-8px_rgba(10,35,80,.6)] hover:bg-ink-2 sm:right-6 cursor-pointer',
          raised ? 'bottom-20 lg:bottom-6' : 'bottom-4 sm:bottom-6',
          open && 'max-sm:hidden',
        )}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Ask QBee'}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden text-[15px] font-semibold sm:inline">{open ? 'Close' : 'Ask QBee'}</span>
      </button>
    </>
  );
}
