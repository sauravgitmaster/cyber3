import React, { useState, useRef } from 'react';
import { Camera, Trash2, Check, Sparkles, AlertCircle, Upload, Bot, Shield, Zap, Star, Award, Compass, User } from 'lucide-react';

interface AvatarUploaderProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const PRESET_AVATARS = [
  'bot',
  'shield',
  'zap',
  'star',
  'user',
  'award',
  'compass',
  'sparkles',
];

const renderAvatarIcon = (type: string, className?: string) => {
  switch (type) {
    case 'shield':
      return <Shield className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
    case 'zap':
      return <Zap className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
    case 'star':
      return <Star className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
    case 'award':
      return <Award className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
    case 'compass':
      return <Compass className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
    case 'sparkles':
      return <Sparkles className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
    case 'user':
      return <User className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
    default:
      return <Bot className={className || 'w-1/2 h-1/2 text-zinc-700 dark:text-zinc-300'} />;
  }
};

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md',
}) => {
  const [preview, setPreview] = useState<string>(currentAvatar || 'bot');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCustomImage = preview.startsWith('data:image/') || preview.startsWith('http');

  const sizeClasses = {
    sm: 'w-14 h-14 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  }[size];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, or WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be smaller than 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onAvatarChange(result);
      setIsEditing(false);
    };
    reader.onerror = () => {
      setError('Failed to read image.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const fallback = 'bot';
    setPreview(fallback);
    onAvatarChange(fallback);
    setError(null);
  };

  const handleSelectPreset = (key: string) => {
    setPreview(key);
    onAvatarChange(key);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Display */}
      <div className="relative group">
        <div
          className={`${sizeClasses} rounded-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 shadow-xs select-none transition-transform group-hover:scale-102`}
        >
          {isCustomImage ? (
            <img
              src={preview}
              alt="Learner Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            renderAvatarIcon(preview)
          )}
        </div>

        {/* Quick Edit Overlay Button */}
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm transition-all active:scale-90 cursor-pointer"
          title="Change Photo or Avatar"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Expanded Avatar Selector Popover */}
      {isEditing && (
        <div className="w-full max-w-xs p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-3 z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Choose Your Avatar</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-medium cursor-pointer"
            >
              Done
            </button>
          </div>

          {/* Preset Icons */}
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AVATARS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  preview === key
                    ? 'bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 scale-105'
                    : 'bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {renderAvatarIcon(key, 'w-5 h-5 text-zinc-700 dark:text-zinc-300')}
              </button>
            ))}
          </div>

          {/* Action Buttons: Upload or Remove */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            {isCustomImage && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
