import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

const Card: React.FC<CardProps> = ({ title, className, children, ...props }) => {
    return (
        <div
            className={`rounded-xl border bg-white text-card-foreground shadow ${className}`}
            {...props}
        >
            {title && (
                <div className="border-b p-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
