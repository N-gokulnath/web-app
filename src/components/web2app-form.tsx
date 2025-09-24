
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Link2,
  LoaderCircle,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn, sleep } from '@/lib/utils';
import { analyzeAndOptimizeContent } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type ProgressStep = {
  id: number;
  text: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};

const initialSteps: ProgressStep[] = [
  { id: 1, text: 'Loading website', status: 'pending' },
  { id: 2, text: 'Analyzing website content', status: 'pending' },
  { id: 3, text: 'Creating manifest and building APK', status: 'pending' },
  { id: 4, text: 'Success! Your app is ready.', status: 'pending' },
];

const ProgressIcon = ({ status }: { status: ProgressStep['status'] }) => {
  switch (status) {
    case 'running':
      return <LoaderCircle className="h-5 w-5 animate-spin text-primary" />;
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case 'pending':
      return <Circle className="h-5 w-5 text-muted-foreground/30" />;
    default:
      return null;
  }
};

export function Web2AppForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressStep[]>(initialSteps);
  const [showDownload, setShowDownload] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const runProcess = async (url: string) => {
    setIsProcessing(true);
    setShowDownload(false);
    setProgress(initialSteps.map((s) => ({ ...s, status: 'pending' })));

    let currentSteps = [...initialSteps];

    const updateStep = (id: number, status: ProgressStep['status']) => {
      currentSteps = currentSteps.map((s) => (s.id === id ? { ...s, status } : s));
      setProgress([...currentSteps]);
    };

    try {
      // Step 1: Loading website
      updateStep(1, 'running');
      await sleep(1500);
      updateStep(1, 'completed');

      // Step 2: Analyzing content
      updateStep(2, 'running');
      const analysisResult = await analyzeAndOptimizeContent({ websiteUrl: url });
      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Failed to analyze website content.');
      }
      await sleep(500); // Small delay to show completion
      updateStep(2, 'completed');

      // Step 3: Building APK
      updateStep(3, 'running');
      await sleep(2000);
      updateStep(3, 'completed');

      // Step 4: Success
      updateStep(4, 'running');
      await sleep(500);
      updateStep(4, 'completed');
      
      setShowDownload(true);

    } catch (error: any) {
      const failedStep = currentSteps.find(s => s.status === 'running');
      if (failedStep) {
        updateStep(failedStep.id, 'failed');
      }
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    runProcess(values.url);
  };

  const handleDownload = () => {
    const apkContent = `
[Web2App Generated APK]
Website: ${form.getValues('url')}
Timestamp: ${new Date().toISOString()}

This is a dummy file to simulate an APK download.
`;
    const blob = new Blob([apkContent], {
      type: 'application/vnd.android.package-archive',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create a filename from the URL
    const urlObject = new URL(form.getValues('url'));
    const filename = `${urlObject.hostname.replace(/\./g, '_')}.apk`;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Download Started',
      description: `Downloading ${filename}...`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mt-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Create Your App</CardTitle>
        <CardDescription>
          Enter your website&apos;s URL to begin the conversion process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        className="pl-9"
                        disabled={isProcessing}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isProcessing} className="w-full transition-all">
              {isProcessing ? 'Generating...' : 'Generate App'}
            </Button>
          </form>
        </Form>
        {(isProcessing || progress.some(p => p.status !== 'pending')) && (
          <div className="mt-8 space-y-4 pt-6 border-t">
            {progress.map((step, index) => (
              step.status !== 'pending' && (
                <div
                  key={step.id}
                  className="flex items-center gap-x-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProgressIcon status={step.status} />
                  <p
                    className={cn('text-sm font-medium', {
                      'text-muted-foreground': step.status === 'completed',
                      'text-destructive': step.status === 'failed',
                    })}
                  >
                    {step.text}
                  </p>
                </div>
              )
            ))}
          </div>
        )}
      </CardContent>
      {showDownload && (
        <CardFooter className="flex-col gap-4 !pt-0">
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download APK
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
