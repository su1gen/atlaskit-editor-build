// @ts-ignore
import React, {useState, useEffect} from 'react';
// @ts-ignore
import ReactDOM from 'react-dom'
// @ts-ignore
import {Editor, MediaProvider, WithEditorActions, EditorContext, BaseReactEditorView} from '@atlaskit/editor-core';
// @ts-ignore
import {IntlProvider} from "react-intl-next";
import {
    BaseItem, DecisionState,
    Handler,
    ObjectKey,
    RecentUpdateContext,
    RecentUpdatesId,
    TaskState
} from "@atlaskit/task-decision/types";

import AtlassianIcon from '@atlaskit/icon/glyph/editor/align-center';
import {JSONDocNode} from "@atlaskit/editor-json-transformer";
import {Node} from "prosemirror-model";
import {ResolvedEditorState} from "@atlaskit/editor-common/collab";
import * as Y from 'yjs'
import {WebsocketProvider} from 'y-websocket'
import {ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo} from 'y-prosemirror'

import {keymap} from 'prosemirror-keymap'

import {MockMentionResource} from './Mention/index'


interface TaskDecisionProvider {
    unsubscribeRecentUpdates(id: RecentUpdatesId): void;

    notifyRecentUpdates(updateContext: RecentUpdateContext): void;

    toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState>;

    subscribe(objectKey: ObjectKey, handler: Handler, item?: BaseItem<TaskState | DecisionState>): void;

    unsubscribe(objectKey: ObjectKey, handler: Handler): void;
}

let taskDecisionProvider: Promise<TaskDecisionProvider> = Promise.resolve({
    unsubscribeRecentUpdates: (id: RecentUpdatesId) => {
        console.log(id)
    },
    notifyRecentUpdates: (updateContext: RecentUpdateContext) => {
        console.log(updateContext)
    },
    toggleTask: (objectKey: ObjectKey, state: TaskState) => {
        let state1: TaskState = 'DONE'
        console.log(state)
        return Promise.resolve(state1);
    },
    subscribe: (objectKey: ObjectKey, handler: Handler, item?: BaseItem<TaskState | DecisionState>) => {
        console.log(111)
    },
    unsubscribe: (objectKey: ObjectKey, handler: Handler) => {
        console.log(222)
    }
});


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


