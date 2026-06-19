import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { getAllEmployees } from '../api/employeeApi';
import styles from './Dashboard.module.css';

const COLORS = ['#5b5ef4', '#3ecf8e', '#f59e0b', '#f87171', '#a78bfa', '#34d399'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        color: 'var(--text)'
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.name === 'Salary' ? `₹${Number(p.value).toLocaleString('en-IN')}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEmployees()
      .then(res => setEmployees(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Department wise count
  const deptData = Object.entries(
    employees.reduce((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  // Status wise count for pie chart
  const statusData = Object.entries(
    employees.reduce((acc, e) => {
      const s = e.p?.status || 'Unknown';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Salary by department
  const salaryData = Object.entries(
    employees.reduce((acc, e) => {
      if (!acc[e.department]) acc[e.department] = [];
      acc[e.department].push(Number(e.salary));
      return acc;
    }, {})
  ).map(([dept, salaries]) => ({
    name: dept,
    Salary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
  }));

  // Stats
  const totalSalary = employees.reduce((s, e) => s + Number(e.salary), 0);
  const avgSalary = employees.length ? Math.round(totalSalary / employees.length) : 0;
  const activeCount = employees.filter(e => e.p?.status === 'Active').length;
  const deptCount = new Set(employees.map(e => e.department)).size;
  const highestSalary = employees.length
    ? Math.max(...employees.map(e => Number(e.salary)))
    : 0;

  if (loading) return (
    <div className={styles.loadingBox}>
      <div className={styles.spinner}></div>
      <p>Loading dashboard...</p>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#1e2050' }}>👥</div>
          <div>
            <div className={styles.statVal}>{employees.length}</div>
            <div className={styles.statLbl}>Total Employees</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#0d2a1e' }}>📁</div>
          <div>
            <div className={styles.statVal} style={{ color: 'var(--green)' }}>{activeCount}</div>
            <div className={styles.statLbl}>Active Projects</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#1e2050' }}>🏢</div>
          <div>
            <div className={styles.statVal} style={{ color: 'var(--accent-text)' }}>{deptCount}</div>
            <div className={styles.statLbl}>Departments</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#2a1f0a' }}>💰</div>
          <div>
            <div className={styles.statVal} style={{ color: 'var(--amber)' }}>
              ₹{avgSalary ? (avgSalary / 1000).toFixed(1) + 'K' : '0'}
            </div>
            <div className={styles.statLbl}>Avg Salary</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#2a1010' }}>🏆</div>
          <div>
            <div className={styles.statVal} style={{ color: '#f87171' }}>
              ₹{highestSalary ? (highestSalary / 1000).toFixed(1) + 'K' : '0'}
            </div>
            <div className={styles.statLbl}>Highest Salary</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className={styles.chartsRow}>

        {/* Department Bar Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Employees by Department</div>
            <div className={styles.chartSub}>Headcount per department</div>
          </div>
          {deptData.length === 0 ? (
            <div className={styles.noData}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Employees" fill="#5b5ef4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Project Status Pie Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Project Status Distribution</div>
            <div className={styles.chartSub}>Breakdown by project status</div>
          </div>
          {statusData.length === 0 ? (
            <div className={styles.noData}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: 'var(--text2)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className={styles.chartsRow}>

        {/* Avg Salary by Department */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Average Salary by Department</div>
            <div className={styles.chartSub}>Salary comparison across teams</div>
          </div>
          {salaryData.length === 0 ? (
            <div className={styles.noData}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salaryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Salary" fill="#3ecf8e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Employees Table */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Recent Employees</div>
            <div className={styles.chartSub}>Latest additions to the team</div>
          </div>
          <div className={styles.recentTable}>
            {employees.length === 0 ? (
              <div className={styles.noData}>No employees yet</div>
            ) : (
              [...employees].reverse().slice(0, 5).map(emp => (
                <div key={emp.id} className={styles.recentRow}>
                  <div className={styles.recentAvatar}>
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.recentInfo}>
                    <div className={styles.recentName}>{emp.name}</div>
                    <div className={styles.recentDept}>{emp.department}</div>
                  </div>
                  <div className={styles.recentRight}>
                    <div className={styles.recentSalary}>
                      ₹{Number(emp.salary).toLocaleString('en-IN')}
                    </div>
                    <div className={`${styles.recentStatus} ${
                      emp.p?.status === 'Active' ? styles.statusActive :
                      emp.p?.status === 'In Progress' ? styles.statusProgress :
                      styles.statusOther
                    }`}>
                      {emp.p?.status || 'N/A'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}