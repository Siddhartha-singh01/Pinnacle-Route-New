import React from 'react';
import JsonArrayEditor from './JsonArrayEditor';
import type { FieldConfig } from './JsonArrayEditor';

interface ServicesEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function ServicesEditor({ data, onChange }: ServicesEditorProps) {
  const safeData = Array.isArray(data) ? data : [];

  const handleCategoryChange = (index: number, key: string, value: any) => {
    const newData = [...safeData];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  const itemFields: FieldConfig[] = [
    { key: 'title', label: 'Sub-Service Title', type: 'text' },
    { key: 'icon', label: 'Icon SVG Path (optional)', type: 'text' },
    { key: 'body', label: 'Body Paragraphs (separated by double newlines)', type: 'textarea-list' },
    { key: 'related.prompt', label: 'Related CTA Prompt', type: 'text' },
    { key: 'related.label', label: 'Related CTA Button Label', type: 'text' },
    { key: 'related.href', label: 'Related CTA URL', type: 'text' },
  ];

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Service Categories</h3>
      </div>
      {safeData.map((service, index) => {
        const isExpanded = expandedIndex === index;
        let subItems = [];
        try {
          subItems = typeof service.subItemsJson === 'string' ? JSON.parse(service.subItemsJson || '[]') : (service.subItemsJson || []);
        } catch {
          subItems = [];
        }

        return (
          <div key={service.slug || index} className={`bg-[#111] border rounded-xl overflow-hidden transition-colors ${isExpanded ? 'border-gold' : 'border-line-soft hover:border-grey-2'}`}>
            <div 
              className="p-4 flex items-center justify-between cursor-pointer bg-ink"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <h4 className="font-bold text-white text-sm">{service.label || 'Untitled Service'}</h4>
              <span className="text-xs text-grey-2 uppercase tracking-widest font-semibold">
                {isExpanded ? 'Collapse ⏶' : 'Expand ⏷'}
              </span>
            </div>
            
            {isExpanded && (
              <div className="p-6 border-t border-line-soft relative">
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Service Label</span>
                    <input type="text" value={service.label || ''} onChange={(e) => handleCategoryChange(index, 'label', e.target.value)} className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Category</span>
                    <input type="text" value={service.category || ''} onChange={(e) => handleCategoryChange(index, 'category', e.target.value)} className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Intro Text</span>
                    <textarea value={service.intro || ''} onChange={(e) => handleCategoryChange(index, 'intro', e.target.value)} className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none min-h-[80px]" />
                  </label>
                </div>
                
                <JsonArrayEditor
                  title="Sub-Services"
                  items={subItems}
                  fields={itemFields}
                  emptyItem={{ id: `sub-${Date.now()}`, title: '', body: [], related: { prompt: '', label: '', href: '' } }}
                  onChange={(newItems) => handleCategoryChange(index, 'subItemsJson', newItems)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
