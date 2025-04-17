import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react'
import { ColumnDef, ColumnFiltersState, PaginationState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import { Fragment, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: TData[]
}

export function DataTable<TData, TValue> ({ columns, data }: DataTableProps<TData, TValue>): JSX.Element {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      pagination
    }
  })

  return (
    <>
      {/*
      <div className='flex items-center py-2 md:pb-4'>
        <Input
          id='search'
          placeholder='Buscar...'
          value={(table.getColumn('location')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            useFilterValue.setState({ value: event.target.value })
            table.getColumn('location')?.setFilterValue(event.target.value)
          }}
          className='max-w-sm'
        />
      </div>
      */}

      <div className='border rounded-md'>
        <Table className='relative w-full h-10 overflow-clip' divClassName='max-h-[64vh] md:max-h-[75vh] overflow-y-auto'>
          <TableHeader className='sticky top-0 w-full h-10 bg-background'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                onClick={() => {
                  console.log('Click')
                }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='text-center bg-muted/50'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}

              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {
              table.getRowModel().rows?.length > 0
                ? (
                    table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <TableRow data-state={row.getIsSelected() && 'selected'}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className='text-center'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      </Fragment>
                    ))
                  )
                : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No se han encontrado resultados para esta búsqueda
                    </TableCell>
                  </TableRow>
                  )
            }
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between text-xs'>
        <div className='hidden md:block'>
          <div className='flex items-center gap-1'>
            <Select onValueChange={value => table.setPageSize(Number(value))}>
              <SelectTrigger className='w-auto'>
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <SelectItem key={pageSize} value={pageSize.toString()} className='text-xs'>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <span className='flex items-center gap-1 mr-4'>
                <div>Página</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} de{' '}
                  {table.getPageCount().toLocaleString()}
                </strong>
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-1 mt-4'>
          <Button
            variant='outline'
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className='text-xs'
          >
            <IconChevronsLeft stroke={2} /> <span className='hidden md:block'>Primer Página</span>
          </Button>
          <Button
            variant='outline'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='text-xs'
          >
            <IconChevronLeft stroke={2} /> <span className='hidden md:block'>Anterior</span>
          </Button>

          <Button
            variant='outline'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='text-xs'
          >
            <span className='hidden md:block'>Siguiente</span> <IconChevronRight stroke={2} />
          </Button>
          <Button
            variant='outline'
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            className='text-xs'
          >
            <span className='hidden md:block'>Ultima Página</span> <IconChevronsRight stroke={2} />
          </Button>
        </div>
      </div>
    </>
  )
}
