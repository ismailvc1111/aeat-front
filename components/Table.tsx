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
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-surface/80 p-10 text-center text-sm text-text-secondary">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface/95 shadow-sm shadow-black/10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-text-primary">
          <thead className="bg-surface/80 text-text-secondary">
            <tr className="border-b border-border/60 text-left">
              {columns.map((column) => (
                <th key={column.header} className={cn("px-5 py-3 font-medium", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-border/40 transition-colors last:border-b-0 hover:bg-text-primary/5"
              >
                {columns.map((column) => (
                  <td key={column.header} className={cn("px-5 py-4 text-sm text-text-secondary first:text-text-primary", column.className)}>
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
