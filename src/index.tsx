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

        // const [data, setData] = useState(null);
        const [data, setData] = useState({
            "version": 1,
            "type": "doc",
            "content": []
        });

        // @ts-ignore
        useEffect(async () => {
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
                            "version": 1,
                            "type": "doc",
                            "content": []
                        })
                    }
                }
            }
        }, []);
        return (
            <IntlProvider locale="en">
                {data &&
                    <Editor
                        defaultValue={data ?? {}}
                        appearance="comment"
                        placeholder='Write something...'
                        insertMenuItems={customInsertMenuItems}
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
                            featureFlags: {
                                captions: true,
                            },

                            // provider: mediaProvider,
                            allowResizing: true,
                            allowMediaSingle: true,
                            // useMediaPickerPopup: false,
                            allowDropzoneDropLine: true,
                            isCopyPasteEnabled: true,

                            // allowMediaGroup: true,
                            allowResizingInTables: true,
                            // allowLinking: true,
                            allowLazyLoading: true,
                            // allowBreakoutSnapPoints: true,
                            allowAdvancedToolBarOptions: true,
                            allowMediaSingleEditable: true,
                            // allowRemoteDimensionsFetch: true,
                            allowMarkingUploadsAsIncomplete: true,
                            // fullWidthEnabled: true,
                            waitForMediaUpload: true,
                            allowAltTextOnImages: true,
                            // enableDownloadButton: true,
                            useForgePlugins: true,
                            // alignLeftOnInsert: true,
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

                                                            if (documentContentWrapper){
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
})
