type RoleCardProps = {
    title: string;
    features?: string[];
};

export function RoleCard({ title, features = [] }: RoleCardProps) {
    return (
        <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-200 relative overflow-hidden">
            <span className="material-symbols-outlined absolute top-0 right-0 p-6 text-[120px] opacity-5 pointer-events-none select-none">
                school
            </span>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <ul className="flex flex-col mt-6 items-start gap-4 list-none">
                {features.map((feature, index) => (
                    <li key={index} className="flex gap-2 items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-[#0058be]">check_circle</span>
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    )
}