import type { GetServerSideProps, NextPage } from "next";
import { Container } from "../../components/Container";
import { Profile } from "../../components/Profile";
import * as Mantine from "@mantine/core";
import { api } from "../../utils/api";
import { Loader } from "../../components/Loader";
import { HeaderDefault } from "../../components/Header/HeaderDefault";

interface UserPageProps {
  id: string;
}

const UserPage: NextPage<UserPageProps> = ({ id }) => {
  const getUserQuery = api.user.get.useQuery({
    id,
  });

  if (getUserQuery.isLoading) {
    return (
      <HeaderDefault>
        <Mantine.Container>
          <Loader />
        </Mantine.Container>
      </HeaderDefault>
    );
  }

  if (!getUserQuery.data?.id) {
    return (
      <HeaderDefault>
        <Mantine.Container>
          <Mantine.Center>
            <Mantine.Title order={3}>User could not be found.</Mantine.Title>
          </Mantine.Center>
        </Mantine.Container>
      </HeaderDefault>
    );
  }

  return (
    <HeaderDefault>
      <Container
        style={{
          paddingTop: "50px",
          borderRadius: "10px",
          minHeight: "100vh",
          border: "1px solid rgb(44, 46, 51)",
        }}
      >
        <Profile user={getUserQuery.data} />
      </Container>
    </HeaderDefault>
  );
};

export default UserPage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      id: ctx.query.id,
    },
  };
};
