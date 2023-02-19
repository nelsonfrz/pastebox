import { type NextPage } from "next";
import * as Mantine from "@mantine/core";
import { TextEditorCreate } from "../../components/TextEditor/TextEditorCreate";
import { HeaderCreate } from "../../components/Header/HeaderCreate";

const CreateTextPage: NextPage = () => {
  return (
    <HeaderCreate>
      <Mantine.Container>
        <Mantine.Stack>
          <TextEditorCreate />
        </Mantine.Stack>
      </Mantine.Container>
    </HeaderCreate>
  );
};

export default CreateTextPage;
