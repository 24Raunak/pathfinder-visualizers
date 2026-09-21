type Option<T> = {
  name: string;
  value: T;
};

type Props<T> = {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  isDisabled?: boolean;
};

export default function RadioGroup<T>({
  label,
  options,
  value,
  onChange,
  isDisabled = false,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-300">
          {label}
        </span>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(option.value)}
            className={
              value === option.value
                ? "bg-blue-600 text-white px-3 py-1 rounded"
                : "bg-gray-600 text-white px-3 py-1 rounded"
            }
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}