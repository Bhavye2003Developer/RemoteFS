import useExpoStore from "~/store/useExpoStore";
import { Input } from "./ui/input";

export default function Searcher() {
  const { searchText, updateSearchText } = useExpoStore();

  return (
    <div>
      <Input
        type="text"
        placeholder="Search file or folder"
        value={searchText}
        onChange={(e) => updateSearchText(e.target.value)}
      />
    </div>
  );
}
