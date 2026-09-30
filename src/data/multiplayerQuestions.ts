// Curated fast-paced multiplayer questions for "Play With a Friend"
// Designed for quick 10-second decisions: short punchy situations and 3-4 clear options.
// Answer positions are evenly distributed across A, B, C, and D.

export interface MultiplayerQuestionData {
  id: string;
  missionId: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  audience?: 'kids' | 'adult' | 'both';
  situation: string;
  prompt: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  whySafe: string;
}

export const multiplayerQuestionsPool: MultiplayerQuestionData[] = [
  // ==========================================
  // KIDS & GENERAL POOL
  // ==========================================
  {
    id: 'mp-q1',
    missionId: 'mission-free-robux',
    title: 'Free Robux Message',
    category: 'Scam & Phishing',
    difficulty: 'Beginner',
    audience: 'kids',
    situation: 'A DM says: "You won 10,000 free Robux! Click right now before the prize expires!"',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Report the message as a scam and delete it' },
      { id: 'opt-b', text: 'Click the link fast so you don’t miss it' },
      { id: 'opt-c', text: 'Forward the message to your school friends' },
      { id: 'opt-d', text: 'Reply asking if it’s really true' },
    ],
    correctOptionId: 'opt-a',
    whySafe: 'Real game companies never hand out free game coins in direct messages.',
  },
  {
    id: 'mp-q2',
    missionId: 'mission-homework-drop',
    title: 'Suspicious Homework File',
    category: 'Scam & Phishing',
    difficulty: 'Beginner',
    audience: 'kids',
    situation: 'You get an email with an attachment named "Science_Worksheet_Ch5.docx.exe".',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Open it to check tomorrow’s homework' },
      { id: 'opt-b', text: 'Do not open it; .exe files can install viruses' },
      { id: 'opt-c', text: 'Rename the file to remove .exe and open it' },
      { id: 'opt-d', text: 'Save it to a USB drive and open it at school' },
    ],
    correctOptionId: 'opt-b',
    whySafe: 'Files ending in .exe are executable computer programs, not reading documents.',
  },
  {
    id: 'mp-q3',
    missionId: 'mission-pass-sharing',
    title: 'Sharing Game Password',
    category: 'Password Security',
    difficulty: 'Beginner',
    audience: 'kids',
    situation: 'Your best friend at school asks for your game password to help you beat a boss level.',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Give them the password, they are your best friend' },
      { id: 'opt-b', text: 'Text it to them and tell them to delete the text' },
      { id: 'opt-c', text: 'Politely say no; passwords must stay private' },
      { id: 'opt-d', text: 'Change your password to "123456" so they remember' },
    ],
    correctOptionId: 'opt-c',
    whySafe: 'Even close friends can accidentally leak passwords. Keep them to yourself!',
  },
  {
    id: 'mp-q4',
    missionId: 'mission-pet-pass',
    title: 'Creating a Strong Password',
    category: 'Password Security',
    difficulty: 'Beginner',
    audience: 'both',
    situation: 'You are making a new password. Which of these is the safest password to use?',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Fluffy2014 (Your pet dog + birth year)' },
      { id: 'opt-b', text: 'Password123!' },
      { id: 'opt-c', text: 'Your school name + grade number' },
      { id: 'opt-d', text: 'Purple!Dolphin#Skates99 (A long multi-word passphrase)' },
    ],
    correctOptionId: 'opt-d',
    whySafe: 'Passphrases with random words, symbols, and numbers are extremely tough to crack.',
  },
  {
    id: 'mp-q5',
    missionId: 'mission-2fa-discord',
    title: 'Two-Factor Code Request',
    category: 'Password Security',
    difficulty: 'Intermediate',
    audience: 'kids',
    situation: 'A friend on Discord says: "I got locked out! Steam just sent a 6-digit code to your phone, send it to me!"',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Send the code right away to help your friend' },
      { id: 'opt-b', text: 'Never share security codes; their account is likely hacked' },
      { id: 'opt-c', text: 'Post the code in the public group chat' },
      { id: 'opt-d', text: 'Ask them for their password first as a trade' },
    ],
    correctOptionId: 'opt-b',
    whySafe: 'Verification codes are keys to your account. Scammers use hacked friends to steal them.',
  },
  {
    id: 'mp-q6',
    missionId: 'mission-quiz-perms',
    title: 'Fun Quiz App Permissions',
    category: 'Privacy & Identity',
    difficulty: 'Beginner',
    audience: 'both',
    situation: 'A free quiz app called "Which Superhero Are You?" asks for permission to read all your phone contacts.',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Deny the permission; a quiz has no need for your contacts' },
      { id: 'opt-b', text: 'Allow it so you can see your superhero result' },
      { id: 'opt-c', text: 'Allow it, then uninstall the app next week' },
      { id: 'opt-d', text: 'Allow it only while using mobile data' },
    ],
    correctOptionId: 'opt-a',
    whySafe: 'Apps asking for unnecessary private data are often collecting and selling contact lists.',
  },
  {
    id: 'mp-q7',
    missionId: 'mission-public-wifi',
    title: 'Coffee Shop Free WiFi',
    category: 'Safe Browsing',
    difficulty: 'Intermediate',
    audience: 'both',
    situation: 'You connect to "Free_Mall_WiFi_NoPassword". What should you avoid doing?',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Checking the weather or sports scores' },
      { id: 'opt-b', text: 'Reading Wikipedia articles for homework' },
      { id: 'opt-c', text: 'Entering personal passwords or making banking purchases' },
      { id: 'opt-d', text: 'Disconnecting WiFi when you leave' },
    ],
    correctOptionId: 'opt-c',
    whySafe: 'Open public WiFi without encryption can allow snoops on the same network to intercept logins.',
  },
  {
    id: 'mp-q8',
    missionId: 'mission-house-photo',
    title: 'Posting Front Porch Selfie',
    category: 'Privacy & Identity',
    difficulty: 'Beginner',
    audience: 'kids',
    situation: 'You take a cool selfie outside showing your front door with your house number clearly visible.',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Post it publicly so everyone sees your new shoes' },
      { id: 'opt-b', text: 'Tag your exact street location in the caption' },
      { id: 'opt-c', text: 'Share your home address in the comments' },
      { id: 'opt-d', text: 'Blur or crop out the house number before sharing' },
    ],
    correctOptionId: 'opt-d',
    whySafe: 'Never post identifiable landmarks or house numbers online—keep your home location private.',
  },
  {
    id: 'mp-q9',
    missionId: 'mission-mystery-usb',
    title: 'Found USB Drive in Library',
    category: 'Social Engineering',
    difficulty: 'Beginner',
    audience: 'both',
    situation: 'You spot a shiny USB flash drive on a library desk labeled "Exam Answers & Secrets".',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Turn it in to library lost-and-found without plugging it in' },
      { id: 'opt-b', text: 'Plug it into your home laptop safely' },
      { id: 'opt-c', text: 'Plug it into the school computer to see who lost it' },
      { id: 'opt-d', text: 'Give it to another student to test' },
    ],
    correctOptionId: 'opt-a',
    whySafe: 'Plugging in unknown USB drives can instantly launch malicious scripts or ransomware.',
  },
  {
    id: 'mp-q10',
    missionId: 'mission-fake-support',
    title: 'Pop-Up Virus Warning',
    category: 'Scam & Phishing',
    difficulty: 'Intermediate',
    audience: 'both',
    situation: 'A browser tab screams: "YOUR COMPUTER IS INFECTED! Call 1-800-MICRO-HELP immediately!"',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Call the number immediately for tech support' },
      { id: 'opt-b', text: 'Click "Clean Now" button on the web page' },
      { id: 'opt-c', text: 'Close the browser tab; real antivirus doesn’t ask you to call numbers' },
      { id: 'opt-d', text: 'Type your credit card to buy protection' },
    ],
    correctOptionId: 'opt-c',
    whySafe: 'Fake browser alerts scare you into calling scam call centers. Simply close the tab.',
  },
  {
    id: 'mp-q11',
    missionId: 'mission-mfa-fatigue',
    title: 'Midnight Login Prompts',
    category: 'Password Security',
    difficulty: 'Intermediate',
    audience: 'both',
    situation: 'At 11:30 PM, your phone buzzes 5 times with: "Approve sign-in to School Portal in Russia?"',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Hit "Approve" so the buzzing stops' },
      { id: 'opt-b', text: 'Hit "Deny", then change your password immediately' },
      { id: 'opt-c', text: 'Turn off your phone and ignore it' },
      { id: 'opt-d', text: 'Approve once to see who is trying' },
    ],
    correctOptionId: 'opt-b',
    whySafe: 'This is an MFA Fatigue attack! Deny the request and change your password right away.',
  },
  {
    id: 'mp-q12',
    missionId: 'mission-stream-mod',
    title: 'Streamer Moderator Offer',
    category: 'Social Engineering',
    difficulty: 'Intermediate',
    audience: 'kids',
    situation: 'A popular gamer’s DM says: "I want to make you a stream mod! Just download this verification plugin."',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Download and run the plugin right away' },
      { id: 'opt-b', text: 'Run the plugin as Administrator' },
      { id: 'opt-c', text: 'Check the official stream page; real creators don’t send weird download links' },
      { id: 'opt-d', text: 'Disable your antivirus so the plugin installs' },
    ],
    correctOptionId: 'opt-c',
    whySafe: 'Impersonating creators with "moderator tools" is a common way to distribute token stealers.',
  },
  {
    id: 'mp-q13',
    missionId: 'mission-device-update',
    title: 'Official Software Update',
    category: 'Safe Browsing',
    difficulty: 'Beginner',
    audience: 'both',
    situation: 'Your tablet settings say "System Security Update Ready". What is the best practice?',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Install official security updates to patch bugs' },
      { id: 'opt-b', text: 'Never update your device; updates are bad' },
      { id: 'opt-c', text: 'Search Google for third-party update files' },
      { id: 'opt-d', text: 'Delay updates for 2 years' },
    ],
    correctOptionId: 'opt-a',
    whySafe: 'Official software updates fix security holes before hackers can use them to harm devices.',
  },
  {
    id: 'mp-q14',
    missionId: 'mission-dm-voice',
    title: 'AI Voice Clone Message',
    category: 'Social Engineering',
    difficulty: 'Advanced',
    audience: 'both',
    situation: 'You receive a voice note that sounds like your cousin saying: "I lost my backpack, please Venmo $20!"',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Send the money immediately since it sounds like them' },
      { id: 'opt-b', text: 'Send double the money just in case' },
      { id: 'opt-c', text: 'Post about it on Instagram' },
      { id: 'opt-d', text: 'Call your cousin directly on their normal phone number to check' },
    ],
    correctOptionId: 'opt-d',
    whySafe: 'AI can clone voices from short clips. Always verify urgent money requests with a direct phone call.',
  },
  {
    id: 'mp-q15',
    missionId: 'mission-lock-screen',
    title: 'Leaving Laptop in Classroom or Office',
    category: 'Privacy & Identity',
    difficulty: 'Beginner',
    audience: 'both',
    situation: 'You need to step out of the room for 5 minutes. What should you do before walking away?',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Leave your screen on and accounts logged in' },
      { id: 'opt-b', text: 'Lock your computer screen with Win+L or Cmd+Control+Q' },
      { id: 'opt-c', text: 'Cover the screen with a sheet of paper' },
      { id: 'opt-d', text: 'Turn off the monitor only' },
    ],
    correctOptionId: 'opt-b',
    whySafe: 'Locking your screen ensures nobody can browse your emails or impersonate you while you are away.',
  },
  {
    id: 'mp-q16',
    missionId: 'mission-sms-package',
    title: 'Missing Package Delivery Text',
    category: 'Scam & Phishing',
    difficulty: 'Beginner',
    audience: 'both',
    situation: 'You get a text: "USPS: Your package cannot be delivered! Click track-pkg-now.info to pay $1.50 fee."',
    prompt: "What's the safe choice?",
    options: [
      { id: 'opt-a', text: 'Delete and ignore; official post offices don’t text from random cell numbers' },
      { id: 'opt-b', text: 'Click the link and enter your parent’s credit card' },
      { id: 'opt-c', text: 'Reply with your home address' },
      { id: 'opt-d', text: 'Forward to all your friends to warn them' },
    ],
    correctOptionId: 'opt-a',
    whySafe: 'Package delivery smishing texts are sent in bulk to trick people into giving up credit card details.',
  },

  // ==========================================
  // ADULT & WORKPLACE SCENARIOS POOL
  // ==========================================
  {
    id: 'mp-q17',
    missionId: 'mission-adult-bec',
    title: 'Executive Wire Transfer Request',
    category: 'Social Engineering',
    difficulty: 'Advanced',
    audience: 'adult',
    situation: 'An email appearing from your CEO requests an urgent $45,000 wire transfer for a confidential acquisition.',
    prompt: "What is your immediate authoritative action?",
    options: [
      { id: 'opt-a', text: 'Process the transfer immediately to avoid disciplinary action' },
      { id: 'opt-b', text: 'Reply to the email asking for confirmation' },
      { id: 'opt-c', text: 'Call the CEO or Finance Director via internal out-of-band phone line to verify' },
      { id: 'opt-d', text: 'CC the entire department to seek opinions' },
    ],
    correctOptionId: 'opt-c',
    whySafe: 'Business Email Compromise (BEC) attacks rely on manufactured authority. Always verify out-of-band.',
  },
  {
    id: 'mp-q18',
    missionId: 'mission-adult-macro',
    title: 'Vendor Invoice with Macros',
    category: 'Scam & Phishing',
    difficulty: 'Intermediate',
    audience: 'adult',
    situation: 'A vendor billing email contains "Invoice_Sep2026.xlsm" and asks you to "Enable Content" to view total.',
    prompt: "What is the security procedure?",
    options: [
      { id: 'opt-a', text: 'Enable Macros so calculation formulas run' },
      { id: 'opt-b', text: 'Do NOT enable macros; malicious VBA scripts execute malware upon enablement' },
      { id: 'opt-c', text: 'Save the document to Google Drive and execute it there' },
      { id: 'opt-d', text: 'Send the file to accounting to inspect' },
    ],
    correctOptionId: 'opt-b',
    whySafe: 'Macro-enabled office files (.xlsm, .docm) are common carriers for initial access loaders.',
  },
  {
    id: 'mp-q19',
    missionId: 'mission-adult-git-secret',
    title: 'Accidental Cloud Key Commit',
    category: 'Incident Response',
    difficulty: 'Advanced',
    audience: 'adult',
    situation: 'You mistakenly committed an AWS access key and database secret in a public GitHub repository commit.',
    prompt: "What is the critical first step?",
    options: [
      { id: 'opt-a', text: 'Delete the commit locally and push a force update' },
      { id: 'opt-b', text: 'Wait until the end of sprint to roll keys' },
      { id: 'opt-c', text: 'Immediately revoke/rotate the leaked key in the cloud IAM console, then purge git history' },
      { id: 'opt-d', text: 'Change the repository from public to private and do nothing else' },
    ],
    correctOptionId: 'opt-c',
    whySafe: 'Public git scrapers harvest keys within seconds. The leaked credential must be revoked immediately.',
  },
  {
    id: 'mp-q20',
    missionId: 'mission-adult-sim-swap',
    title: 'Sudden "No Service" Cellular Alert',
    category: 'Privacy & Identity',
    difficulty: 'Advanced',
    audience: 'adult',
    situation: 'Your cell phone suddenly drops to "No Service" and you receive an email: "Your SIM card was re-assigned".',
    prompt: "What threat is occurring?",
    options: [
      { id: 'opt-a', text: 'Normal carrier cell tower maintenance' },
      { id: 'opt-b', text: 'A transient SIM hardware defect' },
      { id: 'opt-c', text: 'A SIM Swapping attack to intercept your SMS 2FA codes for banking and email accounts' },
      { id: 'opt-d', text: 'Your phone battery needs replacement' },
    ],
    correctOptionId: 'opt-c',
    whySafe: 'SIM swaps route your cellular calls and 2FA SMS tokens to attacker hardware. Contact your carrier immediately.',
  },
];

// Helper to get 8 random, balanced questions for a multiplayer match
// Server authoritatively shuffles options for each question so correct answers
// are distributed across A, B, C, D and identical across all players.
export function getEightRandomQuestions(
  excludeIds: string[] = [],
  audience?: 'kids' | 'adult'
): MultiplayerQuestionData[] {
  let pool = multiplayerQuestionsPool.filter((q) => !excludeIds.includes(q.id));
  if (audience) {
    const audiencePool = pool.filter((q) => !q.audience || q.audience === audience || q.audience === 'both');
    if (audiencePool.length >= 8) {
      pool = audiencePool;
    }
  }

  const candidatePool = pool.length >= 8 ? pool : multiplayerQuestionsPool;

  // Shuffle selected questions
  const shuffledQuestions = [...candidatePool].sort(() => Math.random() - 0.5).slice(0, 8);

  // Server authoritatively shuffles the options of each question
  return shuffledQuestions.map((q) => {
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: shuffledOptions,
    };
  });
}
