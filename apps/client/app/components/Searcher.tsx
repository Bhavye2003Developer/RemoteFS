import useExpoStore from "~/store/useExpoStore";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function Searcher() {
  const { searchText, updateSearchText } = useExpoStore();

  return (
    <div className="w-full relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
      <Input
        type="text"
        placeholder="Search files or folders..."
        value={searchText}
        onChange={(e) => updateSearchText(e.target.value)}
        className="pl-11 pr-4 h-11 sm:h-9 text-base sm:text-sm rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 focus-visible:ring-2 focus-visible:ring-gray-500"
      />
    </div>
  );
}
