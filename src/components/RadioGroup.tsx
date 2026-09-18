type Option = {
    name: string;
    value: number;
}

type Props = {
    options: Option[];
    value: number;
    onChange: (value: number) => void;
};

export default function RadioGroup({
    options,
    value,
    onChange,
}: Props) {
    return (
        <div className="flex-gap-4">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={
                        value === option.value
                        ? "bg-blue-600 text-white px-3 py-1 rounded"
                        : "bg-gray-600 px-3 py-1 rounded"
                    }
                >
                    {option.name}
                </button>
                // <label
                //     key={option.value}
                //     className="flex items-center gap-2 curor-pointer"
                // >
                //     <input
                //         type="radio"
                //         checked={value === option.value}
                //         onChange={() => onChange(option.value)}
                //     />
                //     {option.name}
                // </label>
            ))}
        </div>
    )
}