const customInsertMenuItems = [
    {
        content: "Insert image",
        value: {name: "insert-image"},
        tooltipDescription: "Insert image",
        tooltipPosition: "right",
        // @ts-ignore
        elemBefore: <AtlassianIcon/>,

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

                    var data = new FormData()
                    data.append('upload', inputElement.files[0])
                    // @ts-ignore
                    data.append('_token', access_token)

                    fetch(uploadURL, {
                        method: 'POST',
                        body: data
                    })
                        .then(response => response.json())
                        .then(data => {
                            editorActions.replaceSelection({
                                "type": "mediaSingle",
                                "content": [
                                    {
                                        "type": "media",
                                        "attrs": {
                                            "type": "external",
                                            // "url": `http://localhost:3000/${data.path}#media-blob-url=true&id=87bcf0a2-a269-4038-8834-65f4bd6e5a9e&collection=contentId-65651&contextId=65651&mimeType=image%2Fjpeg&name=(89).jpg&size=256698&width=527&height=329&alt=`
                                            "url": `${data.url}#media-blob-url=true&id=87bcf0a2-a269-4038-8834-65f4bd6e5a9e&collection=contentId-65651&contextId=65651&mimeType=image%2Fjpeg&name=(89).jpg&size=256698&width=527&height=329&alt=`
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
            });

            // const teardown = () => {
            //     document.body.removeEventListener('focus', teardown, true);
            //     setTimeout(() => {
            //         document.body.removeChild(inputElemenet);
            //     }, 1000);
            // }
            // document.body.addEventListener('focus', teardown, true);

            document.body.appendChild(inputElement);
            inputElement.click();


            // editorActions.replaceSelection({
            //     "type": "paragraph",
            //     "content": [
            //         {
            //             "type": "text",
            //             "text": "Some text in a paragraph"
            //         }
            //     ]
            // })
        }
    }
];

window.addEventListener('load', () => {

        // const ws = new WebSocket('ws://localhost:3000');
        // ws.addEventListener('open', function (event) {
        //     console.log('connected');
        // });
        //
        // const ydoc = new Y.Doc()
        // const room = `coch-org-document-test1`
        // // const provider = new WebsocketProvider('wss://n.coch.org', room, ydoc)
        // const provider = new WebsocketProvider('ws://localhost:3000', room, ydoc)
        // const yXmlFragment = ydoc.get('prosemirror-atlaskit', Y.XmlFragment)
        //
        // /**
        //  * The Atlasian Editor does not provide a method to add custom ProseMirror plugins.
        //  * This hack intercepts the generation of Atlassian edits so we can extend it.
        //  *
        //  * Ideally you would fork ProseMirror and add the Yjs plugin properly.
        //  */
        // const originalGetPlugins = BaseReactEditorView.prototype.getPlugins
        // BaseReactEditorView.prototype.getPlugins = function () {
        //     // @ts-ignore
        //     return originalGetPlugins.apply(this, arguments).concat([{
        //         name: 'yjs-plugin',
        //         // @ts-ignore
        //         pmPlugins: function () {
        //             return [
        //                 {
        //                     name: 'y-shared-content',
        //                     plugin: function (_a) {
        //                         // @ts-ignore
        //                         return ySyncPlugin(yXmlFragment)
        //                     }
        //                 }, {
        //                     name: 'y-shared-cursors',
        //                     plugin: function (_a) {
        //                         return yCursorPlugin(provider.awareness)
        //                     }
        //                 }, {
        //                     name: 'y-undo-plugin',
        //                     plugin: yUndoPlugin
        //                 }, {
        //                     name: 'y-undo-keymaps',
        //                     plugin: () => keymap({
        //                         'Mod-z': undo,
        //                         'Mod-y': redo,
        //                         'Mod-Shift-z': redo
        //                     })
        //                 }
        //             ]
        //         }
        //     }])
        // }

        function DelHeight_P_Empty(container: { querySelectorAll: (arg0: string) => any; }) {
            const all_p_elem = container.querySelectorAll('p')
            if (all_p_elem.length !== 0) {
                all_p_elem.forEach((elem: { innerText: string | any[]; style: { height: string; }; }) => {
                    if (elem.innerText.length === 1) {
                        elem.style.height = '0px'
                    } else {
                        elem.style.height = 'initial'
                    }
                })
            }
        }


        function AtlassianEditor(props: any) {

            const [data, setData] = useState({
                // @ts-ignore
                "version": 1,
                "type": "doc",
                "content": []
            });
            const [users, setUsers] = useState(null)

            // @ts-ignore
            useEffect(async () => {
                const mocsUsers = [{
                    // @ts-ignore

                    id: 1435,
                    // @ts-ignore

                    name: "Daniella",
                    // @ts-ignore

                    email: "forest.wehner@example.net",
                    // @ts-ignore

                    email_verified_at: null,
                    // @ts-ignore

                    created_at: "2022-04-29T11:21:16.000000Z",
                    // @ts-ignore

                    updated_at: "2022-04-29T11:21:18.000000Z",
                    // @ts-ignore

                    nickname: "xstark",
                    // @ts-ignore

                    last_name: "Wintheiser",
                    // @ts-ignore

                    last_login: "2022-04-29 11:21:18",
                    // @ts-ignore

                    google_id: null,
                    // @ts-ignore

                    facebook_id: null,
                    // @ts-ignore

                    is_admin: false,
                    // @ts-ignore

                    country_list_id: null,
                    // @ts-ignore

                    lat: null,
                    // @ts-ignore

                    lon: null,
                    // @ts-ignore

                    discord_id: null,
                    // @ts-ignore

                    discord_chat_id: null,
                    // @ts-ignore

                    cover: null,
                    // @ts-ignore

                    city_id: null,
                    // @ts-ignore

                    reddit_refresh_token: null,
                    // @ts-ignore

                    reddit_access_token: null,
                    // @ts-ignore

                    avatar: "avatar.png",
                    // @ts-ignore

                    messenger_color: "#2180f3",
                    // @ts-ignore

                    dark_mode: false,
                    // @ts-ignore

                    "active_status": false,
                    // @ts-ignore

                    is_bot: false,
                    // @ts-ignore

                    cover_position: null,
                    // @ts-ignore

                    is_banned: false,
                    // @ts-ignore

                    reddit_nickname: null
                    // @ts-ignore

                }]
                // @ts-ignore

                let editDocumentForm = document.querySelector("#edit-document-form")
                if (editDocumentForm) {
                    // @ts-ignore
                    let getDraftURL = editDocumentForm.dataset.getDraft
                    if (getDraftURL) {
                        const data = await fetch(getDraftURL)
                            .then((response) => {
                                return response.json();
                            })
                        if (data?.document?.content) {
                            setData(JSON.parse(data.document.content))
                        } else {
                            setData({
                                // @ts-ignore
                                "version": 1,
                                "type": "doc",
                                "content": []
                            })
                        }
                    }

                }
                // @ts-ignore
                const users = await fetch('https://dev.coch.org/users')
                // @ts-ignore
                if(users.data) {
                    // @ts-ignore
                    setUsers(users.data.map(({id, name, nickname, last_name}) => {
                        return {
                            id,
                            name,
                            nickname,
                            mentionName:last_name,
                            avatarUrl: "data:image/png;base64,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"
                        }
                    }))
                } else {
                    // @ts-ignore
                    setUsers(mocsUsers.map(({id, name, nickname, last_name}) => {
                        return {
                            id,
                            name,
                            nickname,
                            mentionName:last_name,
                            avatarUrl: "data:image/png;base64,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"
                        }
                    }))
                }

            }, []);

            console.log(users)

            return (
                <IntlProvider locale="en">
                    {(data && users) &&
                    <Editor
                      defaultValue={data ?? {}}
                      appearance="comment"
                      placeholder='Write something...'
                      insertMenuItems={customInsertMenuItems}

                        // taskDecisionProvider={taskDecisionProvider}
                        // allowTasksAndDecisions

                      mentionProvider={Promise.resolve(new MockMentionResource({
                          minWait: 10,
                          maxWait: 25,
                      }, users))}

                      allowTables={{
                          advanced: true,
                          allowColumnResizing: true,
                          allowMergeCells: true,
                          allowNumberColumn: true,
                          allowBackgroundColor: true,
                          allowHeaderRow: true,
                          allowHeaderColumn: true,
                          permittedLayouts: 'all',
                          stickToolbarToBottom: true
                      }}

                        // taskDecisionProvider={taskDecisionProvider}
                        // allowTasksAndDecisions


                      media={{
                          // provider: mediaProvider,
                          // useMediaPickerPopup: false,
                          // allowMediaGroup: true,
                          // allowLinking: true,
                          // allowBreakoutSnapPoints: true,
                          // allowRemoteDimensionsFetch: true,
                          // fullWidthEnabled: true,
                          // enableDownloadButton: true,
                          // alignLeftOnInsert: true,
                          // useForgePlugins: true,

                          featureFlags: {
                              captions: true,
                          },
                          allowResizing: true,
                          allowMediaSingle: true,
                          allowDropzoneDropLine: true,
                          isCopyPasteEnabled: true,
                          allowResizingInTables: true,
                          allowLazyLoading: true,
                          allowAdvancedToolBarOptions: true,
                          allowMediaSingleEditable: true,
                          allowMarkingUploadsAsIncomplete: true,
                          waitForMediaUpload: true,
                          allowAltTextOnImages: true,
                      }}
                      primaryToolbarComponents={
                          <WithEditorActions

                              render={actions => (
                                  <div>
                                      <button
                                          onClick={async () => {
                                              let currentContent = await actions.getValue()
                                              // @ts-ignore
                                              let updateDraftURL = document.querySelector("#edit-document-form")?.dataset.updateDraft
                                              let access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
                                              if (currentContent && updateDraftURL && access_token) {

                                                  let data = {
                                                      'document': currentContent,
                                                      '_method': 'PUT'
                                                  }

                                                  fetch(updateDraftURL, {
                                                      method: 'POST',
                                                      headers: {
                                                          'X-CSRF-TOKEN': access_token,
                                                          'Content-Type': 'application/json'
                                                      },
                                                      body: JSON.stringify(data)
                                                  })
                                                      .then(response => response.json())
                                                      .then(data => {
                                                          console.log(data)
                                                      })
                                              }
                                          }}
                                      >
                                          Save
                                      </button>
                                      <button
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
                                                              const documentContentLoad = document.querySelector('.document-content')
                                                              const editorStyleAll = document.querySelectorAll('.common-editor-styles:not(.common-editor-styles-user-draft)')
                                                              const editorStyleTruAll = document.querySelectorAll('.common-editor-true:not(.common-editor-styles-user-draft)')
                                                              // @ts-ignore
                                                              documentContentLoad.classList.toggle('show-draft')

                                                              if (editorStyleAll) {
                                                                  editorStyleAll.forEach(r => {
                                                                      DelHeight_P_Empty(r)
                                                                      r.classList.remove('common-editor-styles')
                                                                      r.classList.remove('common-editor-styles_mac')
                                                                      r.classList.add('common-editor-true_mac')
                                                                      r.classList.add('common-editor-true')
                                                                  })
                                                              }
                                                              if (editorStyleTruAll) {
                                                                  editorStyleTruAll.forEach(r => {
                                                                      DelHeight_P_Empty(r)
                                                                      r.classList.remove('common-editor-true')
                                                                      r.classList.add('common-editor-styles')
                                                                      r.classList.add('common-editor-styles_mac')
                                                                      r.classList.remove('common-editor-true_mac')
                                                                  })
                                                              }
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
)
