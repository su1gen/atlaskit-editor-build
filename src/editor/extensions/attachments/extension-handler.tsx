import React from 'react';
import {ExtensionComponentModule} from "../types";

type AttachmentsItem = {
  fileName: string;
  filePath: string;
  fileStoragePath: string;
  fileUploadedAt: string;
  fileOwner: string;
}

export type AttachmentsParams = {
  items: Array<AttachmentsItem>;
  currentLocalId: string;
};

const renderExtensionModule: ExtensionComponentModule<any> = Promise.resolve(props => {
  const {parameters} = props.node;

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
          {parameters.items && parameters.items.map(function(item: AttachmentsItem, idx: number){
            return (
              <div className="attachment-row">
                <div className="expand-column attachment-summary-toggle"></div>
                <div className="filename-column">
                  <p>
                    <span className="icon icon-file-image hide-icons"></span>
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
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
})


export default renderExtensionModule;
