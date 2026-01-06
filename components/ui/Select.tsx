import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: string[];
}

const Select: React.FC<SelectProps> = ({ label, options, className, children, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                className={`flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            >
                {options ? (
                    <>
                        <option value="">Seleccione una opción</option>
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </>
                ) : children}
            </select>
        </div>
    );
};

export default Select;
