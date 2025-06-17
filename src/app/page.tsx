// src/app/page.tsx

import Link from 'next/link';
import { FileText } from 'lucide-react'; // Usaremos um ícone para dar um toque especial

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="flex flex-col items-center text-center p-8 -mt-16">
        {/* Ícone para dar um ar mais profissional */}
        <FileText className="h-16 w-16 text-blue-600 mb-4" />

        {/* Título Principal */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Demonstração do Visualizador de PDF
        </h1>

        {/* Subtítulo explicativo */}
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Este é um protótipo técnico desenvolvido para validar as funcionalidades de busca e grifo em documentos PDF, utilizando Next.js, React e pdf-lib.
        </p>

        {/* Botão de Ação para a Demo */}
        <div className="mt-10">
          <Link
            href="/pdf"
            className="flex items-center justify-center gap-x-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-transform hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 hover:scale-105"
          >
            Acessar a Demo
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}