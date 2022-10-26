import {InlineCommentCreateComponentProps} from "@atlaskit/editor-core";
import * as React from "react";
import TextArea from "@atlaskit/textarea";
import Button from "@atlaskit/button/standard-button";
import { v4 as uuidv4 } from 'uuid';
import { annotationsList } from '../App'

export class CreateCommentView extends React.Component<any, any> {
  private onCreate: any;
  private onClose: any;
  private annotationText = ''

  constructor(props: InlineCommentCreateComponentProps) {
    super(props);

    this.onCreate = props.onCreate;
    this.onClose = props.onClose;
  }

  render() {
    const onCreateAnnotation = () => {
      if (this.annotationText.trim().length === 0){
        return console.error('Insert annotation text')
      }

      const key = uuidv4();
      const createAnnotationUrl = (document.querySelector('#edit-document-form') as HTMLElement)?.dataset?.atlaskitCreateAnnotation
      const access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")

      if (createAnnotationUrl && access_token){
        let annotationData = {
          key,
          text: this.annotationText.trim(),
          //@ts-ignore
          documentId: window.Laravel.documentId,
        }

        fetch(createAnnotationUrl, {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': access_token,
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(annotationData)
        }).then(response => response.json())
          .then(data => {
            if (data.isCreated){
              annotationsList.push({
                id: key,
                isResolved: false,
              })
              this.onCreate(key);

              var el = document.querySelector(".ProseMirror")!
              var range = document.createRange()
              var sel = window.getSelection()!

              range.setStart(el.childNodes[0], 0)

              sel.removeAllRanges()
              sel.addRange(range)

            } else {
              console.error(data.error.message)
            }
            this.annotationText = ''
          })
      } else {
        console.error('There is no url for creating annotations')
      }
    };

    const onPopupClose =() => {
      this.onClose();
    };

    return (
      <div className={'annotation-popup'} >
        <div style={{paddingBottom: '10px'}}>
          <TextArea
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              this.annotationText = event.target.value
            }
          />
        </div>
        <div className={'annotation-popup__buttons'}>
          <Button appearance="primary" onClick={onCreateAnnotation}>
            Save
          </Button>
          <Button appearance="primary" onClick={onPopupClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }
}