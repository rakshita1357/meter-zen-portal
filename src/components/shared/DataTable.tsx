import { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  pageSize?: number;
  actions?: (item: T) => ReactNode;
  filters?: ReactNode;
  customSearch?: (item: T, term: string) => boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Search...",
  loading,
  pageSize = 8,
  actions,
  filters,
  customSearch,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  let filtered = data;
  if (search) {
    if (customSearch) {
      filtered = data.filter((item) => customSearch(item, search));
    } else if (searchKey) {
      filtered = data.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(search.toLowerCase())
      );
    }
  }

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchKey && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 bg-muted/40 border-border/50 rounded-lg"
            />
          </div>
        )}
        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="max-h-[600px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
              <TableRow className="border-b border-border/40">
                {columns.map((col) => (
                  <TableHead key={col.key} className="font-semibold text-foreground text-xs uppercase tracking-wider">
                    {col.sortable ? (
                      <button onClick={() => handleSort(col.key)} className="inline-flex items-center gap-1 hover:text-primary transition-colors duration-200">
                        {col.header} <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : col.header}
                  </TableHead>
                ))}
                {actions && <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + (actions ? 1 : 0)} className="py-8 text-center text-muted-foreground">No records found</TableCell></TableRow>
              ) : paged.map((item, i) => (
                <TableRow key={i} className="hover:bg-primary/3 transition-colors duration-150 border-b border-border/30">
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render ? col.render(item) : item[col.key]}</TableCell>
                  ))}
                  {actions && <TableCell>{actions(item)}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
