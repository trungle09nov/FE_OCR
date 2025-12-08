// components/editor/RichTextEditor.tsx
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function RichTextEditor({ value, onChange, readOnly }: RichTextEditorProps) {
  return (
    <div className="border rounded-lg flex flex-col h-full">
      {!readOnly && (
        <div className="border-b p-2 bg-muted flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className="flex-1 p-4 font-mono text-sm resize-none outline-none"
        spellCheck="false"
      />
    </div>
  );
}