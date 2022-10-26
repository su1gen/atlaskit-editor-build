import {InlineCommentViewComponentProps} from "@atlaskit/editor-core";
import * as React from "react";
import Button from "@atlaskit/button/standard-button";
import {UserInfo} from "./user-info";
import { annotationsList } from '../App'

export class ShowCommentView extends React.Component<any, any> {
  private onDelete: any;
  private onResolve: any;
  private onClose: any;
  private annotations: any;
  private getAnnotationUrl: string | undefined;
  private resolveAnnotationUrl: string | undefined;
  private deleteAnnotationUrl: string | undefined;
  private access_token: string | undefined | null;

  constructor(props: InlineCommentViewComponentProps) {
    super(props);

    this.onDelete = props.onDelete;
    this.onResolve = props.onResolve;
    this.onClose = props.onClose;
    this.annotations = props.annotations;
    this.state = {
      annotationData: null
    }
    this.getAnnotationUrl = (document.querySelector('#edit-document-form') as HTMLElement)?.dataset?.atlaskitGetAnnotation
    this.resolveAnnotationUrl = (document.querySelector('#edit-document-form') as HTMLElement)?.dataset?.atlaskitResolveAnnotation
    this.deleteAnnotationUrl = (document.querySelector('#edit-document-form') as HTMLElement)?.dataset?.atlaskitDeleteAnnotation
    this.access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
  }

  componentDidMount() {
    if (this.getAnnotationUrl) {
      fetch(`${this.getAnnotationUrl}?annotationKey=${this.annotations[0].id}`)
        .then(response => response.json())
        .then(data => {
          this.setState({
            annotationData: data
          })
        });
    }
  }

  render() {
    if (!this.state.annotationData || this.state.annotationData.error) {
      return null;
    }

    const onPopupClose = () => {
      this.onClose();
    };

    const onPopupResolve = () => {
      if (this.resolveAnnotationUrl && this.access_token){
        let annotationData = {
          key: this.annotations[0].id,
        }

        fetch(this.resolveAnnotationUrl, {
          method: 'PATCH',
          headers: {
            'X-CSRF-TOKEN': this.access_token,
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(annotationData)
        }).then(response => response.json())
          .then(data => {
            if (data.isResolved){
              this.onResolve(this.annotations[0].id);
            } else {
              console.error(data.error.message)
            }
          })
      } else {
        console.error('There is no url for creating annotations')
      }
    };

    const onPopupDelete = () => {
      if (this.deleteAnnotationUrl && this.access_token){
        let annotationData = {
          key: this.annotations[0].id,
        }

        fetch(this.deleteAnnotationUrl, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': this.access_token,
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(annotationData)
        }).then(response => response.json())
          .then(data => {
            if (data.isDeleted){
              console.log(this.annotations, annotationsList)
              this.onDelete(this.annotations[0].id);
            } else {
              console.error(data.error.message)
            }
          })
      } else {
        console.error('There is no url for creating annotations')
      }
    };


    return (
      <div className={'annotation-popup'}>
        <UserInfo avatarSrc={this.state.annotationData.avatar.avatarSrc}
                  userName={this.state.annotationData.name}
                  isAvatarLink={this.state.annotationData.avatar.isAvatarLink}></UserInfo>
        <div className={'annotation-popup__text'}>{this.state.annotationData.text}</div>
        <div className={'annotation-popup__buttons'}>
          {/*<Button appearance="primary" onClick={onPopupResolve}>*/}
          {/*  Resolve*/}
          {/*</Button>*/}
          <Button appearance="primary" onClick={onPopupDelete}>
            Delete
          </Button>
          <Button appearance="primary" onClick={onPopupClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }
}
