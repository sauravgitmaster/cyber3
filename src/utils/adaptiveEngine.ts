import { ScenarioItem, UserProfile, SkillCategoryScore, MissionHistoryItem } from '../types';

/**
 * Adaptive Mission Selection Engine
 * 
 * Uses Cyber Smart Score as primary difficulty signal (scaffold levels 1-5).
 * Factors in:
 * - Weakest skill categories
 * - Recent mistakes & successes
 * - Avoiding recently completed missions (last 4-5)
 * - Weighted difficulty distribution: 70% target, 20% reinforcement, 10% stretch
 * - Guarantees an eligible mission is always returned (never undefined)
 */

export function getTargetScaffoldLevels(score: number): number[] {
  if (score < 25) return [1];
  if (score < 45) return [1, 2];
  if (score < 65) return [2, 3];
  if (score < 80) return [3, 4];
  return [4, 5];
}

export function findWeakestCategory(
  skills: SkillCategoryScore[],
  missionHistory: MissionHistoryItem[]
): string | null {
  // 1. Check recent mistakes in history (last 5 missions)
  const recentMistakes = missionHistory.slice(-5).filter(h => h.outcome === 'incorrect');
  if (recentMistakes.length > 0) {
    const counts: Record<string, number> = {};
    recentMistakes.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) return sorted[0][0];
  }

  // 2. Check skill category scores
  if (skills && skills.length > 0) {
    const sortedSkills = [...skills].sort((a, b) => a.score - b.score);
    const lowest = sortedSkills[0];
    if (lowest && lowest.score < 70) {
      return lowest.name;
    }
  }

  return null;
}

export function getNextMission(
  user: UserProfile,
  allMissions: ScenarioItem[],
  missionHistory: MissionHistoryItem[],
  skills: SkillCategoryScore[],
  currentMissionId?: string
): ScenarioItem {
  if (!allMissions || allMissions.length === 0) {
    throw new Error('No missions available in library');
  }

  const score = user.digitalTrustScore ?? 50;
  const targetLevels = getTargetScaffoldLevels(score);
  const weakestCategory = findWeakestCategory(skills, missionHistory);

  // Recently completed IDs (avoid repeating the last 5 completed missions)
  const recentCompletedIds = new Set(
    missionHistory.slice(-5).map(h => h.missionId)
  );
  if (currentMissionId) {
    recentCompletedIds.add(currentMissionId);
  }

  // Determine roll for difficulty tier: 70% target, 20% easier reinforcement, 10% stretch
  const roll = Math.random();
  let desiredLevels = targetLevels;

  if (roll < 0.20) {
    // 20% Reinforcement (easier)
    const minLevel = Math.min(...targetLevels);
    desiredLevels = minLevel > 1 ? [minLevel - 1] : targetLevels;
  } else if (roll > 0.90) {
    // 10% Stretch (harder)
    const maxLevel = Math.max(...targetLevels);
    desiredLevels = maxLevel < 5 ? [maxLevel + 1] : targetLevels;
  }

  // Filter candidate pool
  let candidates = allMissions.filter(m => {
    if (recentCompletedIds.has(m.id)) return false;
    return desiredLevels.includes(m.scaffoldLevel);
  });

  // If no candidates in desired levels, widen to any non-recent mission
  if (candidates.length === 0) {
    candidates = allMissions.filter(m => !recentCompletedIds.has(m.id));
  }

  // If still empty (e.g. learner completed all 30 missions!), exclude only the current mission
  if (candidates.length === 0) {
    candidates = allMissions.filter(m => m.id !== currentMissionId);
  }

  // Absolute fallback
  if (candidates.length === 0) {
    return allMissions[0];
  }

  // Calculate weights for candidates
  const scoredCandidates = candidates.map(mission => {
    let weight = 10;

    // Boost if matching weakest category
    if (weakestCategory && mission.category.toLowerCase().includes(weakestCategory.toLowerCase())) {
      weight += 25;
    }

    // Boost if exact target scaffold level
    if (targetLevels.includes(mission.scaffoldLevel)) {
      weight += 15;
    }

    // Slight boost for unplayed missions
    const timesPlayed = missionHistory.filter(h => h.missionId === mission.id).length;
    if (timesPlayed === 0) {
      weight += 20;
    } else {
      weight -= Math.min(15, timesPlayed * 5);
    }

    return { mission, weight: Math.max(1, weight) };
  });

  // Weighted random pick
  const totalWeight = scoredCandidates.reduce((sum, item) => sum + item.weight, 0);
  let randomPoint = Math.random() * totalWeight;

  for (const item of scoredCandidates) {
    if (randomPoint <= item.weight) {
      return item.mission;
    }
    randomPoint -= item.weight;
  }

  return scoredCandidates[0].mission;
}
