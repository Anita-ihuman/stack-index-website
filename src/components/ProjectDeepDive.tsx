import { DeepDiveAnalysis, LearningResource } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Star, AlertTriangle, Lightbulb, BookOpen, Layers } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

interface ProjectDeepDiveProps {
  analysis: DeepDiveAnalysis;
}

export function ProjectDeepDive({ analysis }: ProjectDeepDiveProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className={`bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur ${analysis.verificationBadge ? 'border-emerald-500/50 border-2' : 'border-primary/20'}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <CardTitle className="text-4xl font-bold font-mono">
                  {analysis.name}
                </CardTitle>
                {analysis.verificationBadge && (
                  <VerificationBadge badge={analysis.verificationBadge} size="md" />
                )}
              </div>
              <CardDescription className="text-lg mt-2">
                {analysis.technicalSummary}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full shrink-0">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-bold font-mono text-xl">
                {analysis.communityRating.toFixed(1)}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid Layout for Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Use Cases Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-secondary/20">
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Use Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {analysis.useCases.map((useCase, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="font-mono text-sm py-1.5 px-3"
                >
                  {useCase}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-green-500/10">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pros & Cons Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="bg-secondary/20">
          <CardTitle>Pros & Cons</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                Pros
              </h4>
              <ul className="space-y-3">
                {analysis.topProsCons.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400 font-bold">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
                <XCircle className="w-5 h-5" />
                Cons
              </h4>
              <ul className="space-y-3">
                {analysis.topProsCons.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 dark:text-red-400 font-bold">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Card */}
      <Card className="hover:shadow-lg transition-shadow border-primary/30">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Detailed Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm font-mono leading-relaxed text-muted-foreground whitespace-pre-line">
            {analysis.architecturalDesign}
          </p>
        </CardContent>
      </Card>

      {/* Best Practices & Common Pitfalls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Best Practices Card */}
        <Card className="hover:shadow-lg transition-shadow border-blue-500/30">
          <CardHeader className="bg-blue-500/10">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Lightbulb className="w-5 h-5" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {analysis.bestPractices.map((practice, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Common Pitfalls Card */}
        <Card className="hover:shadow-lg transition-shadow border-amber-500/30">
          <CardHeader className="bg-amber-500/10">
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              Common Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {analysis.commonPitfalls.map((pitfall, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-lg leading-none">
                    ⚠
                  </span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Gotchas Card */}
      {analysis.gotchas && analysis.gotchas.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow border-red-500/30">
          <CardHeader className="bg-red-500/10">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Important Gotchas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {analysis.gotchas.map((gotcha, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg leading-none">
                    ⚠️
                  </span>
                  <span>{gotcha}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Learning Resources Card */}
      <Card className="hover:shadow-lg transition-shadow border-purple-500/30">
        <CardHeader className="bg-purple-500/10">
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <BookOpen className="w-5 h-5" />
            Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-3">
            {analysis.learningResources.map((resource: LearningResource, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-purple-700 dark:text-purple-300 hover:underline"
                  >
                    {resource.title}
                  </a>
                  <span className="text-xs text-muted-foreground">{resource.type}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
