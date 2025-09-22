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
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={cn("px-4 py-3 text-left", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-border/60 transition hover:bg-muted/20 focus-within:bg-muted/20"
            >
              {columns.map((column) => (
                <td key={column.header} className={cn("px-4 py-3", column.className)}>
                  {column.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
