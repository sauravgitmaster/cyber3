import React, { useState } from 'react';
import { MentorInsight, UserProfile, ActivePage } from '../../types';
import { Send, X, Sparkles, ChevronDown, ChevronUp, Lightbulb, Compass, Search, ShieldAlert, Eye, Globe, HelpCircle } from 'lucide-react';
import { ByteMascot, ByteMood } from './ByteMascot';

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  insight?: MentorInsight;
  onStartRecommendation?: (pathId: string, moduleId?: string) => void;
  userTrustScore?: number;
  activePage?: ActivePage;
  onNavigate?: (page: ActivePage) => void;
}

interface ChatMessage {
  id: string;
  sender: 'byte' | 'learner';
  text: string;
  technicalDetails?: string;
  time: string;
  mood?: ByteMood;
}

const QUICK_PROMPTS = [
  { text: 'Is this message safe?', icon: Search },
  { text: 'How do I spot a scam?', icon: ShieldAlert },
  { text: 'What should I never share online?', icon: Eye },
  { text: 'Why is this website suspicious?', icon: Globe },
  { text: 'Give me a hint!', icon: HelpCircle },
];

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({
  isOpen,
  onClose,
  user,
  insight,
  onStartRecommendation,
  userTrustScore,
  activePage,
  onNavigate,
}) => {
  const learnerName = user?.name || 'there';
  const smartScore = user?.digitalTrustScore ?? userTrustScore ?? 74;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'byte',
      text: `Hey ${learnerName}! I'm Byte, your cyber safety buddy. Ask me anything about staying safe online, spotting tricky messages, or passwords!`,
      time: 'Just now',
      mood: 'waving',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedTechId, setExpandedTechId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || inputText).trim();
    if (!question) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const learnerMsgId = `learner-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: learnerMsgId, sender: 'learner', text: question, time: now },
    ]);
    setInputText('');
    setIsTyping(true);

    try {
      let reply = '';
      let technical = '';
      let replyMood: ByteMood = 'happy';

      // 1. Call real backend API
      try {
        const res = await fetch('/api/mentor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            context: {
              name: learnerName,
              score: smartScore,
              page: activePage,
            },
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.reply) {
            reply = data.reply;
            technical = data.technical || '';
            replyMood = (data.mood as ByteMood) || 'happy';
          }
        }
      } catch (networkErr) {
        // Fallback to local rules
      }

      // 2. Local fallback if API server was unreachable
      if (!reply) {
        const lower = question.toLowerCase();
        if (lower.includes('safe') || lower.includes('message') || lower.includes('email') || lower.includes('phish')) {
          reply =
            'Whoa! When checking any unexpected message, ask yourself three simple questions:\n1. Did I actually ask for this?\n2. Are they trying to rush me with "ACT NOW"?\n3. Does the sender address look a little bit strange?\n\nIf anything feels off, don\'t click the link — go directly to the real app or website yourself!';
          technical =
            'Technical explanation: Phishers rely on lookalike domain names and mismatched SMTP headers. Hovering links reveals the real target destination URL before clicking.';
          replyMood = 'detective';
        } else if (lower.includes('spot a scam') || lower.includes('scam')) {
          reply =
            'Scammers love to pretend to be someone you trust (like school IT, a gaming friend, or a company). They almost always use urgency ("Your account will be deleted in 1 hour!") or promise free prizes/Robux/gift cards to make you rush. Take a breath — real services will never rush you into giving away your password.';
          technical =
            'Technical explanation: This tactic is known as Pretexting and Social Engineering. Attackers manufacture artificial crisis states to bypass cognitive skepticism.';
          replyMood = 'caution';
        } else if (lower.includes('share') || lower.includes('privacy') || lower.includes('personal')) {
          reply =
            'Smart rule: Keep your "secret treasure" safe! Never share your full birthdate, home address, school schedule, parent names, or passwords in public chats or quizzes. Even quizzes that ask "What was your first pet\'s name?" can be tricks to guess your password reset questions!';
          technical =
            'Technical explanation: Social media quizzes frequently act as crowdsourced Open Source Intelligence (OSINT) harvesters targeting common security recovery question databases.';
          replyMood = 'thinking';
        } else if (lower.includes('suspicious') || lower.includes('website') || lower.includes('link') || lower.includes('url')) {
          reply =
            'Take a close look at the address bar! Scammers often swap letters (like using "1" instead of "l", or adding extra words like "login-verify-account.com"). If it\'s not the exact official web address, it\'s not safe.';
          technical =
            'Technical explanation: Attackers use typo-squatting, homoglyph attacks, and multi-level subdomains. The true root domain sits directly before the first single forward slash.';
          replyMood = 'detective';
        } else if (lower.includes('hint')) {
          reply =
            'Here is Byte\'s golden rule: "When in doubt, check it out out-of-band!" That means instead of clicking any link inside a message, open a fresh browser tab and visit the official website directly from your bookmarks.';
          technical =
            'Technical explanation: Out-of-band verification completely neutralizes credential harvesting proxies and adversary-in-the-middle reverse-proxies.';
          replyMood = 'excited';
        } else if (lower.includes('password')) {
          reply =
            'Long beats complicated! A password made of 4 random words (like "purple-bicycle-forest-pancake") is way easier for you to remember and almost impossible for a computer to guess! And never use the same password on two different sites.';
          technical =
            'Technical explanation: Password entropy scales geometrically with length. A 16+ character multi-word passphrase resists brute-force GPU cluster cracking far better than an 8-character string with complex symbols.';
          replyMood = 'proud';
        } else {
          reply =
            `That is a great question, ${learnerName}! Every time you pause and think before clicking, you are leveling up your cyber superhero powers. Always protect your passwords and ask a trusted adult if something feels weird.`;
          technical =
            'Defensive principle: Zero-Trust framework dictates that all inbound digital requests must be verified, whether from internal or external sources.';
          replyMood = 'happy';
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `byte-${Date.now()}`,
          sender: 'byte',
          text: reply,
          technicalDetails: technical,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: replyMood,
        },
      ]);
    } catch {
      // quiet fallback
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#fafaf9] dark:bg-[#000000] flex flex-col h-full z-10 text-zinc-900 dark:text-zinc-100 shadow-2xl animate-in slide-in-from-right duration-200 border-l border-zinc-200 dark:border-zinc-850 transition-colors">
        {/* Header with Byte */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#080808] border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ByteMascot mood="waving" size="sm" animate={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100">Ask Byte</h2>
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono uppercase tracking-wider border border-zinc-250 dark:border-zinc-800">
                  AI Mentor
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Always here to help you stay smart & safe online
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Close Byte drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Byte's Tip Callout if insight available */}
        {insight && (
          <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Byte's Adventure Tip</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs">
              "{insight.observation}"
            </p>
            {onStartRecommendation && insight.recommendationPathId && (
              <button
                onClick={() => {
                  onStartRecommendation(insight.recommendationPathId, insight.recommendationModuleId);
                  onClose();
                }}
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
              >
                <span>Jump to {insight.recommendationTitle}</span>
                <span>→</span>
              </button>
            )}
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">
            Quick Inquiries
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt.text)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-xs font-normal text-zinc-700 dark:text-zinc-300 shadow-2xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              >
                <prompt.icon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => {
            const isByte = msg.sender === 'byte';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isByte ? 'items-start' : 'items-end justify-end'}`}
              >
                {isByte && (
                  <div className="mt-1">
                    <ByteMascot mood={msg.mood || 'happy'} size="xs" animate={false} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs space-y-2 leading-relaxed ${
                    isByte
                      ? 'bg-white dark:bg-[#080808] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-850 rounded-tl-xs'
                      : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-tr-xs font-normal'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Progressive disclosure: Want to know how this works? */}
                  {isByte && msg.technicalDetails && (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850">
                      <button
                        onClick={() =>
                          setExpandedTechId(expandedTechId === msg.id ? null : msg.id)
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>How this works under the hood</span>
                        {expandedTechId === msg.id ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {expandedTechId === msg.id && (
                        <div className="mt-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 font-mono space-y-1">
                          <span className="font-mono uppercase tracking-wider text-[9px] text-zinc-500 block">
                            Deep Dive Breakdown
                          </span>
                          <p className="font-sans leading-normal">
                            {msg.technicalDetails}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right font-mono ${
                      isByte ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 italic pl-8">
              <ByteMascot mood="thinking" size="xs" animate={false} />
              <span className="font-serif-editorial italic">Byte is thinking...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white dark:bg-[#080808] border-t border-zinc-200 dark:border-zinc-850">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Byte anything about online safety..."
              className="flex-1 px-4 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 text-xs outline-hidden text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-zinc-950 transition-all shadow-2xs cursor-pointer"
              aria-label="Send question to Byte"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
