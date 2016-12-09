import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import { createPatchFunction } from 'core/vdom/patch.js'
import baseModules from 'core/vdom/modules/index.js'
import platformModules from 'web/runtime/modules/index.js'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  if(options.nodeOps != null)
     this.__patch__ = createPatchFunction({ nodeOps: options.nodeOps, modules: platformModules.concat(baseModules) });
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
