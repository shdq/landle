interface FixedMenuProps {
  position: "top" | "bottom";
  children?: React.ReactNode;
}

const FixedMenu = ({ position, children }: FixedMenuProps): JSX.Element => {
  return (
    <nav
      style={{
        position: "fixed",
        zIndex: "1",
        top: position === "top" ? 0 : "auto",
        bottom: position === "bottom" ? 0 : "auto",
        left: 0,
        right: 0,
        height: "40px",
        backgroundColor: "var(--colors-background)",
        display: "flex",
        justifyContent:
          position === "bottom" ? "space-around" : "space-between",
        alignItems: "center",
        padding: "10px",
        paddingBottom: position === "bottom" ? "30px" : "10px",
      }}
    >
      {children}
    </nav>
  );
};

export default FixedMenu;
