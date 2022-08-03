import {EditorActions} from "@atlaskit/editor-core";
import {ReactComponents} from "@atlaskit/editor-core/editor";

export type InsertMenuCustomItem = {
  content: string;
  value?: {
    name: string | null;
  };
  tooltipDescription?: string;
  tooltipPosition?: string;
  elemBefore?: ReactComponents | string;
  elemAfter?: ReactComponents | string;
  isDisabled?: boolean;
  className?: string;
  onClick?: (editorActions: EditorActions) => void;
};