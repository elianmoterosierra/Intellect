export function isGoogleMeetUrl(value: string): boolean {
    try {
        const url = new URL(value.trim());
        return url.protocol === 'https:' && url.hostname.toLowerCase() === 'meet.google.com';
    } catch {
        return false;
    }
}
