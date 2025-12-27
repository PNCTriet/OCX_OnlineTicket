"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { IconFileText, IconBook, IconLoader2, IconChevronRight, IconSearch, IconX, IconLink } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase";

// Danh sách các file markdown có sẵn
const DOCUMENTS = [
  { id: "rule", name: "Design Rules", file: "/documents/RULE.md", keywords: ["design", "vector", "png", "svg", "export", "asset"] },
  { id: "auth-setup", name: "Auth Setup", file: "/documents/AUTH_SETUP.md", keywords: ["auth", "authentication", "login", "supabase", "setup"] },
  { id: "backend-email", name: "Backend Email API", file: "/documents/BACKEND_EMAIL_API_SPEC.md", keywords: ["email", "api", "backend", "spec"] },
  { id: "buy-ticket-flow", name: "Buy Ticket Flow", file: "/documents/BUY_TICKET_FLOW.md", keywords: ["ticket", "buy", "flow", "purchase", "order"] },
  { id: "database-en", name: "Database Design (EN)", file: "/documents/database_design_EN.md", keywords: ["database", "design", "schema", "english"] },
  { id: "database-vi", name: "Database Design (VI)", file: "/documents/database_design_VI.md", keywords: ["database", "design", "schema", "vietnamese", "tiếng việt"] },
  { id: "env-setup", name: "Environment Setup", file: "/documents/ENV_SETUP.md", keywords: ["environment", "env", "setup", "config", "variables"] },
  { id: "frontend-webhook", name: "Frontend Payment Webhook", file: "/documents/FRONTEND_PAYMENT_WEBHOOK.md", keywords: ["webhook", "payment", "frontend", "callback"] },
  { id: "icon-libraries", name: "Icon Libraries", file: "/documents/ICON_LIBRARIES_README.md", keywords: ["icon", "libraries", "ui", "design"] },
  { id: "images-naming", name: "Images Naming", file: "/documents/images_naming_refactor.md", keywords: ["images", "naming", "refactor", "assets"] },
  { id: "launch-gate", name: "Launch Gate", file: "/documents/LAUNCH_GATE_README.md", keywords: ["launch", "gate", "release"] },
  { id: "launch-readme", name: "Launch Readme", file: "/documents/LAUNCH_README.md", keywords: ["launch", "readme", "deployment"] },
  { id: "resend-setup", name: "Resend Setup", file: "/documents/RESEND_SETUP.md", keywords: ["resend", "email", "setup", "service"] },
  { id: "setup-checklist", name: "Setup Checklist", file: "/documents/SETUP_CHECKLIST.md", keywords: ["setup", "checklist", "guide", "installation"] },
  { id: "supabase-setup", name: "Supabase Setup", file: "/documents/SUPABASE_SETUP.md", keywords: ["supabase", "database", "setup", "config"] },
  { id: "test-guide", name: "Test Guide", file: "/documents/TEST_GUIDE.md", keywords: ["test", "testing", "guide", "qa"] },
  { id: "webhook-setup", name: "Webhook Setup", file: "/documents/WEBHOOK_SETUP.md", keywords: ["webhook", "setup", "payment", "callback"] },
];

function DocumentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const supabase = createClient();
  const BUCKET_NAME = "documents";
  const MAX_UPLOAD_MB = 5;

  // Filter documents based on search query
  const filteredDocuments = DOCUMENTS.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  // Load document từ URL param hoặc document đầu tiên
  useEffect(() => {
    const docParam = searchParams?.get("doc");
    if (docParam) {
      const doc = DOCUMENTS.find((d) => d.id === docParam);
      if (doc && selectedDoc !== docParam) {
        handleSelectDoc(docParam);
        return;
      }
    }
    // Nếu không có param hoặc không tìm thấy, load document đầu tiên
    if (DOCUMENTS.length > 0 && !selectedDoc) {
      handleSelectDoc(DOCUMENTS[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSelectDoc = async (docId: string) => {
    const doc = DOCUMENTS.find((d) => d.id === docId);
    if (!doc || selectedDoc === docId) return;

    setSelectedDoc(docId);
    setLoading(true);
    setContent("");

    // Update URL với query param (chỉ khi không phải từ URL param)
    const currentDocParam = searchParams?.get("doc");
    if (currentDocParam !== docId) {
      router.push(`/documents?doc=${docId}`, { scroll: false });
    }

    try {
      const response = await fetch(doc.file);
      if (response.ok) {
        const text = await response.text();
        setContent(text);
      } else {
        setContent("# Error\n\nCould not load document.");
      }
    } catch {
      setContent("# Error\n\nFailed to load document.");
    } finally {
      setLoading(false);
    }
  };

  const copyDocumentLink = () => {
    if (!selectedDoc) return;
    
    const currentUrl = window.location.origin;
    const docUrl = `${currentUrl}/documents?doc=${selectedDoc}`;
    
    navigator.clipboard.writeText(docUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Upload zip (<5MB) and allow download
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setUploadError(`File vượt quá ${MAX_UPLOAD_MB}MB.`);
      setUploadedFileName(null);
      setUploadedFileUrl(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setUploadError("Chỉ hỗ trợ file .zip.");
      setUploadedFileName(null);
      setUploadedFileUrl(null);
      return;
    }

    setUploading(true);
    try {
      const filePath = `uploads/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: false,
          cacheControl: "3600",
        });

      if (uploadErr) {
        setUploadError(`Upload thất bại: ${uploadErr.message}`);
        setUploadedFileName(null);
        setUploadedFileUrl(null);
        return;
      }

      const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      const publicUrl = publicData?.publicUrl;
      if (!publicUrl) {
        setUploadError("Không lấy được link tải xuống.");
        setUploadedFileName(null);
        setUploadedFileUrl(null);
        return;
      }

      setUploadedFileName(file.name);
      setUploadedFileUrl(publicUrl);
    } catch (err) {
      setUploadError("Upload thất bại. Vui lòng thử lại.");
      setUploadedFileName(null);
      setUploadedFileUrl(null);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    };
  }, [uploadedFileUrl]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex-shrink-0 overflow-y-auto max-h-screen md:max-h-none">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <IconBook className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Tài Liệu</h2>
          </div>
          
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  type="button"
                  aria-label="Clear search"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-zinc-500 mt-2">
                Tìm thấy {filteredDocuments.length} tài liệu
              </p>
            )}
          </div>

          <nav className="space-y-1">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelectDoc(doc.id)}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedDoc === doc.id
                    ? "bg-zinc-800 text-white font-semibold shadow-lg"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                <IconFileText 
                  className={`w-5 h-5 flex-shrink-0 ${
                    selectedDoc === doc.id ? "text-blue-400" : "text-zinc-500"
                  }`} 
                />
                <span className="flex-1">{doc.name}</span>
                {selectedDoc === doc.id && (
                  <IconChevronRight className="w-4 h-4 text-blue-400" />
                )}
              </button>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">
                <IconSearch className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                <p>Không tìm thấy tài liệu nào</p>
                <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-h-screen bg-black">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Hidden upload control (zip <5MB) */}
          <div className="mb-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>Upload ZIP (ẩn):</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs transition-colors"
              >
                {uploading ? "Đang upload..." : "Chọn file"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,application/zip"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploadedFileName && uploadedFileUrl && (
                <a
                  href={uploadedFileUrl}
                  download={uploadedFileName}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs transition-colors"
                >
                  Tải xuống {uploadedFileName}
                </a>
              )}
            </div>
            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
          </div>

          {selectedDoc && content && !loading && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span>Đang xem:</span>
                <span className="text-white font-semibold">
                  {DOCUMENTS.find((d) => d.id === selectedDoc)?.name}
                </span>
              </div>
              <button
                onClick={copyDocumentLink}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm transition-colors"
                title="Copy link to this document"
              >
                <IconLink className="w-4 h-4" />
                {copied ? "Đã copy!" : "Copy link"}
              </button>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <IconLoader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-zinc-400">Đang tải tài liệu...</p>
            </div>
          ) : content ? (
            <article className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-4xl font-bold mb-4 mt-8 text-white border-b border-zinc-700 pb-2" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-3xl font-bold mb-3 mt-6 text-white border-b border-zinc-700 pb-2" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-2xl font-semibold mb-2 mt-4 text-white" {...props} />
                  ),
                  h4: ({ ...props }) => (
                    <h4 className="text-xl font-semibold mb-2 mt-4 text-white" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-4 text-zinc-300 leading-relaxed" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 text-zinc-300" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 text-zinc-300" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="text-zinc-300" {...props} />
                  ),
                  code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
                    if (inline) {
                      return (
                        <code className="bg-zinc-800 px-2 py-1 rounded text-sm text-orange-400 font-mono" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={`bg-zinc-900 p-4 rounded-lg block overflow-x-auto text-sm text-zinc-300 font-mono ${className || ""}`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children, ...props }: { children?: React.ReactNode }) => (
                    <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
                      {children}
                    </pre>
                  ),
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border-collapse border border-zinc-700" {...props} />
                    </div>
                  ),
                  thead: ({ ...props }) => (
                    <thead className="bg-zinc-800" {...props} />
                  ),
                  tbody: ({ ...props }) => (
                    <tbody {...props} />
                  ),
                  tr: ({ ...props }) => (
                    <tr className="border-b border-zinc-700" {...props} />
                  ),
                  th: ({ ...props }) => (
                    <th className="border border-zinc-700 px-4 py-2 text-left font-semibold text-white" {...props} />
                  ),
                  td: ({ ...props }) => (
                    <td className="border border-zinc-700 px-4 py-2 text-zinc-300" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400 mb-4" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                  ),
                  hr: ({ ...props }) => (
                    <hr className="border-zinc-700 my-8" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-bold text-white" {...props} />
                  ),
                  em: ({ ...props }) => (
                    <em className="italic text-zinc-200" {...props} />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center text-zinc-400 mt-16">
              <div className="flex flex-col items-center gap-4">
                <IconFileText className="w-16 h-16 text-zinc-600" />
                <p className="text-lg">Chọn một tài liệu từ sidebar để xem nội dung</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <IconLoader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    }>
      <DocumentsContent />
    </Suspense>
  );
}

