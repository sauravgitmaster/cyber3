import { ScenarioItem, ScenarioOption, SkillCheckQuestion } from '../types';
import { MultiplayerQuestionData } from '../data/multiplayerQuestions';

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Fisher-Yates array shuffle (creates a new shuffled copy)
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles scenario options and re-indexes their display labels (A, B, C, D)
 * while preserving option IDs, optimal status, risk levels, and feedback.
 */
export function shuffleScenarioOptions(options: ScenarioOption[]): ScenarioOption[] {
  const shuffled = shuffleArray(options);
  return shuffled.map((opt, idx) => ({
    ...opt,
    label: LABELS[idx] || String.fromCharCode(65 + idx),
  }));
}

/**
 * Returns a new scenario with shuffled options whose correct/optimal answer
 * is randomized rather than fixed at any specific position.
 */
export function randomizeScenarioOptions(scenario: ScenarioItem): ScenarioItem {
  return {
    ...scenario,
    options: shuffleScenarioOptions(scenario.options),
  };
}

/**
 * Randomizes options for skill check questions while preserving ID-based validation
 * and trustScoreWeights.
 */
export function randomizeSkillCheckQuestion(q: SkillCheckQuestion): SkillCheckQuestion {
  return {
    ...q,
    options: shuffleArray(q.options),
  };
}

/**
 * Server-authoritative multiplayer question option shuffler.
 * Shuffles the options array for a question while retaining correctOptionId.
 */
export function randomizeMultiplayerQuestion(q: MultiplayerQuestionData): MultiplayerQuestionData {
  return {
    ...q,
    options: shuffleArray(q.options),
  };
}
