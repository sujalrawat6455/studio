// src/components/compiler/OutputPanel.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, TerminalSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutputPanelProps {
  jsCode: string | null;
  isLoading: boolean;
  error?: string | null;
}

export function OutputPanel({ jsCode, isLoading, error }: OutputPanelProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (jsCode) {
      navigator.clipboard.writeText(jsCode);
      toast({
        title: "Copied to clipboard!",
        description: "Generated JavaScript code has been copied.",
      });
    }
  };

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <TerminalSquare className="mr-2 h-5 w-5 text-accent" />
            Generated JavaScript
          </CardTitle>
          {jsCode && !isLoading && (
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy JS
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-accent" />
            <span>Generating JavaScript...</span>
          </div>
        ) : error && !jsCode ? (
           <div className="flex-grow flex items-center justify-center text-destructive p-4 rounded-md bg-destructive/10 border border-destructive/30">
            <p>{error}</p>
          </div>
        ) : jsCode ? (
          <>
            <Label htmlFor="jsOutput" className="sr-only">
              Generated JavaScript
            </Label>
            <Textarea
              id="jsOutput"
              value={jsCode}
              readOnly
              className="font-mono text-sm flex-grow resize-none min-h-[200px] lg:min-h-[300px] bg-input/30"
              placeholder="JavaScript output will appear here..."
              rows={15}
            />
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <p>JavaScript output will appear here after compilation.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
