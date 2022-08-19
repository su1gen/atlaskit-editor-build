import {ExtensionAPI, ExtensionManifest} from '@atlaskit/editor-common/extensions';
import renderExtensionModule, {AttachmentsParams} from './extension-handler';
import {ExtensionModuleActionHandler} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest";
import {ADFEntity} from "@atlaskit/adf-utils/types";
// @ts-ignore
import {v4 as uuidv4} from 'uuid';

import DownloadIcon from "@atlaskit/icon/svgs/download.svg";
import UploadIcon from "@atlaskit/icon/svgs/upload.svg";

export const AttachmentsHandler: ExtensionModuleActionHandler = () => {

  const newParameters: AttachmentsParams = {} as AttachmentsParams;
  newParameters.items = []

  return Promise.resolve({
    type: "extension",
    attrs: {
      extensionType: "attachments.extension",
      extensionKey: "attachments:attachments-default",
      text: "Attachments",
      parameters: newParameters
    },
  })
}

const downloadFile = (url: string) => {
  const a = document.createElement('a')
  a.href = url
  // @ts-ignore
  a.download = url.split('/').pop()
  console.log(a)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
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
    contextualToolbars: [
      {
        context: {
          type: 'extension',
          nodeType: 'extension',
          extensionKey: 'attachments:attachments-default',
          extensionType: 'attachments.extension',
        },
        toolbarItems: [
          {
            key: 'attachment-button-1',
            display: 'icon',
            label: 'Download all files',
            tooltip: 'Download all files',
            icon: () => import('@atlaskit/icon/glyph/arrow-down').then((mod) => mod.default),
            action: async (adf: ADFEntity, api: ExtensionAPI) => {
              const localId: string = adf.attrs?.parameters?.currentLocalId || '';

              // @ts-ignore
              let attachmentsUrl = document.querySelector("#edit-document-form")?.dataset?.atlaskitDownloadAttachments
              // @ts-ignore
              if (attachmentsUrl && localId) {
                console.log(attachmentsUrl + `?attachmentId=${localId}`)
                downloadFile(attachmentsUrl + `?attachmentId=${localId}`)
              }
            },
          },
          {
            key: 'attachment-button-2',
            display: 'icon',
            label: 'Upload files',
            tooltip: 'Upload files',
            icon: () =>
                import('@atlaskit/icon/glyph/arrow-up').then((mod) => mod.default),
            action: async (adf: ADFEntity, api: ExtensionAPI) => {
              const localId: string = adf.attrs?.localId || '';

              // // @ts-ignore
              // const uploadURL = document.querySelector("#edit-document-form")?.dataset?.atlaskitUploadImage
              // // @ts-ignore
              // const access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")

              let attachmentInput = document.querySelector("#attachments-files")
              if (attachmentInput) {
                attachmentInput.remove()
              }

              let inputElement = document.createElement('input');
              inputElement.setAttribute('type', 'file');
              inputElement.setAttribute('id', 'attachments-files');
              inputElement.setAttribute('multiple', 'true');
              inputElement.classList.add('hide');

              inputElement.addEventListener('change', () => {
                // @ts-ignore
                let attachmentsUrl = document.querySelector("#edit-document-form")?.dataset?.atlaskitUploadAttachments
                let access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
                // @ts-ignore
                if (inputElement.files && attachmentsUrl && access_token) {
                  const formData = new FormData();
                  const newLocalId = "myID-" + uuidv4();
                  // @ts-ignore
                  formData.append("_token", access_token);
                  for (const file of inputElement.files) {
                    formData.append('attachments[]', file, file.name)
                  }
                  formData.append('attachmentId', newLocalId)
                  formData.append('oldAttachmentId', localId)
                  formData.append('currentAttachmentId', adf.attrs?.parameters?.currentLocalId || '')
                  // @ts-ignore
                  formData.append('documentId', window.Laravel.docId)

                  let oldAttachments = []

                  let currentAttachments = adf.attrs?.parameters?.items;
                  if (currentAttachments){
                    for (const item of currentAttachments) {
                      oldAttachments.push({
                        "fileName": item.fileName,
                        "fileStoragePath": item.fileStoragePath
                      })
                    }
                  }

                  formData.append('oldAttachments', JSON.stringify(oldAttachments))

                  fetch(attachmentsUrl, {
                    method: 'POST',
                    body: formData
                  }).then(response => response.json())
                    .then(data => {
                      if (data.files) {
                        api.doc.update(localId, ({attrs, marks}) => {
                          // @ts-ignore
                          data.files.forEach(file => {
                            // @ts-ignore
                            attrs.parameters.items.push({
                              fileName: file.fileName,
                              filePath: file.filePath,
                              fileStoragePath: file.fileStoragePath,
                              fileUploadedAt: file.fileUploadedAt,
                              fileOwner: file.fileOwner
                            })
                          })

                          // @ts-ignore
                          let newParams: AttachmentsParams = JSON.parse(JSON.stringify(attrs.parameters))
                          newParams.currentLocalId = newLocalId

                          console.log(111, adf, attrs, newParams)

                          return {
                            attrs: {
                              // @ts-ignore
                              extensionType: attrs.extensionType,
                              // @ts-ignore
                              extensionKey: attrs.extensionKey,
                              // @ts-ignore
                              text: attrs.text,
                              localId: newLocalId,
                              // @ts-ignore
                              parameters: newParams,
                            },
                          }
                        });
                      }

                    });
                }
                inputElement.remove()
              });
              document.body.appendChild(inputElement);

              // @ts-ignore
              inputElement.value = ''
              // @ts-ignore
              inputElement.click()
            },
          },
        ],
      },
    ],
  },
};

if ((manifest as any)?.modules?.nodes['attachments-default']) {
  (manifest as any).modules.nodes['attachments-default'].__hideFrame = true;
}

export default manifest;
