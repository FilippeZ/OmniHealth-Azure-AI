import React, { useState, useEffect } from 'react';
import { Search, Bell, Wifi, Clock } from 'lucide-react';

export default function Navbar({ searchTerm, setSearchTerm, sidebarCollapsed, systemStatus }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const dateStr = currentTime.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const leftOffset = sidebarCollapsed ? 'left-20' : 'left-64';

  return (
    <header
      className={`fixed top-0 ${leftOffset} right-0 h-16 glass-nav z-40 flex items-center justify-between px-6 transition-all duration-300`}
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: 'var(--text-faint)' }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient ID, name, or record type..."
            className="clinical-input pl-9 pr-4"
            style={{ maxWidth: '380px' }}
            id="patient-search"
          />
        </div>

        {/* Live Status Pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <div className="live-dot" />
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ fontFamily: "'JetBrains Mono'", color: '#34d399' }}
          >
            AZURE MAF OPERATIONAL
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Live Clock */}
        <div className="text-right">
          <div
            className="text-xs font-bold tabular-nums"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
          >
            {timeStr}
          </div>
          <div
            className="text-[9px] uppercase tracking-wider"
            style={{ color: 'var(--text-faint)', fontFamily: "'JetBrains Mono'" }}
          >
            {dateStr}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px" style={{ background: 'var(--border)' }} />

        {/* Network status */}
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" style={{ color: 'var(--accent-emerald)' }} />
          <span
            className="text-[10px] font-bold"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
          >
            {systemStatus?.response_latency_ms || 142}ms
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.25)',
          }}
          id="notifications-btn"
        >
          <Bell className="w-3.5 h-3.5" style={{ color: '#fb7185' }} />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background: '#f43f5e', color: '#fff', fontFamily: "'JetBrains Mono'" }}
          >
            {systemStatus?.critical_events || 3}
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px" style={{ background: 'var(--border)' }} />

        {/* Physician Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div
              className="text-[11px] font-bold"
              style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
            >
              DR. ARIS NIKOLAIDIS
            </div>
            <div
              className="text-[9px] uppercase tracking-wider"
              style={{ fontFamily: "'JetBrains Mono'", color: 'var(--accent-cyan)' }}
            >
              LEAD CLINICAL DIAGNOSTICIAN
            </div>
          </div>
          <div className="avatar-ring w-10 h-10" style={{ flexShrink: 0 }}>
            <div className="avatar-inner">AN</div>
          </div>
        </div>
      </div>
    </header>
  );
}
