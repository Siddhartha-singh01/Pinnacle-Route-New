import React from 'react';
import JsonArrayEditor from './JsonArrayEditor';
import type { FieldConfig } from './JsonArrayEditor';

interface PortfolioEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function PortfolioEditor({ data, onChange }: PortfolioEditorProps) {
  const fields: FieldConfig[] = [
    { key: 'title', label: 'Project Title', type: 'text' },
    { key: 'tag', label: 'Tag (e.g., E-Commerce)', type: 'text' },
    { key: 'href', label: 'URL (e.g., /#work)', type: 'text' },
    { key: 'img', label: 'Image URL (e.g., /assets/image.png)', type: 'text' },
  ];

  return (
    <div className="h-full">
      <JsonArrayEditor
        title="Portfolio Work Items"
        description="List of case studies shown on the homepage."
        items={data}
        fields={fields}
        emptyItem={{ id: `work-${Date.now()}`, title: '', tag: '', href: '#', img: '' }}
        onChange={onChange}
      />
    </div>
  );
}
