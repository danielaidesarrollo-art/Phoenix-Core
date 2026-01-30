import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

const Card: React.FC<CardProps> = ({ title, className, children, ...props }) => {
    return (
        <div
            className={cn("bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", className)}
            {...props}
        >
            {title && (
                <div className="px-6 py-4 border-b border-gray-50">
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
