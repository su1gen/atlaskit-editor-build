import {Plugin, Selection} from "prosemirror-state"
import {toggleMark, setBlockType} from "prosemirror-commands"
import {EditorView} from 'prosemirror-view'
import {MarkType, Schema} from "prosemirror-model"

import "./styles.css"

class SelectionTooltip {
  private tooltip: HTMLElement
  private markButtons: NodeListOf<HTMLElement>
  private items: any[]
  private boldIcon = '<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8 6h4.832C13.908 6 16 6.5 16 9c0 1.333-.333 2.167-1 2.5 1.333.333 2 1.333 2 3 0 .5 0 3.5-4 3.5H8a1 1 0 01-1-1V7a1 1 0 011-1zm1 10h3.5c1 0 2-.25 2-1.5s-1.104-1.5-2-1.5H9v3zm0-4.975h3c.504 0 2 0 2-1.525S12 8 12 8H9v3.025z" fill="currentColor" fill-rule="evenodd"/></svg>'
  private italicIcon = '<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M10 6h6a1 1 0 010 2h-6a1 1 0 110-2zM8 16h6a1 1 0 010 2H8a1 1 0 010-2zm4-8h2l-2 8h-2l2-8z" fill="currentColor" fill-rule="evenodd"/></svg>'
  private underlineIcon = '<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M7 7a1 1 0 112 0v4c0 1.884.93 3 3 3s3-1.116 3-3V7a1 1 0 012 0v4c0 2.916-1.737 5-5 5s-5-2.084-5-5V7zm0 10h10a1 1 0 010 2H7a1 1 0 010-2z" fill="currentColor"/></svg>'
  private strikeIcon = '<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8.58 11H6a1 1 0 000 2h6.327c1.295.34 1.847.822 1.847 1.642 0 .958-.872 1.648-2.075 1.648-1.008 0-1.779-.398-2.127-1.056-.19-.361-.522-.624-.93-.624h-.16c-.484 0-.868.46-.731.925C8.602 17.068 10.013 18 11.986 18 14.464 18 16 16.614 16 14.388c0-.532-.081-.991-.253-1.388H18a1 1 0 000-2h-5.556l-.564-.145c-1.268-.324-1.784-.775-1.784-1.544 0-.975.778-1.608 1.953-1.608.871 0 1.544.383 1.86 1.027.174.356.499.612.894.612h.145c.486 0 .875-.463.729-.927C15.221 6.958 13.846 6 12.057 6 9.77 6 8.255 7.378 8.255 9.453c0 .597.107 1.11.325 1.547z" fill="currentColor" fill-rule="evenodd"/></svg>'
  private linkIcon = '<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M12.654 8.764a.858.858 0 01-1.213-1.213l1.214-1.214a3.717 3.717 0 015.257 0 3.714 3.714 0 01.001 5.258l-1.214 1.214-.804.804a3.72 3.72 0 01-5.263.005.858.858 0 011.214-1.214c.781.782 2.05.78 2.836-.005l.804-.803 1.214-1.214a1.998 1.998 0 00-.001-2.831 2 2 0 00-2.83 0l-1.215 1.213zm-.808 6.472a.858.858 0 011.213 1.213l-1.214 1.214a3.717 3.717 0 01-5.257 0 3.714 3.714 0 01-.001-5.258l1.214-1.214.804-.804a3.72 3.72 0 015.263-.005.858.858 0 01-1.214 1.214 2.005 2.005 0 00-2.836.005l-.804.803L7.8 13.618a1.998 1.998 0 00.001 2.831 2 2 0 002.83 0l1.215-1.213z" fill="currentColor"/></svg>'
  private activeColor = null

  private colors = [
    {name: "Dark gray", color: "#000000", shade: 'dark'},
    {name: "Dark blue", color: "#0747a6", shade: 'dark'},
    {name: "Dark teal", color: "#008da6", shade: 'dark'},
    {name: "Dark green", color: "#006644", shade: 'dark'},
    {name: "Orange", color: "#ff991f", shade: 'light'},
    {name: "Dark red", color: "#bf2600", shade: 'dark'},
    {name: "Dark purple", color: "#403294", shade: 'dark'},
    {name: "Light gray", color: "#97a0af", shade: 'dark'},
    {name: "Blue", color: "#4c9aff", shade: 'dark'},
    {name: "Teal", color: "#00b8d9", shade: 'dark'},
    {name: "Green", color: "#36b37e", shade: 'dark'},
    {name: "Yellow", color: "#ffc400", shade: 'light'},
    {name: "Red", color: "#ff5630", shade: 'dark'},
    {name: "Purple", color: "#6554c0", shade: 'dark'},
    {name: "White", color: "#ffffff", shade: 'light'},
    {name: "Light blue", color: "#b3d4ff", shade: 'light'},
    {name: "Light teal", color: "#b3f5ff", shade: 'light'},
    {name: "Light green", color: "#abf5d1", shade: 'light'},
    {name: "Light yellow", color: "#fff0b3", shade: 'light'},
    {name: "Light red", color: "#ffbdad", shade: 'light'},
    {name: "Light purple", color: "#eae6ff", shade: 'light'},
  ]


