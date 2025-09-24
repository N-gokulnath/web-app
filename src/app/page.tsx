import { Web2AppForm } from '@/components/web2app-form';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 selection:bg-primary/20">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl font-headline">
          Web2App
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-lg mx-auto">
          Instantly convert your website into a native Android application with the power of AI.
        </p>
      </div>
      <Web2AppForm />
    </main>
  );
}
