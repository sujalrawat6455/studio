import { CompilerInterface } from "@/components/compiler/CompilerInterface";
import { getDatatypeMapping } from "@/lib/compiler";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const datatypeMappings = getDatatypeMapping();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="py-4 px-4 md:px-6 lg:px-8 shadow-sm bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            MiniC Compiler
          </h1>
          <Link href="https://github.com/firebase/genkit/tree/main/firebase-studio-prototyping-examples/mini-c-compiler" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <CompilerInterface initialDatatypeMappings={datatypeMappings} />
      </main>

      <footer className="py-4 px-4 md:px-6 lg:px-8 text-center text-sm text-muted-foreground border-t border-border/50 bg-card/50">
        <p>&copy; {new Date().getFullYear()} MiniC Compiler. Powered by Next.js, ShadCN UI, and Genkit AI.</p>
      </footer>
    </div>
  );
}
