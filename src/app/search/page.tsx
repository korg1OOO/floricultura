import { Suspense } from "react";
import SearchClient from "./SearchClient"; // Adjust the import based on your actual component name
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesquisa - Flor de Lima",
  description: "Pesquise produtos na Flor de Lima.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Carregando página de pesquisa...</div>}>
      <SearchClient />
    </Suspense>
  );
}