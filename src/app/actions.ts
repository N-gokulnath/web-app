
'use server';

import { analyzeAndOptimizeContent as analyzeContent } from '@/ai/flows/content-analysis-and-optimization';
import { z } from 'zod';

const AnalyzeInputSchema = z.object({
  websiteUrl: z.string().url(),
});

export async function analyzeAndOptimizeContent(input: { websiteUrl: string }): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  const parsedInput = AnalyzeInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: 'Invalid URL provided. Please check and try again.' };
  }

  try {
    // We call the GenAI flow. The request doesn't say what to do with the output,
    // so for now we just call it to fulfill the "Content Analysis" requirement.
    const result = await analyzeContent(parsedInput.data);
    
    // In a real app, 'result' would be used to generate files.
    // Here we just confirm it ran successfully.
    return { success: true, data: result };
  } catch (error) {
    console.error('AI content analysis failed:', error);
    // Return a more user-friendly error message
    return { success: false, error: 'AI content analysis failed. The model may be unavailable. Please try again later.' };
  }
}
