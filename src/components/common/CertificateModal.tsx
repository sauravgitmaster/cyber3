import React, { useState } from 'react';
import { CertificateItem } from '../../types';
import { X, ShieldCheck, Printer, CheckCircle, ExternalLink, Award, Sparkles } from 'lucide-react';
import { ByteMascot } from './ByteMascot';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#080808] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Official Cyber Certificate
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-black">
          {/* Certificate Frame */}
          <div className="p-6 sm:p-8 border border-zinc-300 dark:border-zinc-700 rounded-2xl bg-white dark:bg-[#0c0c0c] shadow-md relative text-center space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ByteMascot mood="happy" size="xs" animate={false} />
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  CYBERMENTOR AI
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>OFFICIALLY VERIFIED</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-widest block">
                CERTIFICATE OF ACHIEVEMENT
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100">
                {certificate.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                Conferred for demonstrating excellent decision-making and digital safety awareness.
              </p>
            </div>

            {/* Recipient Ribbon */}
            <div className="my-4 py-3 border-y border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-0.5">
                PROUDLY PRESENTED TO
              </span>
              <div className="text-2xl sm:text-3xl font-semibold -tracking-[0.02em] text-zinc-900 dark:text-zinc-100">
                {certificate.recipientName}
              </div>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-1 block">
                Cyber Smart Score: {certificate.trustScoreAtIssue}/100 pts
              </span>
            </div>

            {/* Skills Badges */}
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide block mb-2">
                Demonstrated Skills
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {certificate.skillsVerified.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-mono rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="flex items-end justify-between pt-4 border-t border-zinc-100 dark:border-zinc-855 text-xs text-zinc-500">
              <div className="text-left">
                <span className="block text-[10px] uppercase font-mono text-zinc-400">Credential ID</span>
                <span className="font-mono text-zinc-900 dark:text-zinc-100 text-xs">{certificate.credentialId}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase font-mono text-zinc-400">Awarded On</span>
                <span className="font-mono text-zinc-900 dark:text-zinc-100 text-xs">{certificate.issuedDate}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-mono text-zinc-400">Mentor Seal</span>
                <span className="font-mono text-emerald-500 text-xs">Byte Approved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-850 text-xs gap-3">
          <span className="text-zinc-500 font-mono text-[11px]">
            ID: {certificate.credentialId}
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-mono text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
