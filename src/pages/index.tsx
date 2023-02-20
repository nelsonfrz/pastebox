import { type NextPage } from "next";
import { HeaderDefault } from "../components/Header/HeaderDefault";
import * as Mantine from "@mantine/core";
import { IconBrandGithub, IconPlus } from "@tabler/icons";
import Link from "next/link";
import styles from "../styles/index.module.css";
import { useEffect, useRef } from "react";
import { useMouse, useMediaQuery } from "@mantine/hooks";

const Home: NextPage = () => {
  const blobRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMouse();
  const mobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    blobRef.current?.animate(
      {
        left: `${x}px`,
        top: `${y}px`,
      },
      { duration: 3000, fill: "forwards" }
    );
  }, [x, y]);

  return (
    <>
      <Mantine.Box className={styles.blur} />
      <Mantine.Box ref={blobRef} className={styles.blob} />

      <HeaderDefault>
        <Mantine.Container>
          <Mantine.Space h={80} />
          <Mantine.Title size={mobile ? 40 : 70}>Pastebox</Mantine.Title>
          <Mantine.Text>
            Write and share texts online using Pastebox{"'"}s awesome text
            editor!
          </Mantine.Text>
          <Mantine.Space h={10} />
          <Mantine.Flex gap="xs">
            <Link href="/text">
              <Mantine.Button
                leftIcon={<IconPlus size={18} />}
                color="blue"
                radius="xl"
                variant="gradient"
              >
                Create
              </Mantine.Button>
            </Link>
            <Link href="https://github.com/nelsonfrz/pastebox" target="_blank">
              <Mantine.Button
                leftIcon={<IconBrandGithub size={18} />}
                color="gray"
                radius="xl"
              >
                Github
              </Mantine.Button>
            </Link>
          </Mantine.Flex>
        </Mantine.Container>
      </HeaderDefault>
    </>
  );
};

export default Home;
