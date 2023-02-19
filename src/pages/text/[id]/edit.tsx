import type { GetServerSideProps, NextPage } from "next";
import * as Mantine from "@mantine/core";
import { api } from "../../../utils/api";
import { TextEditorEdit } from "../../../components/TextEditor/TextEditorEdit";
import { HeaderDefault } from "../../../components/Header/HeaderDefault";
import { Loader } from "../../../components/Loader";
import { HeaderEdit } from "../../../components/Header/HeaderEdit";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface TextPageProps {
  id: string;
}

const EditTextPage: NextPage<TextPageProps> = ({ id }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const getTextQuery = api.text.get.useQuery(
    {
      id,
    },
    {
      onSuccess: (text) => {
        if (text && text.userId !== session?.user.id)
          void router.push(`/text/${text.id}`);
      },
    }
  );

  if (getTextQuery.isLoading) {
    return (
      <HeaderDefault>
        <Mantine.Container>
          <Loader />
        </Mantine.Container>
      </HeaderDefault>
    );
  }

  if (!getTextQuery.data?.id) {
    return (
      <HeaderDefault>
        <Mantine.Container>
          <Mantine.Center>
            <Mantine.Title order={3}>Text could not be found.</Mantine.Title>
          </Mantine.Center>
        </Mantine.Container>
      </HeaderDefault>
    );
  }

  return (
    <HeaderEdit text={getTextQuery.data}>
      <Mantine.Container>
        <TextEditorEdit />
      </Mantine.Container>
    </HeaderEdit>
  );
};

export default EditTextPage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      id: ctx.query.id,
    },
  };
};
