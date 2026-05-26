import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Users, Clock, ChevronRight, Edit2, X, Check, Save } from 'lucide-react';
import { useApp, GROUPS } from '../context/AppContext';

const INITIAL_EVENTS = [
    { id: 1, title: 'Int. Vöcklabrucker Sparkassen Meeting', date: '2026-06-06', time: '14:00', location: 'Voralpenstadion Vöcklabruck', type: 'Wettkampf', helfer: 12, helferNeeded: 20, groups: ['Aktive', 'U18', 'U20'], status: 'geplant' },
    { id: 2, title: 'Speedy Kids Cup Vöcklabruck',            date: '2026-08-29', time: '09:00', location: 'Voralpenstadion Vöcklabruck', type: 'Wettkampf', helfer: 8,  helferNeeded: 15, groups: ['U10', 'U12'],          status: 'geplant' },
    { id: 3, title: '26. Vöcklabrucker Kinderzehnkampf',      date: '2026-09-19', time: '09:30', location: 'Voralpenstadion Vöcklabruck', type: 'Wettkampf', helfer: 14, helferNeeded: 25, groups: ['U12', 'U14', 'U16'],   status: 'geplant' },
    { id: 4, title: 'Vorstandssitzung Sommer',                date: '2026-06-21', time: '19:00', location: 'Vereinslokal',                type: 'Meeting',   helfer: 0,  helferNeeded: 0,  groups: ['Vorstand'],            status: 'geplant' },
    { id: 5, title: 'OÖ Landesmeisterschaften U14',           date: '2026-07-05', time: '10:00', location: 'Linz',                        type: 'Auswärts',  helfer: 0,  helferNeeded: 2,  groups: ['U14'],                 status: 'geplant' },
    { id: 6, title: '40. Attnanger Stadtlauf',                date: '2026-05-31', time: '10:30', location: 'Attnang-Puchheim',            type: 'Wettkampf', helfer: 18, helferNeeded: 18, groups: ['Alle'],                status: 'abgeschlossen' },
];

const EMPTY_FORM = {
    title: '', date: '', time: '', location: '',
    type: 'Wettkampf', groups: [], helferNeeded: 0, description: '', status: 'geplant',
};

const EVENT_TYPES = ['Wettkampf', 'Meeting', 'Auswärts', 'Training'];
const TYPE_COLORS = { Wettkampf: 'tag-gold', Meeting: 'tag-grey', Auswärts: 'tag-blue', Training: 'tag-green' };
const GROUP_OPTIONS = [...GROUPS, 'Vorstand', 'Alle'];

