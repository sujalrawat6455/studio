'use server';

/**
 * @fileOverview Explains the conversion steps from MiniC to JavaScript.
 *
 * - explainConversion - A function that handles the explanation of the conversion process.
 * - ExplainConversionInput - The input type for the explainConversion function.
 * - ExplainConversionOutput - The return type for the explainConversion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainConversionInputSchema = z.object({
  miniCSourceCode: z
    .string()
    .describe('The MiniC source code to explain the conversion for.'),
  javaScriptCode: z
    .string()
    .describe('The JavaScript code generated from the MiniC source code.'),
});
export type ExplainConversionInput = z.infer<typeof ExplainConversionInputSchema>;

const ExplainConversionOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A step-by-step explanation of the conversion process.'),
});
export type ExplainConversionOutput = z.infer<typeof ExplainConversionOutputSchema>;

export async function explainConversion(input: ExplainConversionInput): Promise<ExplainConversionOutput> {
  return explainConversionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainConversionPrompt',
  input: {schema: ExplainConversionInputSchema},
  output: {schema: ExplainConversionOutputSchema},
  prompt: `You are an expert compiler engineer. You are explaining how MiniC code is converted to JavaScript.

MiniC Source Code:
--------------------
{{{miniCSourceCode}}}

JavaScript Code:
--------------------
{{{javaScriptCode}}}

Explain the conversion step by step. Be clear and concise.
`,
});

const explainConversionFlow = ai.defineFlow(
  {
    name: 'explainConversionFlow',
    inputSchema: ExplainConversionInputSchema,
    outputSchema: ExplainConversionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
