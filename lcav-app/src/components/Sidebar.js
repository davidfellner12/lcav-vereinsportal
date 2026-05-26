import React, { useState } from 'react';
import {
  LayoutDashboard, Users, MessageSquare, ClipboardList,
  Calendar, Wrench, Trophy, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'gruppen',     label: 'Trainingsgruppen',   icon: Users },
  { id: 'chat',        label: 'Kommunikation',      icon: MessageSquare },
  { id: 'training',    label: 'Trainingsplanung',   icon: ClipboardList },
  { id: 'events',      label: 'Veranstaltungen',    icon: Calendar },
  { id: 'aufgaben',    label: 'Arbeitszuweisungen', icon: Wrench },
  { id: 'wettkampf',   label: 'Wettkampf',          icon: Trophy },
];

export default function Sidebar() {
  const { activePage, setActivePage, currentUser, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) return null;

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, var(--navy-mid) 0%, var(--navy) 100%)',
      borderRight: '1px solid rgba(26,90,171,0.25)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: '1px solid rgba(26,90,171,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-bright) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 14, color: 'white', flexShrink: 0,
          boxShadow: '0 2px 8px rgba(26,90,171,0.5)',
        }}>LC</div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>LCAV</div>
            <div style={{ fontSize: 10, color: 'var(--grey-400)', letterSpacing: '0.05em' }}>JODL PACKAGING</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          return (
            <button key={id} onClick={() => setActivePage(id)} style={{
              display: 'flex', alignItems: 'center',
              gap: 10, padding: collapsed ? '10px 0' : '9px 12px',
              borderRadius: 'var(--radius)',
              border: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: active
                ? 'linear-gradient(90deg, rgba(26,90,171,0.4) 0%, rgba(26,90,171,0.15) 100%)'
                : 'transparent',
              color: active ? 'var(--white)' : 'var(--grey-400)',
              fontSize: 13, fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              borderLeft: active ? '3px solid var(--blue-bright)' : '3px solid transparent',
              transition: 'all 0.15s',
            }}
            title={collapsed ? label : undefined}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--white)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--grey-400)'; }}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '8px', borderTop: '1px solid rgba(26,90,171,0.2)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '8px 0' : '8px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: 'rgba(26,90,171,0.1)', border: '1px solid rgba(26,90,171,0.2)',
          borderRadius: 'var(--radius)', marginBottom: 6,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--blue)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>{currentUser.avatar || currentUser.name?.split(' ').map(n=>n[0]).join('').substring(0,2)}</div>
          {!collapsed && (
            <div style={{ textAlign: 'left', overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
              <div style={{ fontSize: 10, color: 'var(--blue-light)', textTransform: 'capitalize' }}>{currentUser.role}{currentUser.group_name ? ` · ${currentUser.group_name}` : ''}</div>
            </div>
          )}
        </div>

        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: collapsed ? '8px 0' : '7px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: 'transparent', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 'var(--radius)', color: '#f87171', fontSize: 12, cursor: 'pointer',
        }} title={collapsed ? 'Abmelden' : undefined}>
          <LogOut size={14} />
          {!collapsed && 'Abmelden'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} style={{
        position: 'absolute', top: 22, right: -12,
        width: 24, height: 24, borderRadius: '50%',
        background: 'var(--blue)', border: '2px solid var(--navy)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 10,
      }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