export default function Events() {
    const { currentUser } = useApp();
    const [events, setEvents]     = useState(INITIAL_EVENTS);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter]     = useState('alle');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId]     = useState(null);
    const [form, setForm]         = useState(EMPTY_FORM);
    const [errors, setErrors]     = useState({});

    const isTrainer = currentUser?.role === 'trainer' || currentUser?.role === 'vorstand';
    const filtered  = events.filter(e => filter === 'alle' || e.type === filter || e.status === filter);

    // ── Form helpers ──────────────────────────────────────────────────────────
    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditId(null);
        setErrors({});
        setShowForm(true);
        setSelected(null);
    };

    const openEdit = (ev, e) => {
        e.stopPropagation();
        setForm({ ...ev });
        setEditId(ev.id);
        setErrors({});
        setShowForm(true);
        setSelected(null);
    };

    const closeForm = () => { setShowForm(false); setEditId(null); setErrors({}); };

    const toggleGroup = (g) => {
        setForm(prev => ({
            ...prev,
            groups: prev.groups.includes(g) ? prev.groups.filter(x => x !== g) : [...prev.groups, g],
        }));
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim())  e.title = 'Titel erforderlich';
        if (!form.date)          e.date  = 'Datum erforderlich';
        if (form.groups.length === 0) e.groups = 'Mindestens eine Gruppe wählen';
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        if (editId) {
            setEvents(prev => prev.map(ev => ev.id === editId ? { ...ev, ...form } : ev));
            if (selected?.id === editId) setSelected({ ...selected, ...form });
        } else {
            const newEvent = { ...form, id: Date.now(), helfer: 0, helferNeeded: Number(form.helferNeeded) };
            setEvents(prev => [...prev, newEvent]);
        }
        closeForm();
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Event wirklich löschen?')) return;
        setEvents(prev => prev.filter(ev => ev.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ padding: 28, maxWidth: 1100 }}>

            {/* Header */}
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
                    <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={14} /> Event erstellen
                    </button>
                )}
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.35)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, textTransform: 'uppercase' }}>
                            {editId ? 'Event bearbeiten' : 'Neues Event'}
                        </h2>
                        <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <X size={18} color="var(--grey-400)" />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {/* Titel */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Field label="Titel *" error={errors.title}>
                                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                       placeholder="z.B. Vöcklabrucker Stadtlauf" style={inputStyle(errors.title)} />
                            </Field>
                        </div>

                        {/* Datum & Uhrzeit */}
                        <Field label="Datum *" error={errors.date}>
                            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                   style={inputStyle(errors.date)} />
                        </Field>
                        <Field label="Uhrzeit">
                            <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                                   style={inputStyle()} />
                        </Field>

                        {/* Ort & Typ */}
                        <Field label="Ort">
                            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                                   placeholder="z.B. Voralpenstadion Vöcklabruck" style={inputStyle()} />
                        </Field>
                        <Field label="Typ">
                            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle()}>
                                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </Field>

                        {/* Helfer & Status */}
                        <Field label="Helfer benötigt">
                            <input type="number" min="0" value={form.helferNeeded}
                                   onChange={e => setForm(p => ({ ...p, helferNeeded: e.target.value }))} style={inputStyle()} />
                        </Field>
                        <Field label="Status">
                            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle()}>
                                <option value="geplant">Geplant</option>
                                <option value="abgeschlossen">Abgeschlossen</option>
                                <option value="abgesagt">Abgesagt</option>
                            </select>
                        </Field>

                        {/* Gruppen */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Field label="Gruppen *" error={errors.groups}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 0' }}>
                                    {GROUP_OPTIONS.map(g => {
                                        const active = form.groups.includes(g);
                                        return (
                                            <button key={g} type="button" onClick={() => toggleGroup(g)} style={{
                                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                                background: active ? 'var(--blue)' : 'rgba(26,90,171,0.1)',
                                                border: `1px solid ${active ? 'var(--blue)' : 'rgba(26,90,171,0.25)'}`,
                                                color: active ? 'white' : 'var(--grey-400)', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 4,
                                            }}>
                                                {active && <Check size={10} />}{g}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>
                        </div>

                        {/* Beschreibung */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Field label="Beschreibung">
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                          rows={3} placeholder="Optionale Infos zum Event…"
                          style={{ ...inputStyle(), resize: 'vertical', minHeight: 70 }} />
                            </Field>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 22px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            <Save size={14} /> {editId ? 'Speichern' : 'Event erstellen'}
                        </button>
                        <button onClick={closeForm} style={{ padding: '9px 18px', background: 'transparent', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 8, color: 'var(--grey-400)', fontSize: 13, cursor: 'pointer' }}>
                            Abbrechen
                        </button>
                    </div>
                </div>
            )}

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['alle', 'Wettkampf', 'Meeting', 'Auswärts', 'abgeschlossen'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: filter === f ? 'var(--blue)' : 'rgba(26,90,171,0.1)',
                        border: `1px solid ${filter === f ? 'var(--blue)' : 'rgba(26,90,171,0.25)'}`,
                        color: filter === f ? 'white' : 'var(--grey-400)', cursor: 'pointer', textTransform: 'capitalize',
                    }}>{f === 'alle' ? `Alle (${events.length})` : f}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
                {/* Event list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--grey-600)', fontSize: 13 }}>Keine Events gefunden.</div>
                    )}
                    {filtered.map(ev => {
                        const d = new Date(ev.date);
                        const isPast = ev.status === 'abgeschlossen';
                        return (
                            <div key={ev.id} onClick={() => setSelected(selected?.id === ev.id ? null : ev)} style={{
                                background: 'var(--navy-mid)',
                                border: `1px solid ${selected?.id === ev.id ? 'rgba(26,90,171,0.6)' : 'rgba(26,90,171,0.2)'}`,
                                borderRadius: 'var(--radius-lg)', padding: '16px 18px',
                                cursor: 'pointer', opacity: isPast ? 0.65 : 1,
                                transition: 'border-color 0.15s',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                    <div style={{ minWidth: 52, textAlign: 'center', background: 'rgba(26,90,171,0.15)', borderRadius: 8, padding: '8px 4px', border: '1px solid rgba(26,90,171,0.2)' }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, lineHeight: 1, color: 'var(--blue-light)' }}>
                                            {d.getDate().toString().padStart(2, '0')}
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--grey-400)', textTransform: 'uppercase' }}>
                                            {d.toLocaleDateString('de-AT', { month: 'short' })}
                                        </div>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{ev.title}</span>
                                            <span className={`tag ${TYPE_COLORS[ev.type] || 'tag-grey'}`}>{ev.type}</span>
                                            {isPast && <span className="tag tag-grey">Abgeschlossen</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                            {ev.location && (
                                                <span style={{ fontSize: 12, color: 'var(--grey-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={11} /> {ev.location}
                        </span>
                                            )}
                                            {ev.time && (
                                                <span style={{ fontSize: 12, color: 'var(--grey-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} /> {ev.time} Uhr
                        </span>
                                            )}
                                            {ev.helferNeeded > 0 && (
                                                <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: ev.helfer >= ev.helferNeeded ? '#4ade80' : '#f87171' }}>
                          <Users size={11} /> {ev.helfer}/{ev.helferNeeded} Helfer
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                        {isTrainer && (
                                            <button onClick={e => openEdit(ev, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.6 }}>
                                                <Edit2 size={13} color="var(--blue-light)" />
                                            </button>
                                        )}
                                        <ChevronRight size={16} color="var(--grey-600)" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Event detail panel */}
                {selected && (
                    <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 'fit-content' }}>
                        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase' }}>Event Details</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {isTrainer && (
                                    <button onClick={e => openEdit(selected, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                                        <Edit2 size={14} color="var(--blue-light)" />
                                    </button>
                                )}
                                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                                    <X size={14} color="var(--grey-400)" />
                                </button>
                            </div>
                        </div>
                        <div style={{ padding: 18 }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>{selected.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <DetailRow icon={Calendar} label="Datum"   value={new Date(selected.date).toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
                                {selected.time     && <DetailRow icon={Clock}    label="Uhrzeit" value={`${selected.time} Uhr`} />}
                                {selected.location && <DetailRow icon={MapPin}   label="Ort"     value={selected.location} />}
                                <DetailRow icon={Users} label="Gruppen" value={selected.groups?.join(', ') || '–'} />
                            </div>

                            {selected.description && (
                                <p style={{ fontSize: 13, color: 'var(--grey-400)', marginTop: 14, lineHeight: 1.6 }}>{selected.description}</p>
                            )}

                            {selected.helferNeeded > 0 && (
                                <div style={{ marginTop: 16, padding: 14, background: 'rgba(26,90,171,0.1)', borderRadius: 8, border: '1px solid rgba(26,90,171,0.2)' }}>
                                    <div style={{ fontSize: 11, color: 'var(--grey-400)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Helfer</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min((selected.helfer / selected.helferNeeded) * 100, 100)}%`, height: '100%', background: selected.helfer >= selected.helferNeeded ? 'var(--success)' : 'var(--blue-bright)', borderRadius: 3 }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 600 }}>{selected.helfer}/{selected.helferNeeded}</span>
                                    </div>
                                    <button style={{ width: '100%', padding: '8px', background: 'var(--blue)', border: 'none', borderRadius: 6, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                        Als Helfer anmelden
                                    </button>
                                </div>
                            )}

                            {isTrainer && (
                                <button onClick={e => handleDelete(selected.id, e)} style={{ marginTop: 14, width: '100%', padding: '7px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#f87171', fontSize: 12, cursor: 'pointer' }}>
                                    Event löschen
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Field({ label, children, error }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: 11, color: error ? '#f87171' : 'var(--grey-400)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {label}
            </label>
            {children}
            {error && <div style={{ fontSize: 11, color: '#f87171', marginTop: 3 }}>{error}</div>}
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

function inputStyle(error) {
    return {
        width: '100%', padding: '8px 12px', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(26,90,171,0.3)'}`,
        borderRadius: 7, color: 'var(--white)', fontSize: 13, outline: 'none',
    };
}