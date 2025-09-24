'use server';
/**
 * @fileOverview Analyzes website content using AI to optimize it for mobile viewing and performance.
 *
 * - analyzeAndOptimizeContent - A function that handles the content analysis and optimization process.
 * - AnalyzeAndOptimizeContentInput - The input type for the analyzeAndOptimizeContent function.
 * - AnalyzeAndOptimizeContentOutput - The return type for the analyzeAndOptimizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAndOptimizeContentInputSchema = z.object({
  websiteUrl: z
    .string()
    .url()
    .describe('The URL of the website to analyze and optimize.'),
});
export type AnalyzeAndOptimizeContentInput = z.infer<
  typeof AnalyzeAndOptimizeContentInputSchema
>;

const AnalyzeAndOptimizeContentOutputSchema = z.object({
  optimizedContent: z
    .string()
    .describe('The optimized content of the website for mobile viewing.'),
  suggestions: z
    .string()
    .describe('Suggestions for improving website performance on mobile.'),
});
export type AnalyzeAndOptimizeContentOutput = z.infer<
  typeof AnalyzeAndOptimizeContentOutputSchema
>;

export async function analyzeAndOptimizeContent(
  input: AnalyzeAndOptimizeContentInput
): Promise<AnalyzeAndOptimizeContentOutput> {
  return analyzeAndOptimizeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAndOptimizeContentPrompt',
  input: {schema: AnalyzeAndOptimizeContentInputSchema},
  output: {schema: AnalyzeAndOptimizeContentOutputSchema},
  prompt: `You are an expert web content optimizer specializing in mobile performance.

Analyze the content of the website at the given URL and provide optimized content and suggestions for improving website performance on mobile.

URL: {{{websiteUrl}}}

Optimize the content and provide suggestions in a structured format.`,
});

const analyzeAndOptimizeContentFlow = ai.defineFlow(
  {
    name: 'analyzeAndOptimizeContentFlow',
    inputSchema: AnalyzeAndOptimizeContentInputSchema,
    outputSchema: AnalyzeAndOptimizeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