  constructor(private editorView: EditorView) {
    let schema: Schema = this.editorView.state.schema

    console.log(schema.marks)

    this.items = [
      {command: toggleMark(schema.marks.strong), dom: this.icon(this.boldIcon, "Bold", "strong")},
      {command: toggleMark(schema.marks.em), dom: this.icon(this.italicIcon, "Italic", "em")},
      {command: toggleMark(schema.marks.underline), dom: this.icon(this.underlineIcon, "Underline", "underline")},
      {command: toggleMark(schema.marks.strike), dom: this.icon(this.strikeIcon, "Strikethrough", "strike")},
      {command: "textColorEvent", dom: this.textColorMarkElement()},
      {command: "linkEvent", dom: this.linkMarkElement()},
      // {command: toggleMark(schema.marks.annotation, {annotationType: "inlineComment", id: "b81e1de8-9df7-4210-861d-89e13512ce33"}), dom: this.icon(this.strikeIcon, "Strikethrough", "strike")},
      // toggleMark(schema.marks.link, {href: 'http://google.com'})
      // {command: () => {showLinkingToolbarWithMediaTypeCheck(this.editorView.state)}, dom: this.icon(this.linkIcon, "Link", "link")},
      // {command: () => {showLinkingToolbarWithMediaTypeCheck}, dom: this.icon(this.linkIcon, "Link", "link")},
      // {command: showLinkingToolbarWithMediaTypeCheck, dom: this.icon(this.linkIcon, "Link", "link")},
      // {command: showLinkingToolbarWithMediaTypeCheck(this.editorView.state), dom: this.icon(this.linkIcon, "Link", "link")},
      // {command: setBlockType(schema.nodes.paragraph), dom: this.icon("p", "paragraph")},
      // heading(schema, 1), heading(schema, 2), heading(schema, 3),
      // {command: wrapIn(schema.nodes.blockquote), dom: this.icon(">", "blockquote")}
    ]

    let tooltipOuter = document.createElement("div")
    tooltipOuter.className = "tooltip"
    let tooltipWrapper = document.createElement("div")
    tooltipWrapper.className = "tooltip__wrapper"

    this.items.forEach(({dom}) => tooltipWrapper.appendChild(dom))

    tooltipOuter.appendChild(tooltipWrapper)

    this.tooltip = tooltipOuter
    this.markButtons = this.tooltip.querySelectorAll('.tooltip__button')
    this.editorView.dom.parentNode!.appendChild(this.tooltip)

    this.update(this.editorView, null)

    this.tooltip.addEventListener("click", e => {
      e.preventDefault()
      editorView.focus()
      //@ts-ignore
      if (e.target.classList.contains('color-list__item-button')){
        this.resetMark(schema.marks.textColor)
        //@ts-ignore
        this.applyMark(schema.marks.textColor, {color: e.target.dataset.color})
        let textColorWrapper = this.tooltip.querySelector('.tooltip__text-color-wrapper')
        if (textColorWrapper){
          textColorWrapper.classList.remove('tooltip__button-wrapper_active')
        }
        //@ts-ignore
      } else if(e.target.classList.contains('link-popup__button')){
        let linkInput: HTMLInputElement | null = this.tooltip.querySelector('.link-popup__input')
        if (linkInput && linkInput.value.trim()){
          let linkUrl = this.getValidURL(linkInput.value)
          if (linkUrl){
            this.resetMark(schema.marks.link)
            this.applyMark(schema.marks.link, {href: linkUrl})
          }
        }
        let linkWrapper = this.tooltip.querySelector('.tooltip__link-wrapper')
        if (linkWrapper){
          linkWrapper.classList.remove('tooltip__button-wrapper_active')
        }
        if (linkInput){
          linkInput.value = ''
        }

        //@ts-ignore
      } else if(e.target.closest('.link-popup')){
        let linkInput = this.tooltip.querySelector('.link-popup__input')
        //@ts-ignore
        linkInput.focus()
      } else {
        this.items.forEach(({command, dom}) => {
          if (dom.contains(e.target))
            if (command === "textColorEvent" || command === "linkEvent") {
              if (dom.classList.contains('tooltip__button-wrapper_active')){
                dom.classList.remove('tooltip__button-wrapper_active')
              } else {
                let activeButton = this.tooltip.querySelector('.tooltip__button-wrapper_active')
                if (activeButton && e.target !== activeButton){
                  activeButton.classList.remove('tooltip__button-wrapper_active')
                }
                dom.classList.add('tooltip__button-wrapper_active')
              }
            } else {
              command(editorView.state, editorView.dispatch, editorView)
            }
        })
      }
    })
  }

