import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Pencil, Trash2, Plus, Search, ArrowUpDown, Users, X } from 'lucide-react';
import './styles.css';

const API = 'http://localhost:5000/api/employees';
const emptyForm = { name: '', department: '', role: '', salary: '', joinDate: '' };

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadEmployees = async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ search, sortBy: sort.field, order: sort.order });
      const res = await fetch(`${API}?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to load employees.');
      setEmployees(data.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { const t = setTimeout(loadEmployees, 250); return () => clearTimeout(t); }, [search, sort.field, sort.order]);
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(''), 2500); return () => clearTimeout(t); } }, [message]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    else if (form.name.trim().length < 2) e.name = 'Use at least 2 characters.';
    if (!form.department.trim()) e.department = 'Department is required.';
    if (!form.role.trim()) e.role = 'Role is required.';
    if (form.salary === '' || Number.isNaN(Number(form.salary)) || Number(form.salary) < 0) e.salary = 'Enter a valid salary.';
    if (!form.joinDate) e.joinDate = 'Join date is required.';
    setFieldErrors(e); return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault(); if (!validate()) return;
    setSaving(true); setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/${editingId}` : API;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed.');
      setMessage(editingId ? 'Employee updated successfully.' : 'Employee added successfully.');
      resetForm(); await loadEmployees();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setFieldErrors({}); };
  const editEmployee = (emp) => {
    setEditingId(emp._id); setForm({ name: emp.name, department: emp.department, role: emp.role, salary: String(emp.salary), joinDate: new Date(emp.joinDate).toISOString().slice(0,10) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const deleteEmployee = async () => {
    if (!deleteTarget) return; setSaving(true);
    try {
      const res = await fetch(`${API}/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Delete failed.');
      setMessage('Employee deleted successfully.'); setDeleteTarget(null); await loadEmployees();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };
  const changeSort = (field) => setSort((s) => s.field === field ? { field, order: s.order === 'asc' ? 'desc' : 'asc' } : { field, order: 'asc' });
  const stats = useMemo(() => ({ count: employees.length, payroll: employees.reduce((sum, e) => sum + Number(e.salary || 0), 0) }), [employees]);

  return <div className="app">
    <header className="hero"><div><p className="eyebrow">HR ADMIN DASHBOARD</p><h1>Employee Management System</h1><p className="subtitle">Manage employee records with a clean CRUD workflow.</p></div><div className="hero-icon"><Users size={34}/></div></header>
    <main className="container">
      <section className="stats"><div className="stat"><span>Total Employees</span><strong>{stats.count}</strong></div><div className="stat"><span>Displayed Payroll</span><strong>₹{stats.payroll.toLocaleString('en-IN')}</strong></div><div className="stat"><span>API Status</span><strong className="online">● Connected</strong></div></section>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error"><span>{error}</span><button onClick={() => setError('')} aria-label="Close error"><X size={18}/></button></div>}
      <section className="grid">
        <div className="card form-card"><div className="card-title"><div><p className="label">RECORD FORM</p><h2>{editingId ? 'Edit Employee' : 'Add Employee'}</h2></div>{editingId && <button className="text-btn" onClick={resetForm}>Cancel edit</button>}</div>
          <form onSubmit={submit} noValidate>
            <Field label="Full Name" name="name" value={form.name} onChange={setForm} error={fieldErrors.name} placeholder="e.g. Priya Sharma" />
            <Field label="Department" name="department" value={form.department} onChange={setForm} error={fieldErrors.department} placeholder="e.g. Human Resources" />
            <Field label="Role" name="role" value={form.role} onChange={setForm} error={fieldErrors.role} placeholder="e.g. HR Executive" />
            <div className="two"><Field label="Salary (₹)" name="salary" type="number" min="0" value={form.salary} onChange={setForm} error={fieldErrors.salary} placeholder="50000" /><Field label="Join Date" name="joinDate" type="date" value={form.joinDate} onChange={setForm} error={fieldErrors.joinDate} /></div>
            <button className="primary" disabled={saving}><Plus size={19}/>{saving ? 'Saving...' : editingId ? 'Update Employee' : 'Add Employee'}</button>
          </form>
        </div>
        <div className="card table-card"><div className="table-head"><div><p className="label">EMPLOYEE DIRECTORY</p><h2>All Employees</h2></div><div className="search"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, department, role..." /></div></div>
          {loading ? <div className="state">Loading employees...</div> : employees.length === 0 ? <div className="state empty">No employees found. Add your first employee using the form.</div> : <div className="table-wrap"><table><thead><tr><Sortable label="Name" field="name" sort={sort} onSort={changeSort}/><Sortable label="Department" field="department" sort={sort} onSort={changeSort}/><Sortable label="Role" field="role" sort={sort} onSort={changeSort}/><Sortable label="Salary" field="salary" sort={sort} onSort={changeSort}/><Sortable label="Join Date" field="joinDate" sort={sort} onSort={changeSort}/><th>Actions</th></tr></thead><tbody>{employees.map((emp) => <tr key={emp._id}><td><strong>{emp.name}</strong></td><td>{emp.department}</td><td>{emp.role}</td><td>₹{Number(emp.salary).toLocaleString('en-IN')}</td><td>{new Date(emp.joinDate).toLocaleDateString('en-IN')}</td><td><div className="actions"><button className="icon edit" title="Edit employee" onClick={() => editEmployee(emp)}><Pencil size={17}/></button><button className="icon delete" title="Delete employee" onClick={() => setDeleteTarget(emp)}><Trash2 size={17}/></button></div></td></tr>)}</tbody></table></div>}
        </div>
      </section>
    </main>
    {deleteTarget && <div className="modal-backdrop"><div className="modal"><div className="modal-icon"><Trash2/></div><h3>Delete employee?</h3><p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p><div className="modal-actions"><button className="secondary" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="danger" disabled={saving} onClick={deleteEmployee}>{saving ? 'Deleting...' : 'Delete Employee'}</button></div></div></div>}
    <footer>CRUD Employee Management System · React + Express + MongoDB</footer>
  </div>
}

function Field({ label, name, value, onChange, error, type='text', ...props }) { return <label className="field"><span>{label}</span><input className={error ? 'invalid' : ''} type={type} name={name} value={value} onChange={(e) => onChange((f) => ({ ...f, [name]: e.target.value }))} {...props}/>{error && <small>{error}</small>}</label> }
function Sortable({ label, field, sort, onSort }) { return <th><button className="sort-btn" onClick={() => onSort(field)}>{label}<ArrowUpDown size={14} className={sort.field === field ? 'active-sort' : ''}/></button></th> }

createRoot(document.getElementById('root')).render(<App />);
