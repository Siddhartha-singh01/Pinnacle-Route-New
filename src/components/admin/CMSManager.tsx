import React, { useState, useEffect } from 'react';

export default function CMSManager() {
  const [activeTab, setActiveTab] = useState<'settings' | 'navigation' | 'tech'>('settings');
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/content?type=${activeTab}`, { credentials: 'same-origin' });
      const data = await res.json();
      if (activeTab === 'settings' && data.length > 0) {
        setSettings(data[0]);
      } else if (activeTab === 'settings') {
        // Fallback default
        setSettings({
          siteName: '', description: '', contactEmail: '', contactPhone: '', address: ''
        });
      }
    } catch (e) {
      console.error('Failed to load data', e);
    }
    setIsLoading(false);
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('/api/admin/content?type=settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(settings),
      });
      alert('Settings saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Error saving settings.');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-[#0f0f0f] border border-line-soft rounded-xl p-6 shadow-2xl">
      <div className="flex border-b border-line-soft mb-6">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'settings' ? 'text-gold border-b-2 border-gold' : 'text-grey-2 hover:text-white'}`}
        >
          Global Settings
        </button>
        <button
          onClick={() => setActiveTab('navigation')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'navigation' ? 'text-gold border-b-2 border-gold' : 'text-grey-2 hover:text-white'}`}
        >
          Navigation
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'tech' ? 'text-gold border-b-2 border-gold' : 'text-grey-2 hover:text-white'}`}
        >
          Tech Stack
        </button>
      </div>

      {isLoading ? (
        <div className="text-grey-2 animate-pulse">Loading data...</div>
      ) : (
        <div>
          {activeTab === 'settings' && (
            <form onSubmit={saveSettings} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Site Name</span>
                  <input
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Contact Email</span>
                  <input
                    type="email"
                    value={settings.contactEmail || ''}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Site Description</span>
                <textarea
                  value={settings.description || ''}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors h-24 resize-none"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Phone Number</span>
                  <input
                    type="text"
                    value={settings.contactPhone || ''}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-grey-2 uppercase tracking-widest">Office Address</span>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="bg-ink border border-line-soft rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                  />
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gold text-ink font-bold px-8 py-3 rounded-full hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'navigation' && (
            <div className="text-grey-2 p-8 text-center border border-dashed border-line-soft rounded-lg">
              <h3 className="text-white font-medium mb-2">Navigation Manager</h3>
              <p className="text-sm">This module will allow you to drag-and-drop menu items, add dropdowns, and edit footer links. Coming in the next iteration!</p>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="text-grey-2 p-8 text-center border border-dashed border-line-soft rounded-lg">
              <h3 className="text-white font-medium mb-2">Tech Stack Library</h3>
              <p className="text-sm">Upload new CDN links or SVG icons for the scrolling tech marquee. Coming in the next iteration!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
