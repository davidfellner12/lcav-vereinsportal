import React, { useState } from 'react';
import {
  Wrench, Plus, Check, Clock, AlertCircle, User,
  ChevronDown, ChevronUp, X, Save, Users, Calendar,
  LayoutList, LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Seed data ────────────────────────────────────────────────────────────────
const EVENTS_LIST = [
  'Sparkassen Meeting 06.06.',
  'Kinderzehnkampf 19.09.',
  'Speedy Kids Cup 29.08.',
  'Stadtlauf 31.05.',
  'Alle Events',
];

const INITIAL_TASKS = [
  { id: 1,  title: 'Aufbau Sprunganlage',       event: 'Kinderzehnkampf 19.09.',  person: 'Felix Gruber',    priority: 'hoch',    status: 'offen',     due: '18.09.', category: 'Aufbau'       },
  { id: 2,  title: 'Zeitnahme / Zeitmessung',   event: 'Sparkassen Meeting 06.06.',person: 'Maria Bruneder',  priority: 'hoch',    status: 'erledigt',  due: '06.06.', category: 'Technik'      },
  { id: 3,  title: 'Catering koordinieren',      event: 'Stadtlauf 31.05.',        person: '',                priority: 'mittel',  status: 'offen',     due: '30.05.', category: 'Logistik'     },
  { id: 4,  title: 'Kampfrichter Kugelstoß',    event: 'Kinderzehnkampf 19.09.',  person: 'Thomas Regl',     priority: 'mittel',  status: 'bestätigt', due: '19.09.', category: 'Kampfgericht' },
  { id: 5,  title: 'Siegerehrung moderieren',   event: 'Sparkassen Meeting 06.06.',person: 'Sandra Kirchner', priority: 'niedrig', status: 'bestätigt', due: '06.06.', category: 'Moderation'   },
  { id: 6,  title: 'Auf- und Abbau Tribüne',    event: 'Kinderzehnkampf 19.09.',  person: '',                priority: 'hoch',    status: 'offen',     due: '18.09.', category: 'Aufbau'       },
  { id: 7,  title: 'Erste Hilfe Betreuung',     event: 'Alle Events',             person: 'Petra Mayr',      priority: 'hoch',    status: 'bestätigt', due: 'laufend',category: 'Sanitäter'    },
  { id: 8,  title: 'Vereinsshop betreuen',      event: 'Kinderzehnkampf 19.09.',  person: '',                priority: 'mittel',  status: 'offen',     due: '19.09.', category: 'Verkauf'      },
  { id: 9,  title: 'Startunterlagen ausgeben',  event: 'Sparkassen Meeting 06.06.',person: '',                priority: 'mittel',  status: 'offen',     due: '06.06.', category: 'Organisation' },
  { id: 10, title: 'Lautsprecheranlage aufbau', event: 'Kinderzehnkampf 19.09.',  person: 'Walter Regl',     priority: 'mittel',  status: 'bestätigt', due: '19.09.', category: 'Technik'      },
  { id: 11, title: 'Parkplatzeinweisung',        event: 'Sparkassen Meeting 06.06.',person: '',               priority: 'niedrig', status: 'offen',     due: '06.06.', category: 'Organisation' },
  { id: 12, title: 'Fotodokumentation',          event: 'Speedy Kids Cup 29.08.',  person: 'Maria Bruneder',  priority: 'niedrig', status: 'offen',     due: '29.08.', category: 'Medien'       },
  { id: 13, title: 'Aufbau Zieleinlauf',         event: 'Speedy Kids Cup 29.08.',  person: '',                priority: 'hoch',    status: 'offen',     due: '28.08.', category: 'Aufbau'       },
  { id: 14, title: 'Urkunden drucken',           event: 'Speedy Kids Cup 29.08.',  person: 'Sandra Kirchner', priority: 'mittel',  status: 'erledigt',  due: '27.08.', category: 'Organisation' },
];

const MEMBERS = [
  'Maria Bruneder', 'Thomas Regl', 'Sandra Kirchner', 'Walter Regl',
  'Petra Mayr', 'Klaus Hofmann', 'Felix Gruber', 'Lena Mayr',
  'Jonas Kraft', 'Anna Berger',
];

const STATUS_CFG = {
  offen:     { label: 'Offen',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  tagClass: 'tag-red'   },
  bestätigt: { label: 'Bestätigt', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', tagClass: 'tag-blue'  },
  erledigt:  { label: 'Erledigt',  color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  tagClass: 'tag-green' },
};

const PRIO_CFG = {
  hoch:    { color: '#ef4444', dot: '🔴' },
  mittel:  { color: '#f59e0b', dot: '🟡' },
  niedrig: { color: '#22c55e', dot: '🟢' },
};

const EMPTY_TASK = { title: '', event: EVENTS_LIST[0], person: '', priority: 'mittel', status: 'offen', due: '', category: '' };

// ── Component ────────────────────────────────────────────────────────────────
export default function Aufgaben() {
  const { currentUser } = useApp();
  const isTrainer = currentUser?.role === 'trainer' || currentUser?.role === 'vorstand';

  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [view, setView]             = useState('event');   // 'event' | 'list'
  const [expandedEvent, setExpanded]= useState('Kinderzehnkampf 19.09.');
  const [showForm, setShowForm]     = useState(false);
  const [editTask, setEditTask]     = useState(null);
  const [form, setForm]             = useState(EMPTY_TASK);
  const [errors, setErrors]         = useState({});
  const [filterStatus, setFilter]   = useState('alle');

  // ── Helpers ────────────────────────────────────────────────────────────────
  const openCreate = (eventName) => {
    setForm({ ...EMPTY_TASK, event: eventName || EVENTS_LIST[0] });
    setEditTask(null); setErrors({}); setShowForm(true);
  };
  const openEdit = (t) => {
    setForm({ ...t }); setEditTask(t.id); setErrors({}); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTask(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Titel erforderlich';
    if (!form.event)        e.event = 'Event erforderlich';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editTask) {
      setTasks(prev => prev.map(t => t.id === editTask ? { ...t, ...form } : t));
    } else {
      setTasks(prev => [...prev, { ...form, id: Date.now() }]);
    }
    closeForm();
  };

  const deleteTask = (id) => {
    if (!window.confirm('Aufgabe löschen?')) return;
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const cycleStatus = (id) => {
    if (!isTrainer) return;
    const cycle = { offen: 'bestätigt', bestätigt: 'erledigt', erledigt: 'offen' };
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: cycle[t.status] } : t));
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const statsFor = (evTasks) => ({
    total:     evTasks.length,
    offen:     evTasks.filter(t => t.status === 'offen').length,
    bestätigt: evTasks.filter(t => t.status === 'bestätigt').length,
    erledigt:  evTasks.filter(t => t.status === 'erledigt').length,
    unbesetzt: evTasks.filter(t => !t.person).length,
    progress:  evTasks.length ? Math.round((evTasks.filter(t => t.status === 'erledigt').length / evTasks.length) * 100) : 0,
  });

  const globalStats = statsFor(tasks);
  const filteredList = tasks.filter(t => filterStatus === 'alle' || t.status === filterStatus);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
      <div style={{ padding: 28, maxWidth: 1200 }}>

        {/* Header */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={20} color="var(--blue-light)" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Arbeitszuweisungen</h1>
              <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Übersicht wer wo eingeteilt ist & was noch offen ist</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 8, overflow: 'hidden' }}>
              {[{ key: 'event', icon: LayoutGrid, label: 'Event-Ansicht' }, { key: 'list', icon: LayoutList, label: 'Listenansicht' }].map(({ key, icon: Icon, label }) => (
                  <button key={key} onClick={() => setView(key)} title={label} style={{
                    padding: '8px 14px', background: view === key ? 'var(--blue)' : 'transparent',
                    border: 'none', color: view === key ? 'white' : 'var(--grey-400)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
                  }}>
                    <Icon size={14} />{label}
                  </button>
              ))}
            </div>
            {isTrainer && (
                <button onClick={() => openCreate()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={14} /> Aufgabe erstellen
                </button>
            )}
          </div>
        </div>

        {/* Global stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Gesamt',    value: globalStats.total,     icon: Wrench,       color: 'var(--blue-light)' },
            { label: 'Offen',     value: globalStats.offen,     icon: AlertCircle,  color: '#ef4444'           },
            { label: 'Bestätigt', value: globalStats.bestätigt, icon: Clock,        color: '#3b82f6'           },
            { label: 'Erledigt',  value: globalStats.erledigt,  icon: Check,        color: '#22c55e'           },
          ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, background: `${color}22`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--grey-400)', marginTop: 2 }}>{label}</div>
                </div>
              </div>
          ))}
        </div>

        {/* Create/Edit Form */}
        {showForm && (
            <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.35)', borderRadius: 'var(--radius-lg)', padding: 22, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, textTransform: 'uppercase' }}>
                  {editTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
                </h2>
                <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="var(--grey-400)" /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <FLabel label="Titel *" error={errors.title}>
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                           placeholder="z.B. Aufbau Weitsprunganlage" style={inp(errors.title)} />
                  </FLabel>
                </div>
                <FLabel label="Event *" error={errors.event}>
                  <select value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} style={inp()}>
                    {EVENTS_LIST.map(ev => <option key={ev}>{ev}</option>)}
                  </select>
                </FLabel>
                <FLabel label="Zugewiesen an">
                  <select value={form.person} onChange={e => setForm(p => ({ ...p, person: e.target.value }))} style={inp()}>
                    <option value="">— Noch nicht vergeben —</option>
                    {MEMBERS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </FLabel>
                <FLabel label="Kategorie">
                  <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                         placeholder="z.B. Aufbau, Technik…" style={inp()} />
                </FLabel>
                <FLabel label="Priorität">
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={inp()}>
                    <option value="hoch">🔴 Hoch</option>
                    <option value="mittel">🟡 Mittel</option>
                    <option value="niedrig">🟢 Niedrig</option>
                  </select>
                </FLabel>
                <FLabel label="Status">
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inp()}>
                    <option value="offen">Offen</option>
                    <option value="bestätigt">Bestätigt</option>
                    <option value="erledigt">Erledigt</option>
                  </select>
                </FLabel>
                <FLabel label="Fällig am">
                  <input value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))}
                         placeholder="z.B. 18.09." style={inp()} />
                </FLabel>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--blue)', border: 'none', borderRadius: 7, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  <Save size={13} /> {editTask ? 'Speichern' : 'Erstellen'}
                </button>
                <button onClick={closeForm} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 7, color: 'var(--grey-400)', fontSize: 13, cursor: 'pointer' }}>Abbrechen</button>
              </div>
            </div>
        )}

        {/* ── EVENT VIEW ── */}
        {view === 'event' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {EVENTS_LIST.map(evName => {
                const evTasks = tasks.filter(t => t.event === evName);
                const stats   = statsFor(evTasks);
                const open    = expandedEvent === evName;

                return (
                    <div key={evName} style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>

                      {/* Event header row */}
                      <div onClick={() => setExpanded(open ? null : evName)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <Calendar size={14} color="var(--blue-light)" />
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>{evName}</span>
                            <span className="tag tag-blue">{stats.total} Aufgaben</span>
                            {stats.unbesetzt > 0 && (
                                <span className="tag tag-red">⚠ {stats.unbesetzt} unbesetzt</span>
                            )}
                            {stats.unbesetzt === 0 && stats.total > 0 && (
                                <span className="tag tag-green">✓ Alle besetzt</span>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${stats.progress}%`, height: '100%', background: stats.progress === 100 ? '#22c55e' : 'var(--blue-bright)', borderRadius: 3, transition: 'width 0.4s' }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--grey-400)', minWidth: 30, textAlign: 'right' }}>{stats.progress}%</span>
                            <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                              <span style={{ color: '#ef4444' }}>●&nbsp;{stats.offen} offen</span>
                              <span style={{ color: '#3b82f6' }}>●&nbsp;{stats.bestätigt} bestätigt</span>
                              <span style={{ color: '#22c55e' }}>●&nbsp;{stats.erledigt} erledigt</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {isTrainer && (
                              <button onClick={e => { e.stopPropagation(); openCreate(evName); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: 'rgba(26,90,171,0.2)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6, color: 'var(--blue-light)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                                <Plus size={11} /> Aufgabe
                              </button>
                          )}
                          {open ? <ChevronUp size={16} color="var(--grey-400)" /> : <ChevronDown size={16} color="var(--grey-400)" />}
                        </div>
                      </div>

                      {/* Expanded task list */}
                      {open && (
                          <div style={{ borderTop: '1px solid rgba(26,90,171,0.15)' }}>
                            {evTasks.length === 0 && (
                                <div style={{ padding: '20px 18px', textAlign: 'center', color: 'var(--grey-600)', fontSize: 13 }}>
                                  Noch keine Aufgaben — <button onClick={() => openCreate(evName)} style={{ background: 'none', border: 'none', color: 'var(--blue-light)', cursor: 'pointer', fontSize: 13 }}>Erste Aufgabe erstellen</button>
                                </div>
                            )}

                            {/* Column header */}
                            {evTasks.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 120px 90px 80px 80px', padding: '8px 18px', borderBottom: '1px solid rgba(26,90,171,0.1)' }}>
                                  {['Aufgabe', 'Person', 'Kategorie', 'Priorität', 'Fällig', 'Status'].map(h => (
                                      <div key={h} style={{ fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{h}</div>
                                  ))}
                                </div>
                            )}

                            {evTasks.map((t, i) => {
                              const sc = STATUS_CFG[t.status];
                              const pc = PRIO_CFG[t.priority];
                              const unassigned = !t.person;
                              return (
                                  <div key={t.id} style={{
                                    display: 'grid', gridTemplateColumns: '2fr 1.2fr 120px 90px 80px 80px',
                                    alignItems: 'center', padding: '10px 18px',
                                    borderBottom: i < evTasks.length - 1 ? '1px solid rgba(26,90,171,0.07)' : 'none',
                                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                                  }}>
                                    {/* Title */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <div style={{ width: 3, height: 24, borderRadius: 2, background: pc.color, flexShrink: 0 }} />
                                      <div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                                        {t.due && <div style={{ fontSize: 10, color: 'var(--grey-600)' }}>Fällig: {t.due}</div>}
                                      </div>
                                    </div>

                                    {/* Person */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      {unassigned ? (
                                          <span style={{ fontSize: 12, color: '#f87171', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <User size={11} /> Nicht vergeben
                              </span>
                                      ) : (
                                          <>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                                              {t.person.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span style={{ fontSize: 12 }}>{t.person}</span>
                                          </>
                                      )}
                                    </div>

                                    {/* Category */}
                                    <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{t.category || '–'}</div>

                                    {/* Priority */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ fontSize: 10 }}>{pc.dot}</span>
                                      <span style={{ fontSize: 11, color: pc.color, textTransform: 'capitalize' }}>{t.priority}</span>
                                    </div>

                                    {/* Due */}
                                    <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{t.due || '–'}</div>

                                    {/* Status + actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <button onClick={() => cycleStatus(t.id)} title={isTrainer ? 'Status wechseln' : undefined} style={{ background: 'none', border: 'none', cursor: isTrainer ? 'pointer' : 'default', padding: 0 }}>
                                        <span className={`tag ${sc.tagClass}`} style={{ fontSize: 10 }}>{sc.label}</span>
                                      </button>
                                      {isTrainer && (
                                          <div style={{ display: 'flex', gap: 2, opacity: 0.5 }}>
                                            <button onClick={() => openEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, fontSize: 11, color: 'var(--blue-light)' }}>✏</button>
                                            <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, fontSize: 11, color: '#f87171' }}>✕</button>
                                          </div>
                                      )}
                                    </div>
                                  </div>
                              );
                            })}
                          </div>
                      )}
                    </div>
                );
              })}
            </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === 'list' && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['alle', 'offen', 'bestätigt', 'erledigt'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: filterStatus === f ? 'var(--blue)' : 'rgba(26,90,171,0.1)',
                      border: `1px solid ${filterStatus === f ? 'var(--blue)' : 'rgba(26,90,171,0.25)'}`,
                      color: filterStatus === f ? 'white' : 'var(--grey-400)', cursor: 'pointer', textTransform: 'capitalize',
                    }}>{f === 'alle' ? 'Alle' : f}</button>
                ))}
              </div>

              <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 100px 90px 90px', padding: '10px 16px', borderBottom: '1px solid rgba(26,90,171,0.15)' }}>
                  {['Aufgabe', 'Event', 'Person', 'Kategorie', 'Priorität', 'Status'].map(h => (
                      <div key={h} style={{ fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{h}</div>
                  ))}
                </div>

                {filteredList.map((t, i) => {
                  const sc = STATUS_CFG[t.status];
                  const pc = PRIO_CFG[t.priority];
                  return (
                      <div key={t.id} style={{
                        display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 100px 90px 90px',
                        alignItems: 'center', padding: '11px 16px',
                        borderBottom: i < filteredList.length - 1 ? '1px solid rgba(26,90,171,0.08)' : 'none',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 3, height: 20, borderRadius: 2, background: pc.color, flexShrink: 0 }} />
                          {t.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--grey-400)' }}>{t.event}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          {t.person ? (
                              <>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>
                                  {t.person.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <span style={{ fontSize: 12 }}>{t.person}</span>
                              </>
                          ) : (
                              <span style={{ fontSize: 11, color: '#f87171', fontStyle: 'italic' }}>Nicht vergeben</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{t.category || '–'}</div>
                        <div style={{ fontSize: 11, color: pc.color, textTransform: 'capitalize' }}>{pc.dot} {t.priority}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <button onClick={() => cycleStatus(t.id)} style={{ background: 'none', border: 'none', cursor: isTrainer ? 'pointer' : 'default', padding: 0 }}>
                            <span className={`tag ${sc.tagClass}`} style={{ fontSize: 10 }}>{sc.label}</span>
                          </button>
                          {isTrainer && (
                              <>
                                <button onClick={() => openEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--blue-light)', opacity: 0.6, padding: '0 2px' }}>✏</button>
                                <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#f87171', opacity: 0.6, padding: '0 2px' }}>✕</button>
                              </>
                          )}
                        </div>
                      </div>
                  );
                })}
              </div>
            </>
        )}
      </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function FLabel({ label, children, error }) {
  return (
      <div>
        <label style={{ display: 'block', fontSize: 11, color: error ? '#f87171' : 'var(--grey-400)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</label>
        {children}
        {error && <div style={{ fontSize: 11, color: '#f87171', marginTop: 2 }}>{error}</div>}
      </div>
  );
}

function inp(error) {
  return {
    width: '100%', padding: '8px 11px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(26,90,171,0.3)'}`,
    borderRadius: 6, color: 'white', fontSize: 13, outline: 'none',
  };
}