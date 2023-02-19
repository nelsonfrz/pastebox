import * as Mantine from "@mantine/core";
import { IconAdjustments, IconPlus, IconUserCircle } from "@tabler/icons";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface HeaderProps {
  children?: React.ReactNode;
}

export const HeaderDefault: React.FC<HeaderProps> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <Mantine.AppShell
      padding="md"
      header={
        <Mantine.Header height={75} p="md" px="5%">
          <Mantine.Group position="apart">
            <Link href="/">
              <Mantine.Flex align="center" wrap="nowrap" gap="xl">
                <Mantine.Avatar
                  size={47}
                  radius={"xl"}
                  src={"/android-chrome-192x192.png"}
                />
                <Mantine.Title order={3} style={{ userSelect: "none" }}>
                  Pastebox
                </Mantine.Title>
              </Mantine.Flex>
            </Link>
            <Mantine.Flex align="center" wrap="nowrap" gap="xl">
              <Mantine.MediaQuery
                smallerThan={700}
                styles={{ display: "none" }}
              >
                <Link href="/text">
                  <Mantine.Button
                    leftIcon={<IconPlus size={18} />}
                    color="blue"
                    radius="xl"
                  >
                    Create
                  </Mantine.Button>
                </Link>
              </Mantine.MediaQuery>

              {session?.user.id ? (
                <Mantine.Menu
                  withArrow
                  transition="scale-y"
                  position="bottom-end"
                >
                  <Mantine.Menu.Target>
                    <Mantine.ActionIcon>
                      <Mantine.Avatar radius={"xl"} src={session?.user.image} />
                    </Mantine.ActionIcon>
                  </Mantine.Menu.Target>

                  <Mantine.Menu.Dropdown>
                    <Mantine.Menu.Label>Account</Mantine.Menu.Label>
                    <Link href={`/user/${session.user.id}`}>
                      <Mantine.Menu.Item icon={<IconUserCircle size={18} />}>
                        Profile
                      </Mantine.Menu.Item>
                    </Link>
                    <Link href="/settings">
                      <Mantine.Menu.Item icon={<IconAdjustments size={18} />}>
                        Settings
                      </Mantine.Menu.Item>
                    </Link>

                    <Mantine.Menu.Label>Text</Mantine.Menu.Label>
                    <Link href="/text">
                      <Mantine.Menu.Item icon={<IconPlus size={18} />}>
                        Create
                      </Mantine.Menu.Item>
                    </Link>
                  </Mantine.Menu.Dropdown>
                </Mantine.Menu>
              ) : (
                <Link href="/signin" target="_blank">
                  <Mantine.Button variant="light" radius="xl">
                    Sign In
                  </Mantine.Button>
                </Link>
              )}
            </Mantine.Flex>
          </Mantine.Group>
        </Mantine.Header>
      }
    >
      {children}
    </Mantine.AppShell>
  );
};
