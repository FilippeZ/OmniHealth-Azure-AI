import React from 'react';
import {
  LayoutDashboard, Upload, Activity, History,
  ShieldCheck, ChevronLeft, ChevronRight, HeartPulse
} from 'lucide-react';

const navItems = [
  {
    id: 'dashboard',
    label: 'CLINICAL DASHBOARD',
    sub: 'Overview & Active Metrics',
    icon: LayoutDashboard,
    accent: '#3b82f6',
  },
  {
    id: 'upload',
    label: 'DIAGNOSTIC UPLOAD',
    sub: 'OCR Intake & Presets',
    icon: Upload,
    accent: '#a855f7',
  },
  {
    id: 'hitl',
    label: 'SUPERVISORY HITL',
    sub: 'Physician Review & Approval',
    icon: ShieldCheck,
    accent: '#f59e0b',
  },
  {
    id: 'patient-history',
    label: 'PATIENT HISTORY',
    sub: 'UMLS & Education Graph',
    icon: History,
    accent: '#10b981',
  },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 flex flex-col sidebar-glass transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div
        className="h-16 flex items-center px-4 gap-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            boxShadow: '0 0 20px rgba(59,130,246,0.4)',
          }}
        >
          <HeartPulse className="w-5 h-5 text-white" />
        </div>

        {!collapsed && (
          <div className="overflow-hidden animate-fade-in-right">
            <h1
              className="font-bold text-sm tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              OmniHealth AI
            </h1>
            <p
              className="text-[9px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--accent-cyan)', fontFamily: "'JetBrains Mono'" }}
            >
              AZURE MAF CLINICAL
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item animate-fade-in ${isActive ? 'active' : ''}`}
              style={{
                animationDelay: `${i * 60}ms`,
                ...(isActive
                  ? {
                      background: `rgba(${
                        item.accent === '#3b82f6' ? '59,130,246' :
                        item.accent === '#a855f7' ? '168,85,247' :
                        item.accent === '#06b6d4' ? '6,182,212' :
                        item.accent === '#f59e0b' ? '245,158,11' : '16,185,129'
                      }, 0.1)`,
                      borderColor: `${item.accent}55`,
                    }
                  : {}),
              }}
              title={collapsed ? item.label : ''}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: isActive
                    ? `${item.accent}20`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? item.accent + '40' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <Icon
                  className="w-4 h-4 transition-colors"
                  style={{ color: isActive ? item.accent : 'var(--text-muted)' }}
                />
              </div>

              {!collapsed && (
                <div className="flex flex-col min-w-0 flex-1 animate-fade-in">
                  <span
                    className="text-[10px] font-bold tracking-wider truncate"
                    style={{
                      fontFamily: "'JetBrains Mono'",
                      color: isActive ? item.accent : 'var(--text-primary)',
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[10px] truncate"
                    style={{ color: 'var(--text-faint)' }}
                  >
                    {item.sub}
                  </span>
                </div>
              )}

              {!collapsed && isActive && (
                <ChevronRight
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: item.accent }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Compliance Footer */}
      {!collapsed && (
        <div
          className="p-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="rounded-xl p-3 space-y-2"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)' }}
          >
            <div className="compliance-pill">
              <span style={{ color: 'var(--text-muted)' }}>EU AI ACT</span>
              <span className="badge badge-emerald">CLASS IIa</span>
            </div>
            <div className="compliance-pill">
              <span style={{ color: 'var(--text-muted)' }}>MDR AUDIT</span>
              <span className="badge badge-blue">ACTIVE</span>
            </div>
            <div className="compliance-pill">
              <span style={{ color: 'var(--text-muted)' }}>GDPR ART.9</span>
              <span className="badge badge-cyan">ENFORCED</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-auto mb-4 w-7 h-7 rounded-full flex items-center justify-center btn-ghost border-0 transition-all hover:scale-110"
        style={{
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.25)',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
        )}
      </button>
    </aside>
  );
}
