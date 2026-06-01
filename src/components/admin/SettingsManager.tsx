import React, { useState, useEffect } from 'react';

interface Feature {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export default function SettingsManager() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Modal states
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Author' });
  
  // Loading & Saving states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featRes, userRes] = await Promise.all([
        fetch('/api/admin/settings', { credentials: 'same-origin' }),
        fetch('/api/admin/users', { credentials: 'same-origin' })
      ]);
      
      const featData = await featRes.json();
      const userData = await userRes.json();

      if (!featRes.ok || !Array.isArray(featData)) {
        console.error('Failed to load settings:', featData);
        setFeatures([]);
      } else {
        setFeatures(featData);
      }

      if (!userRes.ok || !Array.isArray(userData)) {
        console.error('Failed to load users:', userData);
        setUsers([]);
      } else {
        setUsers(userData);
      }
      
      setLoading(false);
    } catch (e) {
      console.error('Network error loading settings', e);
      setLoading(false);
    }
  };

  const saveFeatures = async (updatedFeatures: Feature[]) => {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFeatures)
      });
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const saveUsers = async (updatedUsers: User[]) => {
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUsers)
      });
    } catch (e) {
      console.error('Failed to save users', e);
    }
  };

  const handleToggle = (id: string) => {
    const updatedFeatures = features.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    );
    setFeatures(updatedFeatures);
    saveFeatures(updatedFeatures);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now(),
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'Active',
      lastLogin: 'Never'
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setInviteModalOpen(false);
    setInviteForm({ name: '', email: '', role: 'Author' });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setEditingUser(null);
  };

  if (loading) {
    return <div className="text-grey-2 py-20 text-center animate-pulse">Loading secure settings...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">System Settings</h1>
      </div>

      {/* Feature Flags Section */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="text-gold" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Feature Flags
        </h2>
        <div className="bg-surface border border-line-soft rounded-xl divide-y divide-line-soft">
          {features.map(feature => (
            <div key={feature.id} className="p-6 flex items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-white font-medium mb-1">{feature.name}</h3>
                <p className="text-sm text-grey-2">{feature.description}</p>
              </div>
              
              <button 
                onClick={() => handleToggle(feature.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  feature.active ? 'bg-gold' : 'bg-ink border border-line-soft'
                }`}
              >
                <span className="sr-only">Toggle {feature.name}</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    feature.active ? 'translate-x-6' : 'translate-x-1 bg-grey-2'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* User Management Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="text-gold" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            User Management
          </h2>
          <button 
            onClick={() => setInviteModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-white/5 border border-line-soft hover:bg-gold hover:text-ink hover:border-gold text-gold transition-colors rounded-lg flex items-center gap-1.5"
          >
            <span>+</span> Invite User
          </button>
        </div>
        
        <div className="bg-surface border border-line-soft rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink border-b border-line-soft text-grey-2 uppercase tracking-wider text-[0.65rem] font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium mb-0.5">{user.name}</div>
                    <div className="text-xs text-grey-2">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-grey-2 border border-line-soft px-2 py-1 rounded bg-ink/50">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs ${user.status === 'Active' ? 'text-green-400' : user.status === 'Suspended' ? 'text-red-400' : 'text-grey-2'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : user.status === 'Suspended' ? 'bg-red-500' : 'bg-grey-3'}`}></div> 
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-grey-2">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="text-xs font-medium px-3 py-1.5 bg-ink border border-line-soft rounded text-gold hover:text-white hover:border-gold/50 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-line-soft rounded-2xl p-6 w-full max-w-md relative">
            <h3 className="text-xl font-semibold text-white mb-4">Invite New User</h3>
            <form onSubmit={handleInvite} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-grey-2 uppercase tracking-wider mb-2 block">Name</label>
                <input required value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} className="w-full bg-ink border border-line-soft text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-xs font-bold text-grey-2 uppercase tracking-wider mb-2 block">Email</label>
                <input required type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} className="w-full bg-ink border border-line-soft text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-xs font-bold text-grey-2 uppercase tracking-wider mb-2 block">Role</label>
                <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="w-full bg-ink border border-line-soft text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gold">
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Author</option>
                  <option>Guest</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setInviteModalOpen(false)} className="flex-1 px-4 py-2 bg-ink border border-line-soft rounded-lg text-white hover:bg-surface-2 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-white transition-colors">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-line-soft rounded-2xl p-6 w-full max-w-md relative">
            <h3 className="text-xl font-semibold text-white mb-4">Edit User: {editingUser.name}</h3>
            <form onSubmit={handleEditSave} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-grey-2 uppercase tracking-wider mb-2 block">Role</label>
                <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="w-full bg-ink border border-line-soft text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gold">
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Author</option>
                  <option>Guest</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-grey-2 uppercase tracking-wider mb-2 block">Status</label>
                <select value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value})} className="w-full bg-ink border border-line-soft text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gold">
                  <option>Active</option>
                  <option>Suspended</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2 bg-ink border border-line-soft rounded-lg text-white hover:bg-surface-2 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-white transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
