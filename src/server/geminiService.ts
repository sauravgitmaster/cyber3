import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export type ByteMood = 'happy' | 'waving' | 'thinking' | 'detective' | 'caution' | 'cheering' | 'excited';

export interface MentorReply {
  reply: string;
  technical?: string;
  mood: ByteMood;
  suggestedAction?: string;
}

export async function askByteMentor(
  question: string,
  context?: { score?: number; page?: string; name?: string; recentMission?: string }
): Promise<MentorReply> {
  const learnerName = context?.name || 'Explorer';
  const score = context?.score ?? 70;

  const ai = getAI();
  if (ai) {
    try {
      const prompt = `You are Byte, a friendly, supportive cyber robot buddy who teaches kids and students how to be safe, smart, and confident online.
The learner's name is ${learnerName} and their Cyber Smart Score is ${score}/100.
The learner asked: "${question}"

Respond in JSON format with three fields:
- "reply": Warm, encouraging, clear explanation (2-4 sentences) that an 8-15 year old can easily understand. Use helpful analogies (locks, detective clues, secret recipes) where fitting. Never judge them for asking.
- "technical": A 1-2 sentence "Under the Hood" explanation explaining the technical concept (e.g. DNS lookups, phishing headers, OAuth permissions, password hashing) for curious learners.
- "mood": One of: "happy", "waving", "thinking", "detective", "caution", "cheering", "excited".

Format your response as valid JSON ONLY:
{"reply": "...", "technical": "...", "mood": "..."}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const raw = response.text?.trim() || '';
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          reply: parsed.reply || "I'm always here to help you stay safe online!",
          technical: parsed.technical,
          mood: (parsed.mood as ByteMood) || 'happy',
        };
      }
    } catch (err) {
      console.warn('Gemini chat request failed, falling back to rule engine:', err);
    }
  }

  // Fallback intelligent safety rules when Gemini API key is not yet set or offline
  const lower = question.toLowerCase();
  if (lower.includes('safe') || lower.includes('message') || lower.includes('email') || lower.includes('phish')) {
    return {
      reply: `Whoa! When checking any unexpected message, ask yourself three simple questions:\n1. Did I actually ask for this?\n2. Are they trying to rush me with "ACT NOW"?\n3. Does the sender address look a little bit strange?\n\nIf anything feels off, don't click the link — go directly to the real app or website yourself!`,
      technical: 'Phishers rely on lookalike domain names and mismatched SMTP headers. Hovering links reveals the real target destination URL before clicking.',
      mood: 'detective',
    };
  }

  if (lower.includes('spot a scam') || lower.includes('scam')) {
    return {
      reply: 'Scammers love to pretend to be someone you trust (like school IT, a gaming friend, or a company). They almost always use urgency ("Your account will be deleted in 1 hour!") or promise free prizes/Robux/gift cards to make you rush. Take a breath — real services will never rush you into giving away your password.',
      technical: 'This tactic is known as Pretexting and Social Engineering. Attackers manufacture artificial crisis states to bypass skepticism.',
      mood: 'caution',
    };
  }

  if (lower.includes('share') || lower.includes('privacy') || lower.includes('personal')) {
    return {
      reply: 'Smart rule: Keep your "secret treasure" safe! Never share your full birthdate, home address, school schedule, parent names, or passwords in public chats or quizzes. Even quizzes that ask "What was your first pet\'s name?" can be tricks to guess your password reset questions!',
      technical: 'Social media quizzes frequently act as crowdsourced Open Source Intelligence (OSINT) harvesters targeting common security recovery question databases.',
      mood: 'thinking',
    };
  }

  if (lower.includes('suspicious') || lower.includes('website') || lower.includes('link') || lower.includes('url')) {
    return {
      reply: 'Great detective instinct! Check the web address closely. Scammers often use sneaky typos like "netflixx.com" or "g00gle.com". Also check for the lock icon, but remember: even fake sites can have locks now. If you ever doubt a link, open a new tab and search for the real official site!',
      technical: 'Attackers register typosquatting and homoglyph domains (using lookalike characters from other alphabets) to imitate reputable sites and steal session cookies.',
      mood: 'detective',
    };
  }

  if (lower.includes('hint') || lower.includes('help') || lower.includes('clue')) {
    return {
      reply: 'Here is Byte\'s golden tip: Stop, Think, and Verify! Ask yourself: "Does this person really need this information right now?" If you aren\'t 100% certain, asking a parent, teacher, or trusted adult is always the superhero move.',
      technical: 'Verification via an independent out-of-band communication channel eliminates more than 90% of impersonation attacks.',
      mood: 'excited',
    };
  }

  return {
    reply: `That's a great question, ${learnerName}! When navigating the digital world, remember the three golden cyber rules: protect your passwords like a treasure chest, double-check suspicious links before clicking, and always talk to a trusted adult if something feels weird!`,
    technical: 'Defense-in-depth blends technical safeguards (MFA, firewalls) with human vigilance (social engineering awareness).',
    mood: 'happy',
  };
}

export async function analyzeMissionDecision(params: {
  missionTitle: string;
  userChoice: string;
  isOptimal: boolean;
  scenarioContext?: string;
}): Promise<{ coaching: string; detectiveTip: string }> {
  const ai = getAI();
  if (ai) {
    try {
      const prompt = `You are Byte, the friendly cyber robot coach.
A student just completed the cyber mission "${params.missionTitle}".
The scenario context: "${params.scenarioContext || ''}".
The choice the student made: "${params.userChoice}".
Was it the optimal choice: ${params.isOptimal ? 'YES' : 'NO'}.

Provide:
1. "coaching": 2 friendly sentences encouraging them and explaining the outcome.
2. "detectiveTip": 1 actionable cyber clue for their future missions.

Return JSON ONLY: {"coaching": "...", "detectiveTip": "..."}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const raw = response.text?.trim() || '';
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Gemini mission feedback failed, falling back:', err);
    }
  }

  return {
    coaching: params.isOptimal
      ? "Outstanding detective work! You spotted the danger signs and kept your digital identity safe."
      : "Good effort! Cyber traps are designed to look real. Every mistake teaches you what clues to look for next time.",
    detectiveTip: params.isOptimal
      ? "Keep checking sender addresses and unexpected urgent demands."
      : "Always pause before clicking urgent links or typing your credentials into third-party forms.",
  };
}
