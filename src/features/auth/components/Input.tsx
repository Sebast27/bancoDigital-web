type InputProps = {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export function Input({ label, type = 'text', value, onChange, placeholder }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}