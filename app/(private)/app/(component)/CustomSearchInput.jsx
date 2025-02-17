function CustomSearchInput({
  value,
  onChange,
  onClear,
  placeholder,
  startContent,
  customHeight,
}) {
  return (
    <div
      className={`relative flex-2 flex items-center w-full px-[17px] border shadow-sm  custom-shadow sm:min-w-fit border-color5 text-color03 ${
        customHeight ? customHeight : "h-[60px]"
      }
      }`}
    >
      {startContent && <div className="mr-2">{startContent}</div>}
      <input
        type="text"
        className="w-full bg-transparent focus:outline-none text-[12px] lg:text-[13px] xl:text-[15px] 
        placeholder:text-[12px] placeholder:lg:text-[13px] placeholder:xl:text-[15px]
          placeholder:text-color03"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="ml-2 text-gray-500 focus:outline-none"
          onClick={onClear}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default CustomSearchInput;
