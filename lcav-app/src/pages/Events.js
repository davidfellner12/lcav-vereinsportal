import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Users, Clock, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EVENTS = [
  { id: 1, title: 'Int. Vöcklabrucker Sparkassen Meeting', date: '2026-06-06', time: '14:00', location: 'Voralpenstadion Vöcklabruck', type: 'Wettkampf', helfer: 12, helferNeeded: 20, groups: ['Aktive', 'U18', 'U20'], status: 'geplant' },
  { id: 2, title: 'Speedy Kids Cup Vöcklabruck',            date: '2026-08-29', time: '09:00', location: 'Voralpenstadion Vöcklabruck', type: 'Wettkampf', helfer: 8,  helferNeeded: 15, groups: ['U10', 'U12'], status: 'geplant' },
  { id: 3, title: '26. Vöcklabrucker Kinderzehnkampf',      date: '2026-09-19', time: '09:30', location: 'Voralpenstadion Vöcklabruck', type: 'Wettkampf', helfer: 14, helferNeeded: 25, groups: ['U12', 'U14', 'U16'], status: 'geplant' },
  { id: 4, title: 'Vorstandssitzung Sommer',                date: '2026-06-21', time: '19:00', location: 'Vereinslokal',               type: 'Meeting',   helfer: 0,  helferNeeded: 0,  groups: ['Vorstand'],  status: 'geplant' },
  { id: 5, title: 'OÖ Landesmeisterschaften U14',           date: '2026-07-05', time: '10:00', location: 'Linz',                       type: 'Auswärts',  helfer: 0,  helferNeeded: 2,  groups: ['U14'],       status: 'geplant' },
  { id: 6, title: '40. Attnanger Stadtlauf',                date: '2026-05-31', time: '10:30', location: 'Attnang-Puchheim',            type: 'Wettkampf', helfer: 18, helferNeeded: 18, groups: ['Alle'],       status: 'abgeschlossen' },
];

const TYPE_COLORS = { Wettkampf: 'tag-gold', Meeting: 'tag-grey', Auswärts: 'tag-blue', Training: 'tag-green' };

export default function Events() {
  const { currentUser } = useApp();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('alle');
  const isTrainer = currentUser.role === 'trainer' || currentUser.role === 'vorstand';

  const filtered = EVENTS.filter(e => filter === 'alle' || e.type === filter || e.status === filter);

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} color="var(--blue-light)" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Veranstaltungen</h1>
            <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Events, Wettkämpfe & Vereinstermine</p>
          </div>
        </div>
        {isTrainer && (
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Event erstellen
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['alle', 'Wettkampf', 'Meeting', 'Auswärts', 'abgeschlossen'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: filter === f ? 'var(--blue)' : 'rgba(26,90,171,0.1)',
            border: `1px solid ${filter === f ? 'var(--blue)' : 'rgba(26,90,171,0.25)'}`,
            color: filter === f ? 'white' : 'var(--grey-400)', cursor: 'pointer',
            textTransform: 'capitalize',
          }}>{f === 'alle' ? 'Alle' : f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
        {/* Event list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(ev => {
            const d = new Date(ev.date);
            const isPast = ev.status === 'abgeschlossen';
            return (
              <div key={ev.id} onClick={() => setSelected(selected?.id === ev.id ? null : ev)} style={{
                background: 'var(--navy-mid)',
                border: `1px solid ${selected?.id === ev.id ? 'rgba(26,90,171,0.6)' : 'rgba(26,90,171,0.2)'}`,
                borderRadius: 'var(--radius-lg)', padding: '16px 18px',
                cursor: 'pointer', opacity: isPast ? 0.6 : 1,
                transition: 'border-color 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {/* Date block */}
                  <div style={{
                    minWidth: 52, textAlign: 'center',
                    background: 'rgba(26,90,171,0.15)', borderRadius: 8, padding: '8px 4px',
                    border: '1px solid rgba(26,90,171,0.2)',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, lineHeight: 1, color: 'var(--blue-light)' }}>
                      {d.getDate().toString().padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--grey-400)', textTransform: 'uppercase' }}>
                      {d.toLocaleDateString('de-AT', { month: 'short' })}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{ev.title}</span>
                      <span className={`tag ${TYPE_COLORS[ev.type] || 'tag-grey'}`}>{ev.type}</span>
                      {isPast && <span className="tag tag-grey">Abgeschlossen</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--grey-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={11} /> {ev.location}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--grey-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {ev.time} Uhr
                      </span>
                      {ev.helferNeeded > 0 && (
                        <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: ev.helfer >= ev.helferNeeded ? '#4ade80' : '#f87171' }}>
                          <Users size={11} /> {ev.helfer}/{ev.helferNeeded} Helfer
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--grey-600)" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Event detail */}
        {selected && (
          <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 'fit-content' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase' }}>Event Details</span>
              {isTrainer && <Edit2 size={14} color="var(--blue-light)" style={{ cursor: 'pointer' }} />}
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 12 }}>{selected.title}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <DetailRow icon={Calendar} label="Datum" value={new Date(selected.date).toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
                <DetailRow icon={Clock} label="Uhrzeit" value={`${selected.time} Uhr`} />
                <DetailRow icon={MapPin} label="Ort" value={selected.location} />
                <DetailRow icon={Users} label="Gruppen" value={selected.groups.join(', ')} />
              </div>

              {selected.helferNeeded > 0 && (
                <div style={{ marginTop: 16, padding: 14, background: 'rgba(26,90,171,0.1)', borderRadius: 8, border: '1px solid rgba(26,90,171,0.2)' }}>
                  <div style={{ fontSize: 12, color: 'var(--grey-400)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Helfer</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(selected.helfer / selected.helferNeeded) * 100}%`, height: '100%', background: selected.helfer >= selected.helferNeeded ? 'var(--success)' : 'var(--blue-bright)', borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{selected.helfer}/{selected.helferNeeded}</span>
                  </div>
                  <button style={{ width: '100%', padding: '8px', background: 'var(--blue)', border: 'none', borderRadius: 6, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Als Helfer anmelden
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ width: 28, height: 28, background: 'rgba(26,90,171,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={13} color="var(--blue-light)" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 500, marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}
