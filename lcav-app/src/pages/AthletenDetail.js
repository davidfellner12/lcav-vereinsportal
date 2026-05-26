import React, { useState } from 'react';
import {
    ArrowLeft, Heart, Activity, TrendingUp, Thermometer,
    Download, Calendar, Star, Plus, X, Save, ChevronDown, ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRAINING_LOGS, LACTATE_TESTS, FEELING_COLORS, INTENSITY_COLORS } from '../utils/trainingData';
import { exportAthleteOverview } from '../utils/excelExport';

const EMPTY_LAKTAT_STAGE = { stage: '', load: '', pace: '', lactate: '', hr: '', notes: '' };
const EMPTY_LAKTAT_TEST  = { date: new Date().toISOString().split('T')[0], stages: [{ ...EMPTY_LAKTAT_STAGE, stage: 1 }] };

export default function AthletenDetail() {
    const { setActivePage } = useApp();
    const athlete = (() => { try { return JSON.parse(localStorage.getItem('lcav_selected_athlete')); } catch { return null; } })();

    const [tab,          setTab]     = useState('logs');
    const [lactatTests,  setLaktat]  = useState(LACTATE_TESTS.filter(t => t.athleteId === athlete?.id));
    const [showNewTest,  setNewTest] = useState(false);
    const [newTest,      setNT]      = useState({ ...EMPTY_LAKTAT_TEST, stages: [{ ...EMPTY_LAKTAT_STAGE, stage: 1 }] });
    const [expandedTest, setExpTest] = useState(null);

    if (!athlete) {
        return (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--grey-400)' }}>
                Kein Athlet ausgewählt. <button onClick={() => setActivePage('trainerhub')} style={{ color: 'var(--blue-light)', background: 'none', border: 'none', cursor: 'pointer' }}>Zurück</button>
            </div>
        );
    }

    const logs = TRAINING_LOGS.filter(l => l.athleteId === athlete.id)
        .sort((a, b) => b.date.localeCompare(a.date));

    const avgFeeling = logs.length ? (logs.reduce((s, l) => s + (l.feeling||0), 0) / logs.length).toFixed(1) : '–';
    const maxHrPeak  = logs.reduce((m, l) => l.maxHr > m ? l.maxHr : m, 0);
    const bestPace   = logs.filter(l => l.avgPace).sort((a, b) => a.avgPace.localeCompare(b.avgPace))[0]?.avgPace || '–';
    const lastLaktat = lactatTests.slice(-1)[0]?.stages?.slice(-2)?.[0]?.lactate;

    const handleExport = () => exportAthleteOverview(athlete, logs.map(l => ({ ...l, unit: l.discipline })), lactatTests.flatMap(t => t.stages.map(s => ({ ...s, date: t.date, athlete: athlete.name }))));

    const addStage = () => setNT(p => ({ ...p, stages: [...p.stages, { ...EMPTY_LAKTAT_STAGE, stage: p.stages.length + 1 }] }));
    const updateStage = (i, field, val) => setNT(p => { const s = [...p.stages]; s[i] = { ...s[i], [field]: val }; return { ...p, stages: s }; });
    const saveTest = () => {
        setLaktat(prev => [...prev, { ...newTest, id: Date.now(), athleteId: athlete.id }]);
        setNT({ ...EMPTY_LAKTAT_TEST, stages: [{ ...EMPTY_LAKTAT_STAGE, stage: 1 }] });
        setNewTest(false);
    };

    return (
        <div style={{ padding: 28, maxWidth: 1200 }}>
            {/* Header */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setActivePage('trainerhub')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <ArrowLeft size={18} color="var(--grey-400)" />
                    </button>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--blue-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800 }}>
                        {athlete.avatar}
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>{athlete.name}</h1>
                        <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                            <span className="tag tag-blue">{athlete.group}</span>
                            {athlete.disciplines?.map(d => <span key={d} className="tag tag-grey" style={{ fontSize: 10 }}>{d}</span>)}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => { setActivePage('trainingsplan_kalender'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(26,90,171,0.15)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 8, color: 'var(--blue-light)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        <Calendar size={13} /> Kalender
                    </button>
                    <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(26,90,171,0.15)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 8, color: 'var(--blue-light)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        <Download size={13} /> Excel Export
                    </button>
                </div>
            </div>

            {/* KPI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Ø Befinden',     value: avgFeeling,              suffix: '/10', icon: Star,        color: FEELING_COLORS[Math.round(parseFloat(avgFeeling))] || 'var(--accent)' },
                    { label: 'Max. Puls Peak', value: maxHrPeak || '–',        suffix: maxHrPeak ? ' bpm' : '', icon: Heart,       color: '#f87171' },
                    { label: 'Beste Pace',     value: bestPace,                suffix: bestPace !== '–' ? '/km' : '', icon: Activity,    color: 'var(--blue-light)' },
                    { label: 'Letztes Laktat', value: lastLaktat || '–',       suffix: lastLaktat ? ' mmol' : '', icon: Thermometer,  color: 'var(--accent)' },
                ].map(({ label, value, suffix, icon: Icon, color }) => (
                    <div key={label} style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <div style={{ width: 28, height: 28, background: `${color}22`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={14} color={color} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>
                            {value}<span style={{ fontSize: 14, fontWeight: 600 }}>{suffix}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'var(--navy-mid)', padding: 4, borderRadius: 10, border: '1px solid rgba(26,90,171,0.2)', width: 'fit-content' }}>
                {[
                    { key: 'logs',   label: 'Trainingslogs',  icon: Activity },
                    { key: 'laktat', label: 'Laktat-Tests',    icon: Thermometer },
                    { key: 'puls',   label: 'Puls-Übersicht',  icon: Heart },
                ].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setTab(key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600, background: tab === key ? 'var(--blue)' : 'transparent', border: 'none', color: tab === key ? 'white' : 'var(--grey-400)', cursor: 'pointer' }}>
                        <Icon size={13} />{label}
                    </button>
                ))}
            </div>

            {/* ── TRAINING LOGS TAB ─────────────────────────────────────────────── */}
            {tab === 'logs' && (
                <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 80px 80px 80px 80px 80px', padding: '10px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)' }}>
                        {['Datum','Einheit / Notizen','Ruhepuls','Max. Puls','Ø Tempo','Laktat','Befinden'].map(h => (
                            <div key={h} style={{ fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{h}</div>
                        ))}
                    </div>

                    {logs.length === 0 && (
                        <div style={{ padding: 32, textAlign: 'center', color: 'var(--grey-600)', fontSize: 13 }}>Noch keine Logs vorhanden.</div>
                    )}

                    {logs.map((l, i) => (
                        <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 80px 80px 80px 80px 80px', alignItems: 'center', padding: '11px 18px', borderBottom: i < logs.length - 1 ? '1px solid rgba(26,90,171,0.07)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}>
                            <div style={{ fontSize: 12, color: 'var(--grey-400)' }}>{l.date}</div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.discipline}</div>
                                {l.notes && <div style={{ fontSize: 11, color: 'var(--grey-600)', fontStyle: 'italic' }}>„{l.notes}"</div>}
                            </div>
                            <HRCell value={l.restingHr} color="#94a3b8" />
                            <HRCell value={l.maxHr} color="#f87171" />
                            <div style={{ fontSize: 12, color: 'var(--blue-light)', fontWeight: 600 }}>{l.avgPace ? `${l.avgPace}` : '–'}</div>
                            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{l.lactate ? `${l.lactate}` : '–'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {l.feeling && (
                                    <>
                                        <div style={{ width: 28, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ width: `${l.feeling * 10}%`, height: '100%', background: FEELING_COLORS[l.feeling], borderRadius: 3 }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: FEELING_COLORS[l.feeling], fontWeight: 700 }}>{l.feeling}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── LAKTAT TAB ────────────────────────────────────────────────────── */}
            {tab === 'laktat' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                        <button onClick={() => setNewTest(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            <Plus size={14} /> Neuer Laktat-Test
                        </button>
                    </div>

                    {/* New test form */}
                    {showNewTest && (
                        <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.35)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, textTransform: 'uppercase' }}>Neuer Laktat-Stufentest</h3>
                                <button onClick={() => setNewTest(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="var(--grey-400)" /></button>
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={lStyle}>Testdatum</label>
                                <input type="date" value={newTest.date} onChange={e => setNT(p => ({ ...p, date: e.target.value }))}
                                       style={{ padding: '7px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 7, color: 'white', fontSize: 13, outline: 'none' }} />
                            </div>

                            {/* Stages */}
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 100px 80px 1fr', gap: 8, marginBottom: 8 }}>
                                    {['Stufe','Belastung','Tempo / Watt','Laktat (mmol)','Puls','Notizen'].map(h => (
                                        <div key={h} style={{ fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{h}</div>
                                    ))}
                                </div>
                                {newTest.stages.map((s, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 100px 80px 1fr', gap: 8, marginBottom: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--blue-light)' }}>{i + 1}</div>
                                        {['load','pace','lactate','hr','notes'].map(f => (
                                            <input key={f} value={s[f]} onChange={e => updateStage(i, f, e.target.value)}
                                                   placeholder={f === 'load' ? 'z.B. 3:00 min/km' : f === 'pace' ? 'z.B. 3:00' : f === 'lactate' ? 'z.B. 2.4' : f === 'hr' ? 'z.B. 155' : ''}
                                                   style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(26,90,171,0.25)', borderRadius: 6, color: 'white', fontSize: 12, outline: 'none' }} />
                                        ))}
                                    </div>
                                ))}
                                <button onClick={addStage} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'transparent', border: '1px dashed rgba(26,90,171,0.3)', borderRadius: 6, color: 'var(--blue-light)', fontSize: 12, cursor: 'pointer', marginTop: 4 }}>
                                    <Plus size={11} /> Stufe hinzufügen
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={saveTest} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--blue)', border: 'none', borderRadius: 7, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                    <Save size={13} /> Test speichern
                                </button>
                                <button onClick={() => setNewTest(false)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid rgba(26,90,171,0.3)', borderRadius: 7, color: 'var(--grey-400)', fontSize: 13, cursor: 'pointer' }}>Abbrechen</button>
                            </div>
                        </div>
                    )}

                    {/* Existing tests */}
                    {lactatTests.length === 0 && !showNewTest && (
                        <div style={{ padding: 32, textAlign: 'center', color: 'var(--grey-600)', fontSize: 13 }}>Noch keine Laktat-Tests erfasst.</div>
                    )}

                    {lactatTests.map(test => (
                        <div key={test.id} style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 12 }}>
                            <button onClick={() => setExpTest(expandedTest === test.id ? null : test.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white)' }}>
                                <Thermometer size={16} color="var(--accent)" />
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Laktat-Stufentest · {test.date}</span>
                                <span className="tag tag-gold">{test.stages.length} Stufen</span>
                                {/* Find anaerobic threshold (first stage > 4 mmol) */}
                                {(() => {
                                    const thresh = test.stages.find(s => parseFloat(s.lactate) >= 4);
                                    return thresh ? <span className="tag tag-red">Schwelle ~{thresh.pace}/km</span> : null;
                                })()}
                                <span style={{ marginLeft: 'auto' }}>{expandedTest === test.id ? <ChevronUp size={14} color="var(--grey-400)" /> : <ChevronDown size={14} color="var(--grey-400)" />}</span>
                            </button>

                            {expandedTest === test.id && (
                                <div style={{ borderTop: '1px solid rgba(26,90,171,0.15)', padding: '14px 18px' }}>
                                    {/* Visual chart bars */}
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, marginBottom: 14 }}>
                                        {test.stages.map((s, i) => {
                                            const val = parseFloat(s.lactate) || 0;
                                            const max = Math.max(...test.stages.map(x => parseFloat(x.lactate) || 0));
                                            const pct = max ? (val / max) * 100 : 0;
                                            const col = val < 2 ? '#22c55e' : val < 4 ? '#f59e0b' : '#ef4444';
                                            return (
                                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                                    <span style={{ fontSize: 9, color: col, fontWeight: 700 }}>{s.lactate}</span>
                                                    <div style={{ width: '100%', background: `${col}22`, border: `1px solid ${col}44`, borderRadius: '3px 3px 0 0', height: `${Math.max(pct, 8)}%`, transition: 'height 0.3s' }} />
                                                    <span style={{ fontSize: 9, color: 'var(--grey-600)' }}>S{i + 1}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Table */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 100px 80px 1fr' }}>
                                        {['Stufe','Belastung','Tempo/Watt','Laktat','Puls','Notizen'].map(h => (
                                            <div key={h} style={{ padding: '6px 8px', fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, borderBottom: '1px solid rgba(26,90,171,0.1)' }}>{h}</div>
                                        ))}
                                        {test.stages.map((s, i) => {
                                            const lv = parseFloat(s.lactate) || 0;
                                            const col = lv < 2 ? '#22c55e' : lv < 4 ? '#f59e0b' : '#ef4444';
                                            return (
                                                <React.Fragment key={i}>
                                                    <Cell v={s.stage} bold center />
                                                    <Cell v={s.load} />
                                                    <Cell v={s.pace} />
                                                    <Cell v={s.lactate ? `${s.lactate} mmol` : '–'} color={col} bold />
                                                    <Cell v={s.hr ? `${s.hr} bpm` : '–'} color="#f87171" />
                                                    <Cell v={s.notes || '–'} small />
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── PULS TAB ──────────────────────────────────────────────────────── */}
            {tab === 'puls' && (
                <div>
                    {/* HR zones reference */}
                    <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', padding: 18, marginBottom: 16 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Herzfrequenz-Zonen</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                            {[
                                { zone: 'Z1', label: 'Regeneration',   pct: '50–60%', color: '#3b82f6', desc: 'Sehr leicht' },
                                { zone: 'Z2', label: 'Grundlage',      pct: '60–70%', color: '#22c55e', desc: 'Leicht' },
                                { zone: 'Z3', label: 'Aerob',          pct: '70–80%', color: '#f59e0b', desc: 'Moderat' },
                                { zone: 'Z4', label: 'Anaerob',        pct: '80–90%', color: '#f97316', desc: 'Hart' },
                                { zone: 'Z5', label: 'VO₂max',         pct: '90–100%',color: '#ef4444', desc: 'Maximum' },
                            ].map(z => (
                                <div key={z.zone} style={{ padding: '10px 12px', background: `${z.color}15`, border: `1px solid ${z.color}33`, borderRadius: 8 }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: z.color }}>{z.zone}</div>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{z.label}</div>
                                    <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{z.pct} HFmax</div>
                                    <div style={{ fontSize: 10, color: 'var(--grey-600)' }}>{z.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HR log table */}
                    <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>Puls-Verlauf aus Trainings</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 90px 90px 90px 90px', padding: '8px 18px', borderBottom: '1px solid rgba(26,90,171,0.1)' }}>
                            {['Datum','Einheit','Ruhepuls','Max. Puls','Ø Tempo','Laktat'].map(h => (
                                <div key={h} style={{ fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{h}</div>
                            ))}
                        </div>
                        {logs.filter(l => l.restingHr || l.maxHr).map((l, i) => (
                            <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 90px 90px 90px 90px', alignItems: 'center', padding: '10px 18px', borderBottom: i < logs.length - 1 ? '1px solid rgba(26,90,171,0.07)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}>
                                <div style={{ fontSize: 12, color: 'var(--grey-400)' }}>{l.date}</div>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{l.discipline}</div>
                                <HRCell value={l.restingHr} color="#94a3b8" suffix=" bpm" />
                                <HRCell value={l.maxHr} color="#f87171" suffix=" bpm" />
                                <div style={{ fontSize: 12, color: 'var(--blue-light)' }}>{l.avgPace || '–'}</div>
                                <div style={{ fontSize: 12, color: 'var(--accent)' }}>{l.lactate ? `${l.lactate} mmol` : '–'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function HRCell({ value, color, suffix = '' }) {
    return <div style={{ fontSize: 12, color: value ? color : 'var(--grey-600)', fontWeight: value ? 600 : 400 }}>{value ? `${value}${suffix}` : '–'}</div>;
}

function Cell({ v, color, bold, small, center }) {
    return (
        <div style={{ padding: '8px 8px', fontSize: small ? 11 : 12, color: color || 'var(--white)', fontWeight: bold ? 700 : 400, borderBottom: '1px solid rgba(26,90,171,0.05)', textAlign: center ? 'center' : 'left', fontFamily: bold ? 'var(--font-display)' : 'var(--font-body)' }}>{v || '–'}</div>
    );
}

const lStyle = { display: 'block', fontSize: 11, color: 'var(--grey-400)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 };