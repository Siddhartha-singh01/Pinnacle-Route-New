import React from 'react';
import JsonArrayEditor from './JsonArrayEditor';
import type { FieldConfig } from './JsonArrayEditor';

interface TechStackEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function TechStackEditor({ data, onChange }: TechStackEditorProps) {
  const fields: FieldConfig[] = [
    { key: 'name', label: 'Technology Name', type: 'text' },
    { key: 'iconUrl', label: 'Icon SVG/Image URL', type: 'text' },
  ];

  return (
    <div className="h-full">
      <JsonArrayEditor
        title="Tech Stack Logos"
        description="The technologies displayed in the Marquee/Tech Stack section."
        items={data}
        fields={fields}
        emptyItem={{ id: Date.now(), name: '', iconUrl: '' }}
        onChange={onChange}
      />
    </div>
  );
}
