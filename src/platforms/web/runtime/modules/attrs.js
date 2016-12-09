/* @flow */

import { extend } from 'shared/util'
import { isIE9 } from 'core/util/env'
import {
  isBooleanAttr,
  isEnumeratedAttr,
  isXlink,
  xlinkNS,
  getXlinkProp,
  isFalsyAttrValue
} from 'web/util/index'

function updateAttrs (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  let key, cur, old
  const elm = vnode.elm
  const nodeOps = vnode.context.$root.$options.nodeOps
  const oldAttrs = oldVnode.data.attrs || {}
  let attrs: any = vnode.data.attrs || {}
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs)
  }

  for (key in attrs) {
    cur = attrs[key]
    old = oldAttrs[key]
    if (old !== cur) {
      setAttr(elm, key, cur, nodeOps)
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value, nodeOps)
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
      } else if (!isEnumeratedAttr(key)) {
        nodeOps.removeAttribute(elm, key)
      }
    }
  }
}

function setAttr (el: Element, key: string, value: any, nodeOps: any) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      nodeOps.removeAttribute(el, key)
    } else {
      nodeOps.setAttribute(el, key, key)
    }
  } else if (isEnumeratedAttr(key)) {
    nodeOps.setAttribute(el, key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true')
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      nodeOps.removeAttributeNS(el, xlinkNS, getXlinkProp(key))
    } else {
      nodeOps.setAttributeNS(el, xlinkNS, key, value)
    }
  } else {
    if (isFalsyAttrValue(value)) {
      nodeOps.removeAttribute(el, key)
    } else {
      nodeOps.setAttribute(el, key, value)
    }
  }
}

export default {
  create: updateAttrs,
  update: updateAttrs
}
