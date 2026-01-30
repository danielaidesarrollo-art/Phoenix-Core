import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
    return (
        <div className="space-y-1 w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700" htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    className={`flex h-9 w-full rounded-md border border-gray-300 bg-transparent py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${icon ? 'pl-10' : 'px-3'} ${className}`}
                    {...props}
                />
            </div>
        </div>
    );
};

export default Input;
