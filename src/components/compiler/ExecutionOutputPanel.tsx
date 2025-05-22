// src/components/compiler/ExecutionOutputPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eraser, Terminal, Loader2 } from "lucide-react"; // Using Terminal icon

interface ExecutionOutputPanelProps {
  output: string[] | null;
  isLoading: boolean;
  onClear: () => void;
  error?: string | null; // For execution-specific errors
}

export function ExecutionOutputPanel({ output, isLoading, onClear, error }: ExecutionOutputPanelProps) {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <Terminal className="mr-2 h-5 w-5 text-accent" />
            Execution Output
          </CardTitle>
          {output && output.length > 0 && !isLoading && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Eraser className="mr-2 h-4 w-4" />
              Clear Output
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-accent" />
            <span>Executing code...</span>
          </div>
        ) : error ? (
           <div className="flex-grow flex items-center justify-center text-destructive p-4 rounded-md bg-destructive/10 border border-destructive/30">
            <p>{error}</p>
          </div>
        ) : output && output.length > 0 ? (
          <ScrollArea className="flex-grow h-[200px] lg:h-[300px] rounded-md border p-3 bg-input/30 font-mono text-sm">
            {output.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">{line}</div>
            ))}
          </ScrollArea>
        ) : (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <p>Output from console.log will appear here after running the code.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
