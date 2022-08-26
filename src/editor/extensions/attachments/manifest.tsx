import {ExtensionAPI, ExtensionManifest} from '@atlaskit/editor-common/extensions';
import renderExtensionModule, {AttachmentsItem, AttachmentsParams} from './extension-handler';
import {ExtensionModuleActionHandler} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest";
import {ADFEntity} from "@atlaskit/adf-utils/types";
// @ts-ignore
import {v4 as uuidv4} from 'uuid';

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

const downloadFile = (attachmentUrl: string, attachmentItems: Array<AttachmentsItem> | undefined, attachmentId: string) => {
  if (attachmentItems) {

    let attachmentFullUrl = attachmentUrl + '?'

    attachmentItems.forEach(item => {
      attachmentFullUrl += `attachmentPaths[]=${item.fileStoragePath}&attachmentFileNames[]=${item.fileName}&`
    })

    attachmentFullUrl += `attachmentId=${attachmentId}`

    const a = document.createElement('a')
    a.style.display = "none"
    a.href = attachmentFullUrl
    // @ts-ignore
    a.download = attachmentUrl.split('/').pop()
    console.log(a)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)


    // fetch(attachmentUrl)

    // let access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
    // const formData = new FormData();
    //
    // let oldAttachments = []
    //
    // for (const item of attachmentItems) {
    //   oldAttachments.push({
    //     "fileName": item.fileName,
    //     "fileStoragePath": item.fileStoragePath
    //   })
    // }
    //
    // // @ts-ignore
    // formData.append("_token", access_token);
    // formData.append("attachmentId", attachmentId);
    // formData.append('attachments', JSON.stringify(oldAttachments))
    //
    //
    // fetch(attachmentUrl, {
    //   method: 'POST',
    //   body: formData
    // }).then(response => response.json())
    //   .then(data => {
    //     if (data.archivePath) {
    //       const a = document.createElement('a')
    // a.style.display = "none"
    //       a.href = data.archivePath
    //       // @ts-ignore
    //       a.download = data.archivePath.split('/').pop()
    //       console.log(a)
    //       document.body.appendChild(a)
    //       a.click()
    //       document.body.removeChild(a)
    //     }
    //   })
  }
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
                // console.log(attachmentsUrl + `?attachmentId=${localId}`)
                downloadFile(attachmentsUrl, adf.attrs?.parameters?.items, localId)
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
                let roller = document.querySelector(`.attachments__container[data-attachment-local-id="${localId}"] .lds-roller`)

                // @ts-ignore
                if (inputElement.files && attachmentsUrl && access_token) {
                  if (roller) {
                    roller.classList.remove('hide')
                  }
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
                  if (currentAttachments) {
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
                              fileOwner: file.fileOwner,
                              fileType: file.fileType,
                            })
                          })

                          // @ts-ignore
                          let newParams: AttachmentsParams = JSON.parse(JSON.stringify(attrs.parameters))
                          newParams.currentLocalId = newLocalId
                          if (roller) {
                            roller.classList.add('hide')
                          }

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
