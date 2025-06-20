import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { useNotes } from '@/contexts/NotesContext';
import { Entity } from '@/utils/parsingUtils';

interface EntityCardProps {
  entity: Entity;
}

export function EntityCard({ entity }: EntityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');
  const { getEntityAttributes, setEntityAttributes } = useNotes();

  const entityKey = `${entity.kind}:${entity.label}`;

  useEffect(() => {
    if (isExpanded) {
      const savedAttributes = getEntityAttributes(entityKey);
      // Merge with existing attributes from the entity
      const mergedAttributes = {
        ...entity.attributes,
        ...savedAttributes
      };
      setAttributes(mergedAttributes);
    }
  }, [entityKey, entity.attributes, isExpanded, getEntityAttributes]);

  const handleAttributeChange = (key: string, value: any) => {
    const updatedAttributes = { ...attributes, [key]: value };
    setAttributes(updatedAttributes);
    setEntityAttributes(entityKey, updatedAttributes);
  };

  const handleAddAttribute = () => {
    if (newAttrKey.trim() && newAttrValue.trim()) {
      handleAttributeChange(newAttrKey.trim(), newAttrValue.trim());
      setNewAttrKey('');
      setNewAttrValue('');
    }
  };

  const handleDeleteAttribute = (key: string) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    setAttributes(updatedAttributes);
    setEntityAttributes(entityKey, updatedAttributes);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-between hover:bg-accent rounded-none text-left"
        >
          <div className="flex items-center gap-2 flex-1">
            <span className="font-medium">{entity.label}</span>
            <Badge variant="outline" className="text-xs capitalize">
              {entity.kind.toLowerCase()}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>

        {isExpanded && (
          <div className="p-3 pt-0 space-y-3">
            {/* Existing Attributes */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Attributes:
              </h4>
              
              {Object.keys(attributes).length === 0 ? (
                <p className="text-xs text-muted-foreground">No attributes</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(attributes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="text-xs font-medium">{key}</div>
                        <Input
                          value={String(value)}
                          onChange={(e) => handleAttributeChange(key, e.target.value)}
                          className="h-7 text-xs mt-1"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAttribute(key)}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Attribute */}
            <div className="border-t pt-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Add Attribute:
              </h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Key"
                  value={newAttrKey}
                  onChange={(e) => setNewAttrKey(e.target.value)}
                  className="h-7 text-xs flex-1"
                />
                <Input
                  placeholder="Value"
                  value={newAttrValue}
                  onChange={(e) => setNewAttrValue(e.target.value)}
                  className="h-7 text-xs flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAttribute()}
                />
                <Button
                  size="sm"
                  onClick={handleAddAttribute}
                  disabled={!newAttrKey.trim() || !newAttrValue.trim()}
                  className="h-7 px-2"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
