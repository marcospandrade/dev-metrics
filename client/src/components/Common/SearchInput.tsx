import { LibIcons } from '@/lib/icons';

interface SearchInputProps {
  searchInputPlaceholder: string;
  onChangeSearchInput: (searchInput: string) => void;
}

export function SearchInput({
  searchInputPlaceholder,
  onChangeSearchInput,
}: Readonly<SearchInputProps>) {
  return (
    <div className="relative">
      <input
        className="placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:border-slate-400 hover:border-slate-400 h-10 w-full rounded border bg-transparent bg-white py-2 pl-3 pr-11 text-sm shadow-sm transition duration-200 focus:shadow-md focus:outline-none"
        placeholder={searchInputPlaceholder ?? 'Search here...'}
        onChange={(e) => onChangeSearchInput(e.target.value)}
      />
      <button
        className="absolute right-1 top-1 my-auto flex h-8 w-8 items-center rounded bg-white px-2 "
        type="button"
      >
        <LibIcons.SearchIcon />
      </button>
    </div>
  );
}
