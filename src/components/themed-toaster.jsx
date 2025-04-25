import { Toaster } from "sonner";
import { useTheme } from "@/components/theme-provider";

export function ThemedToaster() {
  const { theme } = useTheme();

  const getToastTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  return (
    <Toaster
      theme={getToastTheme()}
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        style: {
          color: "var(--foreground)",
        },
      }}
    />
  );
}
