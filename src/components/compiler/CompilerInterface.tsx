// src/components/compiler/CompilerInterface.tsx
"use client";

import { useState, useEffect } from "react";
import { CodeInputPanel } from "./CodeInputPanel";
import { OutputPanel } from "./OutputPanel";
// import { ExplanationPanel } from "./ExplanationPanel"; // Removed
import { DatatypeMappingDisplay } from "./DatatypeMappingDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent }  from "@/components/ui/card";
import { PlaySquare, Loader2 } from "lucide-react";
import { compileAndExplainAction, type CompileResult } from "@/app/actions";
import type { DatatypeMapping } from "@/lib/compiler";
import { useToast } from "@/hooks/use-toast";

interface CompilerInterfaceProps {
  initialDatatypeMappings: DatatypeMapping[];
}

export function CompilerInterface({ initialDatatypeMappings }: CompilerInterfaceProps) {
  const [miniCCode, setMiniCCode] = useState<string>("");
  const [jsCode, setJsCode] = useState<string | null>(null);
  // const [explanation, setExplanation] = useState<string | null>(null); // Removed
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [compilationErrors, setCompilationErrors] = useState<string[] | null>(null);
  const { toast } = useToast();

  // Effect to clear results when MiniC code changes after a compilation
  useEffect(() => {
    if (!isLoading) { // Only clear if not currently loading
      setJsCode(null);
      // setExplanation(null); // Removed
      setError(null);
      setCompilationErrors(null);
    }
  }, [miniCCode]);


  const handleCompile = async () => {
    if (!miniCCode.trim()) {
      toast({
        title: "Input Error",
        description: "MiniC code cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setCompilationErrors(null);
    setJsCode(null);
    // setExplanation(null); // Removed

    try {
      const result: CompileResult = await compileAndExplainAction(miniCCode);
      if (result.error) {
        setError(result.error);
        if (result.compilationErrors) {
          setCompilationErrors(result.compilationErrors);
        }
         toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setJsCode(result.jsCode);
        // setExplanation(result.explanation); // Removed
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      toast({
        title: "Unhandled Error",
        description: e.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearInput = () => {
    setMiniCCode("");
    // States depending on miniCCode will be cleared by useEffect
  };
  
  const defaultMiniCCode = `integer a = 10;
integer b = 20;
integer sum;
sum = a + b;
print(sum);

if (a < b) {
  print("a is less than b");
}

character initial = 'J';
decimal pi = 3.14;

print(initial);
print(pi);
`;

  useEffect(() => {
    setMiniCCode(defaultMiniCCode);
  }, []);


  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-md">
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground max-w-prose">
            Enter your MiniC code below. Click "Compile" to see the generated JavaScript.
          </p>
          <Button onClick={handleCompile} disabled={isLoading} size="lg" className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <PlaySquare className="mr-2 h-5 w-5" />
            )}
            Compile
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:min-h-[calc(100vh-280px)]">
        {/* Column 1: Input & Datatypes */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CodeInputPanel
            value={miniCCode}
            onChange={setMiniCCode}
            onClear={handleClearInput}
            disabled={isLoading}
            compilationErrors={compilationErrors}
          />
          <DatatypeMappingDisplay mappings={initialDatatypeMappings} />
        </div>

        {/* Column 2: JS Output */}
        <div className="lg:col-span-1">
          <OutputPanel jsCode={jsCode} isLoading={isLoading && !jsCode} error={error && !compilationErrors ? error : undefined} />
        </div>

        {/* Column 3: Explanation - Removed */}
        {/* 
        <div className="lg:col-span-1">
          <ExplanationPanel explanation={explanation} isLoading={isLoading && !explanation} error={error && !compilationErrors ? error : undefined} />
        </div> 
        */}
      </div>
    </div>
  );
}
