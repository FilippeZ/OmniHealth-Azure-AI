import React, { useState } from 'react';
import { ShieldCheck, User, Key, CheckCircle2, X, Lock, Stethoscope, Building2 } from 'lucide-react';

export default function DoctorLoginModal({ isOpen, onClose, doctor, onLogin }) {
  const [docName, setDocName] = useState(doctor?.name || 'DR. ARIS NIKOLAIDIS');
  const [docRole, setDocRole] = useState(doctor?.role || 'LEAD CLINICAL DIAGNOSTICIAN');
  const [licenseId, setLicenseId] = useState(doctor?.licenseId || 'GR-MDR-99823');
  const [institution, setInstitution] = useState(doctor?.institution || 'OmniHealth Azure AI Hub');
  const [password, setPassword] = useState('••••••••••••');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onLogin({
        name: docName,
        role: docRole,
        licenseId,
        institution,
        authenticated: true,
      });
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4">
      <div
        className="w-full max-w-lg rounded-2xl p-6 border shadow-2xl relative overflow-hidden animate-slide-in-up"
        style={{
          background: 'linear-gradient(135deg, #070A13 0%, #0c162c 100%)',
          borderColor: 'rgba(56,189,248,0.3)',
          boxShadow: '0 0 50px rgba(6,182,212,0.2)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                PHYSICIAN AUTHENTICATION PORTAL
              </h2>
              <span className="text-[10px] font-mono text-cyan-400/80 block">
                EU AI ACT ARTICLE 14 AUTHORIZED ACCESS
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Doctor Status Badge */}
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              ACTIVE PHYSICIAN SESSION
            </span>
          </div>
          <span className="badge badge-emerald font-mono">MDR CLASS IIa</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
              PHYSICIAN FULL NAME
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                required
                className="clinical-input pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                CLINICAL TITLE / ROLE
              </label>
              <input
                type="text"
                value={docRole}
                onChange={(e) => setDocRole(e.target.value)}
                required
                className="clinical-input"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                MEDICAL LICENSE ID
              </label>
              <input
                type="text"
                value={licenseId}
                onChange={(e) => setLicenseId(e.target.value)}
                required
                className="clinical-input font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
              HEALTHCARE INSTITUTION
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
                className="clinical-input pl-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
              CREDENTIAL SECURITY PIN / PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="clinical-input pl-9"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold uppercase transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)]"
              style={{ background: 'linear-gradient(135deg, #00F2FE 0%, #0099FF 100%)', border: 'none', color: '#000' }}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  AUTHENTICATED · UPDATING PHYSICIAN PROFILE...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-black" />
                  AUTHENTICATE PHYSICIAN CREDENTIALS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
