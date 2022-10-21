import {InlineCommentViewComponentProps} from "@atlaskit/editor-core";
import * as React from "react";
import Button from "@atlaskit/button/standard-button";
import {Avatar} from "./avatar";

export class ShowCommentView extends React.Component<any, any> {
  private onDelete: any;
  private onResolve: any;
  private onClose: any;
  private annotations: any;

  constructor(props: InlineCommentViewComponentProps) {
    super(props);

    this.onDelete = props.onDelete;
    this.onResolve = props.onResolve;
    this.onClose = props.onClose;
    this.annotations = props.annotations;
    this.state = {
      annotationData: null
    }
  }

  componentDidMount() {
    let getAnnotationUrl = (document.querySelector('#edit-document-form') as HTMLElement)?.dataset?.atlaskitGetAnnotation
    if (getAnnotationUrl) {
      fetch(`${getAnnotationUrl}?annotationKey=${this.annotations[0].id}`)
        .then(response => response.json())
        .then(data => {
          this.setState({
            annotationData: data
          })
        });
    }
  }

  render() {
    if (!this.state.annotationData) {
      return null;
    }

    const onPopupClose = () => {
      this.onClose();
    };

    const onPopupResolve = () => {
      this.onResolve(this.annotations[0].id);
    };

    const onPopupDelete = () => {
      this.onDelete(this.annotations[0].id);
    };


    return (
      <div className={'annotation-popup'}>
        {/*<AvatarItem*/}
        {/*  avatar={*/}
        {/*    <Avatar*/}
        {/*      src={this.state.annotationData.avatar}*/}
        {/*      presence="online"*/}
        {/*    />*/}
        {/*  }*/}
        {/*  primaryText={this.state.annotationData.name}*/}
        {/*/>*/}
        <Avatar src={this.state.annotationData.avatar.avatarSrc}></Avatar>
        <div style={{padding: '8px'}}>{this.state.annotationData.text}</div>
        <div style={{padding: '4px'}}>
          <Button appearance="primary" onClick={onPopupResolve}>
            Resolve
          </Button>
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
