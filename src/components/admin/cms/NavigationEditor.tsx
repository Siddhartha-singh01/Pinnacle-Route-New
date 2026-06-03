import React from 'react';
import JsonArrayEditor from './JsonArrayEditor';
import type { FieldConfig } from './JsonArrayEditor';

interface NavigationEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function NavigationEditor({ data, onChange }: NavigationEditorProps) {
  const fields: FieldConfig[] = [
    { key: 'label', label: 'Navigation Label', type: 'text' },
    { key: 'href', label: 'URL / Path', type: 'text' },
    { key: 'parentId', label: 'Parent ID (optional for sub-menus)', type: 'text' },
  ];

  return (
    <div className="h-full">
      <JsonArrayEditor
        title="Navigation Links"
        description="The main links appearing in the top navigation bar."
        items={data}
        fields={fields}
        emptyItem={{ id: `nav-${Date.now()}`, label: '', href: '/', parentId: '' }}
        onChange={onChange}
      />
    </div>
  );
}
