import * as XLSX from 'xlsx';

/**
 * Exportiert einen Trainingsplan als Excel-Datei
 * plan: { name, group, week, year, days: { Montag: [{...}], ... } }
 */
export function exportPlanToExcel(plan) {
    const wb = XLSX.utils.book_new();

    const DAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];

    // ── Sheet 1: Wochenplan ───────────────────────────────────────────────────
    const planRows = [
        [`Trainingsplan: ${plan.name}`],
        [`Gruppe: ${plan.group}  |  KW ${plan.week}/${plan.year}`],
        [],
        ['Tag', 'Trainingsart', 'Disziplin', 'Dauer (min)', 'Intensität', 'Notizen'],
    ];

    DAYS.forEach(day => {
        const units = plan.days?.[day] || [];
        if (units.length === 0) {
            planRows.push([day, '—', '—', '—', '—', '—']);
        } else {
            units.forEach((u, i) => {
                planRows.push([i === 0 ? day : '', u.type, u.discipline, u.duration_min || u.duration, u.intensity, u.notes || '']);
            });
        }
    });

    const ws1 = XLSX.utils.aoa_to_sheet(planRows);

    // Column widths
    ws1['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 40 }];

    // Style header rows (bold simulation via cell comments — xlsx-js-style needed for full styling)
    XLSX.utils.book_append_sheet(wb, ws1, 'Wochenplan');

    // ── Sheet 2: Athleten-Logs (wenn vorhanden) ───────────────────────────────
    if (plan.logs && plan.logs.length > 0) {
        const logRows = [
            [`Athleten-Trainingslogs – ${plan.name}`],
            [],
            ['Datum', 'Athlet', 'Einheit', 'Ruhepuls', 'Max. Puls', 'Ø Tempo (min/km)', 'Feeling (1-10)', 'Laktat (mmol/L)', 'Notizen'],
        ];
        plan.logs.forEach(l => {
            logRows.push([
                l.date, l.athlete, l.unit,
                l.restingHr || '', l.maxHr || '', l.avgPace || '',
                l.feeling || '', l.lactate || '', l.notes || '',
            ]);
        });
        const ws2 = XLSX.utils.aoa_to_sheet(logRows);
        ws2['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 40 }];
        XLSX.utils.book_append_sheet(wb, ws2, 'Athleten-Logs');
    }

    // ── Sheet 3: Laktat-Testwerte (wenn vorhanden) ────────────────────────────
    if (plan.lactatTests && plan.lactatTests.length > 0) {
        const ltRows = [
            ['Laktat-Stufentest'],
            [],
            ['Datum', 'Athlet', 'Stufe', 'Belastung', 'Tempo / Watt', 'Laktat (mmol/L)', 'Puls (bpm)', 'Notizen'],
        ];
        plan.lactatTests.forEach(t => {
            ltRows.push([t.date, t.athlete, t.stage, t.load, t.pace, t.lactate, t.hr, t.notes || '']);
        });
        const ws3 = XLSX.utils.aoa_to_sheet(ltRows);
        ws3['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, ws3, 'Laktat-Tests');
    }

    // Download
    const filename = `LCAV_Trainingsplan_${plan.group}_KW${plan.week}_${plan.year}.xlsx`;
    XLSX.writeFile(wb, filename);
}

/**
 * Exportiert Athleten-Übersicht als Excel
 */
export function exportAthleteOverview(athlete, logs, lactatTests) {
    const wb = XLSX.utils.book_new();

    // Training logs
    const logRows = [
        [`Trainingslog – ${athlete.name}`],
        [`Gruppe: ${athlete.group}  |  Export: ${new Date().toLocaleDateString('de-AT')}`],
        [],
        ['Datum', 'Einheit', 'Disziplin', 'Ruhepuls', 'Max. Puls', 'Ø Tempo', 'Feeling', 'Laktat', 'Notizen'],
        ...logs.map(l => [l.date, l.unit, l.discipline, l.restingHr||'', l.maxHr||'', l.avgPace||'', l.feeling||'', l.lactate||'', l.notes||'']),
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(logRows);
    ws1['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Trainingslogs');

    // Laktat
    if (lactatTests?.length > 0) {
        const ltRows = [
            [`Laktat-Stufentests – ${athlete.name}`], [],
            ['Datum', 'Stufe', 'Belastung', 'Tempo/Watt', 'Laktat (mmol/L)', 'Puls (bpm)', 'Notizen'],
            ...lactatTests.map(t => [t.date, t.stage, t.load, t.pace, t.lactate, t.hr, t.notes||'']),
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(ltRows);
        XLSX.utils.book_append_sheet(wb, ws2, 'Laktat-Tests');
    }

    XLSX.writeFile(wb, `LCAV_Athlet_${athlete.name.replace(' ', '_')}.xlsx`);
}