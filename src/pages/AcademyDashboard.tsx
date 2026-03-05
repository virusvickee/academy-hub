import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { store, PdfDocument } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Upload, LogOut, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

    // Store as data URL for preview
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
      // Reset file input
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
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">Academy</span>
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
            <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload PDF</CardTitle>
            <CardDescription>Upload subject PDFs with metadata for students to discover</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Name</Label>
                <Input id="subject" required value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Mathematics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class Name</Label>
                <Input id="class" required value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Grade 10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input id="school" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="e.g. Springfield High" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdf-file">PDF File</Label>
                <Input id="pdf-file" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full sm:w-auto">
                  <Upload className="mr-2 h-4 w-4" /> Upload PDF
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Uploads</CardTitle>
            <CardDescription>{docs.length} document{docs.length !== 1 ? "s" : ""} uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            {docs.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No documents uploaded yet.</p>
            ) : (
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
                  {docs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.fileName}</TableCell>
                      <TableCell>{doc.subjectName}</TableCell>
                      <TableCell>{doc.className}</TableCell>
                      <TableCell>{doc.schoolName}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
