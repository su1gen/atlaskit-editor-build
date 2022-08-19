import * as React from "react";
import {Editor, WithEditorActions} from "@atlaskit/editor-core";
// import {getExtensionProviders} from "../extensions/get-extensions-provider";
// import customInsertMenuItems from "../extensions/menu-items";
import {IntlProvider} from "react-intl-next";
import {MockMentionResource} from "../../Mention";
import {getExtensionProviders} from "../extensions/get-extensions-provider";
import customInsertMenuItems from "../extensions/menu-items";

const setExpandEvents = () => {
  let expandItems = document.querySelectorAll('.document-content-public .ak-editor-expand')
  if (expandItems) {
    expandItems.forEach(item => {
      let expandButton = item.querySelector('.ak-expand-button')
      if (expandButton) {
        expandButton.addEventListener('click', () => {
          item.classList.toggle('ak-editor-expand__expanded')
        })
      }
    })
  }
}


export default class AtlassianEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      contentLoaded: false,
      usersLoaded: false,
      content: undefined,
      users: []
    };
  }

  getContent() {
    //@ts-ignore
    const room = `coch-org-document-${window.Laravel.docId}`

    fetch(`https://n.coch.org/document-room/${room}`)
      .then((response) => {
        return response.json();
      })
      .then(responseData => {
        if (!responseData.isRoomExist) {
          // @ts-ignore
          let editDocumentForm = document.querySelector("#edit-document-form")
          if (editDocumentForm) {
            // @ts-ignore
            let getDraftURL = editDocumentForm.dataset.getDraft
            if (getDraftURL) {
              fetch(getDraftURL)
                .then((response) => {
                  return response.json();
                })
                .then(draftData => {
                  // @ts-ignore
                  if (draftData?.document?.content) {
                    this.setState({
                      contentLoaded: true,
                      // @ts-ignore
                      content: JSON.parse(draftData.document.content),
                    })
                  }  else {
                    this.setState({
                      contentLoaded: true,
                    })
                  }
                })
            }
          }
        } else {
          this.setState({
            contentLoaded: true,
          })
        }
      })
  }

  getUsers() {
    //@ts-ignore
    fetch(window.location.origin.includes('localhost')
      ? 'https://coch.it-horov.tech/users' : `${window.location.origin}/users`)
      .then(res => {
        return res.json()
      })
      .then(users => {
        // @ts-ignore
        let usersArray = users.data.map(({id, name, nickname, last_name, avatar}) => {
          return {
            id,
            name,
            nickname: '',
            mentionName: last_name,
            avatarUrl: `https://cochorg.wn.staj.fun/storage/preview/${avatar}`
          }
        })
        this.setState({
          usersLoaded: true,
          users: usersArray,
        })
      })
    // this.setState({
    //   usersLoaded: true,
    //   users: [],
    // })
  }

  componentDidMount() {
    this.getContent()
    this.getUsers()
  }

  render() {
    if (!this.state.contentLoaded || !this.state.usersLoaded) {
      return <h2>Loading...</h2>;
    }
    if (this.state.contentLoaded && this.state.usersLoaded) {
      return (
        <IntlProvider locale="en">
          <Editor
            appearance="full-page"

            extensionProviders={() => [
              getExtensionProviders(),
            ]}
            //@ts-ignore
            insertMenuItems={customInsertMenuItems}
            allowExtension={{
              allowAutoSave: true,
              allowExtendFloatingToolbars: true,
            }}

            defaultValue={this.state.content}
            placeholder='Write something...'

            mentionProvider={Promise.resolve(new MockMentionResource({
              minWait: 10,
              maxWait: 25,
            }, this.state.users))}

            waitForMediaUpload={true}
            allowTextColor={{
              allowMoreTextColors: true,
            }}
            allowLayouts={true}
            allowTables={{
              advanced: true,
              allowColumnResizing: true,
              allowMergeCells: true,
              allowNumberColumn: true,
              allowBackgroundColor: true,
              allowHeaderRow: true,
              allowHeaderColumn: true,
              permittedLayouts: 'all',
              stickToolbarToBottom: true,
              allowColumnSorting: true,
              stickyHeaders: true,
              allowCollapse: true,
              // tableCellOptimization: true,


              // allowColumnSorting: true,
              // allowAddColumnWithCustomStep: true,


              // isHeaderRowRequired: true,
              // allowControls: true,
              // stickyHeaders: true,


              // allowCellOptionsInFloatingToolbar: true,
              // tableCellOptimization: true,
              // tableRenderOptimization: true,
              // stickyHeadersOptimization: true,
              // initialRenderOptimization: true,
              // mouseMoveOptimization: true,
              // tableOverflowShadowsOptimization: true,
              // allowDistributeColumns: true,

            }}
            allowExpand={{
              allowInsertion: true,
              allowInteractiveExpand: true,
            }}
            // taskDecisionProvider={taskDecisionProvider}
            // allowTasksAndDecisions
            media={{
              // @ts-ignore
              // provider: mediaProvider,
              // useMediaPickerPopup: false,
              // allowMediaGroup: true,
              allowLinking: true,
              // allowBreakoutSnapPoints: true,
              // allowRemoteDimensionsFetch: true,
              fullWidthEnabled: true,
              // enableDownloadButton: true,
              // alignLeftOnInsert: true,
              // useForgePlugins: true,
              featureFlags: {
                captions: true,
              },
              // allowResizing: true,
              allowMediaSingle: true,
              // allowDropzoneDropLine: true,
              isCopyPasteEnabled: true,
              // allowResizingInTables: true,
              allowLazyLoading: true,
              allowAdvancedToolBarOptions: true,
              // allowMediaSingleEditable: true,
              // allowMarkingUploadsAsIncomplete: true,
              waitForMediaUpload: true,
              // allowAltTextOnImages: true,
            }}
            primaryToolbarComponents={
              <WithEditorActions
                render={actions => (
                  <div>
                    <button
                      onClick={async () => {
                        let currentContent = await actions.getValue()
                        console.log(currentContent)
                        let currentDataElement = document.querySelector("#current-data")
                        if (currentDataElement){
                          currentDataElement.innerHTML = JSON.stringify(currentContent, null, 4)
                        }
                      }
                      }>
                    Get data
                    </button>
                    <button
                      id={"ak-publish-document"}
                      onClick={async () => {
                        let currentContent = await actions.getValue()
                        // @ts-ignore
                        let updateContentURL = document.querySelector("#edit-document-form")?.dataset.updateContent
                        let access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
                        if (currentContent && updateContentURL && access_token) {

                          let data = {
                            'document': currentContent,
                            '_method': 'PUT'
                          }

                          fetch(updateContentURL, {
                            method: 'POST',
                            headers: {
                              'X-CSRF-TOKEN': access_token,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                          })
                            .then(response => response.json())
                            .then(data => {
                              let documentContentWrapper = document.querySelector(".document-content-public .srm-description__content-inner")

                              if (documentContentWrapper) {
                                documentContentWrapper.innerHTML = data.data.document.content

                                setExpandEvents()

                                const documentContentLoad = document.querySelector('.document-content')

                                // @ts-ignore
                                documentContentLoad.classList.toggle('show-draft')
                              }
                            })
                        }
                      }}
                    >
                      Publish
                    </button>
                  </div>
                )}
              />
            }
          />
        </IntlProvider>
      );
    }
  }
}
