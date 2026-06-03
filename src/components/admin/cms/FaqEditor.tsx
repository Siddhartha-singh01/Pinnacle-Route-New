import React from 'react';
import JsonArrayEditor from './JsonArrayEditor';
import type { FieldConfig } from './JsonArrayEditor';

interface FaqEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function FaqEditor({ data, onChange }: FaqEditorProps) {
  const safeData = Array.isArray(data) ? data : [];

  const handleCategoryChange = (index: number, key: string, value: any) => {
    const newData = [...safeData];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  const handleAddCategory = () => {
    onChange([...safeData, { id: `faq-cat-${Date.now()}`, title: 'New Category', orderIndex: safeData.length, itemsJson: [] }]);
  };

  const handleRemoveCategory = (index: number) => {
    const newData = [...safeData];
    newData.splice(index, 1);
    onChange(newData);
  };

  const itemFields: FieldConfig[] = [
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'answer', label: 'Answer', type: 'textarea' }
  ];

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white uppercase tracking-widest">FAQ Categories</h3>
      </div>
      {safeData.map((category, index) => {
        const isExpanded = expandedIndex === index;
        let items = [];
        try {
          items = typeof category.itemsJson === 'string' ? JSON.parse(category.itemsJson || '[]') : (category.itemsJson || []);
        } catch {
          items = [];
        }

        return (
          <div key={category.id || index} className={`bg-[#111] border rounded-xl overflow-hidden transition-colors ${isExpanded ? 'border-gold' : 'border-line-soft hover:border-grey-2'}`}>
            <div 
              className="p-4 flex items-center justify-between cursor-pointer bg-ink"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <h4 className="font-bold text-white text-sm">{category.title || 'Untitled Category'}</h4>
              <span className="text-xs text-grey-2 uppercase tracking-widest font-semibold">
                {isExpanded ? 'Collapse ⏶' : 'Expand ⏷'}
              </span>
            </div>
            
            {isExpanded && (
              <div className="p-6 border-t border-line-soft relative">
                <button type="button" onClick={() => handleRemoveCategory(index)} className="absolute right-6 top-6 text-red-500 text-sm hover:text-red-400">Remove Category</button>
                <div className="mb-6 flex flex-col gap-2 max-w-md">
                  <label className="text-[11px] font-bold text-grey-2 uppercase tracking-wider">Category Title</label>
                  <input
                    type="text"
                    value={category.title || ''}
                    onChange={(e) => handleCategoryChange(index, 'title', e.target.value)}
                    className="bg-[#050505] border border-line-soft rounded-md px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                
                <JsonArrayEditor
                  title="Questions & Answers"
                  items={items}
                  fields={itemFields}
                  emptyItem={{ question: '', answer: '' }}
                  onChange={(newItems) => handleCategoryChange(index, 'itemsJson', newItems)}
                />
              </div>
            )}
          </div>
        );
      })}
      
      <button type="button" onClick={handleAddCategory} className="py-4 border border-dashed border-line-soft rounded-xl text-gold hover:text-white hover:border-gold transition-colors font-medium">
        + Add New FAQ Category
      </button>
    </div>
  );
}
