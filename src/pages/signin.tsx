import { type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import { type Provider } from "next-auth/providers";
import type { GetServerSideProps } from "next";
import * as Mantine from "@mantine/core";
import { getProviders, signIn } from "next-auth/react";
import { HeaderDefault } from "../components/Header/HeaderDefault";

interface SignInPageProps {
  providers: Provider[];
}

const SignInPage: NextPage<SignInPageProps> = ({ providers }) => {
  return (
    <HeaderDefault>
      <Mantine.Container>
        <Mantine.Title>Please sign in.</Mantine.Title>
        <Mantine.Text>
          To use Pastebox you need to authenticate yourself.
        </Mantine.Text>
        {Object.values(providers).map((provider) => (
          <>
            <Mantine.Space h={20} />
            <Mantine.Button
              color="gray"
              key={provider.id}
              onClick={() => void signIn(provider.id)}
            >
              Sign in with {provider.name}
            </Mantine.Button>
          </>
        ))}
      </Mantine.Container>
    </HeaderDefault>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: Object.values(providers ?? {}) ?? [],
    },
  };
};

export default SignInPage;
