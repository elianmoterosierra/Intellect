export function capitalizeSubjectName(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';

    return `${trimmed.charAt(0).toLocaleUpperCase('es-DO')}${trimmed.slice(1)}`;
}

export function capitalizePersonName(value: string): string {
    return value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `${word.charAt(0).toLocaleUpperCase('es-DO')}${word.slice(1)}`)
        .join(' ');
}
