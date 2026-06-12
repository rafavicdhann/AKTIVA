import { createFileRoute } from "@tanstack/react-router";
import AktivaApp from "../aktiva/AktivaApp.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AKTIVA — Portofolio & Akademik Sekolah" },
      { name: "description", content: "Platform digital manajemen aktivitas, portofolio siswa, dan akademik sekolah." },
      { property: "og:title", content: "AKTIVA — Portofolio & Akademik Sekolah" },
      { property: "og:description", content: "Platform digital manajemen aktivitas, portofolio siswa, dan akademik sekolah." },
    ],
  }),
  component: Index,
});

function Index() {
  return <AktivaApp />;
}
