import { type AppType } from "next/app";
import { type Session } from "next-auth";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { api } from "../utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme: "dark" }}
        >
          <ModalsProvider>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
