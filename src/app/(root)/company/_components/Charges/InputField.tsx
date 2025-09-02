const InputField = ({ icon, placeholder, value, setValue, classes }: any) => {
  return (
    <div className='max-w-md'>
      <div
        className={`relative flex w-full items-center gap-2 overflow-hidden rounded border bg-card p-2 text-sm text-gray-500 transition-all focus-within:border-gray-500 focus-within:text-foreground ${classes}`}
      >
        {icon && <div className='grid h-full place-items-center '>{icon}</div>}
        <input
          type='text'
          title={placeholder}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => setValue(String(e.target.value))}
          className='peer h-full w-full pr-2 outline-none placeholder:font-normal'
        />
      </div>
    </div>
  );
};

export default InputField;
