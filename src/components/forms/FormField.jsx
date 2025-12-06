const FormField = ({
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  className,
  rows,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-base font-medium p-[5px]" htmlFor={name}>
          {label}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows || 3}
          className={className}
          {...props}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={className}
          {...props}
        />
      )}

      {error && <span className="text-red-500 text-sm px-1">{error}</span>}
    </div>
  );
};

export default FormField;
