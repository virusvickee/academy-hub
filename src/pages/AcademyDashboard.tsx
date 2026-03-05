import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { store, PdfDocument } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Upload, LogOut, Trash2, FileText, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function AcademyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<PdfDocument[]>(() => store.getMyPdfs(user!.id));

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a PDF file");
    if (file.type !== "application/pdf") return toast.error("Only PDF files allowed");

    const reader = new FileReader();
    reader.onload = () => {
      const doc = store.uploadPdf({
        fileName: file.name,
        fileUrl: reader.result as string,
        subjectName,
        className,
        schoolName,
        uploadedBy: user!.id,
      });
      setDocs((prev) => [...prev, doc]);
      setSubjectName("");
      setClassName("");
      setSchoolName("");
      setFile(null);
      const input = document.getElementById("pdf-file") as HTMLInputElement;
      if (input) input.value = "";
      toast.success("PDF uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    store.deletePdf(id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("PDF deleted");
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b glass"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-accent shadow-md">
              <School className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>EduPlatform</span>
              <span className="ml-2 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">Academy</span>
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
        {/* Upload Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="h-1.5 gradient-accent" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Upload className="h-4 w-4 text-accent" />
                </div>
                Upload PDF
              </CardTitle>
              <CardDescription>Upload subject PDFs with metadata for students to discover</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Name</Label>
                  <Input id="subject" required value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Mathematics" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class Name</Label>
                  <Input id="class" required value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Grade 10" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School Name</Label>
                  <Input id="school" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="e.g. Springfield High" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf-file">PDF File</Label>
                  <Input id="pdf-file" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="h-11" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="gradient-accent text-accent-foreground font-semibold gap-2 h-11 px-6 group">
                    <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" /> Upload PDF
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">My Uploads</CardTitle>
              <CardDescription>{docs.length} document{docs.length !== 1 ? "s" : ""} uploaded</CardDescription>
            </CardHeader>
            <CardContent>
              {docs.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No documents uploaded yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Upload your first PDF above to get started</p>
                </div>
              ) : (
                <motion.div variants={container} initial="hidden" animate="show">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {docs.map((doc) => (
                          <motion.tr
                            key={doc.id}
                            variants={item}
                            exit={{ opacity: 0, x: -20 }}
                            layout
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <TableCell className="font-medium flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                                <FileText className="h-4 w-4 text-destructive" />
                              </div>
                              <span className="truncate max-w-[150px]">{doc.fileName}</span>
                            </TableCell>
                            <TableCell>{doc.subjectName}</TableCell>
                            <TableCell>{doc.className}</TableCell>
                            <TableCell>{doc.schoolName}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
