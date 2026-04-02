import { useState, useMemo } from "react";

const TRANSACTIONS = [
  { id: 1, date: "2024-03-01", description: "Salary", amount: 85000, category: "Income", type: "income" },
  { id: 2, date: "2024-03-02", description: "Rent", amount: 18000, category: "Housing", type: "expense" },
  { id: 3, date: "2024-03-04", description: "Groceries", amount: 3200, category: "Food", type: "expense" },
  { id: 4, date: "2024-03-05", description: "Swiggy", amount: 850, category: "Food", type: "expense" },
  { id: 5, date: "2024-03-07", description: "Netflix", amount: 649, category: "Entertainment", type: "expense" },
  { id: 6, date: "2024-03-08", description: "Electricity Bill", amount: 1200, category: "Utilities", type: "expense" },
  { id: 7, date: "2024-03-10", description: "Freelance Project", amount: 15000, category: "Income", type: "income" },
  { id: 8, date: "2024-03-12", description: "Metro Card", amount: 500, category: "Transport", type: "expense" },
  { id: 9, date: "2024-03-14", description: "Gym", amount: 1500, category: "Health", type: "expense" },
  { id: 10, date: "2024-03-15", description: "Zomato", amount: 650, category: "Food", type: "expense" },
  { id: 11, date: "2024-03-17", description: "Amazon Purchase", amount: 2300, category: "Shopping", type: "expense" },
  { id: 12, date: "2024-03-18", description: "Internet Bill", amount: 999, category: "Utilities", type: "expense" },
  { id: 13, date: "2024-03-20", description: "Bonus", amount: 10000, category: "Income", type: "income" },
  { id: 14, date: "2024-03-22", description: "Doctor Visit", amount: 800, category: "Health", type: "expense" },
  { id: 15, date: "2024-03-25", description: "Petrol", amount: 1100, category: "Transport", type: "expense" },
  { id: 16, date: "2024-03-26", description: "Movie Tickets", amount: 600, category: "Entertainment", type: "expense" },
  { id: 17, date: "2024-03-28", description: "Coffee Subscription", amount: 299, category: "Food", type: "expense" },
  { id: 18, date: "2024-03-29", description: "Online Course", amount: 1999, category: "Education", type: "expense" },
];

const MONTHLY = [
  { month: "Oct", income: 85000, expense: 28000 },
  { month: "Nov", income: 87000, expense: 31000 },
  { month: "Dec", income: 92000, expense: 38000 },
  { month: "Jan", income: 85000, expense: 29000 },
  { month: "Feb", income: 88000, expense: 27000 },
  { month: "Mar", income: 110000, expense: 34646 },
];

const CATEGORY_COLORS = {
  Food: "#1D9E75",
  Housing: "#378ADD",
  Entertainment: "#D4537E",
  Utilities: "#BA7517",
  Transport: "#7F77DD",
  Health: "#D85A30",
  Shopping: "#639922",
  Education: "#533AB7",
  Income: "#0F6E56",
};

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

