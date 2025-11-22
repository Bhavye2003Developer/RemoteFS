import useExpoStore from "~/store/useExpoStore";
import { Input } from "./ui/input";

export default function Searcher() {
  const { searchText, updateSearchText } = useExpoStore();

  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder="Search file or folder"
        value={searchText}
        onChange={(e) => updateSearchText(e.target.value)}
        className="
          text-base h-11
          sm:h-9 sm:text-sm sm:px-2
        "
      />
    </div>
  );
}
