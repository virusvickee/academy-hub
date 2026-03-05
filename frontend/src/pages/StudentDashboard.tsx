import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { pdfAPI } from "@/lib/api";
import { PdfDocument } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, LogOut, FileText, Eye, GraduationCap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardItem = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } };

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [school, setSchool] = useState("");
  const [results, setResults] = useState<PdfDocument[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PdfDocument | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const params: any = {};
      if (subject) params.subject = subject;
      if (className) params.className = className;
      if (school) params.school = school;

      const docs = await pdfAPI.search(params);
      setResults(docs.map((d: any) => ({ ...d, id: d._id, uploadedAt: d.createdAt })));
      setSearched(true);
      if (docs.length === 0) toast.info("No documents found");
    } catch (error: any) {
      toast.error(error.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b glass"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-md">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>EduPlatform</span>
              <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Student</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-5xl space-y-6 p-4 pt-8">
        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="h-1.5 gradient-primary" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                Search PDFs
              </CardTitle>
              <CardDescription>Find subject materials by subject, class, or school</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="s-subject">Subject</Label>
                  <Input id="s-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-class">Class</Label>
                  <Input id="s-class" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Grade 10" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-school">School</Label>
                  <Input id="s-school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Springfield High" className="h-11" />
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit" disabled={loading} className="gradient-primary text-primary-foreground font-semibold gap-2 h-11 px-6 group">
                    <Search className="h-4 w-4 transition-transform group-hover:scale-110" /> 
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Results</CardTitle>
                  <CardDescription>{results.length} document{results.length !== 1 ? "s" : ""} found</CardDescription>
                </CardHeader>
                <CardContent>
                  {results.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">No documents found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search filters</p>
                    </div>
                  ) : (
                    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {results.map((doc) => (
                        <motion.div key={doc.id} variants={cardItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                          <Card
                            className="cursor-pointer border border-border/50 transition-shadow hover:shadow-lg group"
                            onClick={() => setPreviewDoc(doc)}
                          >
                            <CardContent className="flex items-start gap-3 p-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 transition-colors group-hover:bg-destructive/20">
                                <FileText className="h-5 w-5 text-destructive" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-sm">{doc.fileName}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{doc.subjectName} · {doc.className}</p>
                                <p className="text-xs text-muted-foreground">{doc.schoolName}</p>
                              </div>
                              <Eye className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors mt-1" />
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {previewDoc?.fileName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-xl border bg-muted/50 flex flex-col items-center justify-center p-8">
            {previewDoc && (
              <div className="text-center space-y-4 max-w-md">
                <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-destructive/10">
                  <FileText className="h-10 w-10 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-2">{previewDoc.fileName}</p>
                  <div className="space-y-1 text-sm text-muted-foreground mb-6">
                    <p><span className="font-medium">Subject:</span> {previewDoc.subjectName}</p>
                    <p><span className="font-medium">Class:</span> {previewDoc.className}</p>
                    <p><span className="font-medium">School:</span> {previewDoc.schoolName}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => window.open(previewDoc.fileUrl, '_blank')}
                      className="gap-2 w-full"
                    >
                      <Eye className="h-4 w-4" />
                      View PDF
                    </Button>
                    <Button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewDoc.fileUrl;
                        link.download = previewDoc.fileName;
                        link.click();
                      }}
                      variant="outline"
                      className="gap-2 w-full"
                    >
                      <FileText className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
