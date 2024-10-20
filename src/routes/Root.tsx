import { useState, useEffect } from "react";
import { IconHome, IconSettings, IconBook } from "@tabler/icons-react";
import { Button, Select } from "spartak-ui";
import "./Root.css";
import FixedMenu from "../components/FixedMenu";
import Logo from "../components/Logo";
import { Link, Outlet, useOutletContext, useMatches } from "react-router-dom";

const DEFAULT_LANG = "en";
enum LANGUAGES {
  de = "🇩🇪 German",
  es = "🇪🇸 Spanish",
  en = "🇬🇧 English",
  fr = "🇫🇷 French",
  it = "🇮🇹 Italian",
  ru = "🇷🇺 Russian",
}

function Root() {
  const [currLang, setCurrLang] =
    useState<keyof typeof LANGUAGES>(DEFAULT_LANG);
  const [isLoaded, setIsLoaded] = useState(false); // is app component loaded

  // load default settings
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Load last used language from the local storage or default to DEFAULT_LANG
      const lastOrDefaultLang =
        (localStorage.getItem(`last-used-lang`) as keyof typeof LANGUAGES) ||
        DEFAULT_LANG;
      setCurrLang(lastOrDefaultLang);
    }
    setIsLoaded(true); // the component is loaded and has access to localStorage
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // update last used language when user changes the language
      localStorage.setItem(`last-used-lang`, currLang);
    }
  }, [currLang]);

  const selectOptions = Object.entries(LANGUAGES).map(
    ([langCode, langName]) => {
      return { value: langCode, label: langName, key: langCode };
    }
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrLang(e.target.value as keyof typeof LANGUAGES);
  };

  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname;

  return (
    <>
      <FixedMenu position="top">
        <Logo />
        <Select
          css={{ minWidth: "140px" }}
          size="md"
          name="languages"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            handleSelectChange(e);
          }}
          value={currLang}
          options={selectOptions}
        />
      </FixedMenu>
      <Outlet context={currLang satisfies keyof typeof LANGUAGES} />
      <FixedMenu position="bottom">
        <Button
          as={Link}
          to={`/`}
          variant={currentPath === "/" ? "tinted" : "text"}
          color="blue"
          size="md"
          icon={<IconHome size={24} />}
        />
        <Button
          disabled
          variant="text"
          color="blue"
          size="md"
          icon={<IconBook size={24} />}
        ></Button>
        <Button
          as={Link}
          to="/settings"
          variant={currentPath === "/settings" ? "tinted" : "text"}
          color="blue"
          size="md"
          icon={<IconSettings size={24} />}
        />
      </FixedMenu>
    </>
  );
}

export default Root;

export function useLang() {
  return useOutletContext<keyof typeof LANGUAGES>();
}
