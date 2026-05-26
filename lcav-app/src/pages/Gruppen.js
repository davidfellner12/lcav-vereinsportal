import React, { useState } from 'react';
import { Users, UserPlus, ChevronRight, Activity, Star, Edit2, Check } from 'lucide-react';
import { useApp, GROUPS } from '../context/AppContext';

const GROUP_DATA = {
  U10: { trainer: 'Petra Mayr',        count: 14, schedule: 'Mi 16:00, Sa 10:00', color: '#7c3aed', icon: '🌟' },
  U12: { trainer: 'Maria Bruneder',    count: 22, schedule: 'Di 16:30, Do 16:30, Sa 10:00', color: '#059669', icon: '⚡' },
  U14: { trainer: 'Klaus Hofmann',     count: 18, schedule: 'Mo 17:00, Mi 17:00, Fr 16:30', color: '#1a5aab', icon: '🔥' },
  U16: { trainer: 'Thomas Regl',       count: 20, schedule: 'Mo 17:30, Mi 17:30, Fr 17:00, Sa 9:00', color: '#d97706', icon: '💪' },
  U18: { trainer: 'Sandra Kirchner',   count: 15, schedule: 'Di 18:00, Do 18:00, Sa 9:00', color: '#dc2626', icon: '🏃' },
  U20: { trainer: 'Sandra Kirchner',   count: 8,  schedule: 'Mo 18:30, Do 18:30', color: '#0891b2', icon: '🎯' },
  Aktive: { trainer: 'Sandra Kirchner', count: 45, schedule: 'Mo Di Mi Do Fr 18:30, Sa 9:30', color: '#0f2540', icon: '🏆' },
  Masters: { trainer: 'Werner Huber',  count: 12, schedule: 'Di 09:00, Do 09:00', color: '#6b7280', icon: '🌿' },
};

const MEMBERS_SAMPLE = {
  U16: [
    { name: 'Lena Mayr',      dob: '2010', disciplines: ['100m', '200m', 'Weitsprung'] },
    { name: 'Jonas Kraft',    dob: '2011', disciplines: ['400m', '800m'] },
    { name: 'Anna Berger',    dob: '2010', disciplines: ['Hochsprung', '100m Hürden'] },
    { name: 'Max Steiner',    dob: '2011', disciplines: ['Kugelstoß', '100m'] },
    { name: 'Mia Fuchs',      dob: '2010', disciplines: ['Weitsprung', '200m'] },
  ],
};

export default function Gruppen() {
  const { currentUser } = useApp();
  const [selected, setSelected] = useState(currentUser.group || 'U16');

  const isTrainer = currentUser.role === 'trainer' || currentUser.role === 'vorstand';

  return (
    <div style={{ padding: 28, maxWidth: 1200 }}>
      <PageHeader title="Trainingsgruppen" sub="Altersklassen & Mitgliederverwaltung" icon={Users} />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Group list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GROUPS.map(g => {
            const d = GROUP_DATA[g];
            const active = selected === g;
            return (
              <button key={g} onClick={() => setSelected(g)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 'var(--radius)',
                background: active ? 'linear-gradient(90deg, rgba(26,90,171,0.35), rgba(26,90,171,0.1))' : 'var(--navy-mid)',
                border: `1px solid ${active ? 'rgba(26,90,171,0.5)' : 'rgba(26,90,171,0.15)'}`,
                color: 'var(--white)', cursor: 'pointer', textAlign: 'left',
                borderLeft: active ? '3px solid var(--blue-bright)' : '3px solid transparent',
              }}>
                <span style={{ fontSize: 18 }}>{d.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{g}</div>
                  <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{d.count} Mitglieder · {d.trainer.split(' ')[0]}</div>
                </div>
                {active && <ChevronRight size={14} color="var(--blue-light)" />}
              </button>
            );
          })}
        </div>

        {/* Group detail */}
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header card */}
            <div style={{
              background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.25)',
              borderRadius: 'var(--radius-lg)', padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 32 }}>{GROUP_DATA[selected].icon}</span>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Gruppe {selected}</h2>
                    <p style={{ color: 'var(--grey-400)', fontSize: 13 }}>Trainer: {GROUP_DATA[selected].trainer}</p>
                  </div>
                </div>
                {isTrainer && (
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 'var(--radius)',
                    background: 'var(--blue)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
                  }}>
                    <UserPlus size={14} /> Mitglied hinzufügen
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <InfoBox label="Mitglieder" value={GROUP_DATA[selected].count} icon={Users} />
                <InfoBox label="Training" value={GROUP_DATA[selected].schedule} icon={Activity} small />
                <InfoBox label="Trainer/in" value={GROUP_DATA[selected].trainer} icon={Star} small />
              </div>
            </div>

            {/* Members */}
            <div style={{
              background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={15} color="var(--blue-light)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>Mitglieder</span>
                <span className="tag tag-blue" style={{ marginLeft: 4 }}>{GROUP_DATA[selected].count} gesamt</span>
              </div>

              {(MEMBERS_SAMPLE[selected] || MEMBERS_SAMPLE.U16).map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '11px 18px',
                  borderBottom: i < 4 ? '1px solid rgba(26,90,171,0.08)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {m.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>Jg. {m.dob}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {m.disciplines.map(d => <span key={d} className="tag tag-blue">{d}</span>)}
                  </div>
                  {isTrainer && <Edit2 size={13} color="var(--grey-600)" style={{ cursor: 'pointer' }} />}
                </div>
              ))}
              <div style={{ padding: '10px 18px', textAlign: 'center' }}>
                <button style={{ fontSize: 12, color: 'var(--blue-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Alle {GROUP_DATA[selected].count} Mitglieder anzeigen →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value, icon: Icon, small }) {
  return (
    <div style={{ padding: '10px 14px', background: 'rgba(26,90,171,0.08)', borderRadius: 8, border: '1px solid rgba(26,90,171,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
        <Icon size={12} color="var(--blue-light)" />
        <span style={{ fontSize: 10, color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: small ? 12 : 22, fontWeight: small ? 500 : 800, fontFamily: small ? 'var(--font-body)' : 'var(--font-display)' }}>{value}</div>
    </div>
  );
}

function PageHeader({ title, sub, icon: Icon }) {
  return (
    <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color="var(--blue-light)" />
      </div>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>{title}</h1>
        <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>{sub}</p>
      </div>
    </div>
  );
}
