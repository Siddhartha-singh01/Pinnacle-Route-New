import React from 'react';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'textarea-list' | 'number' | 'url';
}

interface JsonArrayEditorProps {
  title?: string;
  description?: string;
  items: any[];
  fields: FieldConfig[];
  emptyItem: any;
  onChange: (items: any[]) => void;
}

export default function JsonArrayEditor({ title, description, items = [], fields, emptyItem, onChange }: JsonArrayEditorProps) {
  const safeItems = Array.isArray(items) ? items : [];

  const handleFieldChange = (index: number, key: string, value: any) => {
    const newItems = [...safeItems];
    
    // Support dot notation like "related.prompt"
    if (key.includes('.')) {
      const keys = key.split('.');
      let current = newItems[index];
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    } else {
      newItems[index] = { ...newItems[index], [key]: value };
    }
    
    onChange(newItems);
  };

  const handleAdd = () => {
    onChange([...safeItems, { ...emptyItem }]);
  };

  const handleRemove = (index: number) => {
    const newItems = [...safeItems];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...safeItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    onChange(newItems);
  };

  const moveDown = (index: number) => {
    if (index === safeItems.length - 1) return;
    const newItems = [...safeItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    onChange(newItems);
  };

  return (
    <div className="flex flex-col gap-4 border border-line-soft bg-[#0a0a0a] rounded-lg p-5">
      {(title || description) && (
        <div className="flex flex-col gap-1 mb-2">
          {title && <h3 className="text-sm font-semibold text-white uppercase tracking-widest">{title}</h3>}
          {description && <p className="text-xs text-grey-2">{description}</p>}
        </div>
      )}

      {safeItems.map((item, index) => (
        <div key={index} className="flex flex-col gap-4 bg-ink border border-line-soft rounded-lg p-4 relative group">
          <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => moveUp(index)} className="p-1 text-grey-2 hover:text-white" title="Move Up">↑</button>
            <button type="button" onClick={() => moveDown(index)} className="p-1 text-grey-2 hover:text-white" title="Move Down">↓</button>
            <button type="button" onClick={() => handleRemove(index)} className="p-1 text-red-500 hover:text-red-400" title="Remove Item">✕</button>
          </div>

          <div className="grid gap-4 mt-2">
            {fields.map((field) => {
              const getVal = (obj: any, path: string) => path.split('.').reduce((o, k) => (o || {})[k], obj);
              const val = getVal(item, field.key);
              
              return (
              <label key={field.key} className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">{field.label}</span>
                {field.type === 'textarea' || field.type === 'textarea-list' ? (
                  <textarea
                    value={field.type === 'textarea-list' && Array.isArray(val) ? val.join('\n\n') : (val || '')}
                    onChange={(e) => {
                      const v = e.target.value;
                      handleFieldChange(index, field.key, field.type === 'textarea-list' ? v.split('\n\n').filter(Boolean) : v);
                    }}
                    className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none min-h-[80px]"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={val || ''}
                    onChange={(e) => handleFieldChange(index, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  />
                )}
              </label>
            )})}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 py-3 border border-dashed border-line-soft rounded-lg text-grey-2 hover:text-white hover:border-gold transition-colors text-sm font-medium flex items-center justify-center gap-2"
      >
        <span>+</span> Add Item
      </button>
    </div>
  );
}
