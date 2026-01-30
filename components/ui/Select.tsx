import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: (string | { value: string; label: string })[];
}

const Select: React.FC<SelectProps> = ({ label, options, className, children, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                className={cn(
                    "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900",
                    className
                )}
                {...props}
            >
                {options ? (
                    <>
                        {options[0] && typeof options[0] === 'string' && <option value="">Seleccione una opción</option>}
                        {options.map(option => {
                            if (typeof option === 'string') {
                                return <option key={option} value={option}>{option}</option>;
                            }
                            return <option key={option.value} value={option.value}>{option.label}</option>;
                        })}
                    </>
                ) : children}
            </select>
        </div>
    );
};

export default Select;
