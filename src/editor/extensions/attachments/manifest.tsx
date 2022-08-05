import { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import renderExtensionModule, {AttachmentsParams} from './extension-handler';
import {ExtensionModuleActionHandler} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest";

export const AttachmentsHandler: ExtensionModuleActionHandler = () => {

  const newParameters: AttachmentsParams = {} as AttachmentsParams;

  return Promise.resolve({
    type: "extension",
    attrs: {
      extensionType: "attachments.extension",
      extensionKey: "attachments:attachments-default",
      text: "Attachments",
      parameters: newParameters
    }
  })
}


const manifest: ExtensionManifest<AttachmentsParams> = {
  title: 'Attachments',
  type: 'attachments.extension',
  key: 'attachments',
  description: 'Insert attachments',
  icons: {
    '48': () =>
      import('@atlaskit/icon/glyph/editor/file').then((mod) => mod.default),
  },
  modules: {
    quickInsert: [
      {
        key: 'attachments-1',
        title: 'Attachments',
        description: 'Insert attachments',
        icon: () =>
          import('@atlaskit/icon/glyph/editor/file').then((mod) => mod.default),
        action: AttachmentsHandler
      },
    ],
    nodes: {
      'attachments-default': {
        type: 'extension',
        render: () => renderExtensionModule,
      },
    },
  },
};

if ((manifest as any)?.modules?.nodes['attachments-default']) {
  (manifest as any).modules.nodes['attachments-default'].__hideFrame = true;
}

export default manifest;
