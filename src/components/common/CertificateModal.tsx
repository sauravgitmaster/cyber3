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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden text-[#243047]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#8B6CFF]" />
            <span className="text-sm font-black text-[#243047]">
              Official Cyber Certificate
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50/40 via-white to-blue-50/40">
          {/* Certificate Gold Frame */}
          <div className="p-6 sm:p-8 border-4 border-amber-300 rounded-2xl bg-white shadow-md relative text-center space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ByteMascot mood="happy" size="xs" />
                <span className="text-xs font-black text-[#4F7CFF] uppercase tracking-wider">
                  CYBERMENTOR AI
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>OFFICIALLY VERIFIED</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest block">
                CERTIFICATE OF ACHIEVEMENT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#243047]">
                {certificate.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Conferred for demonstrating excellent decision-making and digital safety awareness.
              </p>
            </div>

            {/* Recipient Ribbon */}
            <div className="my-4 py-3 border-y-2 border-dashed border-amber-200/80 bg-amber-50/40 rounded-xl">
              <span className="text-[10px] font-black text-slate-500 uppercase block mb-0.5">
                PROUDLY PRESENTED TO
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#4F7CFF]">
                {certificate.recipientName}
              </div>
              <span className="text-xs font-extrabold text-amber-900 mt-1 block">
                Cyber Smart Score: {certificate.trustScoreAtIssue}/100 ⭐
              </span>
            </div>

            {/* Skills Badges */}
            <div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide block mb-2">
                Demonstrated Skills
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {certificate.skillsVerified.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 border border-blue-200 text-[#4F7CFF]"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="flex items-end justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Credential ID</span>
                <span className="font-mono font-bold text-[#243047]">{certificate.credentialId}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Awarded On</span>
                <span className="font-bold text-[#243047]">{certificate.issuedDate}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Mentor Seal</span>
                <span className="font-bold text-emerald-600">Byte Approved ★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs gap-3">
          <span className="text-slate-500 font-medium">
            Certificate ID: {certificate.credentialId}
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black transition-colors shadow-2xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{copied ? 'Link Copied! ✓' : 'Copy Share Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
