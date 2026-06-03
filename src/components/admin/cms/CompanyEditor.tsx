import React from 'react';
import JsonArrayEditor from './JsonArrayEditor';
import type { FieldConfig } from './JsonArrayEditor';

interface CompanyEditorProps {
  data: any;
  onChange: (data: any) => void;
}

export default function CompanyEditor({ data, onChange }: CompanyEditorProps) {
  // Helper to safely parse potentially stringified JSON from the database
  const parseJson = (val: any) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return []; }
    }
    return Array.isArray(val) ? val : [];
  };

  const careStats = parseJson(data?.careStatsJson);
  const partnerStats = parseJson(data?.partnerStatsJson);
  const whatWeDo = parseJson(data?.whatWeDoJson);

  const statsFields: FieldConfig[] = [
    { key: 'value', label: 'Statistic Value (e.g., 99%)', type: 'text' },
    { key: 'label', label: 'Statistic Label', type: 'text' }
  ];

  const whatWeDoFields: FieldConfig[] = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }
  ];

  return (
    <div className="flex flex-col gap-8 h-full">
      <JsonArrayEditor 
        title="Care Stats" 
        description="The primary statistics shown in the About section."
        items={careStats} 
        fields={statsFields} 
        emptyItem={{ value: '', label: '' }}
        onChange={(newItems) => onChange({ ...data, careStatsJson: newItems })}
      />
      <JsonArrayEditor 
        title="Partner Stats" 
        description="The secondary statistics highlighting partners or scale."
        items={partnerStats} 
        fields={statsFields} 
        emptyItem={{ value: '', label: '' }}
        onChange={(newItems) => onChange({ ...data, partnerStatsJson: newItems })}
      />
      <JsonArrayEditor 
        title="What We Do (Accordion)" 
        description="The accordion items in the About page."
        items={whatWeDo} 
        fields={whatWeDoFields} 
        emptyItem={{ title: '', description: '' }}
        onChange={(newItems) => onChange({ ...data, whatWeDoJson: newItems })}
      />
    </div>
  );
}
