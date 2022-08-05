import React from 'react';
import {ExtensionComponentModule} from "../types";

type AttachmentsItem = {
  fileName: string;
  fileUploadedAt: string;
  fileOwner: string;
}

export type AttachmentsParams = {
  items: Array<AttachmentsItem>;
};

export interface Attachments {
  id: string;
  src: string;
}

const renderExtensionModule: ExtensionComponentModule<any> = Promise.resolve(props => {
  const attachments: AttachmentsParams = {} as AttachmentsParams;

  attachments.items = [
    {
      fileName: "first",
      fileUploadedAt: "Jun 07, 2022",
      fileOwner: "Ivan Petrov"
    },
    {
      fileName: "second",
      fileUploadedAt: "Jun 07, 2022",
      fileOwner: "Ivan Petrov"
    },
    {
      fileName: "third",
      fileUploadedAt: "Jun 07, 2022",
      fileOwner: "Ivan Petrov"
    },
  ]

  return (
    <div className="attachments__container">
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

          {attachments.items.map(function(item, idx){
            return (
              <div className="attachment-row">
                <div className="expand-column attachment-summary-toggle"></div>
                <div className="filename-column">
                  <p>
                    <span className="icon icon-file-image hide-icons"></span>
                    <a className="filename" href="" title="Download">
                      {item.fileName}
                    </a>
                  </p>
                </div>
                <div className="attachment-created modified-column">
                  <span className="hide-icons">{item.fileUploadedAt}</span>
                  <span className="attachments-by">by</span>
                  <a href="" className="url fn confluence-userlink">{item.fileOwner}</a>
                </div>
              </div>
            )
          })}
        </div>
        <div className="attachments__buttons">
          <div className="attachments__download">
            <button className="attachments__buttons-item"
               title="Download all the latest versions of attachments on this page as single zip file.">Download All</button>
          </div>
          <div className="attachments__upload">
            <button className="attachments__buttons-item"
               title="Download all the latest versions of attachments on this page as single zip file.">Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
})


export default renderExtensionModule;
