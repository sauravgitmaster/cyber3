// Learner Level System (0-100)
// Encouraging progression ladder for school-age learners.

export interface LevelInfo {
  levelTitle: string;
  levelBadge: string;
  emoji: string;
  minScore: number;
  maxScore: number;
  nextLevelTitle?: string;
  pointsToNext?: number;
}

export function getLearnerLevel(score: number): LevelInfo {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  if (safeScore >= 80) {
    return {
      levelTitle: 'Cyber Hero',
      levelBadge: 'Cyber Hero',
      emoji: '',
      minScore: 80,
      maxScore: 100,
    };
  }

  if (safeScore >= 60) {
    return {
      levelTitle: 'Cyber Scout',
      levelBadge: 'Cyber Scout',
      emoji: '',
      minScore: 60,
      maxScore: 79,
      nextLevelTitle: 'Cyber Hero',
      pointsToNext: 80 - safeScore,
    };
  }

  if (safeScore >= 40) {
    return {
      levelTitle: 'Defender',
      levelBadge: 'Defender',
      emoji: '',
      minScore: 40,
      maxScore: 59,
      nextLevelTitle: 'Cyber Scout',
      pointsToNext: 60 - safeScore,
    };
  }

  if (safeScore >= 20) {
    return {
      levelTitle: 'Explorer',
      levelBadge: 'Explorer',
      emoji: '',
      minScore: 20,
      maxScore: 39,
      nextLevelTitle: 'Defender',
      pointsToNext: 40 - safeScore,
    };
  }

  return {
    levelTitle: 'Rookie',
    levelBadge: 'Rookie',
    emoji: '',
    minScore: 0,
    maxScore: 19,
    nextLevelTitle: 'Explorer',
    pointsToNext: 20 - safeScore,
  };
}
