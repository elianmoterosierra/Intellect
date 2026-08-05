import type { MouseEvent } from 'react';

type ButtonPrincipalProps = {
    title: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
};

export function ButtonPrincipal({ title, onClick, className = '' }: ButtonPrincipalProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 bg-[#0058be] text-white px-8 py-4 rounded-lg font-semibold text-xl transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg ${className}`}
            onClick={onClick}
        >{title}</button>
    )
}