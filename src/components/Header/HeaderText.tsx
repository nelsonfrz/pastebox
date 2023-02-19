import * as Mantine from "@mantine/core";
import {
  IconAdjustments,
  IconDownload,
  IconUserCircle,
  IconPencil,
  IconShare,
  IconPlus,
} from "@tabler/icons";
import Link from "next/link";
import { openConfirmModal } from "@mantine/modals";
import { useSession } from "next-auth/react";
import type { Text } from "@prisma/client";

interface HeaderProps {
  children?: React.ReactNode;
  text: Text;
}

export const HeaderText: React.FC<HeaderProps> = ({ children, text }) => {
  const { data: session } = useSession();

  const openExportModal = () =>
    openConfirmModal({
      title: "Export",
      children: (
        <Mantine.Radio.Group
          name="exporttype"
          label="Select your export type"
          description="Select your desired format to export the text."
        >
          <Mantine.Radio value="pdf" label="PDF" />
          <Mantine.Radio value="html" label="HTML" />
          <Mantine.Radio value="jpeg" label="JPEG" />
        </Mantine.Radio.Group>
      ),
      labels: { confirm: "Export", cancel: "Cancel" },
    });

  return (
    <Mantine.AppShell
      padding="md"
      header={
        <Mantine.Header height={75} p="md" px="5%">
          <Mantine.Group position="apart">
            <Link href="/">
              <Mantine.Flex align="center" wrap="nowrap" gap="xl">
                <Mantine.Avatar size={47} radius={"xl"} src={"/android-chrome-192x192.png"} />
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
                <Mantine.Flex align="center" wrap="nowrap" gap="xs">
                  <Link href="/text">
                    <Mantine.Button
                      leftIcon={<IconPlus size={18} />}
                      color="blue"
                      radius="xl"
                    >
                      Create
                    </Mantine.Button>
                  </Link>
                  {session?.user.id == text.userId && (
                    <Link href={`/text/${text.id}/edit`}>
                      <Mantine.Button
                        leftIcon={<IconPencil size={18} />}
                        color="gray"
                        radius="xl"
                      >
                        Edit
                      </Mantine.Button>
                    </Link>
                  )}
                  <Mantine.ActionIcon
                    onClick={openExportModal}
                    color="green"
                    variant="filled"
                    radius="xl"
                    size={34}
                  >
                    <IconDownload size={21} />
                  </Mantine.ActionIcon>
                </Mantine.Flex>
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

                    <Mantine.Menu.Divider />
                    <Mantine.Menu.Label>Text</Mantine.Menu.Label>
                    <Link href={`/text/${text.id}/edit`}>
                      <Mantine.Menu.Item icon={<IconPencil size={18} />}>
                        Edit
                      </Mantine.Menu.Item>
                    </Link>

                    <Mantine.Menu.Item
                      onClick={openExportModal}
                      icon={<IconDownload size={18} />}
                    >
                      Export
                    </Mantine.Menu.Item>
                    <Mantine.Menu.Item
                      onClick={() =>
                        void navigator.share({
                          title: text.title,
                          url: `https://pastebox.vercel.app/text/${text.id}`,
                        })
                      }
                      icon={<IconShare size={18} />}
                    >
                      Share
                    </Mantine.Menu.Item>
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
