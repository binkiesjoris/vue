/* @flow */

import { updateListeners } from 'core/vdom/helpers/index'

let target: HTMLElement

function add (event: string, handler: Function, once: boolean, capture: boolean, nodeOps: any) {
  if (once) {
    const oldHandler = handler
    handler = function (ev) {
      remove(event, handler, capture, nodeOps)
      arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments)
    }
  }
  nodeOps.addEventListener(target, event, handler, capture)
}

function remove (event: string, handler: Function, capture: boolean, nodeOps: any) {
  nodeOps.removeEventListener(target, event, handler, capture)
}

function updateDOMListeners (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}
  target = vnode.elm
  updateListeners(on, oldOn, add, remove, vnode.context)
}

export default {
  create: updateDOMListeners,
  update: updateDOMListeners
}
