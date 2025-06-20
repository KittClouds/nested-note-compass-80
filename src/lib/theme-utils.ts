import { flushSync } from 'react-dom';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Gets the current theme mode from the document class
 */
export const getCurrentTheme = (): 'light' | 'dark' => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

/**
 * Applies a theme mode to the document
 * This function will be called by the theme toggle,
 * and it will use the setTheme function from next-themes.
 */
export const applyTheme = (mode: ThemeMode, setThemeCallback: (theme: string) => void) => {
  setThemeCallback(mode);
};

/**
 * Gets a CSS custom property value
 */
export const getCSSVariable = (variable: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
};

/**
 * Sets a CSS custom property value
 */
export const setCSSVariable = (variable: string, value: string) => {
  document.documentElement.style.setProperty(variable, value);
};

/**
 * Creates a new theme variant by modifying existing CSS variables
 */
export const createThemeVariant = (name: string, overrides: Record<string, string>) => {
  const root = document.documentElement;

  // Add a class for the theme variant
  root.classList.add(`theme-${name}`);

  // Apply CSS variable overrides
  Object.entries(overrides).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

/**
 * Removes a theme variant
 */
export const removeThemeVariant = (name: string) => {
  const root = document.documentElement;
  root.classList.remove(`theme-${name}`);
};

/**
 * Notion-style light theme preset
 */
export const notionLightTheme = {
  '--background': '0 0% 100%',
  '--foreground': '0 0% 9%',
  '--card': '0 0% 100%',
  '--card-foreground': '0 0% 9%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '0 0% 9%',
  '--primary': '210 100% 50%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '210 40% 98%',
  '--secondary-foreground': '0 0% 9%',
  '--muted': '210 40% 98%',
  '--muted-foreground': '0 0% 45%',
  '--accent': '210 40% 96%',
  '--accent-foreground': '0 0% 9%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '0 0% 98%',
  '--border': '220 13% 91%',
  '--input': '220 13% 91%',
  '--ring': '210 100% 50%',
  '--editor-background': '0 0% 100%',
  '--editor-foreground': '0 0% 9%',
  '--editor-border': '220 13% 91%',
  '--editor-selection': '210 40% 96%',
  '--editor-toolbar-background': '0 0% 98%',
  '--editor-toolbar-border': '220 13% 91%',
  '--editor-button-hover': '210 40% 96%',
  '--editor-menu-background': '0 0% 100%',
  '--editor-menu-border': '220 13% 91%',
  '--editor-code-background': '210 40% 98%',
  '--editor-blockquote-border': '210 100% 50%',
  '--editor-table-border': '220 13% 91%',
  '--editor-placeholder': '0 0% 45%',
};

// It's good practice to also define a dark theme preset
export const notionDarkTheme = {
  '--background': '0 0% 3.9%', // Example: Dark background
  '--foreground': '0 0% 98%', // Example: Light foreground
  '--card': '0 0% 3.9%',
  '--card-foreground': '0 0% 98%',
  '--popover': '0 0% 3.9%',
  '--popover-foreground': '0 0% 98%',
  '--primary': '210 100% 50%', // Primary color can remain the same or be adjusted
  '--primary-foreground': '0 0% 98%', // Text on primary
  '--secondary': '210 40% 12%', // Darker secondary
  '--secondary-foreground': '0 0% 98%',
  '--muted': '210 40% 12%',
  '--muted-foreground': '0 0% 60%', // Lighter muted text
  '--accent': '210 40% 15%', // Darker accent
  '--accent-foreground': '0 0% 98%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '0 0% 98%',
  '--border': '220 13% 20%', // Darker border
  '--input': '220 13% 20%',
  '--ring': '210 100% 50%',
  '--editor-background': '0 0% 3.9%',
  '--editor-foreground': '0 0% 98%',
  '--editor-border': '220 13% 20%',
  '--editor-selection': '210 40% 15%',
  '--editor-toolbar-background': '0 0% 12%',
  '--editor-toolbar-border': '220 13% 20%',
  '--editor-button-hover': '210 40% 15%',
  '--editor-menu-background': '0 0% 3.9%',
  '--editor-menu-border': '220 13% 20%',
  '--editor-code-background': '210 40% 12%',
  '--editor-blockquote-border': '210 100% 50%',
  '--editor-table-border': '220 13% 20%',
  '--editor-placeholder': '0 0% 60%',
};


export async function toggleDarkModeWithAnimation(
  currentTheme: 'light' | 'dark',
  setThemeCallback: (theme: 'light' | 'dark') => void,
  toggleRef?: React.RefObject<HTMLElement>
) {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  if (
    !(document as any).startViewTransition ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    setThemeCallback(newTheme);
    // Persist selection if using localStorage with next-themes (handled by next-themes)
    return;
  }

  const transition = (document as any).startViewTransition(() => {
    flushSync(() => {
      setThemeCallback(newTheme);
    });
  });

  await transition.ready;

  if (!toggleRef?.current) {
    // Fallback if ref is not available for animation coordinates
     document.documentElement.animate(
      {
        clipPath: [
          `circle(0% at 50% 50%)`,
          `circle(100% at 50% 50%)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
    return;
  }


  const { top, left, width, height } = toggleRef.current.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const maxRadius = Math.hypot(
    Math.max(left, window.innerWidth - left),
    Math.max(top, window.innerHeight - top)
  );

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 500,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    }
  );
}
