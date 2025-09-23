import { Skeleton } from "./ui/skeleton";
import { cn } from "./ui/utils";

export type TableColumn<T> = {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
};

export function Table<T>({
  data,
  columns,
  emptyMessage,
  isLoading = false,
}: {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/70 shadow-[0_25px_60px_rgba(15,15,15,0.3)] backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="bg-white/5 text-left text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={cn("px-6 py-4 text-left", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t border-border/40 transition hover:bg-white/6 focus-within:bg-white/6"
              >
                {columns.map((column) => (
                  <td key={column.header} className={cn("px-6 py-4 text-sm", column.className)}>
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
