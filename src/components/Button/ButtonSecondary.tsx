import type { MouseEvent } from 'react';

type ButtonOutlineProps = {
    title: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
};

export function ButtonOutline({ title, onClick, className = '' }: ButtonOutlineProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 border-2 border-brand-ring text-brand px-8 py-4 rounded-lg font-semibold text-xl transition-all duration-300 hover:bg-brand-tint ${className}`}
            onClick={onClick}
        >{title}</button>
    )
}