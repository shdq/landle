import { Switch } from "../components/Switch";
import { Heading, Text, Card, CardHeader, CardBody } from "spartak-ui";

function Settings() {
  return (
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
      <CardBody>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text size="md">Theme&nbsp;</Text>
          <Switch />
        </div>
      </CardBody>
    </Card>
  );
}

export default Settings;
