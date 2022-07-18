// @ts-ignore
import React, {useState, useEffect} from 'react';
// @ts-ignore
import ReactDOM from 'react-dom'
// @ts-ignore
import {Editor, MediaProvider, WithEditorActions, BaseReactEditorView} from '@atlaskit/editor-core';
// @ts-ignore
import {IntlProvider} from "react-intl-next";
// import {
//     BaseItem, DecisionState,
//     Handler,
//     ObjectKey,
//     RecentUpdateContext,
//     RecentUpdatesId,
//     TaskState
// } from "@atlaskit/task-decision/types";

import ImageIcon from '@atlaskit/icon/glyph/editor/image';

import * as Y from 'yjs'
import {WebsocketProvider} from 'y-websocket'
import {ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo} from 'y-prosemirror'
import {keymap} from 'prosemirror-keymap'

import {MockMentionResource} from './Mention'


import styled from 'styled-components';
import ExamplesErrorBoundary from './helpers/ExamplesErrorBoundary';
import {
  Provider as SmartCardProvider,
  Client as SmartCardClient,
} from '@atlaskit/smart-card';

const smartCardClient = new SmartCardClient('staging');

const Wrapper: any = styled.div`
  box-sizing: border-box;
  height: 100%;
`;
Wrapper.displayName = 'Wrapper';

const Content: any = styled.div`
  padding: 0;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';


// interface TaskDecisionProvider {
//     unsubscribeRecentUpdates(id: RecentUpdatesId): void;
//
//     notifyRecentUpdates(updateContext: RecentUpdateContext): void;
//
//     toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState>;
//
//     subscribe(objectKey: ObjectKey, handler: Handler, item?: BaseItem<TaskState | DecisionState>): void;
//
//     unsubscribe(objectKey: ObjectKey, handler: Handler): void;
// }
//
// let taskDecisionProvider: Promise<TaskDecisionProvider> = Promise.resolve({
//     unsubscribeRecentUpdates: (id: RecentUpdatesId) => {
//         console.log(id)
//     },
//     notifyRecentUpdates: (updateContext: RecentUpdateContext) => {
//         console.log(updateContext)
//     },
//     toggleTask: (objectKey: ObjectKey, state: TaskState) => {
//         let state1: TaskState = 'DONE'
//         console.log(state)
//         return Promise.resolve(state1);
//     },
//     subscribe: (objectKey: ObjectKey, handler: Handler, item?: BaseItem<TaskState | DecisionState>) => {
//         console.log(111)
//     },
//     unsubscribe: (objectKey: ObjectKey, handler: Handler) => {
//         console.log(222)
//     }
// });


// focus(): boolean;
// blur(): boolean;
// clear(): boolean;
// getValue(): Promise<T | JSONDocNode | undefined>;
// getNodeByLocalId(id: string): Node | undefined;
// getSelectedNode(): Node | undefined;
// replaceDocument(rawValue: any): boolean;
// replaceSelection(rawValue: Node | Object | string): boolean;
// appendText(text: string): boolean;
// isDocumentEmpty(): boolean;
// getResolvedEditorState(): Promise<ResolvedEditorState | undefined>;

const setExpandEvents = () => {
  let expandItems = document.querySelectorAll('.document-content-public .ak-editor-expand')
  if (expandItems){
    expandItems.forEach(item => {
      let expandButton = item.querySelector('.ak-expand-button')
      if (expandButton){
        expandButton.addEventListener('click', () => {
          item.classList.toggle('ak-editor-expand__expanded')
        })
      }
    })
  }
}

const sendAndInsertImage = (editorActions: any, uploadURL: string, access_token: string, image: any) => {
  let data = new FormData()
  data.append('upload', image)
  // @ts-ignore
  data.append('_token', access_token)

  fetch(uploadURL, {
    method: 'POST',
    body: data
  })
    .then(response => response.json())
    .then(data => {

      let newWidth = data.originalSize.width
      let newHeight = data.originalSize.height

      if (newWidth > 760){
        newHeight = Math.round(760 * newHeight / newWidth)
        newWidth = 760
      }

      editorActions.replaceSelection({
        "type": "mediaSingle",
        "content": [
          {
            "type": "media",
            "attrs": {
              // "type": "file",
              "type": "external",
              "url": `${data.url}#media-blob-url=true&id=87bcf0a2-a269-4038-8834-65f4bd6e5a9e&collection=contentId-65651&contextId=65651&mimeType=image%2Fjpeg&name=(89).jpg&size=256698&width=${newWidth}&height=${newHeight}&alt=`,
              // "collection": "MediaServicesSample",
              // "name": "(89).jpg",
              "width": newWidth,
              "height": newHeight,
            }
          }
        ]
      })


      // "blob:https://mys1t3.atlassian.net/424690ae-8237-4266-a8b3-9e28b0d1b8ec#media-blob-url=true&id=87bcf0a2-a269-4038-8834-65f4bd6e5a9e&collection=contentId-65651&contextId=65651&mimeType=image%2Fjpeg&name=(89).jpg&size=256698&width=527&height=329&alt="


      // editorActions.replaceDocument(
      //     {
      //     "type": "mediaSingle",
      //     "content": [
      //         {
      //             "type": "media",
      //             "attrs": {
      //                 "type": "external",
      //                 "url": `http://localhost:3000/${data.path}`
      //             }
      //         }
      //     ]
      // }
      // )
    })
}


