type GoogleIconProps = {
    size?: number;
};

export function GoogleIcon({ size = 20 }: GoogleIconProps) {
    return (
        <svg
            aria-hidden="true"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            role="img"
        >
            <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.92-4.2 2.92-7.23Z" />
            <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.51A9.75 9.75 0 0 0 12 21.75Z" />
            <path fill="#FBBC05" d="M6.53 13.86a5.86 5.86 0 0 1 0-3.72V7.63H3.29a9.75 9.75 0 0 0 0 8.74l3.24-2.51Z" />
            <path fill="#EA4335" d="M12 6.11c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.21 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.38l3.24 2.51C7.3 7.83 9.46 6.11 12 6.11Z" />
        </svg>
    );
}
