import type { GetServerSideProps, NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import { HeaderDefault } from "../components/Header/HeaderDefault";
import * as Mantine from "@mantine/core";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { showNotification } from "@mantine/notifications";

interface SettingsPageProps {
  id: string;
}

const SettingsPage: NextPage<SettingsPageProps> = ({ id }) => {
  const getUserQuery = api.user.get.useQuery({ id });

  const editUserQuery = api.user.edit.useMutation({
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: "Successfully updated settings.",
        color: "green",
      });
    },
  });

  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");

  useEffect(() => {
    setName(getUserQuery.data?.name ?? "");
    setDescription(getUserQuery.data?.description ?? "");
    setImage(getUserQuery.data?.image ?? "");
  }, [
    getUserQuery.data?.name,
    getUserQuery.data?.description,
    getUserQuery.data?.image,
  ]);

  return (
    <HeaderDefault>
      <Mantine.Container size={500}>
        <Mantine.Title>Settings</Mantine.Title>

        <Mantine.Stack spacing={2}>
          <Mantine.TextInput
            error={nameError}
            value={name}
            onChange={(e) => {
              setNameError("");
              setName(e.target.value);
            }}
            label="Name"
            placeholder="Enter name"
          />
          <Mantine.TextInput
            error={descriptionError}
            value={description}
            onChange={(e) => {
              setDescriptionError("");
              setDescription(e.target.value);
            }}
            label="Description"
            placeholder="Enter description"
          />
          <Mantine.TextInput
            error={imageError}
            value={image}
            onChange={(e) => {
              setImageError("");
              setImage(e.target.value);
            }}
            label="Image"
            placeholder="Enter url of image"
          />
        </Mantine.Stack>

        <Mantine.Space h={20} />
        <Mantine.Button
          onClick={() => {
            if (name.length < 3) {
              setNameError("Name needs to be longer than 3 characters.");
            }
            if (name.length > 100) {
              setNameError("Name cannot be longer than 100 characters.");
            }

            if (description.length > 200) {
              setDescriptionError(
                "Description cannot be longer than 200 characters."
              );
            }

            if (
              name.length < 3 ||
              name.length > 100 ||
              description.length > 200
            )
              return;

            editUserQuery.mutate({
              name,
              description,
              image,
            });
          }}
        >
          Save
        </Mantine.Button>
      </Mantine.Container>
    </HeaderDefault>
  );
};

export default SettingsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id: session.user.id,
    },
  };
};
