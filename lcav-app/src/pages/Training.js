import React, { useState } from 'react';
import { ClipboardList, Plus, ChevronDown, ChevronUp, Trash2, Copy, Save, Check } from 'lucide-react';
import { useApp, GROUPS, DISCIPLINES } from '../context/AppContext';

const WEEK_DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const INTENSITIES = [
  { value: 'locker',    label: 'Locker',    color: '#22c55e' },
  { value: 'moderat',   label: 'Moderat',   color: '#3b82f6' },
  { value: 'intensiv',  label: 'Intensiv',  color: '#f59e0b' },
  { value: 'wettkampf', label: 'Wettkampf', color: '#ef4444' },
];

const TRAINING_TYPES = ['Technik', 'Kraft', 'Ausdauer', 'Schnelligkeit', 'Koordination', 'Sprungkraft', 'Wurftraining', 'Regeneration', 'Wettkampfvorbereitung', 'Testtraining'];

const SAMPLE_PLANS = {
  U16: {
    name: 'Wochenplan KW 23',
    group: 'U16',
    days: {
      Montag:    [{ type: 'Technik',        discipline: '100m',      duration: 90, intensity: 'moderat', notes: 'Startblocktraining, Reaktion' }],
      Dienstag:  [],
      Mittwoch:  [{ type: 'Kraft',          discipline: 'Kugelstoß', duration: 75, intensity: 'intensiv', notes: 'Kraftzirkel + Technik' }],
      Donnerstag:[],
      Freitag:   [{ type: 'Schnelligkeit',  discipline: '200m',      duration: 90, intensity: 'intensiv', notes: 'Tempowechselläufe' }],
      Samstag:   [{ type: 'Ausdauer',       discipline: '800m',      duration: 60, intensity: 'locker',   notes: 'Regeneration + Dehnen' }],
      Sonntag:   [],
    },
  },
};

