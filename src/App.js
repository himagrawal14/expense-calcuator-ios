import { useState, useMemo } from "react";

const CATEGORIES = [
  { id: "food", label: "Food", color: "#EF9F27", bg: "#412402" },
  { id: "transport", label: "Transport", color: "#85B7EB", bg: "#042C53" },
  { id: "shopping", label: "Shopping", color: "#ED93B1", bg: "#4B1528" },
  { id: "health", label: "Health", color: "#97C459", bg: "#173404" },
  { id: "bills", label: "Bills", color: "#F0997B", bg: "#4A1B0C" },
  { id: "other", label: "Other", color: "#AFA9EC", bg: "#26215C" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const now = new Date();

function genId() { return Math.random().toString(36).slice(2); }

export default function App() {
  const [expenses, setExpenses] = useState([
    { id: genId(), name: "Groceries", amount: 85.5, category: "food", date: "2025-03-20" },
    { id: genId(), name: "Uber", amount: 18.0, category: "transport", date: "2025-03-19" },
    { id: genId(), name: "Netflix", amount: 15.99, category: "bills", date: "2025-03-18" },
    { id: genId(), name: "Gym", amount: 40.0, category: "health", date: "2025-03-15" },
  ]);
  const [tab, setTab] = useState("home");
  const [form, setForm] = useState({ name: "", amount: "", category: "food", date: new Date().toISOString().slice(0,10) });
  const [filterCat, setFilterCat] = useState("all");
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear] = useState(now.getFullYear());

  const monthExpenses = useMemo(() =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    }), [expenses, viewMonth, viewYear]);

  const filtered = filterCat === "all" ? monthExpenses : monthExpenses.filter(e => e.category === filterCat);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const catTotals = useMemo(() =>
    CATEGORIES.map(c => ({
      ...c,
      total: monthExpenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0)
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total),
    [monthExpenses]);

  const grandTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);

  function addExpense() {
    if (!form.name.trim() || !form.amount || isNaN(parseFloat(form.amount))) return;
    setExpenses(prev => [{ id: genId(), name: form.name.trim(), amount: parseFloat(form.amount), category: form.category, date: form.date }, ...prev]);
    setForm(f => ({ ...f, name: "", amount: "" }));
    setTab("home");
  }

  function deleteExpense(id) { setExpenses(prev => prev.filter(e => e.id !== id)); }

  const cat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[5];

  const s = {
    wrap: { background: "#111", minHeight: "100vh", color: "#f0f0f0", fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif", maxWidth: 390, margin: "0 auto", display: "flex", flexDirection: "column" },
    statusBar: { height: 44, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 8 },
    time: { fontSize: 15, fontWeight: 600, color: "#f0f0f0" },
    screen: { flex: 1, overflowY: "auto", paddingBottom: 80 },
    header: { padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    h1: { fontSize: 28, fontWeight: 700, margin: 0, color: "#f0f0f0" },
    monthRow: { display: "flex", gap: 8, padding: "8px 20px", overflowX: "auto" },
    monthBtn: (active) => ({ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, background: active ? "#f0f0f0" : "#222", color: active ? "#111" : "#999", whiteSpace: "nowrap", flexShrink: 0 }),
    totalCard: { margin: "12px 16px", background: "linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius: 20, padding: "20px 24px", border: "0.5px solid #333" },
    totalLabel: { fontSize: 13, color: "#888", marginBottom: 4 },
    totalAmount: { fontSize: 42, fontWeight: 700, color: "#f0f0f0", letterSpacing: -1 },
    totalSub: { fontSize: 13, color: "#666", marginTop: 4 },
    section: { padding: "16px 20px 4px", fontSize: 17, fontWeight: 600, color: "#f0f0f0" },
    catRow: { display: "flex", gap: 8, padding: "4px 16px 12px", overflowX: "auto" },
    catChip: (active, c) => ({ padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? c.color : "#333"}`, cursor: "pointer", fontSize: 12, fontWeight: 600, background: active ? c.bg : "transparent", color: active ? c.color : "#777", whiteSpace: "nowrap", flexShrink: 0 }),
    allChip: (active) => ({ padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? "#f0f0f0" : "#333"}`, cursor: "pointer", fontSize: 12, fontWeight: 600, background: active ? "#f0f0f0" : "transparent", color: active ? "#111" : "#777", whiteSpace: "nowrap", flexShrink: 0 }),
    expList: { padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 },
    expCard: { background: "#1c1c1e", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: "0.5px solid #2a2a2a" },
    expIcon: (c) => ({ width: 40, height: 40, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700, color: c.color }),
    expInfo: { flex: 1 },
    expName: { fontSize: 15, fontWeight: 500, color: "#f0f0f0" },
    expMeta: { fontSize: 12, color: "#666", marginTop: 2 },
    expAmount: { fontSize: 16, fontWeight: 600, color: "#f0f0f0" },
    delBtn: { background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer", padding: "0 0 0 8px" },
    barItem: { display: "flex", alignItems: "center", gap: 10, margin: "6px 16px" },
    barLabel: { fontSize: 13, color: "#888", width: 72, flexShrink: 0 },
    barTrack: { flex: 1, background: "#222", borderRadius: 6, height: 8, overflow: "hidden" },
    barFill: (c, pct) => ({ height: "100%", borderRadius: 6, background: c.color, width: `${pct}%` }),
    barVal: { fontSize: 13, color: "#f0f0f0", width: 58, textAlign: "right", fontVariantNumeric: "tabular-nums" },
    tabBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, background: "#111", borderTop: "0.5px solid #222", display: "flex", height: 72, paddingBottom: 12 },
    tabBtn: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: "none", background: "none", cursor: "pointer", color: active ? "#f0f0f0" : "#555" }),
    tabLabel: { fontSize: 10, fontWeight: 500 },
    addBtn: { width: 52, height: 52, borderRadius: 26, background: "#f0f0f0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -16 },
    formWrap: { padding: "20px 20px" },
    formCard: { background: "#1c1c1e", borderRadius: 18, padding: 0, overflow: "hidden", border: "0.5px solid #2a2a2a" },
    formRow: { padding: "14px 16px", borderBottom: "0.5px solid #222", display: "flex", alignItems: "center", gap: 12 },
    formLabel: { fontSize: 13, color: "#666", width: 80, flexShrink: 0 },
    formInput: { flex: 1, background: "none", border: "none", color: "#f0f0f0", fontSize: 15, outline: "none" },
    formSelect: { flex: 1, background: "none", border: "none", color: "#f0f0f0", fontSize: 15, outline: "none" },
    saveBtn: { margin: "20px 0 0", width: "100%", padding: "16px", borderRadius: 14, background: "#f0f0f0", border: "none", color: "#111", fontSize: 16, fontWeight: 600, cursor: "pointer" },
    emptyText: { textAlign: "center", color: "#555", fontSize: 14, padding: "32px 0" },
  };

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={s.wrap}>
      <div style={s.statusBar}><span style={s.time}>{timeStr}</span></div>
      <div style={s.screen}>

        {tab === "home" && <>
          <div style={s.header}>
            <h1 style={s.h1}>Expenses</h1>
            <span style={{ fontSize: 13, color: "#666" }}>{viewYear}</span>
          </div>

          <div style={s.monthRow}>
            {MONTHS.map((m, i) => (
              <button key={m} style={s.monthBtn(i === viewMonth)} onClick={() => setViewMonth(i)}>{m}</button>
            ))}
          </div>

          <div style={s.totalCard}>
            <div style={s.totalLabel}>Total spent</div>
            <div style={s.totalAmount}>${grandTotal.toFixed(2)}</div>
            <div style={s.totalSub}>{monthExpenses.length} transactions · {MONTHS[viewMonth]}</div>
          </div>

          {catTotals.length > 0 && <>
            <div style={s.section}>By category</div>
            {catTotals.map(c => (
              <div key={c.id} style={s.barItem}>
                <div style={s.barLabel}>{c.label}</div>
                <div style={s.barTrack}><div style={s.barFill(c, grandTotal ? (c.total / grandTotal) * 100 : 0)} /></div>
                <div style={s.barVal}>${c.total.toFixed(0)}</div>
              </div>
            ))}
          </>}

          <div style={s.section}>Transactions</div>
          <div style={s.catRow}>
            <button style={s.allChip(filterCat === "all")} onClick={() => setFilterCat("all")}>All</button>
            {CATEGORIES.map(c => (
              <button key={c.id} style={s.catChip(filterCat === c.id, c)} onClick={() => setFilterCat(c.id)}>{c.label}</button>
            ))}
          </div>

          <div style={s.expList}>
            {filtered.length === 0 && <div style={s.emptyText}>No expenses this month</div>}
            {filtered.map(e => {
              const c = cat(e.category);
              return (
                <div key={e.id} style={s.expCard}>
                  <div style={s.expIcon(c)}>{c.label.slice(0,2)}</div>
                  <div style={s.expInfo}>
                    <div style={s.expName}>{e.name}</div>
                    <div style={s.expMeta}>{c.label} · {new Date(e.date + "T00:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}</div>
                  </div>
                  <div style={s.expAmount}>-${e.amount.toFixed(2)}</div>
                  <button style={s.delBtn} onClick={() => deleteExpense(e.id)}>×</button>
                </div>
              );
            })}
          </div>
        </>}

        {tab === "add" && <>
          <div style={s.header}><h1 style={s.h1}>Add expense</h1></div>
          <div style={s.formWrap}>
            <div style={s.formCard}>
              <div style={s.formRow}>
                <span style={s.formLabel}>Name</span>
                <input style={s.formInput} placeholder="e.g. Coffee" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={s.formRow}>
                <span style={s.formLabel}>Amount</span>
                <input style={s.formInput} placeholder="0.00" type="number" inputMode="decimal" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div style={s.formRow}>
                <span style={s.formLabel}>Category</span>
                <select style={s.formSelect} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ ...s.formRow, borderBottom: "none" }}>
                <span style={s.formLabel}>Date</span>
                <input style={s.formInput} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <button style={s.saveBtn} onClick={addExpense}>Save expense</button>
          </div>
        </>}

      </div>

      <div style={s.tabBar}>
        <button style={s.tabBtn(tab === "home")} onClick={() => setTab("home")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M9 21V12h6v9"/></svg>
          <span style={s.tabLabel}>Home</span>
        </button>
        <button style={s.tabBtn(tab === "add")} onClick={() => setTab("add")}>
          <div style={s.addBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </button>
        <button style={s.tabBtn(false)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          <span style={s.tabLabel}>History</span>
        </button>
      </div>
    </div>
  );
}
