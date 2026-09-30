import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export type ByteMood = 'happy' | 'waving' | 'thinking' | 'detective' | 'caution' | 'cheering' | 'excited' | 'proud';

export interface MentorReply {
  reply: string;
  technical?: string;
  mood: ByteMood;
  suggestedAction?: string;
}

export interface MentorContext {
  score?: number;
  page?: string;
  name?: string;
  recentMission?: string;
  audienceType?: 'kids' | 'adult';
  age?: number;
}

export async function askByteMentor(
  question: string,
  context?: MentorContext
): Promise<MentorReply> {
  const learnerName = context?.name || 'Explorer';
  const score = context?.score ?? 70;
  const isAdult = context?.audienceType === 'adult' || (context?.age !== undefined && context.age >= 13);

  const ai = getAI();
  if (ai) {
    try {
      const prompt = isAdult
        ? `You are Byte, an authoritative, practical, and supportive cybersecurity mentor for adults, working professionals, and university students.
The learner's name is ${learnerName} and their Cyber Smart Score is ${score}/100.
The learner asked: "${question}"

Provide practical, realistic cybersecurity guidance focusing on actionable threat defense, identity protection, credential hygiene, phishing detection, and incident response.
Do NOT use juvenile metaphors, condescending language, or cartoonish imagery. Maintain an educational, professional, and empowering tone.

Respond in JSON format with three fields:
- "reply": Clear, practical explanation (2-4 sentences) addressing the core threat and defensive step.
- "technical": A 1-2 sentence "Under the Hood" technical mechanism (e.g. SPF/DKIM verification, reverse proxy phishing, OSINT harvesting, session cookie hijacking, MFA token relay).
- "mood": One of: "happy", "waving", "thinking", "detective", "caution", "cheering", "excited", "proud".

Format your response as valid JSON ONLY:
{"reply": "...", "technical": "...", "mood": "..."}`
        : `You are Byte, a friendly, encouraging cyber robot buddy who teaches kids and students how to be safe, smart, and confident online.
The learner's name is ${learnerName} and their Cyber Smart Score is ${score}/100.
The learner asked: "${question}"

Guidelines for kids:
- Use simple, friendly, encouraging language and age-appropriate examples (games, school, friends, passwords, safe browsing).
- Avoid frightening, graphic, mature, violent, or highly technical jargon.
- Never shame the learner.
- Include reminders such as "Ask a trusted adult if you are unsure."
- Do not request sensitive personal information from children.

Respond in JSON format with three fields:
- "reply": Warm, encouraging, clear explanation (2-4 sentences) that an 8-12 year old can easily understand. Use helpful analogies (locks, detective clues, secret recipes) where fitting. Include a reminder to ask a trusted adult if unsure.
- "technical": A 1-sentence simple "Under the Hood" clue for curious learners.
- "mood": One of: "happy", "waving", "thinking", "detective", "caution", "cheering", "excited".

Format your response as valid JSON ONLY:
{"reply": "...", "technical": "...", "mood": "..."}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
          reply: parsed.reply || (isAdult ? "I'm here to help you audit and strengthen your digital security posture." : "I'm always here to help you stay safe online!"),
          technical: parsed.technical,
          mood: (parsed.mood as ByteMood) || 'happy',
        };
      }
    } catch (err) {
      console.warn('Gemini chat request failed, falling back to rule engine:', err);
    }
  }

  // Fallback intelligent safety rules when Gemini API is offline or not configured
  const lower = question.toLowerCase();

  if (isAdult) {
    // Adult-oriented fallback engine
    if (lower.includes('safe') || lower.includes('message') || lower.includes('email') || lower.includes('phish')) {
      return {
        reply: `When evaluating any unexpected message, execute a three-point verification:\n1. Inspect the true envelope sender address and authentication headers (SPF/DKIM/DMARC) rather than just the display name.\n2. Look for synthetic urgency or artificial pressure to bypass verification.\n3. Verify requests out-of-band through known, bookmarked portals rather than clicking links inside the email.`,
        technical: 'Phishing infrastructure uses lookalike domain syntax, open redirects, and adversary-in-the-middle reverse proxies to capture credentials and session tokens in transit.',
        mood: 'detective',
      };
    }

    if (lower.includes('spot a scam') || lower.includes('scam') || lower.includes('social engineering')) {
      return {
        reply: 'Attackers frequently use pretexting and executive impersonation (such as Business Email Compromise or fake IT helpdesk calls). They construct high-pressure scenarios to force compliance. Always mandate multi-party authorization or out-of-band phone confirmation for financial or access changes.',
        technical: 'Pretexting establishes an artificial context of authority to exploit trust. Out-of-band verification on an independent communication channel mitigates over 90% of impersonation attempts.',
        mood: 'caution',
      };
    }

    if (lower.includes('share') || lower.includes('privacy') || lower.includes('personal') || lower.includes('data')) {
      return {
        reply: 'Practice data minimization across all public platforms. Never disclose government identification numbers, residential addresses, direct phone numbers, or details that correspond to account recovery security questions. Social media quizzes often serve as crowdsourced profiling campaigns.',
        technical: 'Attackers aggregate fragments from social media posts into Open Source Intelligence (OSINT) dossiers to defeat knowledge-based authentication recovery flows.',
        mood: 'thinking',
      };
    }

    if (lower.includes('suspicious') || lower.includes('website') || lower.includes('link') || lower.includes('url')) {
      return {
        reply: 'Inspect the Fully Qualified Domain Name (FQDN) directly preceding the first single forward slash. Attackers utilize multi-level subdomains (e.g. login.bank.com.malicious-host.net) and homoglyphs to deceive users. When in doubt, navigate via trusted bookmarks or direct search.',
        technical: 'Modern phishing kits proxy legitimate login flows to capture short-lived session cookies, bypassing traditional single-factor passwords and basic SMS tokens.',
        mood: 'detective',
      };
    }

    if (lower.includes('hint') || lower.includes('help') || lower.includes('clue') || lower.includes('mfa')) {
      return {
        reply: 'Core defensive rule: Never approve unsolicited multi-factor authentication (MFA) push notifications, and always verify suspicious transaction requests out-of-band before taking action.',
        technical: 'MFA fatigue attacks rely on repeated prompt bombardment until user frustration leads to approval. FIDO2/WebAuthn hardware keys prevent relay attacks through cryptographic domain-binding.',
        mood: 'excited',
      };
    }

    return {
      reply: `Digital security is founded on defense-in-depth, ${learnerName}: utilize a trusted password manager with high-entropy unique passphrases, mandate hardware-backed or authenticator-app MFA, and verify unexpected urgent requests out-of-band.`,
      technical: 'Defense-in-depth combines technical controls (encryption, zero-trust network access, MFA) with active human verification.',
      mood: 'happy',
    };
  }

  // Kids-oriented fallback engine
  if (lower.includes('safe') || lower.includes('message') || lower.includes('email') || lower.includes('phish')) {
    return {
      reply: `Whoa! When checking any unexpected message, ask yourself three simple questions:\n1. Did I actually ask for this?\n2. Are they trying to rush me with "ACT NOW"?\n3. Does the sender address look a little bit strange?\n\nIf anything feels off, don't click the link — and remember, asking a parent or teacher is always a smart detective move!`,
      technical: 'Phishers rely on lookalike domain names and mismatched addresses. Checking links closely reveals where they really lead.',
      mood: 'detective',
    };
  }

  if (lower.includes('spot a scam') || lower.includes('scam')) {
    return {
      reply: 'Scammers love to pretend to be someone you trust (like school IT, a gaming friend, or a company). They almost always use urgency ("Your account will be deleted in 1 hour!") or promise free prizes/Robux/gift cards to make you rush. Take a breath — real game companies will never rush you or ask for your password. Ask a trusted adult if you are ever unsure!',
      technical: 'This trick is called Pretexting. Attackers pretend to be someone you know to rush you into making a mistake.',
      mood: 'caution',
    };
  }

  if (lower.includes('share') || lower.includes('privacy') || lower.includes('personal')) {
    return {
      reply: 'Smart rule: Keep your "secret treasure" safe! Never share your full birthday, home address, school schedule, parent names, or passwords in public chats or quizzes. Even fun quizzes that ask "What was your first pet\'s name?" can be tricks to guess password reset questions! When unsure, ask a trusted adult.',
      technical: 'Fun online quizzes sometimes secretly collect answers to guess password reset questions.',
      mood: 'thinking',
    };
  }

  if (lower.includes('suspicious') || lower.includes('website') || lower.includes('link') || lower.includes('url')) {
    return {
      reply: 'Great detective instinct! Check the web address closely. Scammers often use sneaky typos like "netflixx.com" or "g00gle.com". If you ever doubt a link, open a new tab and search for the real official site, or ask a parent or teacher to check with you!',
      technical: 'Attackers create fake websites with names that look almost identical to the real ones to trick visitors.',
      mood: 'detective',
    };
  }

  if (lower.includes('hint') || lower.includes('help') || lower.includes('clue')) {
    return {
      reply: 'Here is Byte\'s golden tip: Stop, Think, and Verify! Ask yourself: "Does this person really need this information right now?" If you aren\'t 100% certain, asking a parent, teacher, or trusted adult is always the superhero move!',
      technical: 'Checking with a trusted adult before clicking suspicious things stops almost all online scams.',
      mood: 'excited',
    };
  }

  return {
    reply: `That's a great question, ${learnerName}! When navigating the digital world, remember the three golden cyber rules: protect your passwords like a treasure chest, double-check suspicious links before clicking, and always talk to a trusted adult if something feels weird!`,
    technical: 'Good cyber habits keep your accounts, devices, and personal information safe and sound.',
    mood: 'happy',
  };
}

