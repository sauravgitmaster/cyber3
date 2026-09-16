import { useState, useEffect, useCallback } from 'react';
import {
  ActivePage,
  UserProfile,
  SkillCategoryScore,
  LearningPath,
  ScenarioItem,
  BadgeItem,
  CertificateItem,
  LeaderboardUser,
  MentorInsight,
  SkillCheckResult,
  ScenarioOption,
  MissionHistoryItem,
} from '../types';
import {
  initialUserProfile,
  initialSkillScores,
  learningPathsData,
  initialBadges,
  initialCertificates,
  initialLeaderboard,
  defaultMentorInsight,
} from '../data/mockData';
import { allMissions } from '../data/missionsData';
import { getNextMission } from '../utils/adaptiveEngine';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'cybermentor_state_v2';

interface StoredState {
  user: UserProfile;
  skills: SkillCategoryScore[];
  paths: LearningPath[];
  badges: BadgeItem[];
  certificates: CertificateItem[];
  mentorInsight: MentorInsight;
  lastSkillCheck?: SkillCheckResult;
  completedScenarioIds: string[];
  missionHistory?: MissionHistoryItem[];
}

export function useCyberState() {
  const [currentPage, setCurrentPage] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as ActivePage;
      if (pageParam) {
        return pageParam;
      }
    }
    return 'landing';
  });
  const [selectedPathId, setSelectedPathId] = useState<string>('cyber-safety-fundamentals');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-phishing-social');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(() => {
    return allMissions[0]?.id || 'mission-free-robux';
  });
  const [lastScenarioDecision, setLastScenarioDecision] = useState<{
    scenario: ScenarioItem;
    option: ScenarioOption;
    previousScore: number;
    newScore: number;
    hintsUsed?: number;
  } | null>(null);

  const [isMentorDrawerOpen, setIsMentorDrawerOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<CertificateItem | null>(null);

  // Core persistent state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.user && typeof parsed.user === 'object') {
          return {
            ...initialUserProfile,
            ...parsed.user,
            avatar: parsed.user.avatar || initialUserProfile.avatar,
          };
        }
      }
    } catch {
      // ignore
    }
    return initialUserProfile;
  });

  const [skills, setSkills] = useState<SkillCategoryScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.skills) return parsed.skills;
      }
    } catch {
      // ignore
    }
    return initialSkillScores;
  });

  const [paths, setPaths] = useState<LearningPath[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.paths) return parsed.paths;
      }
    } catch {
      // ignore
    }
    return learningPathsData;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.badges) return parsed.badges;
      }
    } catch {
      // ignore
    }
    return initialBadges;
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.certificates) return parsed.certificates;
      }
    } catch {
      // ignore
    }
    return initialCertificates;
  });

  const [mentorInsight, setMentorInsight] = useState<MentorInsight>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.mentorInsight) return parsed.mentorInsight;
      }
    } catch {
      // ignore
    }
    return defaultMentorInsight;
  });

  const [lastSkillCheck, setLastSkillCheck] = useState<SkillCheckResult | undefined>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        return parsed.lastSkillCheck;
      }
    } catch {
      // ignore
    }
    return undefined;
  });

  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.completedScenarioIds) return parsed.completedScenarioIds;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Adaptive Mission History
  const [missionHistory, setMissionHistory] = useState<MissionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (Array.isArray(parsed.missionHistory)) {
          return parsed.missionHistory;
        }
        // Safe migration from existing completedScenarioIds
        if (Array.isArray(parsed.completedScenarioIds) && parsed.completedScenarioIds.length > 0) {
          return parsed.completedScenarioIds.map((id) => ({
            missionId: id,
            category: 'Scam & Phishing',
            difficulty: 'Beginner' as const,
            scaffoldLevel: 1 as const,
            outcome: 'correct' as const,
            hintsUsed: 0,
            completedAt: new Date().toISOString(),
          }));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      const dataToStore: StoredState = {
        user,
        skills,
        paths,
        badges,
        certificates,
        mentorInsight,
        lastSkillCheck,
        completedScenarioIds,
        missionHistory,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (e) {
      console.error('Failed to sync CyberMentor state:', e);
    }
  }, [user, skills, paths, badges, certificates, mentorInsight, lastSkillCheck, completedScenarioIds, missionHistory]);

  // Request next adaptive mission
  const requestNextMission = useCallback(() => {
    const nextMission = getNextMission(user, allMissions, missionHistory, skills, selectedScenarioId);
    setSelectedScenarioId(nextMission.id);
    return nextMission;
  }, [user, missionHistory, skills, selectedScenarioId]);

  // Execute scenario decision with child-friendly non-punishing score
  const submitScenarioDecision = useCallback((scenario: ScenarioItem, option: ScenarioOption, hintsUsed: number = 0) => {
    const previousScore = user.digitalTrustScore;

    // PART 11: Non-punishing scoring
    // Optimal = +8, Partial/Fair = +2, Incorrect = +0 (Never drops visible score!)
    let scoreGain = 0;
    let outcome: 'correct' | 'partial' | 'incorrect' = 'incorrect';

    if (option.isOptimal) {
      scoreGain = 8;
      outcome = 'correct';
    } else if (option.feedback.decisionQuality === 'Fair' || option.riskLevel === 'Moderate') {
      scoreGain = 2;
      outcome = 'partial';
    } else {
      scoreGain = 0;
      outcome = 'incorrect';
    }

    const newTrustScore = Math.min(100, previousScore + scoreGain);
    const xpGain = option.scoreImpacts.xpDelta > 0 ? option.scoreImpacts.xpDelta : (option.isOptimal ? 60 : 25);
    const newXP = user.currentXP + xpGain;

    let newLevel = user.level;
    let nextXP = user.nextLevelXP;
    if (newXP >= user.nextLevelXP) {
      newLevel += 1;
      nextXP += 500;
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    }

    // Update user
    setUser((prev) => ({
      ...prev,
      digitalTrustScore: newTrustScore,
      trustScoreDelta: prev.trustScoreDelta + (scoreGain > 0 ? 1 : 0),
      currentXP: newXP,
      level: newLevel,
      nextLevelXP: nextXP,
      scenariosCompletedCount: prev.scenariosCompletedCount + 1,
    }));

    // Record in mission history
    const historyItem: MissionHistoryItem = {
      missionId: scenario.id,
      category: scenario.category,
      difficulty: scenario.difficulty,
      scaffoldLevel: scenario.scaffoldLevel || 1,
      outcome,
      hintsUsed,
      completedAt: new Date().toISOString(),
    };

    setMissionHistory((prev) => [...prev, historyItem]);
    setCompletedScenarioIds((prev) => Array.from(new Set([...prev, scenario.id])));

    // Update skill category score
    setSkills((prev) =>
      prev.map((s) => {
        const matches =
          s.name.toLowerCase().includes(scenario.category.toLowerCase()) ||
          scenario.category.toLowerCase().includes(s.name.toLowerCase());
        if (matches) {
          const delta = option.isOptimal ? 10 : (outcome === 'partial' ? 3 : 0);
          return {
            ...s,
            score: Math.min(100, s.score + delta),
            change: s.change + delta,
          };
        }
        return s;
      })
    );

    // Badges unlock check
    if (option.isOptimal) {
      setBadges((prev) =>
        prev.map((b) => {
          if (b.id === 'safe-decision-maker' && !b.unlocked) {
            return { ...b, unlocked: true, unlockedDate: 'Today' };
          }
          if (b.id === 'first-steps' && !b.unlocked) {
            return { ...b, unlocked: true, unlockedDate: 'Today' };
          }
          return b;
        })
      );
    }

    setLastScenarioDecision({
      scenario,
      option,
      previousScore,
      newScore: newTrustScore,
      hintsUsed,
    });

    // Navigate to AI feedback page
    setCurrentPage('ai-feedback');
  }, [user]);

  // Complete Skill Assessment
  const completeSkillCheck = useCallback((result: SkillCheckResult) => {
    setLastSkillCheck(result);
    setUser(prev => ({
      ...prev,
      digitalTrustScore: result.digitalTrustScore,
      trustScoreDelta: 6,
    }));

    // Unlock First Steps badge
    setBadges(prev =>
      prev.map(b => (b.id === 'first-steps' ? { ...b, unlocked: true, unlockedDate: 'Today' } : b))
    );

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }, []);

  // Complete a module step / advance progress
  const updateModuleProgress = useCallback((pathId: string, moduleId: string, progressDelta: number) => {
    setPaths(prev =>
      prev.map(path => {
        if (path.id !== pathId) return path;

        const updatedModules = path.modules.map(mod => {
          if (mod.id !== moduleId) return mod;
          const nextProgress = Math.min(100, Math.max(0, mod.progress + progressDelta));
          const completed = nextProgress >= 100;
          return {
            ...mod,
            progress: nextProgress,
            isCompleted: completed,
          };
        });

        // calculate overall path progress
        const totalModProgress = updatedModules.reduce((acc, m) => acc + m.progress, 0);
        const overallPathProgress = updatedModules.length > 0 ? Math.round(totalModProgress / updatedModules.length) : path.progress;

        return {
          ...path,
          progress: overallPathProgress,
          modules: updatedModules,
        };
      })
    );

    setUser(prev => ({
      ...prev,
      currentXP: prev.currentXP + 35,
    }));
  }, []);

  // Reset to default mock data
  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(initialUserProfile);
    setSkills(initialSkillScores);
    setPaths(learningPathsData);
    setBadges(initialBadges);
    setCertificates(initialCertificates);
    setMentorInsight(defaultMentorInsight);
    setLastSkillCheck(undefined);
    setCompletedScenarioIds([]);
    setMissionHistory([]);
    setCurrentPage('dashboard');
  }, []);

  const navigateTo = useCallback((page: ActivePage, params?: { pathId?: string; moduleId?: string; scenarioId?: string }) => {
    if (params?.pathId) setSelectedPathId(params.pathId);
    if (params?.moduleId) setSelectedModuleId(params.moduleId);
    if (params?.scenarioId) setSelectedScenarioId(params.scenarioId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentPage,
    setCurrentPage,
    navigateTo,
    user,
    setUser,
    skills,
    paths,
    badges,
    certificates,
    mentorInsight,
    setMentorInsight,
    lastSkillCheck,
    completedScenarioIds,
    missionHistory,
    requestNextMission,
    selectedPathId,
    setSelectedPathId,
    selectedModuleId,
    setSelectedModuleId,
    selectedScenarioId,
    setSelectedScenarioId,
    lastScenarioDecision,
    submitScenarioDecision,
    completeSkillCheck,
    updateModuleProgress,
    resetAllData,
    isMentorDrawerOpen,
    setIsMentorDrawerOpen,
    isCertificateModalOpen,
    setIsCertificateModalOpen,
    activeCertificate,
    setActiveCertificate,
    leaderboard: initialLeaderboard.map(u => 
      u.isCurrentUser 
        ? { ...u, trustScore: user.digitalTrustScore, xp: user.currentXP, level: user.level } 
        : u
    ),
    scenarios: allMissions,
    allMissions,
  };
}
