import * as Mantine from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandTelegram, IconShare } from "@tabler/icons";
import Link from "next/link";
import type { GetUserOutput } from "../utils/api";

interface ProfileProps {
  user: Partial<GetUserOutput>;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const mobile = useMediaQuery("(max-width: 900px)");

  return (
    <Mantine.Container>
      <Mantine.Avatar
        variant="filled"
        src={user?.image}
        size={mobile ? 100 : 164}
        radius={1000}
      />
      <Mantine.Title>{user?.name}</Mantine.Title>

      <Mantine.Text>{user?.description}</Mantine.Text>
      <Mantine.Space h={20} />
      <Mantine.Flex wrap="wrap" gap="xl">
        <Link href={`mailto:${user?.email ?? ""}`}>
          <Mantine.Button
            size={mobile ? "xs" : "md"}
            leftIcon={<IconBrandTelegram size={18} />}
            color="gray"
          >
            Message
          </Mantine.Button>
        </Link>
        <Mantine.Button
          onClick={() =>
            void navigator.share({
              title: user.name ?? "",
              url: `https://pastebox.vercel.app/user/${user.id ?? ""}`,
            })
          }
          size={mobile ? "xs" : "md"}
          leftIcon={<IconShare size={18} />}
        >
          Share Profile
        </Mantine.Button>
      </Mantine.Flex>
      <Mantine.Space h={40} />
      <Mantine.Title order={2}>Public Texts</Mantine.Title>
      <Mantine.Space h={20} />
      <Mantine.Stack>
        {user?.texts?.map((text) => (
          <Link key={text.id} href={`/text/${text.id}`}>
            <Mantine.Box
              sx={(theme) => ({
                border: "1px solid rgb(44, 46, 51)",
                padding: "20px",
                borderRadius: "10px",
                ":hover": {
                  backgroundColor: theme.colors.dark[6],
                  cursor: "pointer",
                },
              })}
            >
              <Mantine.Stack>
                <Mantine.Title style={{ wordBreak: "break-all" }} order={3}>
                  {text.title}
                </Mantine.Title>
                <Mantine.Text style={{ wordBreak: "break-all" }}>
                  {text.description}
                </Mantine.Text>
              </Mantine.Stack>
            </Mantine.Box>
          </Link>
        ))}
      </Mantine.Stack>
      <Mantine.Space h={20} />
    </Mantine.Container>
  );
};
