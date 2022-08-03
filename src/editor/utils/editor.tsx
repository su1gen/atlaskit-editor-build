import * as React from "react";
import {EditorActions} from "@atlaskit/editor-core";
import CustomSVG from "../components/common/CustomSVG";
import {testIcon} from "../constants/svg";
import {camelize} from "./string";
import {ReactComponents} from "@atlaskit/editor-core/editor";
import {InsertMenuCustomItem} from "../types/insertMenuCustomItem";

interface EditorMenuItems {
  content: string;
  elemBefore?: ReactComponents;
  onClick?: (editorActions: EditorActions) => void;
}

export const createEditorMenuItem = ({content, elemBefore, onClick}: EditorMenuItems): InsertMenuCustomItem => ({
  content,
  value: {
    name: camelize(content)
  },
  tooltipDescription: content,
  tooltipPosition: "right",
  elemBefore: elemBefore || <CustomSVG width="24" height="24" d={testIcon}/>,
  onClick
});
