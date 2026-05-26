import React, { useState } from 'react';
import {
    ChevronLeft, ChevronRight, Plus, Heart, Activity,
    Smile, Thermometer, Save, X, Download, ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRAINING_PLANS, TRAINING_LOGS, FEELING_COLORS, INTENSITY_COLORS } from '../utils/trainingData';
import { exportPlanToExcel } from '../utils/excelExport';

const DAYS_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAYS_FULL  = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const MONTHS     = ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function getWeekDates(year, week) {
    const jan4 = new Date(year, 0, 4);
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1);
    const start = new Date(startOfWeek1);
    start.setDate(startOfWeek1.getDate() + (week - 1) * 7);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}

const EMPTY_LOG = { restingHr: '', maxHr: '', avgPace: '', feeling: 5, lactate: '', notes: '' };

export default function TrainingsplanKalender() {
    const { currentUser, setActivePage } = useApp();
    const isTrainer = currentUser?.role === 'trainer' || currentUser?.role === 'vorstand';

    // Determine whose calendar we're viewing
    const storedAthlete = (() => { try { return JSON.parse(localStorage.getItem('lcav_selected_athlete')); } catch { return null; } })();
    const viewingAthlete = isTrainer ? storedAthlete : null;
    const athleteId      = viewingAthlete?.id || currentUser?.id || 1;

    const [week,     setWeek]    = useState(23);
    const [year,     setYear]    = useState(2026);
    const [logs,     setLogs]    = useState(TRAINING_LOGS);
    const [logForm,  setLogForm] = useState(null);   // { date, unitId, unit }
    const [formData, setFormData]= useState(EMPTY_LOG);

    // Find matching plan for group
    const athleteGroup = viewingAthlete?.group || 'U16';
    const plan = TRAINING_PLANS.find(p => p.group === athleteGroup && p.week === week && p.year === year)
        || TRAINING_PLANS[0];

    const weekDates = getWeekDates(year, week);

    const getLog = (date, unitId) => {
        const ds = date.toISOString().split('T')[0];
        return logs.find(l => l.athleteId === athleteId && l.date === ds && l.unitId === unitId);
    };

    const openLogForm = (date, unit) => {
        const existing = getLog(date, unit.id);
        setFormData(existing ? { ...existing } : { ...EMPTY_LOG });
        setLogForm({ date, unitId: unit.id, unit });
    };

    const saveLog = () => {
        if (!logForm) return;
        const ds = logForm.date.toISOString().split('T')[0];
        setLogs(prev => {
            const filtered = prev.filter(l => !(l.athleteId === athleteId && l.date === ds && l.unitId === logForm.unitId));
            return [...filtered, { ...formData, id: Date.now(), athleteId, date: ds, unitId: logForm.unitId, discipline: logForm.unit.discipline }];
        });
        setLogForm(null);
    };

    const handleExport = () => {
        const planLogs = logs.filter(l => l.athleteId === athleteId);
        exportPlanToExcel({
            ...plan,
            group: athleteGroup,
            logs: planLogs.map(l => ({ ...l, athlete: viewingAthlete?.name || currentUser?.name, unit: `${l.discipline}` })),
        });
    };

    return (
        <div style={{ padding: 28, maxWidth: 1300 }}>
            {/* Header */}
            <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {isTrainer && (
                        <button onClick={() => setActivePage('trainerhub')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <ArrowLeft size={18} color="var(--grey-400)" />
                        </button>
                    )}
                    <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={20} color="var(--blue-light)" />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, textTransform: 'uppercase' }}>
                            Trainingskalender
                            {viewingAthlete && <span style={{ color: 'var(--blue-light)', marginLeft: 10 }}>– {viewingAthlete.name}</span>}
                        </h1>
                        <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Gruppe {athleteGroup} · {plan?.name || 'Kein Plan'}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {/* Week navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 8, padding: '6px 12px' }}>
                        <button onClick={() => setWeek(w => w > 1 ? w-1 : 52)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><ChevronLeft size={14} color="var(--grey-400)" /></button>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, minWidth: 60, textAlign: 'center' }}>KW {week} / {year}</span>
                        <button onClick={() => setWeek(w => w < 52 ? w+1 : 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><ChevronRight size={14} color="var(--grey-400)" /></button>
                    </div>
                    <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(26,90,171,0.15)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 8, color: 'var(--blue-light)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        <Download size={13} /> Excel Export
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                {Object.entries(INTENSITY_COLORS).map(([k, c]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--grey-400)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                    </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--grey-400)' }}>
                    <Heart size={10} color="#f87171" /> Puls-Log vorhanden
                </div>
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                {weekDates.map((date, di) => {
                    const dayName  = DAYS_FULL[di];
                    const units    = plan?.days?.[dayName] || [];
                    const isToday  = date.toDateString() === new Date().toDateString();
                    const dateStr  = date.toISOString().split('T')[0];

                    return (
                        <div key={di} style={{
                            background: 'var(--navy-mid)',
                            border: `1px solid ${isToday ? 'rgba(26,90,171,0.6)' : 'rgba(26,90,171,0.15)'}`,
                            borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 200,
                        }}>
                            {/* Day header */}
                            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,90,171,0.12)', background: isToday ? 'rgba(26,90,171,0.2)' : 'transparent' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: isToday ? 'var(--white)' : 'var(--grey-400)' }}>{DAYS_SHORT[di]}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: isToday ? 'var(--blue-light)' : 'var(--white)', lineHeight: 1 }}>
                                    {date.getDate()}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--grey-600)' }}>{MONTHS[date.getMonth()]}</div>
                            </div>

                            {/* Units */}
                            <div style={{ padding: '8px' }}>
                                {units.length === 0 && (
                                    <div style={{ fontSize: 11, color: 'var(--grey-600)', textAlign: 'center', padding: '12px 0', fontStyle: 'italic' }}>Ruhetag</div>
                                )}
                                {units.map(unit => {
                                    const log = getLog(date, unit.id);
                                    const iColor = INTENSITY_COLORS[unit.intensity] || 'var(--grey-400)';
                                    return (
                                        <div key={unit.id} style={{ marginBottom: 6 }}>
                                            {/* Unit card */}
                                            <div style={{ padding: '7px 9px', borderRadius: 7, background: `${iColor}18`, border: `1px solid ${iColor}44` }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: iColor, marginBottom: 2 }}>{unit.type}</div>
                                                <div style={{ fontSize: 12, color: 'var(--white)', fontWeight: 600 }}>{unit.discipline}</div>
                                                <div style={{ fontSize: 10, color: 'var(--grey-400)' }}>{unit.duration} min · {unit.intensity}</div>
                                                {unit.notes && <div style={{ fontSize: 9, color: 'var(--grey-600)', marginTop: 2, fontStyle: 'italic' }}>{unit.notes}</div>}
                                            </div>

                                            {/* Log preview */}
                                            {log ? (
                                                <button onClick={() => !isTrainer && openLogForm(date, unit)} style={{
                                                    width: '100%', marginTop: 4, padding: '5px 8px',
                                                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                                    borderRadius: 6, cursor: isTrainer ? 'default' : 'pointer', textAlign: 'left',
                                                }}>
                                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                        {log.feeling && (
                                                            <span style={{ fontSize: 10, color: FEELING_COLORS[log.feeling] }}>
                                😊 {log.feeling}/10
                              </span>
                                                        )}
                                                        {log.maxHr && <span style={{ fontSize: 10, color: '#f87171' }}>♥ {log.maxHr}</span>}
                                                        {log.avgPace && <span style={{ fontSize: 10, color: 'var(--blue-light)' }}>⏱ {log.avgPace}</span>}
                                                        {log.lactate && <span style={{ fontSize: 10, color: 'var(--accent)' }}>La {log.lactate}</span>}
                                                    </div>
                                                    {log.notes && <div style={{ fontSize: 9, color: 'var(--grey-500)', marginTop: 2, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>„{log.notes}"</div>}
                                                </button>
                                            ) : (
                                                !isTrainer && (
                                                    <button onClick={() => openLogForm(date, unit)} style={{
                                                        width: '100%', marginTop: 4, padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                                        background: 'transparent', border: '1px dashed rgba(26,90,171,0.3)', borderRadius: 6, color: 'var(--grey-600)', fontSize: 10, cursor: 'pointer',
                                                    }}>
                                                        <Plus size={9} /> Eintrag
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary bar */}
            <div style={{ marginTop: 16, padding: '14px 18px', background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <SummaryItem label="Trainingseinheiten" value={Object.values(plan?.days || {}).flat().length} color="var(--blue-light)" />
                <SummaryItem label="Geplante Minuten" value={Object.values(plan?.days || {}).flat().reduce((s, u) => s + (u.duration || 0), 0)} color="var(--accent)" suffix="min" />
                <SummaryItem label="Logs diese Woche" value={logs.filter(l => l.athleteId === athleteId).length} color="#22c55e" />
                <SummaryItem label="Ø Feeling" value={
                    (() => {
                        const wl = logs.filter(l => l.athleteId === athleteId && l.feeling);
                        return wl.length ? (wl.reduce((s, l) => s + l.feeling, 0) / wl.length).toFixed(1) : '–';
                    })()
                } color="#f59e0b" />
            </div>

            {/* Log entry modal */}
            {logForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
                    <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.4)', borderRadius: 'var(--radius-lg)', padding: 24, width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, textTransform: 'uppercase' }}>Trainingslog</h2>
                                <p style={{ fontSize: 12, color: 'var(--grey-400)', marginTop: 2 }}>
                                    {logForm.date.toLocaleDateString('de-AT')} · {logForm.unit.discipline} · {logForm.unit.type}
                                </p>
                            </div>
                            <button onClick={() => setLogForm(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="var(--grey-400)" /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                            <MInput label="Ruhepuls (bpm)" icon={Heart} value={formData.restingHr} type="number"
                                    onChange={v => setFormData(p => ({ ...p, restingHr: v }))} placeholder="z.B. 52" />
                            <MInput label="Max. Puls (bpm)" icon={Heart} value={formData.maxHr} type="number"
                                    onChange={v => setFormData(p => ({ ...p, maxHr: v }))} placeholder="z.B. 185" />
                            <MInput label="Ø Tempo (min/km)" icon={Activity} value={formData.avgPace}
                                    onChange={v => setFormData(p => ({ ...p, avgPace: v }))} placeholder="z.B. 3:45" />
                            <MInput label="Laktat (mmol/L)" icon={Thermometer} value={formData.lactate} type="number"
                                    onChange={v => setFormData(p => ({ ...p, lactate: v }))} placeholder="z.B. 3.2" />
                        </div>

                        {/* Feeling slider */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={labelStyle}>Allgemeines Befinden <span style={{ color: FEELING_COLORS[formData.feeling], fontWeight: 700 }}>{formData.feeling}/10</span></label>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                    <button key={n} onClick={() => setFormData(p => ({ ...p, feeling: n }))} style={{
                                        flex: 1, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer',
                                        background: formData.feeling >= n ? FEELING_COLORS[n] : 'rgba(255,255,255,0.08)',
                                        fontSize: 11, fontWeight: 700, color: formData.feeling >= n ? 'white' : 'var(--grey-600)',
                                        transition: 'all 0.1s',
                                    }}>{n}</button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--grey-600)', marginTop: 3 }}>
                                <span>Sehr schlecht</span><span>Sehr gut</span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>Notizen</label>
                            <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                                      rows={3} placeholder="Wie hat sich das Training angefühlt? Besonderheiten…"
                                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(26,90,171,0.25)', borderRadius: 7, color: 'white', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={saveLog} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                <Save size={14} /> Speichern
                            </button>
                            <button onClick={() => setLogForm(null)} style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 8, color: 'var(--grey-400)', fontSize: 13, cursor: 'pointer' }}>
                                Abbrechen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MInput({ label, icon: Icon, value, onChange, placeholder, type = 'text' }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative' }}>
                <Icon size={12} color="var(--grey-600)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                       style={{ width: '100%', padding: '8px 10px 8px 28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(26,90,171,0.25)', borderRadius: 7, color: 'white', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
        </div>
    );
}

function SummaryItem({ label, value, color, suffix = '' }) {
    return (
        <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color }}>{value}{suffix}</div>
            <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{label}</div>
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: 11, color: 'var(--grey-400)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 };