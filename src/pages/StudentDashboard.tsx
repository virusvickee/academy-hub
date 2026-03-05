import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { store, PdfDocument } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, LogOut, FileText, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [school, setSchool] = useState("");
  const [results, setResults] = useState<PdfDocument[]>([]);
  const [searched, setSearched] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PdfDocument | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const docs = store.searchPdfs({ subject, className, school });
    setResults(docs);
    setSearched(true);
    if (docs.length === 0) toast.info("No documents found");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">EduPlatform</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">Student</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-4 pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Search PDFs</CardTitle>
            <CardDescription>Find subject materials by subject, class, or school</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="s-subject">Subject</Label>
                <Input id="s-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-class">Class</Label>
                <Input id="s-class" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Grade 10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-school">School</Label>
                <Input id="s-school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Springfield High" />
              </div>
              <div className="sm:col-span-3">
                <Button type="submit"><Search className="mr-2 h-4 w-4" /> Search</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {searched && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>{results.length} document{results.length !== 1 ? "s" : ""} found</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No documents match your search criteria.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((doc) => (
                    <Card key={doc.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setPreviewDoc(doc)}>
                      <CardContent className="flex items-start gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                          <FileText className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">{doc.subjectName} · {doc.className}</p>
                          <p className="text-xs text-muted-foreground">{doc.schoolName}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {previewDoc?.fileName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-md border">
            {previewDoc && (
              <iframe src={previewDoc.fileUrl} className="h-full w-full" title="PDF Preview" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
