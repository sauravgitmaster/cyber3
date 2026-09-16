export type CategoryGroup = 'FOUNDATIONS' | 'THREAT AWARENESS' | 'RESPONSIBLE CYBER BEHAVIOUR';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  institution: string;
  avatar: string;
  level: number;
  levelTitle: string;
  currentXP: number;
  nextLevelXP: number;
  digitalTrustScore: number;
  trustScoreDelta: number; // e.g. +6 this week
  streakDays: number;
  completedModulesCount: number;
  scenariosCompletedCount: number;
  joinedDate: string;
}

export interface SkillCategoryScore {
  id: string;
  name: string;
  score: number; // 0-100
  level: 'Developing' | 'Competent' | 'Proficient' | 'Advanced';
  change: number; // e.g. +4
  description: string;
}

export interface ModuleSection {
  id: string;
  title: string;
  type: 'learn' | 'example' | 'scenario' | 'decision' | 'ai-feedback' | 'recap';
  content: string;
  codeSnippet?: string;
  warningNotice?: string;
  keyTakeaways?: string[];
}

export interface ModuleItem {
  id: string;
  pathId: string;
  title: string;
  moduleNumber: number;
  totalSteps: number;
  currentStep: number;
  progress: number; // 0-100
  isCompleted: boolean;
  estimatedMinutes: number;
  summary: string;
  objectives: string[];
  sections: ModuleSection[];
  linkedScenarioId?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CategoryGroup;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  moduleCount: number;
  progress: number; // 0-100
  modules: ModuleItem[];
  highlight?: boolean;
}

export interface ScenarioOption {
  id: string;
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
  isOptimal: boolean;
  riskLevel: 'Low' | 'Moderate' | 'Critical';
  feedback: {
    decisionQuality: 'Good' | 'Fair' | 'Poor' | 'Dangerous';
    summary: string;
    whyItMatters: string;
    whatYouDidWell: string;
    watchOutFor: string;
    nextStepRecommendation: string;
  };
  scoreImpacts: {
    riskAwareness: number;
    skillCategory: string;
    skillCategoryDelta: number;
    trustScoreDelta: number;
    xpDelta: number;
  };
}

export interface ScenarioItem {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  scaffoldLevel?: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  context: string;
  threatActor?: string;
  environmentType: 'email' | 'sms' | 'browser' | 'system_alert' | 'social_media';
  simulatedArtifact: {
    sender?: string;
    senderAddress?: string;
    subject?: string;
    timestamp?: string;
    body: string;
    attachedFile?: string;
    targetUrl?: string;
    alertDetails?: Record<string, string>;
  };
  prompt: string;
  options: ScenarioOption[];
  tags: string[];
  hint?: string;
  educationalTakeaway?: string;
  toolReveals?: {
    checkSender?: string;
    checkLink?: string;
    clue?: string;
  };
}

export interface MissionHistoryItem {
  missionId: string;
  category: string;
  difficulty: DifficultyLevel;
  scaffoldLevel: 1 | 2 | 3 | 4 | 5;
  outcome: 'correct' | 'partial' | 'incorrect';
  hintsUsed: number;
  completedAt: string;
}

export interface SkillCheckQuestion {
  id: number;
  title: string;
  category: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    trustScoreWeight: number; // 0 to 100 contribution
    isRecommended: boolean;
    feedbackTag: string;
  }[];
}

export interface SkillCheckResult {
  completedAt: string;
  digitalTrustScore: number;
  strengths: string[];
  needsImprovement: string[];
  recommendedPathId: string;
  recommendedPathTitle: string;
  categoryScores: Record<string, number>;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  category: 'Fundamentals' | 'Detection' | 'Consistency' | 'Elite';
  unlocked: boolean;
  unlockedDate?: string;
  iconName: string;
  xpValue: number;
}

export interface CertificateItem {
  id: string;
  title: string;
  credentialId: string;
  issuedDate: string;
  recipientName: string;
  institution: string;
  skillsVerified: string[];
  trustScoreAtIssue: number;
  verifiedStatus: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  studentIdMasked: string;
  cohort: string;
  avatar: string;
  level: number;
  trustScore: number;
  xp: number;
  isCurrentUser: boolean;
  badgeCount: number;
}

export interface MentorInsight {
  observation: string;
  weakSpot: string;
  recommendationTitle: string;
  recommendationPathId: string;
  recommendationModuleId?: string;
  timestamp: string;
}

export type ActivePage =
  | 'landing'
  | 'auth'
  | 'skill-check'
  | 'dashboard'
  | 'learning-paths'
  | 'module-detail'
  | 'interactive-scenario'
  | 'ai-feedback'
  | 'progress-analytics'
  | 'badges'
  | 'leaderboard'
  | 'profile'
  | 'multiplayer'
  | 'settings';

export * from './multiplayer';
