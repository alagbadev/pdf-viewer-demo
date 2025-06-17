// src/app/pdf/page.tsx
import PdfViewer from '../../components/PdfViewer/PdfViewer';

export default function PdfPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <PdfViewer />
    </main>
  );
}
