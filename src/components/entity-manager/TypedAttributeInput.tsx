
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface TypedAttributeInputProps {
  type: string;
  value: any;
  onChange: (value: any) => void;
  entityKind: string;
  entityLabel: string;
}

export function TypedAttributeInput({ 
  type, 
  value, 
  onChange, 
  entityKind, 
  entityLabel 
}: TypedAttributeInputProps) {
  const [listInput, setListInput] = useState('');

  const handleListAdd = () => {
    if (!listInput.trim()) return;
    const currentList = Array.isArray(value) ? value : [];
    onChange([...currentList, listInput.trim()]);
    setListInput('');
  };

  const handleListRemove = (index: number) => {
    const currentList = Array.isArray(value) ? value : [];
    onChange(currentList.filter((_, i) => i !== index));
  };

  const formatDateForInput = (dateValue: any): string => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    return date.toISOString().split('T')[0];
  };

  switch (type) {
    case 'Text':
      return (
        <Input
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 text-xs"
          placeholder="Enter text value"
        />
      );

    case 'Number':
      return (
        <Input
          type="number"
          value={String(value || '')}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-7 text-xs"
          placeholder="Enter number"
        />
      );

    case 'Boolean':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(Boolean(checked))}
          />
          <span className="text-xs text-muted-foreground">
            {Boolean(value) ? 'True' : 'False'}
          </span>
        </div>
      );

    case 'Date':
      return (
        <Input
          type="date"
          value={formatDateForInput(value)}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
          className="h-7 text-xs"
        />
      );

    case 'List':
      const currentList = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={listInput}
              onChange={(e) => setListInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleListAdd()}
              className="h-7 text-xs flex-1"
              placeholder="Add list item"
            />
            <Button
              size="sm"
              onClick={handleListAdd}
              disabled={!listInput.trim()}
              className="h-7 px-2"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          {currentList.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {currentList.map((item: any, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  {String(item)}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleListRemove(index)}
                    className="h-3 w-3 p-0 hover:bg-red-900/20 hover:text-red-400"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      );

    case 'URL':
      return (
        <Input
          type="url"
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 text-xs"
          placeholder="https://example.com"
        />
      );

    default:
      return (
        <Input
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 text-xs"
          placeholder="Enter value"
        />
      );
  }
}
