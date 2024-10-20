import { useState, useEffect } from "react";
import { IconHome, IconSettings, IconBook } from "@tabler/icons-react";
import { Switch } from "../components/Switch";
import {
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Select,
} from "spartak-ui";
import "./Root.css";
import FixedMenu from "../components/FixedMenu";
import Logo from "../components/Logo";
import { Link, useMatch } from "react-router-dom";

const DEFAULT_LANG = "en";
enum LANGUAGES {
  de = "🇩🇪 German",
  es = "🇪🇸 Spanish",
  en = "🇬🇧 English",
  fr = "🇫🇷 French",
  it = "🇮🇹 Italian",
  ru = "🇷🇺 Russian",
}

function Settings() {
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

  const match = useMatch("/settings");

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
      <Card
        css={{
          height: "100%",
          textAlign: "center",
          paddingTop: "97px",
          paddingBottom: "97px",
        }}
      >
        <CardHeader>
          <Heading as="h1" size="xxl" className="logo-font">
            Settings
          </Heading>
        </CardHeader>
        <CardBody
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Switch />
        </CardBody>
        <CardFooter
          css={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          Footer
        </CardFooter>
      </Card>
      <FixedMenu position="bottom">
        <Button
          variant={match?.pathname === "/" ? "tinted" : "text"}
          color="blue"
          size="md"
          icon={<IconHome size={24} />}
          as={Link}
          to={`/`}
        />
        <Button
          disabled
          variant="text"
          color="blue"
          size="md"
          icon={<IconBook size={24} />}
        ></Button>
        <Button
          variant={match?.pathname === "/settings" ? "tinted" : "text"}
          color="blue"
          size="md"
          to="/settings"
          icon={<IconSettings size={24} />}
          as={Link}
        />
      </FixedMenu>
    </>
  );
}

export default Settings;
