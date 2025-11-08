import { createContext } from "react";
export const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }: any) => {
  return (
    <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};
