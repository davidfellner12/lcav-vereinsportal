import React, { useState } from 'react';
import { Trophy, Plus, TrendingUp, Star, Medal } from 'lucide-react';
import { useApp, GROUPS, DISCIPLINES } from '../context/AppContext';

const RESULTS = [
  { athlete: 'Lena Mayr',     group: 'U16', discipline: '100m',       result: '12.45s',  date: '2026-05-10', event: 'OÖ LM U16',   place: 1 },
  { athlete: 'Jonas Kraft',   group: 'U16', discipline: '400m',       result: '52.10s',  date: '2026-05-10', event: 'OÖ LM U16',   place: 3 },
  { athlete: 'Anna Berger',   group: 'U16', discipline: 'Hochsprung', result: '1.65m',   date: '2026-04-20', event: 'Kreismeist.',  place: 2 },
  { athlete: 'Felix Gruber',  group: 'U12', discipline: 'Weitsprung', result: '4.80m',   date: '2026-05-03', event: 'Kindercup',    place: 1 },
  { athlete: 'Mia Fuchs',     group: 'U16', discipline: '200m',       result: '26.30s',  date: '2026-04-20', event: 'Kreismeist.',  place: 2 },
];

const REGISTRATIONS = [
  { athlete: 'Lena Mayr',    group: 'U16', event: 'Sparkassen Meeting 06.06.', disciplines: ['100m', '200m'],           status: 'gemeldet' },
  { athlete: 'Jonas Kraft',  group: 'U16', event: 'Sparkassen Meeting 06.06.', disciplines: ['400m'],                   status: 'gemeldet' },
  { athlete: 'Anna Berger',  group: 'U16', event: 'Sparkassen Meeting 06.06.', disciplines: ['Hochsprung'],             status: 'gemeldet' },
  { athlete: 'Felix Gruber', group: 'U12', event: 'Speedy Kids Cup 29.08.',    disciplines: ['Weitsprung', '60m'],      status: 'offen'    },
];

const MEDALS = [
  { pos: 1, icon: '🥇', color: '#f59e0b' },
  { pos: 2, icon: '🥈', color: '#94a3b8' },
  { pos: 3, icon: '🥉', color: '#cd7c3a' },
];

export default function Wettkampf() {
  const { currentUser } = useApp();
  const [tab, setTab] = useState('ergebnisse');

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={20} color="var(--blue-light)" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Wettkampf</h1>
          <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Ergebnisse, Meldungen & Bestenliste</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--navy-mid)', padding: 4, borderRadius: 10, border: '1px solid rgba(26,90,171,0.2)', width: 'fit-content' }}>
        {[
          { key: 'ergebnisse', label: 'Ergebnisse' },
          { key: 'meldungen',  label: 'Wettkampfmeldungen' },
          { key: 'bestenliste', label: 'Bestenliste' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600,
            background: tab === t.key ? 'var(--blue)' : 'transparent',
            border: 'none', color: tab === t.key ? 'white' : 'var(--grey-400)', cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'ergebnisse' && (
        <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>Letzte Ergebnisse</span>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'rgba(26,90,171,0.2)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6, color: 'var(--white)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={12} /> Ergebnis eintragen
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 80px 1fr 80px', borderBottom: '1px solid rgba(26,90,171,0.12)' }}>
            {['Athlet/in', 'Gruppe', 'Disziplin', 'Ergebnis', 'Veranstaltung', 'Platz'].map(h => (
              <div key={h} style={{ padding: '8px 14px', fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{h}</div>
            ))}
          </div>
          {RESULTS.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 80px 1fr 80px', alignItems: 'center', borderBottom: i < RESULTS.length - 1 ? '1px solid rgba(26,90,171,0.08)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <div style={{ padding: '11px 14px', fontSize: 13, fontWeight: 500 }}>{r.athlete}</div>
              <div style={{ padding: '11px 14px' }}><span className="tag tag-blue">{r.group}</span></div>
              <div style={{ padding: '11px 14px', fontSize: 13, color: 'var(--grey-400)' }}>{r.discipline}</div>
              <div style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{r.result}</div>
              <div style={{ padding: '11px 14px', fontSize: 12, color: 'var(--grey-400)' }}>{r.event}</div>
              <div style={{ padding: '11px 14px' }}>
                {MEDALS.find(m => m.pos === r.place)
                  ? <span style={{ fontSize: 18 }}>{MEDALS.find(m => m.pos === r.place).icon}</span>
                  : <span style={{ fontSize: 13, color: 'var(--grey-400)' }}>{r.place}.</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'meldungen' && (
        <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>Wettkampfmeldungen</span>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'rgba(26,90,171,0.2)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6, color: 'var(--white)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={12} /> Meldung erstellen
            </button>
          </div>
          {REGISTRATIONS.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderBottom: i < REGISTRATIONS.length - 1 ? '1px solid rgba(26,90,171,0.08)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.athlete}</span>
                  <span className="tag tag-blue">{r.group}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--grey-400)' }}>{r.event}</div>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {r.disciplines.map(d => <span key={d} className="tag tag-gold">{d}</span>)}
              </div>
              <span className={`tag ${r.status === 'gemeldet' ? 'tag-green' : 'tag-red'}`}>{r.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'bestenliste' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { athlete: 'Lena Mayr',   discipline: '100m',       result: '12.45s', group: 'U16', medal: '🥇' },
              { athlete: 'Anna Berger', discipline: 'Hochsprung', result: '1.65m',  group: 'U16', medal: '🥇' },
              { athlete: 'Felix Gruber',discipline: 'Weitsprung', result: '4.80m',  group: 'U12', medal: '🥇' },
            ].map((b, i) => (
              <div key={i} style={{ background: 'var(--navy-mid)', border: '1px solid rgba(240,165,0,0.3)', borderRadius: 'var(--radius-lg)', padding: 18, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{b.medal}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: 'var(--accent)' }}>{b.result}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{b.athlete}</div>
                <div style={{ fontSize: 11, color: 'var(--grey-400)', marginTop: 2 }}>{b.discipline} · {b.group}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', padding: 20, textAlign: 'center', color: 'var(--grey-400)', fontSize: 13 }}>
            <TrendingUp size={24} color="var(--blue-light)" style={{ display: 'block', margin: '0 auto 8px' }} />
            Vollständige Bestenliste mit Filterung nach Disziplin, Gruppe und Jahr folgt in der nächsten Version.
          </div>
        </div>
      )}
    </div>
  );
}
