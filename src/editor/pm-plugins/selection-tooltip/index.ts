import {Plugin} from "prosemirror-state"
import "./styles.css"

class SelectionTooltip {
  // @ts-ignore
  constructor(view) {
    // @ts-ignore
    this.tooltip = document.createElement("div")
    // @ts-ignore
    this.tooltip.className = "tooltip"
    // @ts-ignore
    view.dom.parentNode.appendChild(this.tooltip)

    this.update(view, null)
  }
// @ts-ignore
  update(view, lastState) {
    let state = view.state
    // Don't do anything if the document/selection didn't change
    if (lastState && lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)) return

    // Hide the tooltip if the selection is empty
    if (state.selection.empty) {
      // @ts-ignore
      this.tooltip.style.display = "none"
      return
    }

    // Otherwise, reposition it and update its content
    // @ts-ignore
    this.tooltip.style.display = ""
    let {from, to} = state.selection
    // These are in screen coordinates
    let start = view.coordsAtPos(from), end = view.coordsAtPos(to)
    // The box in which the tooltip is positioned, to use as base
    // @ts-ignore
    let box = this.tooltip.offsetParent.getBoundingClientRect()
    // Find a center-ish x position from the selection endpoints (when
    // crossing lines, end may be more to the left)
    let left = Math.max((start.left + end.left) / 2, start.left + 3)
    // @ts-ignore
    this.tooltip.style.left = (left - box.left) + "px"
    // @ts-ignore
    this.tooltip.style.bottom = (box.bottom - start.top) + "px"
    // @ts-ignore
    this.tooltip.textContent = to - from
  }
// @ts-ignore
  destroy() { this.tooltip.remove() }
}


export let selectionTooltipPlugin = new Plugin({
  view(editorView: any) { return new SelectionTooltip(editorView) }
})