export async function analyzeMissionDecision(params: {
  missionTitle: string;
  userChoice: string;
  isOptimal: boolean;
  scenarioContext?: string;
  audienceType?: 'kids' | 'adult';
}): Promise<{ coaching: string; detectiveTip: string }> {
  const isAdult = params.audienceType === 'adult';
  const ai = getAI();
  if (ai) {
    try {
      const prompt = isAdult
        ? `You are Byte, the cybersecurity mentor for an adult learner.
The learner just responded to the cyber mission "${params.missionTitle}".
The scenario context: "${params.scenarioContext || ''}".
The choice the learner made: "${params.userChoice}".
Was it the optimal choice: ${params.isOptimal ? 'YES' : 'NO'}.

Provide:
1. "coaching": 2 clear sentences providing professional feedback on their decision and the risk outcome.
2. "detectiveTip": 1 actionable cyber hygiene guideline for workplace and personal digital defense.

Return JSON ONLY: {"coaching": "...", "detectiveTip": "..."}`
        : `You are Byte, the friendly cyber robot coach.
A student just completed the cyber mission "${params.missionTitle}".
The scenario context: "${params.scenarioContext || ''}".
The choice the student made: "${params.userChoice}".
Was it the optimal choice: ${params.isOptimal ? 'YES' : 'NO'}.

Provide:
1. "coaching": 2 friendly sentences encouraging them and explaining the outcome. Remind them to ask a trusted adult if unsure.
2. "detectiveTip": 1 actionable cyber clue for their future missions.

Return JSON ONLY: {"coaching": "...", "detectiveTip": "..."}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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

  if (isAdult) {
    return {
      coaching: params.isOptimal
        ? "Excellent risk mitigation. You identified the threat vector, avoided out-of-process credential exposure, and maintained strong security protocol."
        : "Caution: This action introduces credential vulnerability or unauthorized access risk. In professional environments, always mandate out-of-band verification.",
      detectiveTip: params.isOptimal
        ? "Continue auditing sender domains, header authenticity, and out-of-band requests."
        : "Always isolate unexpected attachments and verify urgent transaction demands through an independent communication channel.",
    };
  }

  return {
    coaching: params.isOptimal
      ? "Outstanding detective work! You spotted the danger signs, made the safe choice, and kept your digital world safe."
      : "Good try! Cyber tricks are designed to fool people. Remember: you can always pause and ask a trusted adult for help.",
    detectiveTip: params.isOptimal
      ? "Keep checking sender addresses and watching out for unexpected urgent messages."
      : "Always pause before clicking strange links or giving away your passwords. When in doubt, ask a parent or teacher!",
  };
}
