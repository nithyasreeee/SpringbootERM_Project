import styles from './EmployeeTable.module.css';

const statusColors = {
  'Active': 'green',
  'In Progress': 'blue',
  'Completed': 'gray',
  'On Hold': 'warning'
};

export default function EmployeeTable({ employees, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👥</span>
          <p className={styles.emptyTitle}>No employees yet</p>
          <p className={styles.emptyText}>Add your first employee using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>All Employees</h2>
          <p className={styles.cardSub}>{employees.length} record{employees.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Project</th>
              <th>Client</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td><span className={styles.idBadge}>#{emp.id}</span></td>
                <td><span className={styles.name}>{emp.name}</span></td>
                <td><span className={styles.dept}>{emp.department}</span></td>
                <td><span className={styles.salary}>₹{Number(emp.salary).toLocaleString('en-IN')}</span></td>
                <td>{emp.p?.projectname || '—'}</td>
                <td>{emp.p?.clientname || '—'}</td>
                <td>
                  <span className={`${styles.status} ${styles[statusColors[emp.p?.status] || 'gray']}`}>
                    {emp.p?.status || '—'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => onEdit(emp)} title="Edit">
                      ✏️
                    </button>
                    <button className={styles.deleteBtn} onClick={() => onDelete(emp.id)} title="Delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
