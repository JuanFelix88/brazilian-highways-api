export namespace Controller {
  export interface Request<T = any> {
    method?: string
    body: T
    query: object
  }

  export interface Response {
    statusCode: number
    status: (st: number) => Response
    send: (data: any) => any
    json: (jsonData: object) => void
  }
}

class InjectInspect {
  public unique: symbol
  constructor() {
    this.unique = Symbol('inject')
  }
}

function injectsDependencyList<T = any, J = any>(
  target: J,
  dependencyList: Array<{ name: string }>
): T {
  const injectableList = dependencyList.map(() => new InjectInspect())

  const isClass = (target as any).toString().startsWith('class ')

  if (!isClass) {
    // return the function
    return target as any
  }

  const instance = new (target as any)(...injectableList)

  for (const key of Object.keys(instance)) {
    const injectableIndex = injectableList.findIndex(
      injectable => instance[key] === injectable
    )

    if (injectableIndex === -1) {
      continue
    }

    const dependency = dependencyList.find(dependency =>
      dependency.name.toLowerCase().includes(key.toLowerCase())
    )

    if (!dependency) {
      throw new Error(`Do not resolve the ${key} injectable dependency`)
    }

    instance[key] = injectsDependencyList(dependency, dependencyList)
  }

  return instance
}

export class Controller {
  static availableMethods = ['post', 'get', 'put', 'patch', 'delete', 'options']

  async handler(
    req: Controller.Request,
    res: Controller.Response
  ): Promise<any> {
    const requestMethod = req.method?.toLowerCase()

    if (
      !req.method ||
      !Controller.availableMethods.includes(requestMethod!) ||
      !Reflect.has(this, requestMethod!)
    ) {
      return res.status(405).send('')
    }

    return await this[requestMethod as keyof Controller]?.(req, res)
  }

  static defineHandler() {
    const instance = new this()

    return instance.handler.bind(instance)
  }

  static dependencyInjects<T extends Controller>(
    dependencyList: Array<{ name: string }>
  ) {
    return injectsDependencyList<T>(this as any, dependencyList)
  }

  static defineHandlerWithDependencyInjects<T extends Controller>(
    dependencyList: Array<{ name: string }>
  ) {
    const instance = injectsDependencyList<T>(this as any, dependencyList)

    return instance.handler.bind(instance)
  }
}
