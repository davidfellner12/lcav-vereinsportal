import React, { useState } from 'react';
import { Wrench, Plus, Check, Clock, AlertCircle, User, Calendar, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TASKS = [
  { id: 1, title: 'Aufbau Sprunganlage',         event: 'Kinderzehnkampf 19.09.',  person: 'Felix Gruber',    group: 'Alle',  priority: 'hoch',   status: 'offen',      due: '18.09.', category: 'Aufbau' },
  { id: 2, title: 'Zeitnahme / Zeitmessung',     event: 'Sparkassen Meeting',       person: 'Maria Bruneder',  group: 'U12',   priority: 'hoch',   status: 'erledigt',   due: '06.06.', category: 'Technik' },
  { id: 3, title: 'Catering koordinieren',        event: 'Stadtlauf',               person: 'Nicht vergeben',  group: 'Alle',  priority: 'mittel', status: 'offen',      due: '30.05.', category: 'Logistik' },
  { id: 4, title: 'Kampfrichter Kugelstoß',       event: 'Kinderzehnkampf',         person: 'Thomas Regl',     group: 'U16',   priority: 'mittel', status: 'bestätigt',  due: '19.09.', category: 'Kampfgericht' },
  { id: 5, title: 'Siegerehrung moderieren',      event: 'Sparkassen Meeting',       person: 'Sandra Kirchner', group: 'Aktive',priority: 'niedrig',status: 'bestätigt',  due: '06.06.', category: 'Moderation' },
  { id: 6, title: 'Auf- und Abbau Tribüne',       event: 'Kinderzehnkampf',         person: 'Nicht vergeben',  group: 'Alle',  priority: 'hoch',   status: 'offen',      due: '18.09.', category: 'Aufbau' },
  { id: 7, title: 'Erste Hilfe Betreuung',        event: 'Alle Events',             person: 'Petra Mayr',      group: 'Alle',  priority: 'hoch',   status: 'bestätigt',  due: 'laufend',category: 'Sanitäter' },
  { id: 8, title: 'Vereinsshop betreuen',         event: 'Kinderzehnkampf',         person: 'Nicht vergeben',  group: 'Alle',  priority: 'mittel', status: 'offen',      due: '19.09.', category: 'Verkauf' },
];

const STATUS_CONFIG = {
  offen:      { label: 'Offen',      color: '#ef4444', tagClass: 'tag-red'   },
  bestätigt:  { label: 'Bestätigt',  color: '#3b82f6', tagClass: 'tag-blue'  },
  erledigt:   { label: 'Erledigt',   color: '#22c55e', tagClass: 'tag-green' },
  inArbeit:   { label: 'In Arbeit',  color: '#f59e0b', tagClass: 'tag-gold'  },
};

const PRIORITY_CONFIG = {
  hoch:    { color: '#ef4444' },
  mittel:  { color: '#f59e0b' },
  niedrig: { color: '#22c55e' },
};

export default function Aufgaben() {
  const { currentUser } = useApp();
  const [tasks, setTasks] = useState(TASKS);
  const [filterStatus, setFilterStatus] = useState('alle');
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', event: '', person: '', priority: 'mittel', category: '', due: '' });
  const isTrainer = currentUser.role === 'trainer' || currentUser.role === 'vorstand';

  const filtered = tasks.filter(t => filterStatus === 'alle' || t.status === filterStatus);

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = t.status === 'offen' ? 'bestätigt' : t.status === 'bestätigt' ? 'erledigt' : 'offen';
      return { ...t, status: next };
    }));
  };

  const addTask = () => {
    if (!newTask.title) return;
    setTasks(prev => [...prev, { ...newTask, id: Date.now(), group: 'Alle', status: 'offen' }]);
    setNewTask({ title: '', event: '', person: '', priority: 'mittel', category: '', due: '' });
    setShowAdd(false);
  };

  const stats = {
    offen: tasks.filter(t => t.status === 'offen').length,
    bestätigt: tasks.filter(t => t.status === 'bestätigt').length,
    erledigt: tasks.filter(t => t.status === 'erledigt').length,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={20} color="var(--blue-light)" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Arbeitszuweisungen</h1>
            <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Aufgaben & Helferplanung für Events</p>
          </div>
        </div>
        {isTrainer && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Aufgabe erstellen
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { key: 'offen',     label: 'Offen',     icon: AlertCircle, color: '#ef4444' },
          { key: 'bestätigt', label: 'Bestätigt', icon: Clock,       color: '#3b82f6' },
          { key: 'erledigt',  label: 'Erledigt',  icon: Check,       color: '#22c55e' },
        ].map(({ key, label, icon: Icon, color }) => (
          <div key={key} style={{ background: 'var(--navy-mid)', border: `1px solid ${color}33`, borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: `${color}22`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>{stats[key]}</div>
              <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['alle', 'offen', 'bestätigt', 'erledigt'].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: filterStatus === f ? 'var(--blue)' : 'rgba(26,90,171,0.1)',
            border: `1px solid ${filterStatus === f ? 'var(--blue)' : 'rgba(26,90,171,0.25)'}`,
            color: filterStatus === f ? 'white' : 'var(--grey-400)', cursor: 'pointer', textTransform: 'capitalize',
          }}>{f === 'alle' ? 'Alle' : f}</button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background: 'rgba(26,90,171,0.08)', border: '1px solid rgba(26,90,171,0.25)', borderRadius: 'var(--radius-lg)', padding: 18, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', marginBottom: 14 }}>Neue Aufgabe</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
            {[
              { key: 'title',    label: 'Titel',      type: 'text',   placeholder: 'Aufgabenname' },
              { key: 'event',    label: 'Event',      type: 'text',   placeholder: 'Veranstaltung' },
              { key: 'person',   label: 'Zugewiesen', type: 'text',   placeholder: 'Person' },
              { key: 'category', label: 'Kategorie',  type: 'text',   placeholder: 'z.B. Aufbau' },
              { key: 'due',      label: 'Fällig',     type: 'text',   placeholder: 'z.B. 19.09.' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, color: 'var(--grey-400)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                <input value={newTask[f.key]} onChange={e => setNewTask(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: '100%', padding: '7px 12px', background: 'var(--navy-light)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6, color: 'white', fontSize: 13 }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 10, color: 'var(--grey-400)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priorität</label>
              <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))} style={{ width: '100%', padding: '7px 12px', background: 'var(--navy-light)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6, color: 'white', fontSize: 13 }}>
                <option value="hoch">Hoch</option>
                <option value="mittel">Mittel</option>
                <option value="niedrig">Niedrig</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addTask} style={{ padding: '8px 20px', background: 'var(--blue)', border: 'none', borderRadius: 6, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Erstellen</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 6, color: 'var(--grey-400)', fontSize: 13, cursor: 'pointer' }}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* Task table */}
      <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 80px 90px 80px', gap: 0 }}>
          {['Aufgabe', 'Event', 'Person', 'Priorität', 'Status', 'Fällig'].map(h => (
            <div key={h} style={{ padding: '10px 14px', fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, borderBottom: '1px solid rgba(26,90,171,0.15)' }}>{h}</div>
          ))}
        </div>

        {filtered.map((task, i) => {
          const sc = STATUS_CONFIG[task.status];
          const pc = PRIORITY_CONFIG[task.priority];
          return (
            <div key={task.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 80px 90px 80px',
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(26,90,171,0.08)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              alignItems: 'center',
            }}>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{task.title}</div>
                <span style={{ fontSize: 10, color: 'var(--grey-400)' }}>{task.category}</span>
              </div>
              <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--grey-400)' }}>{task.event}</div>
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <User size={11} color="var(--grey-600)" />
                <span style={{ fontSize: 12, color: task.person === 'Nicht vergeben' ? 'var(--danger)' : 'var(--grey-400)', fontWeight: task.person === 'Nicht vergeben' ? 600 : 400 }}>{task.person}</span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc.color, display: 'inline-block', marginRight: 4 }} />
                <span style={{ fontSize: 11, color: 'var(--grey-400)', textTransform: 'capitalize' }}>{task.priority}</span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <button onClick={() => isTrainer && toggleStatus(task.id)} style={{ background: 'none', border: 'none', cursor: isTrainer ? 'pointer' : 'default', padding: 0 }}>
                  <span className={`tag ${sc.tagClass}`}>{sc.label}</span>
                </button>
              </div>
              <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--grey-400)' }}>{task.due}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
