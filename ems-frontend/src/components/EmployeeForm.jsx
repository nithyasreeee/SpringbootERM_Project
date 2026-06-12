import { useState, useEffect } from 'react';
import styles from './EmployeeForm.module.css';


const empty = {
  name: '', department: '', salary: '',
  p: { projectname: '', clientname: '', status: 'Active' }
};

export default function EmployeeForm({ onSubmit, editData, onCancel, isAdmin }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editData) { 
      setForm({
        name: editData.name || '', department: editData.department || '',
        salary: editData.salary || '',
        p: { projectname: editData.p?.projectname || '', clientname: editData.p?.clientname || '', status: editData.p?.status || 'Active' }
      });
      setOpen(true);
    }
    setErrors({});
  }, [editData]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.department.trim()) e.department = 'Required';
    if (!form.salary || Number(form.salary) <= 0) e.salary = 'Enter valid salary';
    if (!form.p.projectname.trim()) e.projectname = 'Required';
    if (!form.p.clientname.trim()) e.clientname = 'Required';
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
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, salary: Number(form.salary) });
      setForm(empty); setErrors({}); setOpen(false);
    } finally { setLoading(false); }
  };

  const handleCancel = () => { setForm(empty); setErrors({}); setOpen(false); onCancel && onCancel(); };

  return (
    <div className={styles.wrap}>
      {!open && !editData && isAdmin && (
        <button className={styles.openBtn} onClick={() => setOpen(true)}>
          <span className={styles.plusIcon}>+</span> Add employee
        </button>
      )}

      {(open || editData) && isAdmin && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>{editData ? 'Edit employee' : 'New employee'}</div>
            <button className={styles.closeBtn} onClick={handleCancel}>✕</button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.sectionLabel}>Employee details</div>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input className={`${styles.input} ${errors.name ? styles.err : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Nithya S" />
                {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Department</label>
                <input className={`${styles.input} ${errors.department ? styles.err : ''}`} name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
                {errors.department && <span className={styles.errMsg}>{errors.department}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Salary (₹)</label>
                <input className={`${styles.input} ${errors.salary ? styles.err : ''}`} name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="e.g. 60000" />
                {errors.salary && <span className={styles.errMsg}>{errors.salary}</span>}
              </div>
            </div>

            <div className={styles.sectionLabel}>Project details</div>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label className={styles.label}>Project name</label>
                <input className={`${styles.input} ${errors.projectname ? styles.err : ''}`} name="projectname" value={form.p.projectname} onChange={handleChange} placeholder="e.g. RoleTrack" />
                {errors.projectname && <span className={styles.errMsg}>{errors.projectname}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Client name</label>
                <input className={`${styles.input} ${errors.clientname ? styles.err : ''}`} name="clientname" value={form.p.clientname} onChange={handleChange} placeholder="e.g. ABC Corp" />
                {errors.clientname && <span className={styles.errMsg}>{errors.clientname}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.input} name="status" value={form.p.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : editData ? 'Update employee' : 'Save employee'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
