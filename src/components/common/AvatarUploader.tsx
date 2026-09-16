import React, { useState, useRef } from 'react';
import { Camera, Trash2, Check, Sparkles, AlertCircle, Upload } from 'lucide-react';

interface AvatarUploaderProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const PRESET_AVATARS = [
  '🤖', // Byte Bot
  '🦊', // Cyber Fox
  '🛡️', // Shield Guardian
  '⚡', // Cyber Scout
  '🐱', // Pixel Cat
  '🚀', // Space Cadet
  '🦉', // Wisdom Owl
  '⭐', // Star Cadet
];

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md',
}) => {
  const [preview, setPreview] = useState<string>(currentAvatar);
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
    const fallback = '🤖';
    setPreview(fallback);
    onAvatarChange(fallback);
    setError(null);
  };

  const handleSelectPreset = (emoji: string) => {
    setPreview(emoji);
    onAvatarChange(emoji);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Display */}
      <div className="relative group">
        <div
          className={`${sizeClasses} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-100 border-3 border-[#4F7CFF] shadow-sm select-none transition-transform group-hover:scale-102`}
        >
          {isCustomImage ? (
            <img
              src={preview}
              alt="Learner Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="leading-none">{preview}</span>
          )}
        </div>

        {/* Quick Edit Overlay Button */}
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white shadow-md transition-all active:scale-90"
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
        <div className="w-full max-w-xs p-4 bg-white rounded-2xl border border-slate-200 shadow-lg space-y-3 z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#243047]">Choose Your Avatar</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Done
            </button>
          </div>

          {/* Preset Emojis */}
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AVATARS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelectPreset(emoji)}
                className={`p-2 rounded-xl text-2xl flex items-center justify-center transition-all ${
                  preview === emoji
                    ? 'bg-blue-100 border-2 border-[#4F7CFF] scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Action Buttons: Upload or Remove */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#243047] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            {isCustomImage && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
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
