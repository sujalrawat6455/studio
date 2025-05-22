// src/app/actions.ts
"use server";

// import { explainConversion, type ExplainConversionInput } from '@/ai/flows/explain-conversion'; // Removed
import { miniCToJs, type MiniCToJsOutput } from '@/lib/compiler';

export interface CompileResult {
  jsCode: string | null;
  // explanation: string | null; // Removed
  error: string | null;
  compilationErrors?: string[] | null;
}

export async function compileAndExplainAction(miniCCode: string): Promise<CompileResult> {
  if (!miniCCode.trim()) {
    return { jsCode: null, error: "MiniC code cannot be empty.", compilationErrors: null };
  }

  try {
    const compileOutput: MiniCToJsOutput = await miniCToJs(miniCCode);

    if (compileOutput.errors && compileOutput.errors.length > 0) {
      return {
        jsCode: null,
        error: "Compilation failed.",
        compilationErrors: compileOutput.errors,
      };
    }

    if (!compileOutput.jsCode) {
      return { jsCode: null, error: "Compilation produced no JavaScript code.", compilationErrors: null };
    }

    // AI Explanation part removed
    // const aiInput: ExplainConversionInput = {
    //   miniCSourceCode: miniCCode,
    //   javaScriptCode: compileOutput.jsCode,
    // };
    // const aiOutput = await explainConversion(aiInput);

    return {
      jsCode: compileOutput.jsCode,
      // explanation: aiOutput.explanation, // Removed
      error: null,
      compilationErrors: null,
    };
  } catch (e: any) {
    console.error("Error in compileAndExplainAction:", e);
    return { 
      jsCode: null, 
      error: e.message || "An unexpected error occurred during compilation or explanation.",
      compilationErrors: null
    };
  }
}
