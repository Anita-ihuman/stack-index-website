import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ComparisonView } from './ComparisonView';
import { ProjectDeepDive } from './ProjectDeepDive';
import { analyzeTools, detectAnalysisType, EnhancedAnalysisResponse } from '@/lib/aiAnalysis';
import { ComparisonAnalysis, DeepDiveAnalysis } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Zap, Database, FileText, Users, Clock } from 'lucide-react';
import { AnalysisMetadata } from '@/lib/apiClient';

export function AIAnalysisContainer() {
  const [input, setInput] = useState('');
  const [analysisType, setAnalysisType] = useState<'comparison' | 'deepdive' | null>(null);
  const [metadata, setMetadata] = useState<AnalysisMetadata | null>(null);

  const mutation = useMutation({
    mutationFn: analyzeTools,
    onSuccess: (data: EnhancedAnalysisResponse) => {
      setMetadata(data.metadata || null);
      if ('tools' in data.analysis) {
        setAnalysisType('comparison');
      } else {
        setAnalysisType('deepdive');
      }
    },
  });

  const handleAnalyze = () => {
    if (!input.trim()) return;

    const type = detectAnalysisType(input);
    mutation.mutate({ input: input.trim(), type });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const detectedType = input.trim() ? detectAnalysisType(input) : null;

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="border-primary/30 shadow-xl bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            AI Tool Analyzer
          </CardTitle>
          <CardDescription className="text-base">
            Compare multiple tools or get a deep-dive analysis of a single tool.
            Just enter the tool name(s) below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder='e.g., "React vs Vue" or "Next.js"'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-lg font-mono"
                disabled={mutation.isPending}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!input.trim() || mutation.isPending}
              className="h-12 px-8 font-semibold"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {/* Detection Preview */}
          {detectedType && !mutation.isPending && !mutation.data && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold">Detected:</span>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded font-mono">
                {detectedType === 'comparison' ? 'Comparison Mode' : 'Deep-Dive Mode'}
              </span>
            </div>
          )}

          {/* Examples */}
          {!mutation.data && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-semibold mb-2 text-muted-foreground">Examples:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'React vs Vue',
                  'Next.js',
                  'Docker vs Podman',
                  'TypeScript',
                  'PostgreSQL vs MySQL',
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example)}
                    className="font-mono text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : 'An error occurred while analyzing the tools. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {mutation.isPending && (
        <Card className="border-primary/30">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-lg font-semibold text-muted-foreground">
                Analyzing your request with real-time data...
              </p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  GitHub
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Documentation
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Community
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Fetching metrics, docs, and community data...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata Display */}
      {metadata && mutation.data && (
        <Card className="border-primary/10 bg-muted/30">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Fetched {new Date(metadata.fetchedAt).toLocaleTimeString()}
                </span>
                {metadata.tokensUsed > 0 && (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {metadata.tokensUsed.toLocaleString()} tokens
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={metadata.sources.github ? 'default' : 'outline'} className="text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  GitHub
                </Badge>
                <Badge variant={metadata.sources.documentation ? 'default' : 'outline'} className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Docs
                </Badge>
                <Badge variant={metadata.sources.community ? 'default' : 'outline'} className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Community
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mutation.data && analysisType === 'comparison' && (
        <ComparisonView analysis={mutation.data.analysis as ComparisonAnalysis} />
      )}

      {mutation.data && analysisType === 'deepdive' && (
        <ProjectDeepDive analysis={mutation.data.analysis as DeepDiveAnalysis} />
      )}
    </div>
  );
}
