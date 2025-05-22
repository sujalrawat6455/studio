// src/components/compiler/ExplanationPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ExplanationPanelProps {
  explanation: string | null;
  isLoading: boolean;
  error?: string | null;
}

export function ExplanationPanel({ explanation, isLoading, error }: ExplanationPanelProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation);
      toast({
        title: "Copied to clipboard!",
        description: "Explanation has been copied.",
      });
    }
  };

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            Conversion Explained
          </CardTitle>
          {explanation && !isLoading && (
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Explanation
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-accent" />
            <span>Generating explanation...</span>
          </div>
        ) : error && !explanation ? (
           <div className="flex-grow flex items-center justify-center text-destructive p-4 rounded-md bg-destructive/10 border border-destructive/30">
            <p>{error}</p>
          </div>
        ) : explanation ? (
          <ScrollArea className="flex-grow h-[200px] lg:h-[300px] rounded-md border p-4 bg-input/30">
            <div className="text-sm whitespace-pre-wrap">{explanation}</div>
          </ScrollArea>
        ) : (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <p>AI-powered explanation will appear here after compilation.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
