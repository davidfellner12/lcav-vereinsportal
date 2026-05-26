import React from 'react';
import { Users, Calendar, MessageSquare, ClipboardList, TrendingUp, Bell, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STATS = [
  { label: 'Mitglieder',     value: '287', sub: '+12 dieses Jahr',  icon: Users,         color: 'var(--blue)'   },
  { label: 'Trainingsgruppen', value: '8', sub: 'aktive Gruppen',  icon: ClipboardList, color: '#7c3aed'       },
  { label: 'Events 2026',    value: '14',  sub: '3 diesen Monat',  icon: Calendar,      color: 'var(--accent)' },
  { label: 'Nachrichten',    value: '23',  sub: '5 ungelesen',     icon: MessageSquare, color: '#059669'       },
];

const UPCOMING = [
  { date: '06.06', title: 'Int. Vöcklabrucker Sparkassen Meeting', type: 'Wettkampf',  tag: 'tag-gold'  },
  { date: '14.06', title: 'Hallentraining U12 & U14',              type: 'Training',   tag: 'tag-blue'  },
  { date: '21.06', title: 'Vorstandssitzung',                       type: 'Meeting',    tag: 'tag-grey'  },
  { date: '29.08', title: 'Speedy Kids Cup Vöcklabruck',            type: 'Wettkampf',  tag: 'tag-gold'  },
  { date: '19.09', title: '26. Vöcklabrucker Kinderzehnkampf',      type: 'Wettkampf',  tag: 'tag-gold'  },
];

const MESSAGES = [
  { from: 'Thomas Regl',     group: 'U16',    text: 'Trainingsplan für nächste Woche hochgeladen',   time: 'Heute 14:22' },
  { from: 'Sandra Kirchner', group: 'Aktive', text: 'Wer fährt mit zum Meeting nach Linz?',           time: 'Heute 11:05' },
  { from: 'Walter Regl',     group: 'Vorstand', text: 'Helfer für Kinderzehnkampf gesucht',           time: 'Gestern'     },
];

const TASKS = [
  { title: 'Aufbau Sprunganlage',    event: 'Kinderzehnkampf',  person: 'Felix G.',    status: 'offen',  tag: 'tag-red'   },
  { title: 'Zeitnahme Zeitmessung',  event: 'Meeting Jun',      person: 'Maria B.',    status: 'bereit', tag: 'tag-green' },
  { title: 'Catering koordinieren',  event: 'Stadtlauf',        person: 'Nicht vergeben', status: 'offen', tag: 'tag-red' },
];

export default function Dashboard() {
  const { currentUser } = useApp();

  return (
    <div style={{ padding: 28, maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Bell size={14} color="var(--accent)" />
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.05em' }}>5 UNGELESENE BENACHRICHTIGUNGEN</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
          Guten Tag, {currentUser.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--grey-400)', fontSize: 14, marginTop: 4 }}>
          LCAV Vereinsportal · {new Date().toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {STATS.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} style={{
            background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)',
            borderRadius: 'var(--radius-lg)', padding: 20,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--grey-400)', fontWeight: 500 }}>{label}</span>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, color: 'var(--white)' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--grey-400)', marginTop: 4 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Upcoming Events */}
        <Card title="Nächste Termine" icon={Calendar}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {UPCOMING.map((ev, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(26,90,171,0.12)',
              }}>
                <div style={{ textAlign: 'center', minWidth: 38 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--blue-light)' }}>{ev.date.split('.')[0]}</div>
                  <div style={{ fontSize: 10, color: 'var(--grey-400)' }}>{ev.date.split('.')[1] === '06' ? 'Jun' : ev.date.split('.')[1] === '08' ? 'Aug' : 'Sep'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
                  <span className={`tag ${ev.tag}`} style={{ marginTop: 2 }}>{ev.type}</span>
                </div>
                <ChevronRight size={14} color="var(--grey-600)" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent messages */}
        <Card title="Letzte Nachrichten" icon={MessageSquare}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MESSAGES.map((m, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(26,90,171,0.12)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
                      {m.from.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{m.from}</span>
                    <span className="tag tag-grey">{m.group}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--grey-400)' }}>{m.time}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--grey-400)', marginLeft: 28 }}>{m.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Open Tasks */}
      <Card title="Offene Aufgaben" icon={TrendingUp} style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TASKS.map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(26,90,171,0.12)',
            }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</span>
                <span style={{ fontSize: 11, color: 'var(--grey-400)', marginLeft: 8 }}>· {t.event}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--grey-400)' }}>{t.person}</span>
              <span className={`tag ${t.tag}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, icon: Icon, children, style }) {
  return (
    <div style={{
      background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden', ...style,
    }}>
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon size={16} color="var(--blue-light)" />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  );
}
