import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  title: string;
  description: string;
  tag: string;
  author?: string;
  date?: string;
}

export const BlogCard = ({ title, description, tag, author, date }: BlogCardProps) => {
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer bg-gradient-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs font-mono">
            {tag}
          </Badge>
          {date && <span className="text-xs text-muted-foreground">{date}</span>}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
        {author && (
          <p className="text-sm text-muted-foreground mt-4">By {author}</p>
        )}
      </CardContent>
    </Card>
  );
};
