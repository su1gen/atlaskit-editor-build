import {
  ExtensionManifest,
  ExtensionAPI,
} from '@atlaskit/editor-common/extensions';
import renderExtensionModule, {EmbedVideoParams} from './extension-handler';
import {ExtensionModuleActionHandler} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest";
import {youtubeReg} from "../../constants/urls";
import {ADFEntity} from "@atlaskit/adf-utils/types";
import {uuid} from "@atlaskit/adf-schema";
import {TransformAfter, TransformBefore} from "@atlaskit/editor-common/dist/types/extensions/types/extension-handler";

async function defaultUpdate(data: EmbedVideoParams, actions?: ExtensionAPI<EmbedVideoParams>) {

  console.log(data)
  console.log(actions)

  actions!.editInContextPanel(
    (parameters: EmbedVideoParams) => {
      return parameters
    },
    async (parameters: EmbedVideoParams) => {
      let newParams = parameters
      if (newParams.url){
        const youtubeMatch = newParams.url.match(youtubeReg);
        if (youtubeMatch && youtubeMatch[2].length === 11) {
          newParams.key = youtubeMatch[2];
          return newParams
        }
      }
      return parameters
    }
  );
}

export const EmbedVideoHandler: ExtensionModuleActionHandler = () => {

  const url = prompt("Input Url") || "";
  const youtubeMatch = url.match(youtubeReg);
  const newParameters: EmbedVideoParams = {} as EmbedVideoParams;

  if (youtubeMatch && youtubeMatch[2].length === 11) {
    newParameters.type = "youtube";
    newParameters.key = youtubeMatch[2];
    newParameters.url = url;
  }

  return Promise.resolve({
    type: "extension",
    attrs: {
      extensionType: "embed.video.extension",
      extensionKey: "embed.video:embed-video-default",
      text: "Embed video",
      parameters: newParameters
    }
  })
}


const manifest: ExtensionManifest<EmbedVideoParams> = {
  title: 'Embed video',
  type: 'embed.video.extension',
  key: 'embed.video',
  description: 'Insert youtube video',
  icons: {
    '48': () =>
      import('@atlaskit/icon/glyph/editor/file-preview').then((mod) => mod.default),
  },
  modules: {
    quickInsert: [
      {
        key: 'embed-video-1',
        title: 'Embed video',
        description: 'Insert youtube video',
        icon: () =>
          import('@atlaskit/icon/glyph/editor/file-preview').then((mod) => mod.default),
        action: EmbedVideoHandler
      },
    ],
    nodes: {
      'embed-video-default': {
        type: 'extension',
        render: () => renderExtensionModule,
        update: defaultUpdate,
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'url',
              label: 'Video url',
              isRequired: true,
              type: 'string',
            },
          ]),
      },
    },
    contextualToolbars: [
      {
        context: {
          type: 'extension',
          nodeType: 'extension',
          extensionKey: 'embed.video:embed-video-default',
          extensionType: 'embed.video.extension',
        },
        toolbarItems: [
          {
            key: 'item-1',
            display: 'icon',
            label: 'Float left',
            tooltip: 'Float left',
            icon: () =>
              import(
                /* webpackChunkName: "@atlaskit-internal_icon-warning" */ '@atlaskit/icon/glyph/editor/media-wrap-left'
                ).then((mod) => mod.default),
            action: async (adf: ADFEntity, api: ExtensionAPI) => {
              const localId: string = adf.attrs?.localId || '';
              api.editInContextPanel((tb) => {
                // console.log("tb", tb)
              }, (ta) => {
                // console.log("ta", ta)
                return Promise.resolve({

                })
              })
              api.doc.update(localId, ({attrs, marks}) => {
                // console.log(attrs, marks)
                return {
                  attrs: {
                    // @ts-ignore
                    extensionType: attrs.extensionType,
                    // @ts-ignore
                    extensionKey: attrs.extensionKey,
                    // @ts-ignore
                    parameters: attrs.parameters,
                    // @ts-ignore
                    text: attrs.text,
                    // @ts-ignore
                    layout: "wrap-left",
                  },
                }
              });
            },
          },
          // {
          //   key: 'item-2',
          //   display: 'icon',
          //   label: 'Full width',
          //   tooltip: 'Full width',
          //   icon: () =>
          //     import(
          //       /* webpackChunkName: "@atlaskit-internal_icon-editor-success" */ '@atlaskit/icon/glyph/editor/media-center'
          //       ).then((mod) => mod.default),
          //   action: async (adf: ADFEntity, api: ExtensionAPI) => {
          //     const localId: string = adf.attrs?.localId || '';
          //     api.doc.update(localId, ({attrs, marks}) => ({
          //       attrs: {
          //         // @ts-ignore
          //         extensionType: attrs.extensionType,
          //         // @ts-ignore
          //         extensionKey: attrs.extensionKey,
          //         // @ts-ignore
          //         parameters: attrs.parameters,
          //         // @ts-ignore
          //         text: attrs.text,
          //         // @ts-ignore
          //         layout: "default",
          //       },
          //     }));
          //   },
          // },
          {
            key: 'item-3',
            display: 'icon',
            label: 'Float right',
            tooltip: 'Float right',
            icon: () =>
              import(
                /* webpackChunkName: "@atlaskit-internal_icon-editor-success" */ '@atlaskit/icon/glyph/editor/media-wrap-right'
                ).then((mod) => mod.default),
            action: async (adf: ADFEntity, api: ExtensionAPI) => {
              const localId: string = adf.attrs?.localId || '';
              api.doc.update(localId, ({attrs, marks}) => ({
                attrs: {
                  // @ts-ignore
                  extensionType: attrs.extensionType,
                  // @ts-ignore
                  extensionKey: attrs.extensionKey,
                  // @ts-ignore
                  parameters: attrs.parameters,
                  // @ts-ignore
                  text: attrs.text,
                  // @ts-ignore
                  layout: "wrap-right",
                },
              }));
            },
          },
        ],
      },
    ],
  },
};

if ((manifest as any)?.modules?.nodes['embed-video-default']) {
  (manifest as any).modules.nodes['embed-video-default'].__hideFrame = true;
}

export default manifest;
