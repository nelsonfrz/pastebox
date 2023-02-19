import * as Mantine from "@mantine/core";

interface ContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  return <Mantine.Container style={style}>{children}</Mantine.Container>;
};
