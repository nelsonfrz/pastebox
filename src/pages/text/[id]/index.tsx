import type { GetServerSideProps, NextPage } from "next";
import * as Mantine from "@mantine/core";
import { api } from "../../../utils/api";
import { Loader } from "../../../components/Loader";
import { HeaderText } from "../../../components/Header/HeaderText";
import { HeaderDefault } from "../../../components/Header/HeaderDefault";
import { Text } from "../../../components/Text";
import Link from "next/link";

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
        <Mantine.Title order={2}>{getTextQuery.data.title}</Mantine.Title>
        <Mantine.Text style={{ wordBreak: "break-all" }}>
          {getTextQuery.data.description}
        </Mantine.Text>
        <Mantine.Space h={20} />
        <Text content={getTextQuery.data.content} />
        <Mantine.Space h={20} />
        <Mantine.Flex gap="md" align="center">
          <Mantine.Avatar
            size={50}
            radius={1000}
            src={getTextQuery.data.author.image}
          />
          <Mantine.Box>
            <Link href={`/user/${getTextQuery.data.author.id}`}>
              <Mantine.Title order={3}>
                {getTextQuery.data.author.name}
              </Mantine.Title>
            </Link>
            <Mantine.Text style={{ wordBreak: "break-all" }}>
              {getTextQuery.data.author.description}
            </Mantine.Text>
          </Mantine.Box>
        </Mantine.Flex>
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
