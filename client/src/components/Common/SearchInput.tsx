import { LibIcons } from '@/lib/icons'

interface SearchInputProps {
  searchInputPlaceholder: string
  onChangeSearchInput: (searchInput: string) => void
}

export function SearchInput({ searchInputPlaceholder, onChangeSearchInput }: Readonly<SearchInputProps>) {
  return (
    <div className="relative">
      <input
        className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
        placeholder={searchInputPlaceholder ?? 'Search here...'}
        onChange={(e) => onChangeSearchInput(e.target.value)}
      />
      <button className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded " type="button">
        <LibIcons.SearchIcon />
      </button>
    </div>
  )
}