const customInsertMenuItems = [
  {
    content: "Insert image",
    value: {name: "insert-image"},
    tooltipDescription: "Insert image",
    tooltipPosition: "right",
    // @ts-ignore
    elemBefore: <ImageIcon/>,

    onClick: (editorActions: any) => {

      const inputElement = document.createElement('input');
      // @ts-ignore
      const uploadURL = document.querySelector("#edit-document-form")?.dataset?.atlaskitUploadImage
      // @ts-ignore
      const access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      inputElement.style.display = 'none';
      inputElement.type = 'file';
      inputElement.addEventListener('change', () => {
        if (inputElement.files && uploadURL) {
          // @ts-ignore
          sendAndInsertImage(editorActions, uploadURL, access_token, inputElement.files[0])
        }
      });

      document.body.appendChild(inputElement);
      inputElement.click();
    }
  }
];

// @ts-ignore
interface AsapBasedAuth {
  readonly asapIssuer: string;
  readonly token: string;
  readonly baseUrl: string;
}

interface ClientBasedAuth {
  readonly clientId: string;
  readonly token: string;
  readonly baseUrl: string;
}

interface AuthContext {
  readonly collectionName?: string;
}

interface UploadParams {
  collection?: string;
}

declare type Auth = ClientBasedAuth | AsapBasedAuth;
declare type AuthProvider = (context?: AuthContext) => Promise<Auth>;
declare type AuthFromContextProvider = (contextId: string) => Promise<Auth>;

interface MediaClientConfig {
  readonly authProvider: AuthProvider;
  readonly initialAuth?: Auth;
  readonly stargateBaseUrl?: string;
  readonly getAuthFromContext?: AuthFromContextProvider;
}

// @ts-ignore
declare type MediaProvider = {
  uploadParams?: UploadParams;
  /**
   * (optional) Used for creating new uploads and finalizing files.
   * NOTE: We currently don't accept MediaClientConfig, because we need config properties
   *       to initialize
   */
  uploadMediaClientConfig?: MediaClientConfig;
  /**
   * Used for displaying Media Cards and downloading files.
   */
  viewMediaClientConfig: MediaClientConfig;
};

let clientBaseAuth: Promise<Auth> = Promise.resolve({
  clientId: "clientId",
  token: "token",
  baseUrl: "http://localhost:3000",
})
let authProvider = (): Promise<Auth> => {
  return Promise.resolve(clientBaseAuth)
}

let mediaClientConfig: MediaClientConfig = {
  authProvider: authProvider,
}

let uploadMediaClientConfig: MediaClientConfig = {
  authProvider: authProvider,
}
// @ts-ignore
const mediaProvider: Promise<MediaProvider> = Promise.resolve({
  uploadParams: {
    collection: "myCollection"
  },

  viewMediaClientConfig: mediaClientConfig,
  uploadMediaClientConfig: uploadMediaClientConfig,
})


