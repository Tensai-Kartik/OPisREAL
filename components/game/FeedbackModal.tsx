'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bug, Lightbulb, Send, X, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';

interface FeedbackModalProps {
  theme?: 'dark' | 'light';
}

const FEEDBACK_TYPES = [
  { value: 'bug_report', label: '🐛 Bug Report', desc: 'Something is broken or not working correctly' },
  { value: 'suggestion', label: '💡 Suggestion', desc: 'Ideas to improve the game or admin system' },
  { value: 'other', label: '💬 Other', desc: 'General feedback or comments' },
];

export default function FeedbackModal({ theme = 'dark' }: FeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [type, setType] = useState(FEEDBACK_TYPES[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 10) {
      setError('Please write at least 10 characters.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: type.value, message: message.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setMessage('');
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
        }, 2500);
      } else {
        setError(data.error || 'Failed to submit feedback.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative" ref={modalRef}>
      {/* Trigger Button */}
      <button
        onClick={() => { setIsOpen((v) => !v); setSubmitted(false); setError(null); }}
        className={`group px-3 py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg transition-all duration-200 backdrop-blur-md cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
          isDark
            ? 'bg-slate-900/90 border-amber-500/40 text-amber-400 hover:bg-slate-800 hover:border-amber-400 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]'
            : 'bg-white/95 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-amber-500 hover:shadow-md'
        }`}
      >
        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 text-amber-400" />
        <span>Feedback</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-96 rounded-2xl border shadow-2xl z-[100] animate-fadeIn ${
          isDark
            ? 'bg-slate-900/98 border-amber-500/40 backdrop-blur-xl'
            : 'bg-white border-slate-200 backdrop-blur-xl shadow-2xl'
        }`}>
          {submitted ? (
            /* Success State */
            <div className="p-8 flex flex-col items-center text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <p className={`font-black text-lg ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Feedback Sent!
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Thanks for taking the time. Every message is read personally.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black text-base uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Share Feedback
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Goes directly to the developer
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Type Dropdown */}
              <div className="relative">
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Type
                </label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold text-left transition ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-100 hover:border-amber-500/50'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span>{type.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-10 overflow-hidden ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-xl'
                  }`}>
                    {FEEDBACK_TYPES.map((ft) => (
                      <button
                        key={ft.value}
                        type="button"
                        onClick={() => { setType(ft); setDropdownOpen(false); }}
                        className={`w-full px-4 py-3 text-left transition flex flex-col ${
                          type.value === ft.value
                            ? isDark
                              ? 'bg-amber-950/60 text-amber-300'
                              : 'bg-slate-100 text-slate-900 font-bold'
                            : isDark
                              ? 'hover:bg-slate-700 text-slate-300'
                              : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="font-semibold text-sm">{ft.label}</span>
                        <span className="text-[11px] opacity-75 mt-0.5">{ft.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Textarea */}
              <div>
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what happened or share your idea..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition resize-none ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                  }`}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-xs font-semibold">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || message.trim().length < 10}
                className="w-full py-3 gold-button rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
