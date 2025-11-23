import Explorer from "~/components/Explorer";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Remote Explorer" },
    { name: "description", content: "Sleek monochrome file explorer" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100 transition-colors">
      <Explorer />
    </div>
  );
}
