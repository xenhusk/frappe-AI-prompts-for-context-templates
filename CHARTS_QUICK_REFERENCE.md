# 📊 Charts & Metrics Quick Reference

## 🎯 At a Glance

---

## 👔 ADMISSION HEAD PORTAL

### Overview Section (Landing Page)
```
┌─────────────────────────────────────────────────────┐
│  📊 6 METRIC CARDS                                  │
│  • Total Applications                               │
│  • Pending Review                                   │
│  • Unassigned                                       │
│  • Approved (30d)                                   │
│  • Rejected (30d)                                   │
│  • Approval Rate                                    │
└─────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  🍩 Status           │  │  📈 Applications     │
│  Distribution        │  │  Trend (30 Days)     │
│  (Donut Chart)       │  │  (Area Chart)        │
└──────────────────────┘  └──────────────────────┘
```

### Reports Section (Detailed Analytics)
```
┌──────────────────────┐  ┌──────────────────────┐
│  📊 Programs         │  │  🥧 Categories       │
│  (Horizontal Bar)    │  │  (Pie Chart)         │
└──────────────────────┘  └──────────────────────┘

┌───────────────────────────────────────────────────┐
│  👥 Staff Performance                             │
│  (Stacked Bar - Approved/Rejected/Pending)        │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  📉 30-Day Detailed Trend                         │
│  (Multi-Line - Submitted/Approved/Rejected)       │
└───────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  ⭕ Processing Rate   │  │  📊 Weekly Compare   │
│  (Radial Bar)        │  │  (Bar Chart)         │
└──────────────────────┘  └──────────────────────┘

┌───────────────────────────────────────────────────┐
│  📋 DETAILED STATISTICS TABLE                     │
│  All metrics with 30-day changes                  │
└───────────────────────────────────────────────────┘
```

**Total Charts: 8 charts**
- 2 in Overview
- 6 in Reports
- 1 statistics table

---

## 👤 ADMISSION STAFF PORTAL

### Overview Section (Landing Page)
```
┌─────────────────────────────────────────────────────┐
│  📊 4 METRIC CARDS (Personal)                       │
│  • My Total Assignments                             │
│  • Pending Action                                   │
│  • Completed (30d)                                  │
│  • My Approval Rate                                 │
└─────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  🍩 My Applications  │  │  📊 My Activity      │
│  by Status           │  │  (Last 7 Days)       │
│  (Donut Chart)       │  │  (Bar Chart)         │
└──────────────────────┘  └──────────────────────┘
```

### Reports Section (Personal Performance)
```
┌───────────────────────────────────────────────────┐
│  📈 My Processing Timeline (30 Days)              │
│  (Area Chart - Approved/Rejected over time)       │
└───────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  🎓 My Programs      │  │  📅 My Weekly        │
│  (Horizontal Bar)    │  │  Activity            │
│                      │  │  (Bar Chart)         │
└──────────────────────┘  └──────────────────────┘

┌───────────────────────────────────────────────────┐
│  🏆 MY PERFORMANCE SUMMARY TABLE                  │
│  Personal stats and productivity metrics          │
└───────────────────────────────────────────────────┘
```

**Total Charts: 5 charts**
- 2 in Overview
- 3 in Reports
- 1 statistics table

---

## 🎨 Color Code

```
🔴 Rejected / Danger:  #ef4444
🟢 Approved / Success: #10b981
🟡 Pending / Warning:  #fcb31c
🔵 Info:               #3b82f6
⚫ PCCR Maroon:        #7b0200
```

---

## 📅 Time Windows

| Chart Type | Time Range | Update Frequency |
|------------|------------|------------------|
| Overview Metrics | Real-time | On page load / refresh |
| 30-Day Trends | Last 30 days | Daily aggregation |
| 7-Day Activity | Last 7 days | Daily aggregation |
| Weekly Compare | Last 4 weeks | Weekly aggregation |
| Approval Rate | All time | Real-time calculation |

---

## 🔄 Data Flow

```
Frappe DocType (Student Applicant)
         ↓
    frappe.call()
         ↓
  applicationsData[]
         ↓
    Data Processing
         ↓
  ┌──────┴──────┐
  ↓             ↓
Metrics      Charts
```

---

## 💡 Key Insights

### For Heads
- **Unassigned = 0** → Good workflow
- **Processing Rate > 80%** → Healthy throughput
- **Balanced Staff Chart** → Good workload distribution

### For Staff
- **Pending Action = Low** → On top of work
- **Approval Rate 70-90%** → Consistent decisions
- **Steady Weekly Activity** → Good productivity

---

## 🚀 Quick Actions

**To refresh data:**
```
Click "🔄 Refresh" button → All charts update
```

**To see detailed reports:**
```
Click "📊 Reports" tab → Charts load automatically
```

**To view chart data:**
```
Hover over any chart → Tooltip shows exact values
```

**To filter chart data:**
```
Click legend items → Toggle series visibility
```

---

## 📱 Responsive Breakpoints

| Screen Size | Layout |
|-------------|--------|
| Desktop (>1024px) | 2 columns |
| Tablet (768-1024px) | 2 columns |
| Mobile (<768px) | 1 column (stacked) |

---

## 🎯 Performance Tips

✅ Charts only render when visible (lazy loading)  
✅ Reports load on-demand (not on initial load)  
✅ Chart instances cached (no duplicate renders)  
✅ Efficient data filtering (client-side)  
✅ Smooth animations (GPU accelerated)

---

**Files Updated:**
```
Admission Portal Head/
├── index.html (+ ApexCharts CDN, metrics, chart divs)
├── script.js (+ chart functions, data processing)
└── style.css (+ chart styles, responsive grid)

Admission Portal Staff/
├── index.html (+ ApexCharts CDN, metrics, chart divs)
├── script.js (+ chart functions, data processing)
└── style.css (+ chart styles, responsive grid)
```

---

*Ready to use! Just copy to Frappe Web Pages.* 🚀