  resetMark(mark: MarkType){
    this.editorView.dispatch(this.editorView.state.tr.removeMark(
      this.editorView.state.selection.from,
      this.editorView.state.selection.to,
      mark
    ))
  }

  applyMark(mark: MarkType, attrs?: object){
    let dispatchCommand = toggleMark(mark, attrs)
    dispatchCommand(this.editorView.state, this.editorView.dispatch)
  }

  getValidURL(str: string): string | boolean {
    let inputString = str
    if (!inputString.startsWith('https://') && !inputString.startsWith('http://')){
      inputString = 'http://' + inputString
    }
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    if (pattern.test(str)){
      return inputString
    }

    return false
  }

  update(view: any, lastState: any) {
    // Don't do anything if the document/selection didn't change
    if (lastState && lastState.doc.eq(this.editorView.state.doc) &&
      lastState.selection.eq(this.editorView.state.selection)) return


    // Hide the tooltip if the selection is empty
    if (this.shouldHideTooltip(this.editorView.state.selection)) {
      this.tooltip.style.display = "none"
      let textColorWrapper = this.tooltip.querySelectorAll('.tooltip__button-wrapper')
      if (textColorWrapper.length > 0){
        textColorWrapper.forEach(item => {
          if (item.classList.contains('tooltip__button-wrapper_active')){
            item.classList.remove('tooltip__button-wrapper_active')
          }
        })
      }
      return
    }

    // Otherwise, reposition it and update its content
    this.tooltip.style.display = ""

    let {from, to} = this.editorView.state.selection

    let activeMarks = {
      strong: false,
      em: false,
      underline: false,
      strike: false,
      textColor: [],
    }

    this.editorView.state.doc.nodesBetween(from, to, (node, pos, parent, index) => {
      if (node.text && !node.marks.find(mark => mark.type.name === 'textColor')){
        // @ts-ignore
        activeMarks.textColor.push("#000000")
      }

      if (node.marks.length > 0) {
        node.marks.forEach((mark) => {
          if (mark.type.name !== 'link'){
            // @ts-ignore
            if (mark.type.name === 'textColor' && !activeMarks.textColor.includes(mark.attrs.color)){
              // @ts-ignore
              activeMarks[mark.type.name].push(mark.attrs.color)
            } else {
              // @ts-ignore
              activeMarks[mark.type.name] = true
            }
          }
        })
      }

      let textColorLine = this.tooltip.querySelector('.textcolor-button__color-line')

      if (activeMarks.textColor.length === 1){
        // @ts-ignore
        if (activeMarks.textColor.includes("#000000")){
          // @ts-ignore
          textColorLine.style.removeProperty('background')
        } else {
          // @ts-ignore
          textColorLine.style.background = activeMarks.textColor[0]
        }

        let activeColorButton = this.tooltip.querySelector(`.color-list__item-button[data-color="${activeMarks.textColor[0]}"]`)
        if (activeColorButton && !activeColorButton.classList.contains('color-list__item-button__active')){
          activeColorButton.classList.add('color-list__item-button__active')
        }

      } else {
        // @ts-ignore
        textColorLine.style.removeProperty('background')
        let activeColorButton = this.tooltip.querySelector(`.color-list__item-button__active`)
        if (activeColorButton){
          activeColorButton.classList.remove('color-list__item-button__active')
        }
      }
    })

    this.markButtons.forEach((button: HTMLElement) => {
      if (button.classList.contains('tooltip__button_active')) {
        // @ts-ignore
        if (!activeMarks[button.dataset.mark]) {
          button.classList.remove('tooltip__button_active')
        }
      } else {
        // @ts-ignore
        if (activeMarks[button.dataset.mark!]) {
          button.classList.add('tooltip__button_active')
        }
      }
    })


    // These are in screen coordinates
    let start = view.coordsAtPos(from)

    let wrapperLeft = 0
    let wrapper = document.querySelector('.akEditor')
    if (wrapper) {
      wrapperLeft = wrapper.getBoundingClientRect().left
    }
    // The box in which the tooltip is positioned, to use as base
    // @ts-ignore
    let box = this.tooltip.offsetParent.getBoundingClientRect()
    let tooltipBound = this.tooltip.getBoundingClientRect()

    if (start.left + tooltipBound.width + 20 > box.right){
      this.tooltip.style.left = start.left - wrapperLeft - tooltipBound.width + "px"
    } else {
      this.tooltip.style.left = start.left - wrapperLeft + "px"
    }
    this.tooltip.style.bottom = (box.bottom - start.top) + "px"
  }