export default function FinanceDashboard() {
  const [role, setRole] = useState("viewer");
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTx, setNewTx] = useState({ description: "", amount: "", category: "Food", type: "expense", date: "2024-03-30" });

  const totalIncome = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance = totalIncome - totalExpense;

  const categoryTotals = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const topCategory = categoryTotals[0];

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "date") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "amount") list.sort((a, b) => b.amount - a.amount);
    if (sortBy === "category") list.sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [transactions, filterType, search, sortBy]);

  const maxBar = Math.max(...MONTHLY.map(m => m.income));

  const handleAdd = () => {
    if (!newTx.description || !newTx.amount) return;
    const tx = { ...newTx, id: Date.now(), amount: parseInt(newTx.amount) };
    setTransactions(prev => [tx, ...prev]);
    setShowAddForm(false);
    setNewTx({ description: "", amount: "", category: "Food", type: "expense", date: "2024-03-30" });
  };

  const handleDelete = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const styles = {
    app: { fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#f5f5f0", color: "#1a1a1a" },
    header: { background: "#fff", borderBottom: "1px solid #e5e5e0", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 },
    logo: { fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" },
    roleSelect: { fontSize: 13, padding: "4px 10px", borderRadius: 6, border: "1px solid #d5d5d0", background: "#f9f9f6", cursor: "pointer" },
    roleBadge: { fontSize: 11, padding: "2px 8px", borderRadius: 20, background: role === "admin" ? "#E1F5EE" : "#E6F1FB", color: role === "admin" ? "#0F6E56" : "#185FA5", fontWeight: 500, marginLeft: 8 },
    main: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
    tabs: { display: "flex", gap: 4, marginBottom: 24, background: "#fff", borderRadius: 10, padding: 4, border: "1px solid #e5e5e0", width: "fit-content" },
    tab: (active) => ({ padding: "6px 18px", borderRadius: 7, fontSize: 14, fontWeight: active ? 500 : 400, background: active ? "#1a1a1a" : "transparent", color: active ? "#fff" : "#666", border: "none", cursor: "pointer", transition: "all 0.15s" }),
    cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 },
    card: (accent) => ({ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e5e5e0", borderLeft: `3px solid ${accent}` }),
    cardLabel: { fontSize: 12, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" },
    cardValue: { fontSize: 22, fontWeight: 600, letterSpacing: "-0.5px" },
    section: { background: "#fff", borderRadius: 12, border: "1px solid #e5e5e0", padding: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#333" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
    barWrap: { display: "flex", flexDirection: "column", gap: 8 },
    barRow: { display: "flex", alignItems: "center", gap: 10 },
    barLabel: { fontSize: 12, color: "#666", width: 32, textAlign: "right", flexShrink: 0 },
    barTrack: { flex: 1, height: 8, background: "#f0f0ec", borderRadius: 4, overflow: "hidden" },
    txList: { display: "flex", flexDirection: "column", gap: 1 },
    txRow: { display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0ec", gap: 12 },
    txDot: (type) => ({ width: 8, height: 8, borderRadius: "50%", background: type === "income" ? "#1D9E75" : "#E24B4A", flexShrink: 0 }),
    txDesc: { flex: 1, fontSize: 14 },
    txMeta: { fontSize: 12, color: "#999" },
    txAmount: (type) => ({ fontWeight: 500, fontSize: 14, color: type === "income" ? "#0F6E56" : "#A32D2D" }),
    pill: (cat) => ({ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: CATEGORY_COLORS[cat] + "20", color: CATEGORY_COLORS[cat], fontWeight: 500 }),
    input: { padding: "8px 12px", border: "1px solid #d5d5d0", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box", background: "#fafaf8" },
    btn: (variant) => ({ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", background: variant === "primary" ? "#1a1a1a" : variant === "danger" ? "#FCebed" : "#f0f0ec", color: variant === "primary" ? "#fff" : variant === "danger" ? "#A32D2D" : "#444", }),
    emptyState: { textAlign: "center", padding: "40px 0", color: "#999", fontSize: 14 },
    insightCard: { background: "#f9f9f6", borderRadius: 8, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 },
    insightIcon: { fontSize: 18, flexShrink: 0 },
    insightText: { fontSize: 13, color: "#555", lineHeight: 1.5 },
    insightBold: { fontWeight: 600, color: "#1a1a1a", display: "block", marginBottom: 2 },
  };

  const pieTotal = categoryTotals.reduce((s, [, v]) => s + v, 0);
  let angle = 0;
  const pieSlices = categoryTotals.slice(0, 6).map(([cat, val]) => {
    const pct = val / pieTotal;
    const start = angle;
    angle += pct * 360;
    return { cat, val, pct, start, end: angle };
  });

  const polarToXY = (deg, r) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: 80 + r * Math.cos(rad), y: 80 + r * Math.sin(rad) };
  };

  const makeArc = (startDeg, endDeg, r) => {
    const s = polarToXY(startDeg, r);
    const e = polarToXY(endDeg, r);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M 80 80 L ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)} Z`;
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <span style={styles.logo}>FinanceBoard</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#999" }}>Role:</span>
          <select style={styles.roleSelect} value={role} onChange={e => setRole(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <span style={styles.roleBadge}>{role}</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.tabs}>
          {["overview", "transactions", "insights"].map(tab => (
            <button key={tab} style={styles.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <div style={styles.cards}>
              <div style={styles.card("#378ADD")}>
                <div style={styles.cardLabel}>Total Balance</div>
                <div style={{ ...styles.cardValue, color: balance >= 0 ? "#0F6E56" : "#A32D2D" }}>{fmt(balance)}</div>
              </div>
              <div style={styles.card("#1D9E75")}>
                <div style={styles.cardLabel}>Income</div>
                <div style={{ ...styles.cardValue, color: "#0F6E56" }}>{fmt(totalIncome)}</div>
              </div>
              <div style={styles.card("#E24B4A")}>
                <div style={styles.cardLabel}>Expenses</div>
                <div style={{ ...styles.cardValue, color: "#A32D2D" }}>{fmt(totalExpense)}</div>
              </div>
              <div style={styles.card("#BA7517")}>
                <div style={styles.cardLabel}>Savings Rate</div>
                <div style={{ ...styles.cardValue, color: "#854F0B" }}>{Math.round((balance / totalIncome) * 100)}%</div>
              </div>
            </div>

            <div style={styles.grid2}>
              <div style={styles.section}>
                <div style={styles.sectionTitle}>Monthly Overview</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {MONTHLY.map(m => (
                    <div key={m.month} style={styles.barRow}>
                      <span style={styles.barLabel}>{m.month}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                          <div style={{ height: 7, borderRadius: 4, background: "#1D9E75", width: `${(m.income / maxBar) * 100}%` }} />
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <div style={{ height: 7, borderRadius: 4, background: "#E24B4A", width: `${(m.expense / maxBar) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  {[["Income", "#1D9E75"], ["Expense", "#E24B4A"]].map(([l, c]) => (
                    <span key={l} style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />{l}
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionTitle}>Spending by Category</div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <svg width={160} height={160} viewBox="0 0 160 160">
                    {pieSlices.map(({ cat, start, end }) => (
                      <path key={cat} d={makeArc(start, end, 70)} fill={CATEGORY_COLORS[cat] || "#ccc"} stroke="#fff" strokeWidth={2} />
                    ))}
                    <circle cx={80} cy={80} r={36} fill="#fff" />
                    <text x={80} y={77} textAnchor="middle" fontSize={11} fill="#999">total</text>
                    <text x={80} y={92} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1a1a1a">{fmt(pieTotal)}</text>
                  </svg>
                  <div style={{ flex: 1 }}>
                    {categoryTotals.slice(0, 5).map(([cat, val]) => (
                      <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[cat] || "#ccc", display: "inline-block" }} />
                          {cat}
                        </span>
                        <span style={{ fontSize: 12, color: "#555" }}>{fmt(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Recent Transactions</div>
              {transactions.slice(0, 5).length === 0
                ? <div style={styles.emptyState}>No transactions yet.</div>
                : transactions.slice(0, 5).map(t => (
                  <div key={t.id} style={styles.txRow}>
                    <div style={styles.txDot(t.type)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14 }}>{t.description}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>{t.date}</div>
                    </div>
                    <span style={styles.pill(t.category)}>{t.category}</span>
                    <span style={styles.txAmount(t.type)}>{t.type === "income" ? "+" : "-"}{fmt(t.amount)}</span>
                  </div>
                ))}
            </div>
          </>
        )}

        {activeTab === "transactions" && (
          <div style={styles.section}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={styles.sectionTitle}>Transactions</div>
              {role === "admin" && (
                <button style={styles.btn("primary")} onClick={() => setShowAddForm(!showAddForm)}>
                  {showAddForm ? "Cancel" : "+ Add Transaction"}
                </button>
              )}
            </div>

            {showAddForm && role === "admin" && (
              <div style={{ background: "#f9f9f6", borderRadius: 10, padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <input style={styles.input} placeholder="Description" value={newTx.description} onChange={e => setNewTx(p => ({ ...p, description: e.target.value }))} />
                <input style={styles.input} type="number" placeholder="Amount (₹)" value={newTx.amount} onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))} />
                <select style={styles.input} value={newTx.category} onChange={e => setNewTx(p => ({ ...p, category: e.target.value }))}>
                  {Object.keys(CATEGORY_COLORS).filter(c => c !== "Income").map(c => <option key={c}>{c}</option>)}
                </select>
                <select style={styles.input} value={newTx.type} onChange={e => setNewTx(p => ({ ...p, type: e.target.value }))}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input style={styles.input} type="date" value={newTx.date} onChange={e => setNewTx(p => ({ ...p, date: e.target.value }))} />
                <button style={{ ...styles.btn("primary"), alignSelf: "flex-end" }} onClick={handleAdd}>Add</button>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <input style={{ ...styles.input, width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              <select style={{ ...styles.input, width: 130 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select style={{ ...styles.input, width: 140 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="date">Sort: Date</option>
                <option value="amount">Sort: Amount</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>

            {filtered.length === 0
              ? <div style={styles.emptyState}>No transactions match your filters.</div>
              : filtered.map(t => (
                <div key={t.id} style={styles.txRow}>
                  <div style={styles.txDot(t.type)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{t.description}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{t.date}</div>
                  </div>
                  <span style={styles.pill(t.category)}>{t.category}</span>
                  <span style={styles.txAmount(t.type)}>{t.type === "income" ? "+" : "-"}{fmt(t.amount)}</span>
                  {role === "admin" && (
                    <button style={{ ...styles.btn("danger"), padding: "4px 10px", fontSize: 12 }} onClick={() => handleDelete(t.id)}>Delete</button>
                  )}
                </div>
              ))}
          </div>
        )}

        {activeTab === "insights" && (
          <div>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Key Insights</div>
              {topCategory && (
                <div style={styles.insightCard}>
                  <span style={styles.insightIcon}>💸</span>
                  <div>
                    <span style={styles.insightBold}>Highest Spending: {topCategory[0]}</span>
                    <span style={styles.insightText}>You spent {fmt(topCategory[1])} on {topCategory[0]} this month — that's {Math.round((topCategory[1] / totalExpense) * 100)}% of total expenses.</span>
                  </div>
                </div>
              )}
              <div style={styles.insightCard}>
                <span style={styles.insightIcon}>📊</span>
                <div>
                  <span style={styles.insightBold}>Savings Rate: {Math.round((balance / totalIncome) * 100)}%</span>
                  <span style={styles.insightText}>You saved {fmt(balance)} out of {fmt(totalIncome)} earned. {balance / totalIncome > 0.2 ? "Good discipline — above 20% is a healthy benchmark." : "Try to aim for at least 20% savings."}</span>
                </div>
              </div>
              <div style={styles.insightCard}>
                <span style={styles.insightIcon}>📅</span>
                <div>
                  <span style={styles.insightBold}>Month-over-Month</span>
                  <span style={styles.insightText}>Expenses this month: {fmt(totalExpense)} vs last month: ₹27,000. That's a {Math.round(((totalExpense - 27000) / 27000) * 100)}% increase — mostly driven by {topCategory?.[0]}.</span>
                </div>
              </div>
              <div style={styles.insightCard}>
                <span style={styles.insightIcon}>🏆</span>
                <div>
                  <span style={styles.insightBold}>Total Transactions: {transactions.length}</span>
                  <span style={styles.insightText}>{transactions.filter(t => t.type === "income").length} income entries and {transactions.filter(t => t.type === "expense").length} expense entries logged this month.</span>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Spending Breakdown</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {categoryTotals.map(([cat, val]) => (
                  <div key={cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span>{cat}</span>
                      <span style={{ color: "#666" }}>{fmt(val)} <span style={{ color: "#aaa" }}>({Math.round((val / pieTotal) * 100)}%)</span></span>
                    </div>
                    <div style={{ height: 6, background: "#f0f0ec", borderRadius: 4 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: CATEGORY_COLORS[cat] || "#ccc", width: `${(val / pieTotal) * 100}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