export default function Training() {
  const { currentUser } = useApp();
  const [selectedGroup, setSelectedGroup] = useState(currentUser.group || 'U16');
  const [plan, setPlan] = useState(SAMPLE_PLANS.U16);
  const [expandedDay, setExpandedDay] = useState('Montag');
  const [addingTo, setAddingTo] = useState(null);
  const [newUnit, setNewUnit] = useState({ type: '', discipline: '', disciplineGroup: '', duration: 60, intensity: 'moderat', notes: '' });
  const [saved, setSaved] = useState(false);

  const isTrainer = currentUser.role === 'trainer' || currentUser.role === 'vorstand';

  const addUnit = (day) => {
    if (!newUnit.discipline && !newUnit.type) return;
    setPlan(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...(prev.days[day] || []), { ...newUnit }],
      },
    }));
    setAddingTo(null);
    setNewUnit({ type: '', discipline: '', disciplineGroup: '', duration: 60, intensity: 'moderat', notes: '' });
  };

  const removeUnit = (day, idx) => {
    setPlan(prev => ({
      ...prev,
      days: { ...prev.days, [day]: prev.days[day].filter((_, i) => i !== idx) },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={20} color="var(--blue-light)" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Trainingsplanung</h1>
            <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Wochenpläne für alle Altersgruppen & Disziplinen</p>
          </div>
        </div>
        {isTrainer && (
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 20px', borderRadius: 'var(--radius)',
            background: saved ? 'var(--success)' : 'var(--blue)', border: 'none',
            color: 'white', fontSize: 13, fontWeight: 600, transition: 'background 0.2s',
          }}>
            {saved ? <><Check size={14} /> Gespeichert</> : <><Save size={14} /> Speichern</>}
          </button>
        )}
      </div>

      {/* Group & Plan selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--grey-400)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gruppe</label>
          <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} style={selectStyle}>
            {GROUPS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--grey-400)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kalenderwoche</label>
          <select style={selectStyle} defaultValue="KW 23">
            {Array.from({ length: 52 }, (_, i) => <option key={i + 1}>KW {i + 1}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--grey-400)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Planname</label>
          <input defaultValue={plan.name} style={{ ...selectStyle, width: 200 }} />
        </div>
      </div>

      {/* Weekly plan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {WEEK_DAYS.map(day => {
          const units = plan.days[day] || [];
          const expanded = expandedDay === day;
          return (
            <div key={day} style={{
              background: 'var(--navy-mid)',
              border: '1px solid rgba(26,90,171,0.2)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              {/* Day header */}
              <button onClick={() => setExpandedDay(expanded ? null : day)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 18px', background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, minWidth: 110, textAlign: 'left' }}>{day}</span>
                <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {units.map((u, i) => {
                    const int = INTENSITIES.find(x => x.value === u.intensity);
                    return (
                      <span key={i} style={{
                        padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: `${int?.color}22`, color: int?.color,
                        border: `1px solid ${int?.color}44`,
                      }}>
                        {u.type} · {u.discipline}
                      </span>
                    );
                  })}
                  {units.length === 0 && <span style={{ fontSize: 12, color: 'var(--grey-600)' }}>Ruhetag / Kein Training</span>}
                </div>
                <span style={{ fontSize: 11, color: 'var(--grey-400)' }}>{units.length > 0 ? `${units.length} Einheit${units.length > 1 ? 'en' : ''}` : ''}</span>
                {expanded ? <ChevronUp size={15} color="var(--grey-400)" /> : <ChevronDown size={15} color="var(--grey-400)" />}
              </button>

              {/* Expanded content */}
              {expanded && (
                <div style={{ borderTop: '1px solid rgba(26,90,171,0.15)', padding: '14px 18px' }}>
                  {units.map((u, i) => {
                    const int = INTENSITIES.find(x => x.value === u.intensity);
                    return (
                      <div key={i} style={{
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                        padding: '10px 14px', marginBottom: 8,
                        background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                        border: '1px solid rgba(26,90,171,0.12)',
                      }}>
                        <div style={{ width: 4, minHeight: 40, borderRadius: 2, background: int?.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{u.type}</span>
                            <span className="tag tag-blue">{u.discipline}</span>
                            <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${int?.color}22`, color: int?.color, border: `1px solid ${int?.color}33` }}>{u.intensity}</span>
                            <span style={{ fontSize: 11, color: 'var(--grey-400)', marginLeft: 4 }}>⏱ {u.duration} min</span>
                          </div>
                          {u.notes && <p style={{ fontSize: 12, color: 'var(--grey-400)' }}>{u.notes}</p>}
                        </div>
                        {isTrainer && (
                          <button onClick={() => removeUnit(day, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <Trash2 size={13} color="var(--grey-600)" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* Add unit form */}
                  {isTrainer && (
                    addingTo === day ? (
                      <div style={{ padding: 14, background: 'rgba(26,90,171,0.1)', borderRadius: 8, border: '1px dashed rgba(26,90,171,0.3)', marginTop: 8 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
                          <div>
                            <label style={labelStyle}>Trainingsart</label>
                            <select value={newUnit.type} onChange={e => setNewUnit(p => ({ ...p, type: e.target.value }))} style={selectStyle}>
                              <option value="">Wählen…</option>
                              {TRAINING_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Disziplingruppe</label>
                            <select value={newUnit.disciplineGroup} onChange={e => setNewUnit(p => ({ ...p, disciplineGroup: e.target.value, discipline: '' }))} style={selectStyle}>
                              <option value="">Wählen…</option>
                              {Object.keys(DISCIPLINES).map(g => <option key={g}>{g}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Disziplin</label>
                            <select value={newUnit.discipline} onChange={e => setNewUnit(p => ({ ...p, discipline: e.target.value }))} style={selectStyle}>
                              <option value="">Wählen…</option>
                              {(DISCIPLINES[newUnit.disciplineGroup] || []).map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Intensität</label>
                            <select value={newUnit.intensity} onChange={e => setNewUnit(p => ({ ...p, intensity: e.target.value }))} style={selectStyle}>
                              {INTENSITIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Dauer (min)</label>
                            <input type="number" value={newUnit.duration} onChange={e => setNewUnit(p => ({ ...p, duration: +e.target.value }))} style={{ ...selectStyle, width: '100%' }} />
                          </div>
                          <div>
                            <label style={labelStyle}>Notizen</label>
                            <input value={newUnit.notes} onChange={e => setNewUnit(p => ({ ...p, notes: e.target.value }))} placeholder="Optional…" style={{ ...selectStyle, width: '100%' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => addUnit(day)} style={{ padding: '7px 16px', background: 'var(--blue)', border: 'none', borderRadius: 6, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Hinzufügen</button>
                          <button onClick={() => setAddingTo(null)} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6, color: 'var(--grey-400)', fontSize: 12, cursor: 'pointer' }}>Abbrechen</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAddingTo(day)} style={{
                        display: 'flex', alignItems: 'center', gap: 6, marginTop: 6,
                        padding: '7px 14px', background: 'transparent',
                        border: '1px dashed rgba(26,90,171,0.3)', borderRadius: 6,
                        color: 'var(--blue-light)', fontSize: 12, cursor: 'pointer',
                      }}>
                        <Plus size={13} /> Einheit hinzufügen
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disciplines reference */}
      <div style={{ marginTop: 24, background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>Alle Leichtathletik-Disziplinen</span>
        </div>
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {Object.entries(DISCIPLINES).map(([group, discs]) => (
            <div key={group}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{group}</div>
              {discs.map(d => <div key={d} style={{ fontSize: 12, color: 'var(--grey-400)', padding: '2px 0' }}>{d}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  padding: '7px 12px', background: 'var(--navy-light)',
  border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6,
  color: 'var(--white)', fontSize: 13, cursor: 'pointer', outline: 'none',
};

const labelStyle = { fontSize: 10, color: 'var(--grey-400)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };
