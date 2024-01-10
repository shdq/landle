import { useTheme, Button } from "spartak-ui";
import { IconSun, IconMoon } from "@tabler/icons-react";

export const Switch = () => {
  const { theme, setTheme } = useTheme();
  const isThemeDark = theme === "dark";
  return (
    <Button
      color="blue"
      onClick={() => setTheme(isThemeDark ? "light" : "dark")}
      icon={isThemeDark ? <IconSun /> : <IconMoon />}
      variant="text"
    />
  );
};