window.addEventListener('load', () => {
    // @ts-ignore
    if (window.Laravel.docId) {
      const ydoc = new Y.Doc()
      // @ts-ignore
      const room = `coch-org-document-${window.Laravel.docId}`
      const provider = new WebsocketProvider('wss://n.coch.org', room, ydoc)
      const yXmlFragment = ydoc.get('prosemirror-atlaskit', Y.XmlFragment)

      // const room = `coch-org-document-test1`
      // const provider = new WebsocketProvider('ws://localhost:3001', room, ydoc)
      // const provider = new WebsocketProvider('wss://n.coch.org', room, ydoc)

      /**
       * The Atlasian Editor does not provide a method to add custom ProseMirror plugins.
       * This hack intercepts the generation of Atlassian edits so we can extend it.
       *
       * Ideally you would fork ProseMirror and add the Yjs plugin properly.
       */
      const originalGetPlugins = BaseReactEditorView.prototype.getPlugins
      BaseReactEditorView.prototype.getPlugins = function () {
        // @ts-ignore
        return originalGetPlugins.apply(this, arguments).concat([{
          name: 'yjs-plugin',
          // @ts-ignore
          pmPlugins: function () {
            return [
              {
                name: 'y-shared-content',
                plugin: function (_a) {
                  // @ts-ignore
                  return ySyncPlugin(yXmlFragment)
                }
              }, {
                name: 'y-shared-cursors',
                plugin: function (_a) {
                  return yCursorPlugin(provider.awareness)
                }
              }, {
                name: 'y-undo-plugin',
                plugin: yUndoPlugin
              }, {
                name: 'y-undo-keymaps',
                plugin: () => keymap({
                  'Mod-z': undo,
                  'Mod-y': redo,
                  'Mod-Shift-z': redo
                })
              }
            ]
          }
        }])
      }

      function AtlassianEditor(props: any) {

        const [content, setContent] = useState(null);

        const [users, setUsers] = useState(null)
        const [users1, setUsers1] = useState(null)

        // @ts-ignore
        useEffect(() => {
          async function getData() {

            let responseData = await fetch(`https://n.coch.org/document-room/${room}`)
              .then((response) => {
                return response.json();
              })

            if (!responseData.isRoomExist) {
              // @ts-ignore
              let editDocumentForm = document.querySelector("#edit-document-form")
              if (editDocumentForm) {
                // @ts-ignore
                let getDraftURL = editDocumentForm.dataset.getDraft
                if (getDraftURL) {
                  const draftData = await fetch(getDraftURL)
                    .then((response) => {
                      return response.json();
                    })
                  if (draftData?.document?.content) {
                    setContent(JSON.parse(draftData.document.content))
                    console.log("data1:", JSON.parse(draftData.document.content))
                  } else {
                    setContent({
                      // @ts-ignore
                      "version": 1,
                      "type": "doc",
                      "content": []
                    })
                  }
                }
              }
            } else {
              setContent({
                // @ts-ignore
                "version": 1,
                "type": "doc",
                "content": []
              })
            }
            // @ts-ignore
            const users = await fetch(window.location.origin.includes('localhost')
              ? 'https://cochorg.wn.staj.fun/users' : `${window.location.origin}/users`).then(res => {
              return res.json()
            })
            // @ts-ignore
            setUsers1(users.data)
            // @ts-ignore
            setUsers(users.data.map(({id, name, nickname, last_name, avatar}) => {
              return {
                id,
                name,
                nickname: '',
                mentionName: last_name,
                avatarUrl: `https://cochorg.wn.staj.fun/storage/preview/${avatar}`
              }
            }))
          }

          getData()
        }, []);

        // @ts-ignore
        return (
          <IntlProvider locale="en">
            {(users && content) &&
                <ExamplesErrorBoundary>
                    <Wrapper>
                        <Content>
                            <SmartCardProvider client={smartCardClient}>
                                <Editor
                                  // UNSAFE_allowUndoRedoButtons={true}
                                  // allowAnalyticsGASV3={true}
                                  // quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
                                  // allowTextColor={{
                                  //   allowMoreTextColors: true,
                                  // }}
                                  // allowTables={{
                                  //   advanced: true,
                                  //   allowColumnSorting: true,
                                  //   stickyHeaders: true,
                                  //   tableCellOptimization: true,
                                  //   allowCollapse: true,
                                  //   allowDistributeColumns: true,
                                  // }}
                                  // allowBreakout={true}
                                  // allowJiraIssue={true}
                                  // allowPanel
                                  // allowExtension={{
                                  //   allowBreakout: true,
                                  // }}
                                  // allowRule={true}
                                  // allowDate={true}
                                  // allowLayouts={{
                                  //   allowBreakout: true,
                                  //   UNSAFE_addSidebarLayouts: true,
                                  //   UNSAFE_allowSingleColumnLayout: true,
                                  // }}
                                  // allowTextAlignment={true}
                                  // allowIndentation={true}
                                  // allowDynamicTextSizing={true}
                                  // allowTemplatePlaceholders={{allowInserting: true}}
                                  // smartLinks={{
                                  //   provider: Promise.resolve(cardProviderStaging),
                                  //   allowBlockCards: true,
                                  //   allowEmbeds: true,
                                  //   allowResizing: true,
                                  //   useAlternativePreloader: false,
                                  // }}
                                  // allowExpand={{
                                  //   allowInsertion: true,
                                  //   allowInteractiveExpand: true,
                                  // }}
                                    waitForMediaUpload={true}
                                  // allowStatus={true}
                                  // allowFindReplace={{
                                  //   allowMatchCase: true,
                                  // }}
                                  // allowNestedTasks
                                  // codeBlock={{
                                  //   allowCopyToClipboard: true,
                                  //   appearance: this.state.appearance,
                                  // }}

                                  // media={{
                                  //   provider: mediaProvider,
                                  //   allowMediaSingle: true,
                                  //   allowResizing: true,
                                  //   allowLinking: true,
                                  //   allowResizingInTables: true,
                                  //   allowAltTextOnImages: true,
                                  //   altTextValidator: (value: string) => {
                                  //     const errors = [];
                                  //     if (!/^[A-Z]/g.test(value)) {
                                  //       errors.push('Please start with capital letter.');
                                  //     }
                                  //     if (!/^[^"<>&\\]*$/g.test(value)) {
                                  //       errors.push('Please remove special characters.');
                                  //     }
                                  //     if (!/(\w.+\s).+/g.test(value)) {
                                  //       errors.push('Please use at least two words.');
                                  //     }
                                  //     return errors;
                                  //   },
                                  //   featureFlags: mediaEditorProps,
                                  // }}
                                  //   allowHelpDialog
                                  // placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
                                  // placeholderHints={[
                                  //   "Type '/' to insert content.",
                                  //   "Type ':' to insert an emoji.",
                                  //   "Type '@' to insert a mention.",
                                  //   "We added more background colors to tables cells. Try it, type '/tables'.",
                                  //   "Do you need more help? Type '/help'",
                                  // ]}
                                  // placeholderBracketHint="Did you mean to use '/' to insert content?"
                                  //   shouldFocus={true}
                                  // disabled={this.state.disabled}
                                  // defaultValue={
                                  //     (localStorage &&
                                  //         localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
                                  //     undefined
                                  // }
                                  // contentComponents={
                                  //   <WithEditorActions
                                  //       render={(actions) => (
                                  //           <>
                                  //             <BreadcrumbsMiscActions
                                  //                 appearance={this.state.appearance}
                                  //                 onFullWidthChange={this.setFullWidthMode}
                                  //             />
                                  //             <TitleInput
                                  //                 value={this.state.title}
                                  //                 onChange={this.handleTitleChange}
                                  //                 innerRef={this.handleTitleRef}
                                  //                 onFocus={this.handleTitleOnFocus}
                                  //                 onBlur={this.handleTitleOnBlur}
                                  //                 onKeyDown={(e: KeyboardEvent) => {
                                  //                   this.onKeyPressed(e, actions);
                                  //                 }}
                                  //             />
                                  //           </>
                                  //       )}
                                  //   />
                                  // }
                                  // primaryToolbarComponents={[
                                  //   <WithEditorActions
                                  //       key={1}
                                  //       render={(actions) => {
                                  //         this.editorActions = actions;
                                  //
                                  //         return (
                                  //             <>
                                  //               {this.props.customPrimaryToolbarComponents}
                                  //               <Button
                                  //                   isDisabled={!actions}
                                  //                   onClick={this.onCopyLinkWithContent}
                                  //                   style={{ marginRight: 5 }}
                                  //               >
                                  //                 Copy link
                                  //               </Button>
                                  //               <SaveAndCancelButtons
                                  //                   editorActions={actions}
                                  //                   setMode={this.props.setMode}
                                  //               />
                                  //             </>
                                  //         );
                                  //       }}
                                  //   />,
                                  // ]}
                                  // primaryToolbarIconBefore={
                                  //   <Button
                                  //       iconBefore={<AtlassianIcon />}
                                  //       appearance="subtle"
                                  //       shouldFitContainer
                                  //   ></Button>
                                  // }
                                  // onSave={SAVE_ACTION}
                                  // insertMenuItems={customInsertMenuItems}
                                  // extensionHandlers={extensionHandlers}
                                  // performanceTracking={{
                                  //   ttiTracking: {
                                  //     enabled: true,
                                  //     trackSeverity: true,
                                  //     ttiSeverityNormalThreshold:
                                  //     TTI_SEVERITY_THRESHOLD_DEFAULTS.NORMAL,
                                  //     ttiSeverityDegradedThreshold:
                                  //     TTI_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED,
                                  //     ttiFromInvocationSeverityNormalThreshold:
                                  //     TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.NORMAL,
                                  //     ttiFromInvocationSeverityDegradedThreshold:
                                  //     TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED,
                                  //   },
                                  //   transactionTracking: { enabled: true },
                                  //   uiTracking: { enabled: true },
                                  //   nodeViewTracking: { enabled: true },
                                  //   inputTracking: { enabled: true, countNodes: true },
                                  //   bFreezeTracking: {
                                  //     trackInteractionType: true,
                                  //     trackSeverity: true,
                                  //     severityNormalThreshold: BROWSER_FREEZE_NORMAL_SEVERITY_THRESHOLD,
                                  //     severityDegradedThreshold: BROWSER_FREEZE_DEGRADED_SEVERITY_THRESHOLD,
                                  //   },
                                  //   proseMirrorRenderedTracking: {
                                  //     trackSeverity: true,
                                  //     severityNormalThreshold: PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
                                  //     severityDegradedThreshold: PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
                                  //   },
                                  //   contentRetrievalTracking: {
                                  //     enabled: true,
                                  //     successSamplingRate: 2,
                                  //     failureSamplingRate: 1,
                                  //     reportErrorStack: true,
                                  //   },
                                  //   onEditorReadyCallbackTracking: { enabled: true },
                                  //   pasteTracking: { enabled: true },
                                  //   renderTracking: {
                                  //     editor: {
                                  //       enabled: true,
                                  //       useShallow: false,
                                  //     },
                                  //     reactEditorView: {
                                  //       enabled: true,
                                  //       useShallow: false,
                                  //     },
                                  //   },
                                  // }}

                                  // featureFlags={{
                                  //   ...this.props.featureFlags,
                                  //   // Enabling to catch during dev by default
                                  //   'safer-dispatched-transactions': true,
                                  // }}
                                  // appearance='full-page'
                                  // onEditorReady={this.onEditorReady}
                                  // trackValidTransactions={{samplingRate: 100}}


                                    defaultValue={content}
                                    appearance="full-page"
                                    placeholder='Write something...'
                                    insertMenuItems={customInsertMenuItems}

                                  // taskDecisionProvider={taskDecisionProvider}
                                  // allowTasksAndDecisions

                                  // allowNewInsertionBehaviour

                                    mentionProvider={Promise.resolve(new MockMentionResource({
                                      minWait: 10,
                                      maxWait: 25,
                                    }, users))}
                                    allowTextColor={{
                                      allowMoreTextColors: true,
                                    }}
                                    allowLayouts
                                    allowTables={{
                                      advanced: true,
                                      allowColumnResizing: true,
                                      allowMergeCells: true,
                                      allowNumberColumn: true,
                                      allowBackgroundColor: true,
                                      allowHeaderRow: true,
                                      allowHeaderColumn: true,
                                      permittedLayouts: 'all',
                                      stickToolbarToBottom: true,
                                      allowColumnSorting: true,
                                      stickyHeaders: true,
                                      allowCollapse: true,
                                      // tableCellOptimization: true,


                                      // allowColumnSorting: true,
                                      // allowAddColumnWithCustomStep: true,



                                      // isHeaderRowRequired: true,
                                      // allowControls: true,
                                      // stickyHeaders: true,


                                      // allowCellOptionsInFloatingToolbar: true,
                                      // tableCellOptimization: true,
                                      // tableRenderOptimization: true,
                                      // stickyHeadersOptimization: true,
                                      // initialRenderOptimization: true,
                                      // mouseMoveOptimization: true,
                                      // tableOverflowShadowsOptimization: true,
                                      // allowDistributeColumns: true,

                                    }}
                                  allowExpand={{
                                    allowInsertion: true,
                                    allowInteractiveExpand: true,
                                  }}
                                  // taskDecisionProvider={taskDecisionProvider}
                                  // allowTasksAndDecisions
                                    media={{
                                      // @ts-ignore
                                      // provider: mediaProvider,
                                      // useMediaPickerPopup: false,
                                      // allowMediaGroup: true,
                                      allowLinking: true,
                                      // allowBreakoutSnapPoints: true,
                                      // allowRemoteDimensionsFetch: true,
                                      fullWidthEnabled: true,
                                      // enableDownloadButton: true,
                                      // alignLeftOnInsert: true,
                                      // useForgePlugins: true,
                                      featureFlags: {
                                        captions: true,
                                      },
                                      // allowResizing: true,
                                      allowMediaSingle: true,
                                      // allowDropzoneDropLine: true,
                                      isCopyPasteEnabled: true,
                                      // allowResizingInTables: true,
                                      allowLazyLoading: true,
                                      allowAdvancedToolBarOptions: true,
                                      // allowMediaSingleEditable: true,
                                      // allowMarkingUploadsAsIncomplete: true,
                                      waitForMediaUpload: true,
                                      // allowAltTextOnImages: true,
                                    }}
                                    primaryToolbarComponents={
                                      <WithEditorActions
                                        render={actions => (
                                          <div>
                                            <button
                                              onClick={async () => {
                                                await fetch(`https://n.coch.org/document-rooms`)
                                                  .then((response) => {
                                                    return response.json();
                                                  }).then(data => {
                                                    console.log(data)
                                                  })
                                              }}
                                            >
                                              Get rooms
                                            </button>
                                            <button
                                              onClick={async () => {
                                                await fetch(`https://n.coch.org/document-room/delete/${room}`)
                                                  .then((response) => {
                                                    return response.json();
                                                  }).then(data => {
                                                    console.log(data)
                                                  })
                                              }}
                                            >
                                              Delete room
                                            </button>
                                            <button
                                              onClick={async () => {
                                                let currentContent = await actions.getValue()
                                                console.log(currentContent)
                                              }}
                                            >
                                              Get data
                                            </button>
                                            <button
                                              id={"ak-publish-document"}
                                              onClick={async () => {
                                                let currentContent = await actions.getValue()
                                                // @ts-ignore
                                                let updateContentURL = document.querySelector("#edit-document-form")?.dataset.updateContent
                                                let access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
                                                if (currentContent && updateContentURL && access_token) {

                                                  let data = {
                                                    'document': currentContent,
                                                    '_method': 'PUT'
                                                  }

                                                  fetch(updateContentURL, {
                                                    method: 'POST',
                                                    headers: {
                                                      'X-CSRF-TOKEN': access_token,
                                                      'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(data)
                                                  })
                                                    .then(response => response.json())
                                                    .then(data => {
                                                      let documentContentWrapper = document.querySelector(".document-content-public .srm-description__content-inner")

                                                      if (documentContentWrapper) {
                                                        documentContentWrapper.innerHTML = data.data.document.content

                                                        setExpandEvents()

                                                        const documentContentLoad = document.querySelector('.document-content')

                                                        // @ts-ignore
                                                        documentContentLoad.classList.toggle('show-draft')
                                                      }
                                                    })
                                                }
                                              }}
                                            >
                                              Publish
                                            </button>
                                          </div>
                                        )}
                                      />
                                    }
                                />
                            </SmartCardProvider>
                        </Content>
                    </Wrapper>
                </ExamplesErrorBoundary>
            }
          </IntlProvider>
        )
      }

      ReactDOM.render(
        // <EditorContext>
        <AtlassianEditor/>
        // </EditorContext>
        ,
        document.getElementById('atlassian-editor')
      )
    }
  }
)
