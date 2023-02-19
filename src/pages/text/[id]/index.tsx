import type { GetServerSideProps, NextPage } from "next";
import * as Mantine from "@mantine/core";
import { api } from "../../../utils/api";
import { Loader } from "../../../components/Loader";
import { HeaderText } from "../../../components/Header/HeaderText";
import { HeaderDefault } from "../../../components/Header/HeaderDefault";
import { Text } from "../../../components/Text";

interface TextPageProps {
  id: string;
}

const TextPage: NextPage<TextPageProps> = ({ id }) => {
  const getTextQuery = api.text.get.useQuery({
    id,
  });

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
    <HeaderText text={getTextQuery.data}>
      <Mantine.Container>
        <Text content={getTextQuery.data.content} />
      </Mantine.Container>
    </HeaderText>
  );
};

export default TextPage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      id: ctx.query.id,
    },
  };
};
