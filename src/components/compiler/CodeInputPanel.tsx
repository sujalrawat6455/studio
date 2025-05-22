// src/components/compiler/CodeInputPanel.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eraser, FileCode2 } from "lucide-react";

interface CodeInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
  compilationErrors?: string[] | null;
}

export function CodeInputPanel({
  value,
  onChange,
  onClear,
  disabled,
  compilationErrors,
}: CodeInputPanelProps) {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <FileCode2 className="mr-2 h-5 w-5 text-accent" />
            MiniC Code Input
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={disabled}>
            <Eraser className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Label htmlFor="miniCCode" className="sr-only">
          MiniC Code
        </Label>
        <Textarea
          id="miniCCode"
          placeholder="Enter your MiniC code here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm flex-grow resize-none min-h-[200px] lg:min-h-[300px] bg-input/30"
          disabled={disabled}
          rows={15}
        />
        {compilationErrors && compilationErrors.length > 0 && (
          <div className="mt-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <p className="text-destructive font-semibold mb-1">Compilation Errors:</p>
            <ul className="list-disc list-inside text-destructive text-xs">
              {compilationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
