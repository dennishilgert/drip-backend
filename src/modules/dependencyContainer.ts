import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators'
import DI_TYPES from './dependencyContainerTypes'

import 'reflect-metadata'

const container = new Container()
const { lazyInject } = getDecorators(container, false)
export { lazyInject }

export { container }
export { DI_TYPES as types }
