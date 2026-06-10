import { useState, useEffect } from 'react';
import styles from './EmployeeForm.module.css';

const empty = {
  name: '', department: '', salary: '',
  p: { projectname: '', clientname: '', status: 'Active' }
};

export default function EmployeeForm({ onSubmit, editData, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || '',
        department: editData.department || '',
        salary: editData.salary || '',
        p: {
          projectname: editData.p?.projectname || '',
          clientname: editData.p?.clientname || '',
          status: editData.p?.status || 'Active'
        }
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [editData]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.department.trim()) e.department = 'Department is required';
    if (!form.salary || Number(form.salary) <= 0) e.salary = 'Enter a valid salary';
    if (!form.p.projectname.trim()) e.projectname = 'Project name is required';
    if (!form.p.clientname.trim()) e.clientname = 'Client name is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['projectname', 'clientname', 'status'].includes(name)) {
      setForm(f => ({ ...f, p: { ...f.p, [name]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(err => ({ ...err, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, salary: Number(form.salary) });
      setForm(empty);
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{editData ? '✏️' : '➕'}</span>
        <h2 className={styles.cardTitle}>{editData ? 'Edit Employee' : 'Add New Employee'}</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Employee Details</p>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                name="name" value={form.name} onChange={handleChange} placeholder="e.g. Nithya S" />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Department</label>
              <input className={`${styles.input} ${errors.department ? styles.inputError : ''}`}
                name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
              {errors.department && <span className={styles.error}>{errors.department}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Salary (₹)</label>
              <input className={`${styles.input} ${errors.salary ? styles.inputError : ''}`}
                name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="e.g. 60000" />
              {errors.salary && <span className={styles.error}>{errors.salary}</span>}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Project Details</p>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Project Name</label>
              <input className={`${styles.input} ${errors.projectname ? styles.inputError : ''}`}
                name="projectname" value={form.p.projectname} onChange={handleChange} placeholder="e.g. RoleTrack" />
              {errors.projectname && <span className={styles.error}>{errors.projectname}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Client Name</label>
              <input className={`${styles.input} ${errors.clientname ? styles.inputError : ''}`}
                name="clientname" value={form.p.clientname} onChange={handleChange} placeholder="e.g. ABC Corp" />
              {errors.clientname && <span className={styles.error}>{errors.clientname}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.input} name="status" value={form.p.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          {editData && (
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : editData ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
