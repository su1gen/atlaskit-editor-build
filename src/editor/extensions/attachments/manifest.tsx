import {
  ExtensionAPI,
  ExtensionManifest,
} from '@atlaskit/editor-common/extensions';
import renderExtensionModule, {AttachmentsItem, AttachmentsParams} from './extension-handler';
import {ExtensionModuleActionHandler} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest";
import {ADFEntity} from "@atlaskit/adf-utils/types";
// @ts-ignore
import {v4 as uuidv4} from 'uuid';
import './attachments-styles.css'

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
  }
}

export function getFileClasses(item: AttachmentsItem){
  let fileClasses = "icon hide-icons ";

  if (item.fileType.includes('image')){
    fileClasses += 'icon-file-image'
  } else if(item.fileType.includes('video')){
    fileClasses += 'icon-file-multimedia'
  } else if(item.fileType.includes('pdf')){
    fileClasses += 'icon-file-pdf'
  } else if(item.fileType.includes('msword')){
    fileClasses += 'icon-file-word97'
  } else if(item.fileType.includes('vnd.ms-excel')){
    fileClasses += 'icon-file-excel97'
  } else if(item.fileType.includes('powerpoint')){
    fileClasses += 'icon-file-powerpoint97'
  } else if(item.fileType.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')){
    fileClasses += 'icon-file-word'
  } else if(item.fileType.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')){
    fileClasses += 'icon-file-excel'
  } else if(item.fileType.includes('vnd.openxmlformats-officedocument.presentationml.presentation')){
    fileClasses += 'icon-file-powerpoint'
  } else if(item.fileType.includes('html') || item.fileType.includes('javascript')
    || item.fileType.includes('css') || item.fileType.includes('xml')){
    fileClasses += 'icon-file-web'
  } else if(item.fileType.includes('rar') || item.fileType.includes('zip')){
    fileClasses += 'icon-file-archive'
  } else {
    fileClasses += 'icon-file-unknown'
  }

  return fileClasses
}


