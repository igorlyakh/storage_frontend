import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import dayjs from 'dayjs';

import { useGetAllStoresQuery } from '../../store/api/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const StoresTable = () => {
  const { data: stores = [], isLoading, isError } = useGetAllStoresQuery();

  const columnDefs = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
        maxWidth: 100,
      },
      {
        field: 'name',
        headerName: 'Store name',
        flex: 2,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        flex: 1,
        valueFormatter: params =>
          params.value ? dayjs(params.value).format('DD.MM.YY HH:mm') : '',
      },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  );

  // Простые заглушки для состояний загрузки и ошибки
  if (isLoading) return <div>Loading stores...</div>;
  if (isError) return <div>Failed to load stores.</div>;

  return (
    <div style={{ height: 500, width: '100%', marginTop: 10 }}>
      <AgGridReact
        rowData={stores}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
        theme={themeQuartz}
      />
    </div>
  );
};

export default StoresTable;
