import React, { useState } from 'react';
import { UserProfile, AudienceType } from '../../types';
import {
  DEFAULT_AGE_BOUNDARY,
  getAudienceType,
  validateAge,
  getAudienceLabel,
} from '../../utils/audienceConstants';
import { ByteMascot } from './ByteMascot';
import { Sparkles, Shield, Compass, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AgeSelectionModalProps {
  isOpen: boolean;
  user: UserProfile;
  onSaveAge: (age: number, audienceType: AudienceType) => void;
  onClose?: () => void;
  isMandatory?: boolean; // if true, user cannot dismiss without setting age
}

export const AgeSelectionModal: React.FC<AgeSelectionModalProps> = ({
  isOpen,
  user,
  onSaveAge,
  onClose,
  isMandatory = true,
}) => {
  const [ageInput, setAgeInput] = useState<string>(
    user.age !== undefined && user.age !== null ? String(user.age) : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Live preview based on current input
  const validationResult = validateAge(ageInput);
  const previewAudience: AudienceType | null = validationResult.valid && validationResult.age !== undefined
    ? getAudienceType(validationResult.age, DEFAULT_AGE_BOUNDARY)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = validateAge(ageInput);
    if (!result.valid || result.age === undefined) {
      setError(result.error || 'Please enter a valid age.');
      return;
    }

    setIsSubmitting(true);
    const audienceType = getAudienceType(result.age, DEFAULT_AGE_BOUNDARY);
    onSaveAge(result.age, audienceType);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-[#0c0c0e] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 relative text-zinc-900 dark:text-zinc-100 font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-selection-title"
      >
        {/* Top Header & Mascot */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-white shadow-2xs">
              <ByteMascot mood="happy" size="md" animate={false} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Cyber Experience</span>
            </div>
            <h2
              id="age-selection-title"
              className="text-2xl font-semibold -tracking-[0.03em] text-zinc-900 dark:text-zinc-100"
            >
              How old are you?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Byte adapts your cyber missions, quizzes, and mentor explanations to be just right for your age.
            </p>
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Age Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user-age-input"
              className="block text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
            >
              Your Age (Whole Number)
            </label>
            <div className="relative">
              <input
                id="user-age-input"
                type="number"
                min="4"
                max="120"
                step="1"
                required
                autoFocus
                value={ageInput}
                onChange={(e) => {
                  setAgeInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. 12 or 24"
                className="w-full px-4 py-3 text-lg font-semibold bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:bg-white dark:focus:bg-zinc-900 transition-colors"
              />
              <span className="absolute right-4 top-3.5 text-xs font-mono text-zinc-400">
                years old
              </span>
            </div>
          </div>

          {/* Dynamic Experience Preview Badge */}
          {previewAudience && (
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                previewAudience === 'kids'
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                  : 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/40 text-blue-900 dark:text-blue-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {previewAudience === 'kids' ? (
                    <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>Selected: {getAudienceLabel(previewAudience)}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed font-sans">
                    {previewAudience === 'kids'
                      ? 'Encouraging, school & gaming scenarios with reminders to ask a trusted adult.'
                      : 'Practical scenarios on phishing, workplace safety, account defense, and identity protection.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Age Boundary Tip */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Kids: Ages 12 & below</span>
            <span className="font-mono text-zinc-400">•</span>
            <span>Adults: Ages 13 & above</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-98 cursor-pointer"
            >
              <span>{isSubmitting ? 'Saving...' : 'Continue to CyberMentor'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {!isMandatory && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
