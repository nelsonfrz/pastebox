import * as Mantine from "@mantine/core";
import { IconAdjustments, IconX, IconDeviceFloppy } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { openConfirmModal } from "@mantine/modals";

import { api } from "../../utils/api";
import { createContext, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";

import { useBeforeunload } from "react-beforeunload";
import { AccountDropdownItems } from "./AccountDropdownItems";

export const TextEditorContext = createContext({
  title: "",
  description: "",
  publicVisibility: false,
  content: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  changeTitle: (input: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  changeDescription: (input: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  changePublicVisibility: (input: boolean) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  changeContent: (input: string) => {},
});

interface HeaderProps {
  children?: React.ReactNode;
}

export const HeaderCreate: React.FC<HeaderProps> = ({ children }) => {
  const { data: session } = useSession();

  const createTextMutation = api.text.create.useMutation({
    onSuccess: (text) => {
      showNotification({
        title: "Success",
        message: `Successfully created text '${text.title}'`,
        color: "green",
      });
      void router.push(`/text/${text.id}`);
    },
  });

  const router = useRouter();

  const [loadingOverlayVisible, setLoadingOverlayVisible] =
    useState<boolean>(false);
  const [settingsModalOpened, setSettingsModalOpened] =
    useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [publicVisibility, setPublicVisibility] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const changeTitle = (input: string) => setTitle(input);
  const changeDescription = (input: string) => setDescription(input);
  const changePublicVisibility = (input: boolean) => setPublicVisibility(input);
  const changeContent = (input: string) => setContent(input);

  const openSaveModal = () =>
    openConfirmModal({
      title: "Save",
      children: (
        <Mantine.Text>Are you sure you want to save your text?</Mantine.Text>
      ),
      labels: { confirm: "Save", cancel: "Cancel" },
      onConfirm: () => {
        if (!session?.user.id) {
          showNotification({
            title: "Attention",
            message: "You need to sign in before saving your text.",
            color: "red",
          });
          return;
        }

        if (!title || !description || !content) {
          showNotification({
            title: "Attention",
            message:
              "Please enter title, description and content for your text.",
            color: "red",
          });
          if (!title || !description) setSettingsModalOpened(true);
          return;
        }

        setLoadingOverlayVisible(true);
        createTextMutation.mutate({
          title: title,
          description: description,
          content: content,
          publicVisibility: publicVisibility,
        });
      },
    });

  const openCancelModal = () =>
    openConfirmModal({
      title: "Cancel",
      children: (
        <Mantine.Text>
          Are you sure you wish to cancel? Your text will not be saved.
        </Mantine.Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => void router.push("/"),
    });

  useBeforeunload((event) => {
    if (content) {
      event.preventDefault();
    }
  });

  return (
    <>
      {/**
       * TODO: Add error message for length limit
       */}
      <Mantine.Modal
        opened={settingsModalOpened}
        onClose={() => setSettingsModalOpened(false)}
        title="Settings"
      >
        <Mantine.Stack>
          <Mantine.TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Title"
            placeholder="Enter title"
          />
          <Mantine.TextInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
            placeholder="Describe your text"
          />
          <Mantine.Checkbox
            checked={publicVisibility}
            onChange={(e) => setPublicVisibility(e.target.checked)}
            label="Visible to everyone"
          />
        </Mantine.Stack>
      </Mantine.Modal>

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
                {session?.user.id ? (
                  <>
                    <Mantine.MediaQuery
                      smallerThan={700}
                      styles={{ display: "none" }}
                    >
                      <Mantine.Flex align="center" wrap="nowrap" gap="xs">
                        <Mantine.Button
                          onClick={openCancelModal}
                          leftIcon={<IconX size={18} />}
                          color="gray"
                          radius="xl"
                        >
                          Cancel
                        </Mantine.Button>
                        <Mantine.Button
                          leftIcon={<IconDeviceFloppy size={18} />}
                          color="blue"
                          onClick={openSaveModal}
                          radius="xl"
                        >
                          Save
                        </Mantine.Button>

                        <Mantine.ActionIcon
                          onClick={() => setSettingsModalOpened(true)}
                          color="gray"
                          variant="filled"
                          radius="xl"
                          size={34}
                        >
                          <IconAdjustments size={21} />
                        </Mantine.ActionIcon>
                      </Mantine.Flex>
                    </Mantine.MediaQuery>

                    <Mantine.Menu
                      withArrow
                      transition="scale-y"
                      position="bottom-end"
                    >
                      <Mantine.Menu.Target>
                        <Mantine.ActionIcon>
                          <Mantine.Avatar
                            radius={"xl"}
                            src={session?.user.image}
                          />
                        </Mantine.ActionIcon>
                      </Mantine.Menu.Target>

                      <Mantine.Menu.Dropdown>
                        <AccountDropdownItems session={session} />
                        <Mantine.Menu.Divider />
                        <Mantine.Menu.Label>Text</Mantine.Menu.Label>
                        <Mantine.Menu.Item
                          icon={<IconDeviceFloppy size={18} />}
                          onClick={openSaveModal}
                        >
                          Save
                        </Mantine.Menu.Item>
                        <Mantine.Menu.Item
                          onClick={openCancelModal}
                          icon={<IconX size={18} />}
                        >
                          Cancel
                        </Mantine.Menu.Item>
                        <Mantine.Menu.Item
                          onClick={() => setSettingsModalOpened(true)}
                          icon={<IconAdjustments size={18} />}
                        >
                          Settings
                        </Mantine.Menu.Item>
                      </Mantine.Menu.Dropdown>
                    </Mantine.Menu>
                  </>
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
        <Mantine.LoadingOverlay
          visible={loadingOverlayVisible}
          overlayBlur={2}
        />
        <TextEditorContext.Provider
          value={{
            title,
            description,
            publicVisibility,
            content,
            changeTitle,
            changeDescription,
            changePublicVisibility,
            changeContent,
          }}
        >
          {children}
        </TextEditorContext.Provider>
      </Mantine.AppShell>
    </>
  );
};
