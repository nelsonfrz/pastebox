import type { Session } from "next-auth";
import * as Mantine from "@mantine/core";
import Link from "next/link";
import { IconAdjustments, IconLogin, IconUserCircle } from "@tabler/icons";
import { signOut } from "next-auth/react";

interface AccountDropdownItemsProps {
  session: Session;
}

export const AccountDropdownItems: React.FC<AccountDropdownItemsProps> = ({
  session,
}) => {
  return (
    <>
      <Mantine.Menu.Label>Account</Mantine.Menu.Label>
      <Link href={`/user/${session.user.id}`}>
        <Mantine.Menu.Item icon={<IconUserCircle size={18} />}>
          Profile
        </Mantine.Menu.Item>
      </Link>
      <Link href="/settings">
        <Mantine.Menu.Item icon={<IconAdjustments size={18} />}>
          Settings
        </Mantine.Menu.Item>
      </Link>
      <Mantine.Menu.Item
        onClick={() => void signOut()}
        icon={<IconLogin size={18} />}
      >
        Sign Out
      </Mantine.Menu.Item>
    </>
  );
};