  shouldHideTooltip(selection: Selection) {
    if (selection.empty || this.isContentProhibited(selection.content().content)) {
      return true
    }
  }

  isContentProhibited(content: any) {
    let isProhibited = false
    content.forEach((item: any) => {
      let contentItem = item

      if (this.editorView.state.selection.toJSON().type !== 'text') {
        isProhibited = true
      } else {
        while (true) {
          if (contentItem.hasOwnProperty('text')) {
            break
          } else {
            if (contentItem.type.name === 'codeBlock' || contentItem.content.content.length === 0) {
              isProhibited = true
              break
            } else {
              contentItem = contentItem.content.content[0]
            }
          }
        }
      }
    })
    return isProhibited
  }

  icon(text: string, title: string, markName: string) {
    let tooltipButton = document.createElement("button")
    tooltipButton.className = "tooltip__button"
    tooltipButton.dataset.mark = markName
    tooltipButton.title = title
    tooltipButton.innerHTML = text
    return tooltipButton
  }

  generateColorList(): string {
    let colorsList = `
        <div class="color-list__wrapper">
            <div class="color-list__items">`

    this.colors.forEach(item => {
      colorsList += `<div class="color-list__item"">
               <button class="color-list__item-button" 
               title="${item.name}" 
               style="background-color: ${item.color}" 
               data-color="${item.color}" 
               data-color-name="${item.name}"
               data-shade="${item.shade}"></button>
            </div>`
    })

    colorsList += `
            </div>
        </div>`

    return colorsList

  }

  textColorMarkElement(): HTMLElement {
    let textColorButtonWrapper = document.createElement("div")
    textColorButtonWrapper.className = "tooltip__button-wrapper tooltip__text-color-wrapper"
    let textColorButton = document.createElement("button")
    textColorButton.className = "tooltip__button tooltip__button_textcolor"
    // textColorButton.dataset.mark = markName
    textColorButton.title = "Text color"
    let buttonContent = `
        <div class="textcolor-button__wrapper">
            <div class="textcolor-button__icon-wrapper">
                <div class="textcolor-button__icon">
                    <svg width="24" height="24" role="presentation">
                        <path d="M14 12.5h-4l-.874 2.186A.5.5 0 0 1 8.66 15H7.273a.5.5 0 0 1-.456-.705l4.05-9A.5.5 0 0 1 11.323 5h1.354a.5.5 0 0 1 .456.295l4.05 9a.5.5 0 0 1-.456.705h-1.388a.5.5 0 0 1-.465-.314L14 12.5zm-.6-1.5L12 7.5 10.6 11h2.8z" fill="currentColor" fill-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="textcolor-button__color-line">
            
                </div>
            </div>
            <div class="textcolor-button__arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                       <path d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z" fill="currentColor" fill-rule="evenodd"></path>
                </svg>
            </div>
        </div>
    `
    let colorsList = this.generateColorList()

    textColorButton.insertAdjacentHTML("beforeend", buttonContent)
    textColorButtonWrapper.insertAdjacentElement("beforeend", textColorButton)
    textColorButtonWrapper.insertAdjacentHTML("beforeend", colorsList)

    return textColorButtonWrapper
  }

  linkMarkElement(): HTMLElement{
    let linkButtonWrapper = document.createElement("div")
    linkButtonWrapper.className = "tooltip__button-wrapper tooltip__link-wrapper"
    let linkButton = document.createElement("button")
    linkButton.className = "tooltip__button tooltip__button_link"
    // textColorButton.dataset.mark = markName
    linkButton.title = "Link"
    let linkPopup = `
        <div class="link-popup">
            <input type="text" placeholder="Paste link" class="link-popup__input">
            <button type="button" class="link-popup__button">Apply</button>
        </div>
    `

    linkButton.insertAdjacentHTML("beforeend", this.linkIcon)
    linkButtonWrapper.insertAdjacentElement("beforeend", linkButton)
    linkButtonWrapper.insertAdjacentHTML("beforeend", linkPopup)

    return linkButtonWrapper
  }

  heading(schema: any, level: number) {
    return {
      command: setBlockType(schema.nodes.heading, {level}),
      dom: this.icon("H" + level, "heading", "heading")
    }
  }

  destroy() {
    this.tooltip.remove()
  }
}

export let selectionTooltipPlugin = new Plugin({
  view(editorView: any) {
    return new SelectionTooltip(editorView)
  }
})