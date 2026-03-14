import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    openEdit: (data: TData) => void;
    openDelete: (data: TData) => void;
  }
}
