import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { marked } from "marked";


const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState(`## Top 5 Mistakes Every Beginner DevRel\n\nWrite your article here...`);
  const [images, setImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // use direct marked renderer

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await toDataUrl(file);
      newImages.push(dataUrl);
      // Append image markdown to the editor
      setMarkdown((m) => m + `\n\n![${file.name}](${dataUrl})\n`);
    }
    setImages((prev) => [...prev, ...newImages]);
    // reset input
    e.currentTarget.value = "";
  };

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const downloadMarkdown = () => {
    const blob = new Blob([`# ${title}\n\n${markdown}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (title || "post").replace(/\s+/g, "-").toLowerCase() + ".md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="container py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Create / Export Article</h1>
            <p className="text-muted-foreground">Write your article in markdown, upload images (they’ll be embedded as base64), preview, and export the final markdown file to add to the blog.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                className="w-full mb-4 px-4 py-3 rounded border border-border bg-background"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-2">Upload images (will be embedded)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
              </div>

              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[46vh] p-4 rounded border border-border bg-background resize-none"
              />

              <div className="flex gap-3 mt-4">
                <Button onClick={downloadMarkdown} className="bg-gradient-primary">Export Markdown</Button>
                <Button
                  onClick={() => {
                    navigator.clipboard?.writeText(`# ${title}\n\n${markdown}`);
                  }}
                  variant="outline"
                >
                  Copy to Clipboard
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold">Preview</h2>
                <p className="text-sm text-muted-foreground">Rendered markdown preview (images included).</p>
              </div>

              <article className="prose max-w-none bg-card p-6 rounded border-border overflow-auto" dangerouslySetInnerHTML={{ __html: marked(`# ${title}\n\n${markdown}`) }} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePost;
