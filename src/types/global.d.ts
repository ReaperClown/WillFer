declare global {
  interface Window {
    virtualsky?: (options: Record<string, unknown>) => void;
  }
}
