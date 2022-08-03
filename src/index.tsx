import React from 'react';
import ReactDOM from 'react-dom'
import AtlassianEditor from "./editor/components/App";
import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";
import {BaseReactEditorView} from "@atlaskit/editor-core";
import {redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin} from "y-prosemirror";
import {keymap} from "prosemirror-keymap";

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


      ReactDOM.render(
        <AtlassianEditor/>, document.getElementById('atlassian-editor')
      )
    }
  }
)
