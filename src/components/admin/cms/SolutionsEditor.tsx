import React from 'react';
import JsonArrayEditor from './JsonArrayEditor';
import type { FieldConfig } from './JsonArrayEditor';

interface SolutionsEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function SolutionsEditor({ data, onChange }: SolutionsEditorProps) {
  const safeData = Array.isArray(data) ? data : [];

  const handleCategoryChange = (index: number, key: string, value: any) => {
    const newData = [...safeData];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  const featureFields: FieldConfig[] = [
    { key: 'title', label: 'Feature Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'icon', label: 'Icon (optional)', type: 'text' }
  ];

  const stepFields: FieldConfig[] = [
    { key: 'title', label: 'Step Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }
  ];

  const statFields: FieldConfig[] = [
    { key: 'value', label: 'Stat Value', type: 'text' },
    { key: 'label', label: 'Stat Label', type: 'text' }
  ];

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Solutions Categories</h3>
      </div>
      {safeData.map((solution, index) => {
        const isExpanded = expandedIndex === index;
        const parse = (str: string) => { try { return typeof str === 'string' ? JSON.parse(str || '[]') : (str || []) } catch { return [] } };
        const features = parse(solution.featuresJson);
        const steps = parse(solution.stepsJson);
        const stats = parse(solution.statsJson);

        return (
          <div key={solution.slug || index} className={`bg-[#111] border rounded-xl overflow-hidden transition-colors ${isExpanded ? 'border-gold' : 'border-line-soft hover:border-grey-2'}`}>
            <div 
              className="p-4 flex items-center justify-between cursor-pointer bg-ink"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <h4 className="font-bold text-white text-sm">{solution.label || 'Untitled Solution'}</h4>
              <span className="text-xs text-grey-2 uppercase tracking-widest font-semibold">
                {isExpanded ? 'Collapse ⏶' : 'Expand ⏷'}
              </span>
            </div>
            
            {isExpanded && (
              <div className="p-6 border-t border-line-soft relative">
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Solution Label</span>
                    <input type="text" value={solution.label || ''} onChange={(e) => handleCategoryChange(index, 'label', e.target.value)} className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Title</span>
                    <input type="text" value={solution.title || ''} onChange={(e) => handleCategoryChange(index, 'title', e.target.value)} className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Tagline</span>
                    <input type="text" value={solution.tagline || ''} onChange={(e) => handleCategoryChange(index, 'tagline', e.target.value)} className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Overview Body</span>
                    <textarea value={solution.overviewBody || ''} onChange={(e) => handleCategoryChange(index, 'overviewBody', e.target.value)} className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none min-h-[80px]" />
                  </label>
                </div>
                
                <div className="flex flex-col gap-6 mt-8">
                  <JsonArrayEditor title="Features" items={features} fields={featureFields} emptyItem={{ title: '', description: '' }} onChange={(items) => handleCategoryChange(index, 'featuresJson', items)} />
                  <JsonArrayEditor title="Process Steps" items={steps} fields={stepFields} emptyItem={{ title: '', description: '' }} onChange={(items) => handleCategoryChange(index, 'stepsJson', items)} />
                  <JsonArrayEditor title="Stats" items={stats} fields={statFields} emptyItem={{ value: '', label: '' }} onChange={(items) => handleCategoryChange(index, 'statsJson', items)} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
