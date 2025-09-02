import InputField from './InputField';

const ColumnSearch = ({ column }: any) => {
  return (
    <InputField
      name={column.columnDef.name}
      placeholder={`Search by ${column.columnDef.name}`}
      value={column.getFilterValue()}
      setValue={column.setFilterValue}
      classes='!p-1.5 !text-xs'
    />
  );
};

const BooleanColumnFilter = ({ column }: any) => {
  return (
    <select
      title='Click to filter by true or false'
      value={
        column.getFilterValue() === 'true'
          ? 'true'
          : column.getFilterValue() === 'false'
            ? 'false'
            : 'all'
      }
      onChange={(e) => {
        const selectedValue = e.target.value;
        column.setFilterValue(() => {
          return selectedValue === 'true'
            ? 'true'
            : selectedValue === 'false'
              ? 'false'
              : '';
        });
      }}
      className='cursor-pointer rounded border p-1.5 font-normal text-foreground text-gray-500 outline-none transition-all focus-within:border-gray-500 focus-within:text-gray-700'
    >
      <option value='all'>All</option>
      <option value='true'>True</option>
      <option value='false'>False</option>
    </select>
  );
};

const DateColumnFilter = ({ column }: any) => {
  // Convert date from "Dec-18-2023" to "2023-12-18"
  const formatDateToOriginal = (formattedDate: string) => {
    const months: any = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    const [month, day, year] = formattedDate.split('-');
    const monthNum = months[month];
    if (monthNum) {
      return `${year}-${monthNum}-${day.padStart(2, '0')}`;
    } else {
      // eslint-disable-next-line no-console
      console.error(`Unexpected date format: ${formattedDate}`);
      return formattedDate;
    }
  };

  // Convert date from "2023-12-18" to "Dec-18-2023"
  const formatDate = (dateString: string) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const [year, month, day] = dateString.split('-');
    const monthStr = months[parseInt(month, 10) - 1];
    return `${monthStr}-${day}-${year}`;
  };

  return (
    <div>
      <input
        type='date'
        title='Filter by date'
        value={
          column.getFilterValue()
            ? formatDateToOriginal(column.getFilterValue())
            : ''
        }
        onChange={(e) =>
          column.setFilterValue(
            e.target.value ? formatDate(e.target.value) : ''
          )
        }
        className='w-full cursor-pointer rounded border p-1 font-normal text-gray-500 outline-none transition-all focus-within:border-gray-500 focus-within:text-gray-700'
      />
    </div>
  );
};

const ArrayColumnFilter = ({ column }: any) => {
  return (
    <select
      title='Click to filter'
      value={column.getFilterValue() || 'all'}
      onChange={(e) =>
        column.setFilterValue(e.target.value !== 'all' ? e.target.value : '')
      }
      className='cursor-pointer rounded border p-1 font-normal text-gray-500 outline-none transition-all focus-within:border-gray-500 focus-within:text-gray-700'
    >
      <option value='all'>All</option>
      {column?.columnDef?.filterOption?.map((option: any, index: any) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const ColumnFilters = ({ column }: any) => {
  const filterType = column.columnDef.filterOption;
  if (filterType === 'date') {
    return <DateColumnFilter column={column} />;
  }
  if (filterType === 'boolean') {
    return <BooleanColumnFilter column={column} />;
  }
  if (Array.isArray(filterType)) {
    return <ArrayColumnFilter column={column} />;
  }
  return <ColumnSearch column={column} />;
};

export default ColumnFilters;
