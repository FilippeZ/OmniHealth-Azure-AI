import React from 'react';
import {
  LayoutDashboard, Upload, Activity, History,
  ShieldCheck, ChevronLeft, ChevronRight, HeartPulse, Radio
} from 'lucide-react';

const navItems = [
  {
    id: 'dashboard',
    label: 'CLINICAL DASHBOARD',
    sub: 'Overview & Intake Panel',
    icon: LayoutDashboard,
    accent: '#3b82f6',
  },
  {
    id: 'hitl',
    label: 'SUPERVISORY HITL',
    sub: 'EU AI Act Art. 14 Gate',
    icon: ShieldCheck,
    accent: '#f59e0b',
  },
  {
    id: 'patient-history',
    label: 'PATIENT EHR CHARTS',
    sub: 'UMLS Graph & 3D HUD',
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
      {/* Floating Border Edge Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-5 z-50 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-115 shadow-xl cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(56,189,248,0.5)',
          boxShadow: '0 0 15px rgba(6,182,212,0.35)',
        }}
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        id="sidebar-edge-toggle"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      {/* Brand */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="h-14 flex items-center px-4 gap-3 border-b cursor-pointer transition-all hover:bg-white/5"
        style={{ borderColor: 'var(--border)' }}
        title={collapsed ? 'Click to expand sidebar' : 'Click to collapse sidebar'}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 border"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(6,182,212,0.2) 100%)',
            borderColor: 'rgba(56,189,248,0.4)',
            boxShadow: '0 0 20px rgba(6,182,212,0.3)',
          }}
        >
          <img src="/logo.jpeg" alt="OmniHealth AI Logo" className="w-full h-full object-cover rounded-lg" />
        </div>

        {!collapsed && (
          <div className="overflow-hidden animate-fade-in-right flex-1">
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
      <div
        className="p-3 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        {!collapsed ? (
          <div
            className="rounded-xl p-3 space-y-2 animate-fade-in"
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
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-1 text-[8px] font-mono font-bold">
            <span className="badge badge-emerald px-1.5 py-0.5" title="EU AI ACT CLASS IIa">EU</span>
            <span className="badge badge-blue px-1.5 py-0.5" title="MDR AUDIT ACTIVE">MDR</span>
            <span className="badge badge-cyan px-1.5 py-0.5" title="GDPR ART.9 ENFORCED">GDPR</span>
          </div>
        )}
      </div>

      {/* Bottom Toggle Bar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full py-2.5 px-3 border-t flex items-center justify-center gap-2 transition-all hover:bg-white/5 cursor-pointer text-[10px] font-mono font-bold"
        style={{
          borderColor: 'var(--border)',
          color: 'var(--accent-cyan)',
        }}
        title={collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
        id="sidebar-bottom-toggle"
      >
        {collapsed ? (
          <>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </>
        ) : (
          <>
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>COLLAPSE SIDEBAR</span>
          </>
        )}
      </button>
    </aside>
  );
}
