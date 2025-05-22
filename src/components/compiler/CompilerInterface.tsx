// src/components/compiler/CompilerInterface.tsx
"use client";

import { useState, useEffect } from "react";
import { CodeInputPanel } from "./CodeInputPanel";
import { OutputPanel } from "./OutputPanel";
import { ExecutionOutputPanel } from "./ExecutionOutputPanel"; // New panel
import { DatatypeMappingDisplay } from "./DatatypeMappingDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent }  from "@/components/ui/card";
import { PlaySquare, Loader2, Play } from "lucide-react"; // Added Play icon
import { compileAndExplainAction, type CompileResult } from "@/app/actions";
import type { DatatypeMapping } from "@/lib/compiler";
import { useToast } from "@/hooks/use-toast";

interface CompilerInterfaceProps {
  initialDatatypeMappings: DatatypeMapping[];
}

export function CompilerInterface({ initialDatatypeMappings }: CompilerInterfaceProps) {
  const [miniCCode, setMiniCCode] = useState<string>("");
  const [jsCode, setJsCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For compilation
  const [isExecuting, setIsExecuting] = useState<boolean>(false); // For running JS
  const [error, setError] = useState<string | null>(null); // General/compilation error
  const [compilationErrors, setCompilationErrors] = useState<string[] | null>(null);
  const [executionOutput, setExecutionOutput] = useState<string[] | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const { toast } = useToast();

  // Effect to clear results when MiniC code changes
  useEffect(() => {
    if (!isLoading && !isExecuting) { 
      setJsCode(null);
      setError(null);
      setCompilationErrors(null);
      setExecutionOutput(null);
      setExecutionError(null);
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
    setExecutionOutput(null); 
    setExecutionError(null);

    try {
      const result: CompileResult = await compileAndExplainAction(miniCCode);
      if (result.error) {
        setError(result.error);
        if (result.compilationErrors) {
          setCompilationErrors(result.compilationErrors);
        }
         toast({
          title: "Compilation Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setJsCode(result.jsCode);
        toast({
          title: "Compilation Successful",
          description: "JavaScript code generated.",
        });
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during compilation.");
      toast({
        title: "Unhandled Compilation Error",
        description: e.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = () => {
    if (!jsCode) {
      toast({
        title: "Execution Error",
        description: "No JavaScript code to run. Please compile first.",
        variant: "destructive",
      });
      return;
    }
    setIsExecuting(true);
    setExecutionOutput([]); // Clear previous output
    setExecutionError(null);
    
    const logs: string[] = [];
    const captureLog = (...args: any[]) => {
      logs.push(args.map(arg => {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2); // Pretty print objects
          } catch (e) {
            return '[Unserializable Object]';
          }
        }
        return String(arg);
      }).join(' '));
    };

    try {
      // Dynamically create a function to execute the jsCode
      // Pass our custom console implementation
      const func = new Function('customConsole', `
        const console = { log: customConsole.log };
        try {
          ${jsCode}
        } catch(e) {
          customConsole.log('Runtime Error: ' + e.message);
          throw e; // Re-throw to be caught by outer try-catch
        }
      `);
      func({ log: captureLog });
      setExecutionOutput(logs);
      toast({
        title: "Execution Finished",
        description: "Code executed successfully.",
      });
    } catch (e: any) {
      // Logs might already contain the runtime error from the inner try-catch
      // If not, or for other errors (like syntax errors in jsCode not caught by compiler)
      if (!logs.some(log => log.startsWith("Runtime Error:"))) {
         captureLog(`Execution Error: ${e.message}`);
      }
      setExecutionOutput(logs); // Show logs even if there was an error
      setExecutionError(`Execution Error: ${e.message}`); // Set specific execution error
      toast({
        title: "Execution Error",
        description: e.message || "An error occurred while running the JavaScript.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClearInput = () => {
    setMiniCCode("");
    // States depending on miniCCode will be cleared by useEffect
  };

  const handleClearExecutionOutput = () => {
    setExecutionOutput(null);
    setExecutionError(null);
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
            Enter MiniC code, compile to JavaScript, and then run the generated code.
          </p>
          <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
            <Button onClick={handleCompile} disabled={isLoading || isExecuting} size="lg" className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
              ) : (
                <PlaySquare className="mr-2 h-5 w-5" />
              )}
              Compile
            </Button>
            <Button onClick={handleRun} disabled={!jsCode || isLoading || isExecuting} size="lg" className="w-full sm:w-auto">
              {isExecuting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              Run
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:min-h-[calc(100vh-300px)]">
        {/* Column 1: Input & Datatypes */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CodeInputPanel
            value={miniCCode}
            onChange={setMiniCCode}
            onClear={handleClearInput}
            disabled={isLoading || isExecuting}
            compilationErrors={compilationErrors}
          />
          <DatatypeMappingDisplay mappings={initialDatatypeMappings} />
        </div>

        {/* Column 2: JS Output */}
        <div className="lg:col-span-1">
          <OutputPanel 
            jsCode={jsCode} 
            isLoading={isLoading && !jsCode} // Show loading only if jsCode is not yet set during compilation
            error={error && !compilationErrors && !jsCode ? error : undefined} 
          />
        </div>

        {/* Column 3: Execution Output */}
        <div className="lg:col-span-1">
          <ExecutionOutputPanel 
            output={executionOutput}
            isLoading={isExecuting}
            onClear={handleClearExecutionOutput}
            error={executionError}
          />
        </div>
      </div>
    </div>
  );
}
