import { useState } from 'react';
import styles from './EmployeeTable.module.css';

const deptColors = ['accent', 'green', 'amber', 'pink', 'teal'];
const deptMap = {};
let deptIdx = 0;
const getDeptColor = (dept) => {
  if (!deptMap[dept]) { deptMap[dept] = deptColors[deptIdx % deptColors.length]; deptIdx++; }
  return deptMap[dept];
};

const StatusBadge = ({ status }) => {
  const map = {
    'Active': styles.statusActive,
    'In Progress': styles.statusProgress,
    'Completed': styles.statusDone,
    'On Hold': styles.statusHold,
  };
  return <span className={`${styles.statusBadge} ${map[status] || styles.statusHold}`}>{status}</span>;
};

export default function EmployeeTable({ employees, onEdit, onDelete, loading }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = employees
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'salary') { va = Number(va); vb = Number(vb); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ k }) => (
    <span className={styles.sortIcon}>{sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span>
  );

  if (loading) return (
    <div className={styles.panel}>
      <div className={styles.stateBox}>
        <div className={styles.spinner}></div>
        <p className={styles.stateText}>Loading employees...</p>
      </div>
    </div>
  );

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.panelTitle}>All employees</div>
          <div className={styles.panelSub}>{filtered.length} of {employees.length} records</div>
        </div>
        <input className={styles.search} placeholder="Search name or department..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.stateBox}>
          <div className={styles.emptyIcon}>◈</div>
          <p className={styles.stateText}>{employees.length === 0 ? 'No employees yet — add one above.' : 'No results for your search.'}</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th onClick={() => handleSort('name')} className={styles.sortable}>Name<SortIcon k="name" /></th>
                <th>Department</th>
                <th onClick={() => handleSort('salary')} className={styles.sortable}>Salary<SortIcon k="salary" /></th>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td><span className={styles.idChip}>#{emp.id}</span></td>
                  <td>
                    <div className={styles.nameRow}>
                      <div className={`${styles.nameAvatar} ${styles[getDeptColor(emp.department)]}`}>
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={styles.empName}>{emp.name}</span>
                    </div>
                  </td>
                  <td><span className={`${styles.deptPill} ${styles[`dept_${getDeptColor(emp.department)}`]}`}>{emp.department}</span></td>
                  <td><span className={styles.salary}>₹{Number(emp.salary).toLocaleString('en-IN')}</span></td>
                  <td><span className={styles.project}>{emp.p?.projectname || '—'}</span></td>
                  <td>{emp.p?.clientname || '—'}</td>
                  <td><StatusBadge status={emp.p?.status || 'On Hold'} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => onEdit(emp)} title="Edit">✏</button>
                      <button className={styles.deleteBtn} onClick={() => onDelete(emp.id)} title="Delete">⊘</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.panelFooter}>
        <span>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
