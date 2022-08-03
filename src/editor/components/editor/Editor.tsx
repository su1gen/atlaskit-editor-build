import * as React from "react";
import { Editor } from "@atlaskit/editor-core";
import ToolsDrawer from "./ToolsDrawer";
import selectMockMenu from "./helphers/selectMockMenu";
import extensionHandlers from "./helphers/extensionHandlers";
import {IntlProvider} from "react-intl-next";
import {getExtensionProviders} from "../../extensions/get-extensions-provider";
import customInsertMenuItems from "../../extensions/menu-items";

export interface EditorProps {
  getValue: (value: string) => void;
}

const EditorPage = (props: EditorProps) => (
  <IntlProvider locale="en">
    <ToolsDrawer
      isImageUpload
      renderEditor={({
        onChange,
        // customButton
      }) => (
        <Editor
          appearance="full-page"
          // extensionHandlers={extensionHandlers}
          extensionProviders={() => [
            getExtensionProviders(),
          ]}
          // @ts-ignore
          insertMenuItems={customInsertMenuItems}
          onChange={onChange}
          allowExtension={{
            allowAutoSave: true,
            allowExtendFloatingToolbars: true,
          }}
          allowTextColor
          allowTextAlignment
        />
      )}
      {...props}
    />
  </IntlProvider>
);

export default EditorPage;
