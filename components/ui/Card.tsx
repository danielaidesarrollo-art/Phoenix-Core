import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className }) => {
    return (
        <div className={cn("bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", className)}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-50">
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};

export default Card;
