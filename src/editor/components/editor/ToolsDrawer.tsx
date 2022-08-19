import * as React from "react";
import {
  EditorContext,
  WithEditorActions,
  EditorActions
} from "@atlaskit/editor-core";
import { JSONTransformer } from "@atlaskit/editor-json-transformer";

import { ImageUploadProvider as ImageUploadHandler } from "@atlaskit/editor-common/provider-factory";
import { EditorView } from "prosemirror-view";
import FileInput from "../../extensions/components/FileInput";
import PreWrapDiv from "../common/PreWrapDiv";
import { jsonPretty } from "../../utils/string";
import { EditorProps } from "./Editor";
import { createEditorMenuItem } from "../../utils/editor";
import {ReactComponents} from "@atlaskit/editor-core/editor";
import {InsertMenuCustomItem} from "../../types/insertMenuCustomItem";


interface RenderEditor {
  onChange: (editorView: EditorView<any>) => void;
  // legacyImageUploadProvider: Promise<ImageUploadHandler>;
  // fileUploadMenuItem: InsertMenuCustomItem;
  // customButton: InsertMenuCustomItem[];
}

interface customButton {
  name: string;
  element?: ReactComponents;
  onClick?: (editorActions: EditorActions) => void;
}

interface Props extends EditorProps {
  renderEditor: (params: RenderEditor) => React.ReactNode;
  customButton?: customButton[];
  isImageUpload?: boolean;
}

interface State {
  isShowEditorValue: boolean;
  jsonDocument: string;
  filesName: string[];

  selectedTempDataList: string[];
}

class ToolsDrawer extends React.Component<Props, State> {
  fileInputRef: React.RefObject<FileInput> = React.createRef();
  imageUploadRef: React.RefObject<FileInput> = React.createRef();
  transformer: JSONTransformer;

  constructor(props: Props) {
    super(props);

    this.transformer = new JSONTransformer();
    this.state = {
      isShowEditorValue: false,
      jsonDocument: "{}",
      filesName: [],
      selectedTempDataList: []
    };
  }

  recursiveFileUploadQueue = (fileList: File[]) => {
    const { filesName } = this.state;

    this.setState({
      filesName: [...filesName, ...fileList.map(file => file.name)]
    });
  };

  recursiveImageUploadQueue = (fileList: File[], actions: EditorActions) =>
    fileList.forEach(async file => {
      const url = await window.URL.createObjectURL(file);

      actions.replaceSelection({
        type: "mediaSingle",
        attrs: { layout: "center" },
        content: [
          {
            type: "media",
            attrs: {
              type: "external",
              url
            }
          }
        ]
      });
    });

  render() {
    const { renderEditor, isImageUpload } = this.props;
    const {
      isShowEditorValue,
      filesName,

      selectedTempDataList
    } = this.state;

    return (
      // @ts-ignore
      <EditorContext>
        <>
          <button
            onClick={() => {
              this.setState({
                isShowEditorValue: !isShowEditorValue
              });
            }}
          >
            Show/Hide JSON Data
          </button>
          <FileInput
            ref={this.fileInputRef}
            onChange={this.recursiveFileUploadQueue}
            multiple
            isHide
          />
          <WithEditorActions
            render={actions => (
              <>
                <button
                  onClick={async () => {
                    const { getValue } = this.props;
                    const value = await actions.getValue();

                    getValue(value);
                  }}
                >
                  Save
                </button>
                {isImageUpload && (
                  <FileInput
                    ref={this.imageUploadRef}
                    onChange={file =>
                      this.recursiveImageUploadQueue(file, actions)
                    }
                    multiple
                    isHide
                  />
                )}
              </>
            )}
          />
          {renderEditor({
            onChange: editorView => {
              const jsonDocument = jsonPretty(
                this.transformer.encode(editorView.state.doc)
              );

              this.setState({ jsonDocument });
            },
            // // @ts-ignore
            // legacyImageUploadProvider:
            //   isImageUpload &&
            //   Promise.resolve(() =>
            //     // @ts-ignore
            //     this.imageUploadRef.current.fileRef.current.click()
            //   ),
            // fileUploadMenuItem: createEditorMenuItem({
            //   content: "File Upload",
            //   // @ts-ignore
            //   onClick: () => this.fileInputRef.current.fileRef.current.click()
            // }),
            // @ts-ignore
            // customButton: this.props.customButton.map(data =>
            //   createEditorMenuItem({
            //     content: data.name,
            //     onClick: data.onClick
            //   })
            // )
          })}
          {selectedTempDataList && (
            <ul>
              {selectedTempDataList.map(selectedTempData => (
                <li>{selectedTempData}</li>
              ))}
            </ul>
          )}
          {isShowEditorValue && (
            <PreWrapDiv>{this.state.jsonDocument}</PreWrapDiv>
          )}
          {!!filesName.length && (
            <ul>
              {filesName.map(fileName => (
                <li>{fileName}</li>
              ))}
            </ul>
          )}
        </>
      </EditorContext>
    );
  }
}

export default ToolsDrawer;
