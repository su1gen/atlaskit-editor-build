import React from 'react';
import {ExtensionComponentModule} from "../types";
import {ExtensionAPI as api} from "@atlaskit/editor-common/extensions";

export type AttachmentsItem = {
  fileName: string;
  filePath: string;
  fileStoragePath: string;
  fileUploadedAt: string;
  fileOwner: string;
  fileType: string;
}

export type AttachmentsParams = {
  items: Array<AttachmentsItem>;
  currentLocalId: string;
};

const renderExtensionModule: ExtensionComponentModule<any> = Promise.resolve(props => {
  const {localId, parameters} = props.node;
  //@ts-ignore
  let deleteAttachmentUrl = document.querySelector("#edit-document-form")?.dataset?.atlaskitDeleteAttachments
  let access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")

  return (
    <div className="attachments__container" data-attachment-local-id={localId}>
      <div className="attachments__table attachments">
        <div className="header-row">
          <div className="expand-column attachment-summary-toggle"></div>
          <div className="filename-column">
            File
          </div>
          <div className="modified-column">
            Uploaded
          </div>
        </div>
        <div className="attachments__table-content">
          {parameters.items && parameters.items.map(function(item: AttachmentsItem, idx: number){

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

            return (
              <div className="attachment-row">
                <div className="expand-column attachment-summary-toggle"></div>
                <div className="filename-column">
                  <p>
                    <span className={fileClasses}></span>
                    <a className="filename" href={item.filePath} title="Download">
                      {item.fileName}
                    </a>
                  </p>
                </div>
                <div className="attachment-created modified-column">
                  <span className="hide-icons">{item.fileUploadedAt}</span>
                  <span className="attachments-by">by</span>
                  <a href="" className="url fn confluence-userlink">{item.fileOwner}</a>
                </div>
                {/*<div className="attachment-delete">*/}
                {/*  <button className="attachment-delete-button"*/}
                {/*          onClick={() => {*/}
                {/*            // @ts-ignore*/}
                {/*            console.log(this)*/}
                {/*            // if (deleteAttachmentUrl && access_token) {*/}
                {/*            //   const formData = new FormData();*/}
                {/*            //   // @ts-ignore*/}
                {/*            //   formData.append("_token", access_token);*/}
                {/*            //   formData.append('attachmentGooglePath', item.fileStoragePath)*/}
                {/*            //   formData.append('attachmentViewPath', item.filePath)*/}
                {/*            //*/}
                {/*            //   fetch(deleteAttachmentUrl, {*/}
                {/*            //     method: 'DELETE',*/}
                {/*            //     body: formData*/}
                {/*            //   }).then(response => response.json())*/}
                {/*            //     .then(data => {*/}
                {/*            //*/}
                {/*            //     });*/}
                {/*            // }*/}
                {/*          }}>*/}
                {/*    <svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M7 7h10a1 1 0 010 2H7a1 1 0 110-2zm2.78 11a1 1 0 01-.97-.757L7.156 10.62A.5.5 0 017.64 10h8.72a.5.5 0 01.485.621l-1.656 6.622a1 1 0 01-.97.757H9.781zM11 6h2a1 1 0 011 1h-4a1 1 0 011-1z" fill="currentColor" fill-rule="evenodd"></path></svg>*/}
                {/*  </button>*/}
                {/*</div>*/}
              </div>
            )
          })}
        </div>
      </div>
      <div className="lds-roller pre-cover hide">
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
  );
})


export default renderExtensionModule;
