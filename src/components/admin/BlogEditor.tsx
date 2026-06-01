import React, { useState } from 'react';

export default function BlogEditor() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AI Automation',
    readTime: '5',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to publish post');
      }

      setSuccess(true);
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        category: 'AI Automation',
        readTime: '5',
        content: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/admin/blog';
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Create New Post</h1>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-gold text-black font-medium text-sm rounded-lg hover:bg-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
          Post published successfully! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Main Content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-grey-2 uppercase tracking-widest">Post Title</label>
            <input 
              required
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. The Future of AI in Business"
              className="w-full bg-surface border border-line-soft rounded-lg px-4 py-3 text-white placeholder-grey-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-grey-2 uppercase tracking-widest">Description / Excerpt</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A short summary of the post..."
              rows={3}
              className="w-full bg-surface border border-line-soft rounded-lg px-4 py-3 text-white placeholder-grey-3 focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-bold text-grey-2 uppercase tracking-widest flex items-center justify-between">
              <span>Markdown Content</span>
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" className="text-[0.65rem] text-gold hover:underline normal-case tracking-normal">Formatting Help</a>
            </label>
            <textarea 
              required
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="## Write your post here using Markdown..."
              className="w-full h-full min-h-[400px] bg-surface border border-line-soft rounded-lg px-4 py-3 text-white placeholder-grey-3 focus:outline-none focus:border-gold transition-colors font-mono text-sm"
            />
          </div>
        </div>

        {/* Right: Meta Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-line-soft rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white border-b border-line-soft pb-3 mb-1">Post Settings</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-grey-2 uppercase tracking-widest">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-ink border border-line-soft rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                <option value="AI Automation">AI Automation</option>
                <option value="Business Growth">Business Growth</option>
                <option value="eCommerce">eCommerce</option>
                <option value="Case Studies">Case Studies</option>
                <option value="SaaS">SaaS</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-grey-2 uppercase tracking-widest">Read Time (minutes)</label>
              <input 
                required
                type="number" 
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full bg-ink border border-line-soft rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-line-soft">
              <p className="text-xs text-grey-2">
                This post will be saved immediately to the local filesystem as a .md file.
              </p>
            </div>

          </div>
        </div>
      </div>
    </form>
  );
}
