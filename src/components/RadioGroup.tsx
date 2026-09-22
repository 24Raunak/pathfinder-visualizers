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
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>
      )}

      <div className="flex flex-wrap gap-1">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={String(option.value)}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(option.value)}
              className={`
                px-2.5 py-1
                text-xs
                rounded-md
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }
              `}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}