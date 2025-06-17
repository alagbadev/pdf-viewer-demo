// src/components/PdfViewer/PdfViewer.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from 'pdf-lib';

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PdfViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.5);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedTerm, setDebouncedTerm] = useState<string>(searchTerm);
  
  // ARQUITETURA CORRIGIDA: Estados separados para os dados e para a exibição.
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null); // Guarda os dados "mestres" do PDF.
  const [pdfDisplayUrl, setPdfDisplayUrl] = useState<string>('/sample.pdf'); // Guarda a URL para o <Document>.

  const pageRef = useRef<HTMLDivElement>(null);

  // EFEITO 1: Carrega o PDF inicial e o armazena no estado de bytes.
  useEffect(() => {
    fetch('/sample.pdf')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        setPdfBytes(new Uint8Array(buffer));
      })
      .catch(err => {
        console.error("Erro ao carregar PDF inicial:", err);
        setError("Não foi possível carregar o arquivo PDF inicial.");
      });
  }, []); // O array vazio [] garante que isso rode apenas uma vez.

  // EFEITO 2: Limpa a URL de Blob antiga para evitar vazamento de memória.
  useEffect(() => {
    return () => {
      if (pdfDisplayUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfDisplayUrl);
      }
    };
  }, [pdfDisplayUrl]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error(err);
    setError(`Erro ao carregar o PDF. Detalhes: ${err.message}`);
  }, []);

  const customTextRenderer = useCallback(
    (textItem: any): string => {
      const str: string = textItem.str;
      if (!debouncedTerm.trim()) return str;
      const esc = debouncedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${esc})`, "gi");
      return str.split(regex).map((part) =>
        regex.test(part) ? `<mark>${part}</mark>` : part
      ).join('');
    },
    [debouncedTerm]
  );
  
  // LÓGICA FINAL: Usa os estados separados para evitar o "Detached ArrayBuffer".
  const handleHighlightSelection = async () => {
    const selection = window.getSelection();
    // A fonte da verdade agora é o 'pdfBytes', que nunca é desanexado.
    if (!selection || selection.rangeCount === 0 || !pdfBytes || !pageRef.current) return;

    try {
        const range = selection.getRangeAt(0);
        const selectionRect = range.getBoundingClientRect();
        const pageContainerRect = pageRef.current.getBoundingClientRect();
        
        if (selectionRect.width === 0 && selectionRect.height === 0) return;

        // 1. Carrega o PDF a partir dos bytes "mestres", que estão sempre intactos.
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPages()[pageNumber - 1];
        const { height: pageHeight } = page.getSize();

        const x = (selectionRect.left - pageContainerRect.left) / scale;
        const y = pageHeight - ((selectionRect.top - pageContainerRect.top + selectionRect.height) / scale);
        const rectWidth = selectionRect.width / scale;
        const rectHeight = selectionRect.height / scale;

        page.drawRectangle({ x, y, width: rectWidth, height: rectHeight, color: rgb(1, 1, 0), opacity: 0.3 });
        
        // 2. Salva as modificações em um novo conjunto de bytes.
        const modifiedPdfBytes = await pdfDoc.save();
        
        // 3. Cria uma Blob URL a partir dos novos bytes para o renderizador usar.
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const newUrl = URL.createObjectURL(blob);

        // 4. Atualiza os dois estados.
        setPdfBytes(modifiedPdfBytes); // Guarda os novos bytes "mestres".
        setPdfDisplayUrl(newUrl);      // Fornece a nova URL descartável para exibição.

        selection.removeAllRanges();
    } catch (err) {
        console.error("Erro ao aplicar o grifo:", err);
        setError("Não foi possível aplicar o grifo no documento.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 text-gray-900">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
        {/* Controles do topo */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 p-2 border-b">
          <input
            type="text"
            placeholder="Buscar no documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border rounded-md"
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHighlightSelection}
              title="Selecione um texto e clique para grifar"
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md shadow-sm hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!pdfBytes} // Desabilita o botão enquanto o PDF inicial não foi carregado.
            >
              Grifar Seleção ✍️
            </button>
            <div className="flex items-center space-x-2">
              <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))} className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300"> − </button>
              <span className="font-medium w-16 text-center">{(scale * 100).toFixed(0)}%</span>
              <button onClick={() => setScale((s) => s + 0.25)} className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300"> + </button>
            </div>
          </div>
        </div>

        {/* Visualizador de PDF */}
        {error ? (
          <div className="bg-red-100 text-red-800 p-4 rounded-md shadow text-center">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto w-full flex justify-center">
            <div ref={pageRef} className="p-2 rounded-md shadow-inner bg-gray-50">
              {/* O Document agora usa APENAS a URL de exibição */}
              <Document
                file={pdfDisplayUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                onSourceError={onDocumentLoadError}
                loading={<p>Carregando PDF...</p>}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  customTextRenderer={customTextRenderer}
                />
              </Document>
            </div>
          </div>
        )}

        {/* Navegação de páginas */}
        {numPages > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-4 p-2 border-t">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="font-medium">
              Página {pageNumber} de {numPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}