const generateAttachmentModalContent = (items: AttachmentsItem[]) => {

  let modalContent = `<div class="attachments__container attachments-modal-container" extensiontype="attachments.extension">
                    <div class="attachments__table attachments">
                        <div class="header-row">
                          <div class="expand-column attachment-summary-toggle"></div>
                          <div class="filename-column">File</div>
                          <div class="modified-column">Uploaded</div>
                        </div>
                        <div class="attachments__table-content">`

  items.forEach(item => {
    modalContent += `<div class="attachment-row" data-file-storage-path="${item.fileStoragePath}" data-file-name="${item.fileName}">
          <button class="delete-attachment-button" type="button" tabindex="0">
            <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                <path d="M7 7h10a1 1 0 010 2H7a1 1 0 110-2zm2.78 11a1 1 0 01-.97-.757L7.156 10.62A.5.5 0 017.64 10h8.72a.5.5 0 01.485.621l-1.656 6.622a1 1 0 01-.97.757H9.781zM11 6h2a1 1 0 011 1h-4a1 1 0 011-1z" fill="currentColor" fill-rule="evenodd"></path>
            </svg>
          </button>
          <div class="filename-column">
            <p>
              <span class="${getFileClasses(item)}"></span>
              <a target="_blank" class="filename" href="${item.filePath}">
                  ${item.fileName}
              </a>
            </p>
          </div>
          <div class="attachment-created modified-column">
            <span class="hide-icons">${item.fileUploadedAt}</span>
             <span class="attachments-by">by</span>
             <a href="" class="url fn confluence-userlink">${item.fileOwner}</a>
         </div>
        </div>`
  })


  modalContent += `</div></div>
        <div class="roller-wrapper hide">
          <div class="lds-roller pre-cover">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>`


  return modalContent
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

                          if (localId.startsWith("myID-")){
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
                          } else {
                            let newItems: AttachmentsItem[] = []

                            // @ts-ignore
                            data.files.forEach(file => {
                              // @ts-ignore
                              newItems.push({
                                fileName: file.fileName,
                                filePath: file.filePath,
                                fileStoragePath: file.fileStoragePath,
                                fileUploadedAt: file.fileUploadedAt,
                                fileOwner: file.fileOwner,
                                fileType: file.fileType,
                              })
                            })

                            // @ts-ignore
                            attrs.parameters.items = newItems

                          }

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
          {
            key: 'attachment-button-3',
            display: 'icon',
            label: 'Delete attachments',
            tooltip: 'Delete attachments',
            icon: () => import('@atlaskit/icon/glyph/editor/edit').then((mod) => mod.default),
            action: async (adf: ADFEntity, api: ExtensionAPI) => {
              let localId: string = adf.attrs?.localId || '';
              let currentAttachmentItems: AttachmentsItem[] = adf.attrs?.parameters?.items

              let removeAttachmentsModal = document.querySelector('#popUp-remove-attachments')

              if (removeAttachmentsModal) {
                let modalContent = generateAttachmentModalContent(currentAttachmentItems)

                // @ts-ignore
                let modalBlockForInsert = removeAttachmentsModal.querySelector('.modal-content')
                if (modalBlockForInsert) {
                  // @ts-ignore
                  modalBlockForInsert.innerHTML = ''
                  modalBlockForInsert.insertAdjacentHTML('afterbegin', modalContent)

                  let attachmentsContent = modalBlockForInsert.querySelector('.attachments-modal-container')
                  if (attachmentsContent) {
                    attachmentsContent.addEventListener('click', e => {
                      // @ts-ignore
                      let deleteButton = e.target.closest('.delete-attachment-button')
                      if (deleteButton) {
                        let currentItem = deleteButton.closest('.attachment-row')
                        if (currentItem) {

                          // @ts-ignore
                          let deleteAttachmentUrl = document.querySelector("#edit-document-form")?.dataset?.atlaskitDeleteAttachments
                          let access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
                          let roller = document.querySelector(`#popUp-remove-attachments .roller-wrapper`)

                          if (deleteAttachmentUrl && access_token){

                            if (roller) {
                              roller.classList.remove('hide')
                            }

                            if (!localId.startsWith('myID-')){
                              currentAttachmentItems = currentAttachmentItems.filter((item: AttachmentsItem) => item.fileStoragePath !== currentItem.dataset.fileStoragePath)
                              const newLocalId = uuidv4();
                              api.doc.update(localId, ({attrs, marks}) => {
                                localId = newLocalId
                                return {
                                  attrs: {
                                    // @ts-ignore
                                    extensionType: attrs.extensionType,
                                    // @ts-ignore
                                    extensionKey: attrs.extensionKey,
                                    // @ts-ignore
                                    text: attrs.text,
                                    // @ts-ignore
                                    localId: newLocalId,
                                    // @ts-ignore
                                    parameters: {
                                      items: currentAttachmentItems,
                                      // // @ts-ignore
                                      currentLocalId: newLocalId
                                    },
                                  },
                                }
                              });
                              currentItem.remove()
                              if (roller) {
                                roller.classList.add('hide')
                              }
                            } else {
                              const newLocalId = "myID-" + uuidv4();
                              const formData = new FormData();
                              formData.append('_token', access_token);
                              formData.append('fileStoragePath', currentItem.dataset.fileStoragePath);
                              formData.append('newAttachmentId', newLocalId);
                              formData.append('oldAttachmentId', localId);
                              // @ts-ignore
                              formData.append('documentId', window.Laravel.docId)

                              fetch(deleteAttachmentUrl, {
                                method: 'POST',
                                body: formData
                              }).then(response => response.json())
                                .then(data => {
                                  if(data.isDeleted){
                                    currentAttachmentItems = currentAttachmentItems.filter((item: AttachmentsItem) => item.fileStoragePath !== currentItem.dataset.fileStoragePath)

                                    api.doc.update(localId, ({attrs, marks}) => {
                                      localId = newLocalId
                                      return {
                                        attrs: {
                                          // @ts-ignore
                                          extensionType: attrs.extensionType,
                                          // @ts-ignore
                                          extensionKey: attrs.extensionKey,
                                          // @ts-ignore
                                          text: attrs.text,
                                          // @ts-ignore
                                          localId: newLocalId,
                                          // @ts-ignore
                                          parameters: {
                                            items: currentAttachmentItems,
                                            // // @ts-ignore
                                            currentLocalId: newLocalId
                                          },
                                        },
                                      }
                                    });
                                    currentItem.remove()
                                  } else {
                                    console.error(data.error)
                                  }

                                  if (roller) {
                                    roller.classList.add('hide')
                                  }

                                })
                            }


                          }
                        }
                      }
                    })
                  }

                }

                removeAttachmentsModal.classList.remove('hide')

              }

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
