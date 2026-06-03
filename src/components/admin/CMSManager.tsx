import React, { useState, useEffect } from 'react';

type Tab = 'settings' | 'navigation' | 'tech' | 'faq' | 'portfolio' | 'company' | 'services' | 'solutions';

/** Map UI tab IDs to their correct API query parameter values. */
const TAB_TO_API_TYPE: Record<Tab, string> = {
  settings: 'settings',
  navigation: 'navigation',
  tech: 'techstack',
  faq: 'faq',
  portfolio: 'portfolio',
  company: 'company',
  services: 'services',
  solutions: 'solutions',
};

export default function CMSManager() {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiType = TAB_TO_API_TYPE[activeTab];
      const res = await fetch(`/api/admin/content?type=${apiType}`, { credentials: 'same-origin' });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        setError(err.error || `Failed to load ${activeTab} data (HTTP ${res.status})`);
        setData(null);
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      
      if (activeTab === 'settings' || activeTab === 'company') {
        setData(json.length > 0 ? json[0] : {});
      } else {
        // For array-based data (faq, portfolio, services, solutions, navigation, tech)
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load data', e);
      setError('Network error — could not reach the server.');
    }
    setIsLoading(false);
  };

  const saveData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // For JSON stringified inputs, try to parse them back to objects before saving
      let payload = data;
      
      if (activeTab === 'company') {
        payload = {
          ...data,
          careStatsJson: typeof data.careStatsJson === 'string' ? JSON.parse(data.careStatsJson) : data.careStatsJson,
          partnerStatsJson: typeof data.partnerStatsJson === 'string' ? JSON.parse(data.partnerStatsJson) : data.partnerStatsJson,
          whatWeDoJson: typeof data.whatWeDoJson === 'string' ? JSON.parse(data.whatWeDoJson) : data.whatWeDoJson,
        };
      } else if (activeTab === 'faq' || activeTab === 'portfolio' || activeTab === 'services' || activeTab === 'solutions') {
        // For arrays, if we edit them as a huge JSON string, parse it. 
        // If data is a string (user edited a textarea), parse it into array.
        if (typeof data === 'string') {
          payload = JSON.parse(data);
        }
      }

      const apiType = TAB_TO_API_TYPE[activeTab];
      const res = await fetch(`/api/admin/content?type=${apiType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(`${activeTab.toUpperCase()} saved successfully!`);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error saving data. Ensure your JSON is valid format.');
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: 'settings', label: 'Global Settings', icon: '⚙️' },
    { id: 'company', label: 'Company Stats', icon: '🏢' },
    { id: 'faq', label: 'FAQ Data', icon: '❓' },
    { id: 'portfolio', label: 'Portfolio / Work', icon: '🎨' },
    { id: 'services', label: 'Services Details', icon: '💻' },
    { id: 'solutions', label: 'Solutions Details', icon: '🚀' },
    { id: 'navigation', label: 'Navigation (WIP)', icon: '🧭' },
    { id: 'tech', label: 'Tech Stack (WIP)', icon: '🛠️' },
  ];

  return (
    <div className="bg-[#0f0f0f] border border-line-soft rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
      
      {/* Vertical Sidebar */}
      <div className="w-full md:w-64 border-r border-line-soft bg-ink flex flex-col shrink-0">
        <div className="p-4 border-b border-line-soft">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Content Models</h2>
        </div>
        <nav className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === tab.id ? 'bg-surface border border-line-soft text-gold' : 'text-grey-2 hover:text-white hover:bg-surface-2'}`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-6 md:p-8 bg-[#0a0a0a] overflow-y-auto">
        {isLoading ? (
          <div className="text-grey-2 animate-pulse flex items-center justify-center h-full">Loading data payload...</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm max-w-md text-center">
              <strong>Error:</strong> {error}
            </div>
            <button onClick={fetchData} className="text-xs font-medium px-4 py-2 bg-ink border border-line-soft rounded-lg text-gold hover:text-white transition-colors">
              Retry
            </button>
          </div>
        ) : (
          <form onSubmit={saveData} className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between border-b border-line-soft pb-4 mb-4">
              <h2 className="text-xl font-semibold text-white capitalize">{activeTab} Editor</h2>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gold text-ink font-bold px-6 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Deploy Changes'}
              </button>
            </div>

            {/* Form Fields based on Tab */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Site Name</span>
                    <input type="text" value={data?.siteName || ''} onChange={(e) => setData({ ...data, siteName: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white" />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Contact Email</span>
                    <input type="email" value={data?.contactEmail || ''} onChange={(e) => setData({ ...data, contactEmail: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white" />
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Site Description</span>
                  <textarea value={data?.description || ''} onChange={(e) => setData({ ...data, description: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white h-24" />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Phone Number</span>
                    <input type="text" value={data?.contactPhone || ''} onChange={(e) => setData({ ...data, contactPhone: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white" />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Address</span>
                    <input type="text" value={data?.address || ''} onChange={(e) => setData({ ...data, address: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="flex flex-col gap-5 h-full">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Care Stats (JSON)</span>
                  <textarea value={typeof data?.careStatsJson === 'string' ? data.careStatsJson : JSON.stringify(data?.careStatsJson, null, 2)} onChange={(e) => setData({ ...data, careStatsJson: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white h-32 font-mono text-sm" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Partner Stats (JSON)</span>
                  <textarea value={typeof data?.partnerStatsJson === 'string' ? data.partnerStatsJson : JSON.stringify(data?.partnerStatsJson, null, 2)} onChange={(e) => setData({ ...data, partnerStatsJson: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white h-32 font-mono text-sm" />
                </label>
                <label className="flex flex-col gap-2 flex-1">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">What We Do Accordion (JSON)</span>
                  <textarea value={typeof data?.whatWeDoJson === 'string' ? data.whatWeDoJson : JSON.stringify(data?.whatWeDoJson, null, 2)} onChange={(e) => setData({ ...data, whatWeDoJson: e.target.value })} className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white h-full min-h-[200px] font-mono text-sm" />
                </label>
              </div>
            )}

            {(activeTab === 'faq' || activeTab === 'portfolio' || activeTab === 'services' || activeTab === 'solutions') && (
              <div className="flex flex-col gap-2 h-full">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-blue-400 text-sm mb-2">
                  <strong>Advanced JSON Editor:</strong> This collection contains deeply nested arrays. For maximum flexibility, edit the raw JSON array below. Ensure the JSON is strictly valid before clicking deploy.
                </div>
                <label className="flex flex-col gap-2 flex-1">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Raw Data Payload</span>
                  <textarea 
                    value={typeof data === 'string' ? data : JSON.stringify(data, null, 2)} 
                    onChange={(e) => setData(e.target.value)} 
                    className="bg-[#050505] border border-line-soft rounded-md p-4 text-green-400 font-mono text-xs w-full h-full min-h-[400px] focus:outline-none focus:border-gold" 
                    spellCheck="false"
                  />
                </label>
              </div>
            )}

            {(activeTab === 'navigation' || activeTab === 'tech') && (
              <div className="text-grey-2 p-8 text-center border border-dashed border-line-soft rounded-lg">
                <h3 className="text-white font-medium mb-2">{activeTab.toUpperCase()} Manager</h3>
                <p className="text-sm">This specific UI module is currently being built. Please use the database CLI to modify this table for now.</p>
              </div>
            )}

          </form>
        )}
      </div>
    </div>
  );
}
