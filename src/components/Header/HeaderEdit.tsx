import * as Mantine from "@mantine/core";
import {
  IconAdjustments,
  IconShare,
  IconX,
  IconDeviceFloppy,
  IconTrash,
  IconPlus,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { openConfirmModal } from "@mantine/modals";
import { api } from "../../utils/api";
import { createContext, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useBeforeunload } from "react-beforeunload";
import type { Text } from "@prisma/client";
import { AccountDropdownItems } from "./AccountDropdownItems";
import { useHotkeys } from "@mantine/hooks";

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
  text: Text;
}

export const HeaderEdit: React.FC<HeaderProps> = ({ children, text }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const editTextMutation = api.text.edit.useMutation({
    onSuccess: (text) => {
      showNotification({
        title: "Success",
        message: `Successfully edited text '${text.title}'`,
        color: "green",
      });
      void router.push(`/text/${text.id}`);
    },
  });

  const deleteTextMutation = api.text.delete.useMutation({
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: `Successfully deleted text.`,
        color: "green",
      });
      void router.push("/");
    },
  });

  const [loadingOverlayVisible, setLoadingOverlayVisible] =
    useState<boolean>(false);
  const [settingsModalOpened, setSettingsModalOpened] =
    useState<boolean>(false);

  const [title, setTitle] = useState<string>(text.title);
  const [description, setDescription] = useState<string>(text.description);
  const [publicVisibility, setPublicVisibility] = useState<boolean>(
    text.publicVisibility
  );
  const [content, setContent] = useState<string>(text.content);
  const changeTitle = (input: string) => setTitle(input);
  const changeDescription = (input: string) => setDescription(input);
  const changePublicVisibility = (input: boolean) => setPublicVisibility(input);
  const changeContent = (input: string) => setContent(input);

  const [openSaveModalOpened, setOpenSaveModalOpened] = useState(false);

  useHotkeys([
    [
      "ctrl+S",
      () => {
        if (!openSaveModalOpened) openSaveModal();
      },
    ],
    [
      "ctrl+E",
      () => {
        if (!settingsModalOpened) setSettingsModalOpened(true);
      },
    ],
  ]);

  const openSaveModal = () => {
    setOpenSaveModalOpened(true);
    openConfirmModal({
      title: "Save",
      children: (
        <Mantine.Text>Are you sure you want to save your text?</Mantine.Text>
      ),
      labels: { confirm: "Save", cancel: "Cancel" },
      onConfirm: () => {
        if (!title || !description || !content) {
          showNotification({
            title: "Attention",
            message:
              "Please enter title, description and content for your text.",
            color: "red",
          });
          setSettingsModalOpened(true);
          return;
        }

        setLoadingOverlayVisible(true);
        editTextMutation.mutate({
          id: text.id,
          title: title,
          description: description,
          content: content,
          publicVisibility: publicVisibility,
        });
      },
    });
  };

  const openCancelModal = () =>
    openConfirmModal({
      title: "Cancel",
      children: (
        <Mantine.Text>
          Are you sure you wish to cancel? Your changes will not be saved.
        </Mantine.Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => void router.push(`/text/${text.id}`),
    });

  const openDeleteModal = () =>
    openConfirmModal({
      title: "Cancel",
      children: (
        <Mantine.Text>Are you sure you wish to delete your text?</Mantine.Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        deleteTextMutation.mutate({
          id: text.id,
        });
      },
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
                    <Mantine.ActionIcon
                      onClick={openDeleteModal}
                      color="red"
                      variant="filled"
                      radius="xl"
                      size={34}
                    >
                      <IconTrash size={21} />
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
                      <Mantine.Menu.Item
                        onClick={openDeleteModal}
                        icon={<IconTrash size={18} />}
                      >
                        Delete
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
        <Mantine.LoadingOverlay
          visible={loadingOverlayVisible}
          overlayBlur={2}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
          }}
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
