const Pagination = ({ table }: any) => {
  const totalNumberOfRows =
    table.getRowModel().rowsById &&
    Object.keys(table.getRowModel().rowsById).length;

  return (
    <div className='grid grid-cols-1 gap-2 border-t p-2 text-xs sm:text-sm md:grid-cols-3 md:items-center'>
      {/* NUMBER OF ROWS */}
      <div className='text-center md:text-left'>
        Showing{' '}
        <span className='font-bold'>
          {table.getRowModel().rows && table.getRowModel().rows.length}
        </span>{' '}
        of <span className='font-bold'>{totalNumberOfRows}</span> data
      </div>
      {/* ARROW BUTTONS */}
      <div className='flex items-center justify-center gap-2 md:col-start-2'>
        <button
          type='button'
          title='Go to first page'
          className='cursor-pointer rounded border px-3 py-1 text-gray-500 outline-none transition-all hover:border-gray-500 hover:text-gray-900'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          type='button'
          title='Go to previous page'
          className='cursor-pointer rounded border px-3 py-1 text-gray-500 outline-none transition-all hover:border-gray-500 hover:text-gray-900'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        {/* PAGE NUMBER */}
        <div className='hidden items-center gap-1 sm:flex'>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </div>
        <button
          type='button'
          title='Go to next page'
          className='cursor-pointer rounded border px-3 py-1 text-gray-500 outline-none transition-all hover:border-gray-500 hover:text-gray-900'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          type='button'
          title='Go to last page'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className='cursor-pointer rounded border px-3 py-1 text-gray-500 outline-none transition-all hover:border-gray-500 hover:text-gray-900'
        >
          {'>>'}
        </button>
      </div>

      {/* PAGE NUMBER: FOR SMALL DEVICE */}
      <div className='flex w-full items-center justify-center gap-1 sm:hidden'>
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </div>

      <div className='flex flex-wrap  items-center justify-center gap-2 md:col-start-3 md:justify-end'>
        {/* GO TO SPECIFIC PAGE NUMBER */}
        <div className='flex items-center gap-1'>
          Go to page:
          <input
            type='number'
            title='Input page number'
            min={1}
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className='w-16 rounded border p-1  text-gray-500 outline-none transition-all focus-within:border-gray-500 focus-within:text-gray-900'
          />
        </div>
        {/* PAGE SIZE */}
        <select
          title='Select how many rows to show'
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className='cursor-pointer rounded border p-1 text-gray-500 outline-none transition-all focus-within:border-gray-500 focus-within:text-gray-900'
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
