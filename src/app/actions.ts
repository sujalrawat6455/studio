// src/app/actions.ts
"use server";

import { explainConversion, type ExplainConversionInput } from '@/ai/flows/explain-conversion';
import { miniCToJs, type MiniCToJsOutput } from '@/lib/compiler';

export interface CompileResult {
  jsCode: string | null;
  explanation: string | null;
  error: string | null;
  compilationErrors?: string[] | null;
}

export async function compileAndExplainAction(miniCCode: string): Promise<CompileResult> {
  if (!miniCCode.trim()) {
    return { jsCode: null, explanation: null, error: "MiniC code cannot be empty.", compilationErrors: null };
  }

  try {
    const compileOutput: MiniCToJsOutput = await miniCToJs(miniCCode);

    if (compileOutput.errors && compileOutput.errors.length > 0) {
      return {
        jsCode: null,
        explanation: null,
        error: "Compilation failed.",
        compilationErrors: compileOutput.errors,
      };
    }

    if (!compileOutput.jsCode) {
      return { jsCode: null, explanation: null, error: "Compilation produced no JavaScript code.", compilationErrors: null };
    }

    const aiInput: ExplainConversionInput = {
      miniCSourceCode: miniCCode,
      javaScriptCode: compileOutput.jsCode,
    };

    // Add a delay to simulate AI processing time, useful for showing loading states
    // await new Promise(resolve => setTimeout(resolve, 1500));

    const aiOutput = await explainConversion(aiInput);

    return {
      jsCode: compileOutput.jsCode,
      explanation: aiOutput.explanation,
      error: null,
      compilationErrors: null,
    };
  } catch (e: any) {
    console.error("Error in compileAndExplainAction:", e);
    return { 
      jsCode: null, 
      explanation: null, 
      error: e.message || "An unexpected error occurred during compilation or explanation.",
      compilationErrors: null
    };
  }
}
