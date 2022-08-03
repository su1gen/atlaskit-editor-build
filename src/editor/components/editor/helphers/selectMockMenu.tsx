import { youtubeReg } from "../../../constants/urls";
import { createEditorMenuItem } from "../../../utils/editor";
import {InsertMenuCustomItem} from "../../../types/insertMenuCustomItem";

interface Params {
  type: string;
  key: any;
}

type MockMenuItem = "embedVideo";

type SelectMockMenu = MockMenuItem[];

interface MockInsertMenu {
  [key: string]: InsertMenuCustomItem;
}

const mockInsertMenu: MockInsertMenu = {
  embedVideo: createEditorMenuItem({
    content: "Embed Video",
    onClick: editorActions => {
      const url = prompt("Input Url") || "";
      const youtubeMatch = url.match(youtubeReg);
      const newParameters: Params = {} as Params;

      if (youtubeMatch && youtubeMatch[2].length === 11) {
        newParameters.type = "youtube";
        newParameters.key = youtubeMatch[2];
      } else {
        return null;
      }

      editorActions.replaceSelection({
        type: "extension",
        attrs: {
          extensionType: "embed-video",
          extensionKey: "embedVideo",
          text: "Embed video",
          parameters: newParameters
        }
      });
    }
  })
};

const selectMockMenu = (menu: SelectMockMenu): InsertMenuCustomItem[] =>
  menu.map(menuItem => mockInsertMenu[menuItem]);

export default selectMockMenu;
