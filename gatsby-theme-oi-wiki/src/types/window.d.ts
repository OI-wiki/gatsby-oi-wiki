declare global {
    interface Window {
        __theme: string;
        __setPreferredTheme: (theme: string) => void;
        __onThemeChange: (theme: string) => void;
    }
}
export {}
