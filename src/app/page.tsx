// src/app/page.tsx
import { Suspense } from "react";
import ClientWrapper from "./ClientWrapper";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Carregando...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}
