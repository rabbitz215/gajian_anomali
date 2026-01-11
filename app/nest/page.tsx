import { Suspense } from "react";
import NestPage from "./NestPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <NestPage />
    </Suspense>
  );
}
