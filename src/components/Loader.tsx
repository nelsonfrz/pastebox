import * as Mantine from "@mantine/core";

export const Loader: React.FC = () => {
  return (
    <Mantine.Loader
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};
