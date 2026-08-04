/// <reference lib="dom" />

import { expect, test as base, type Page } from '@playwright/test'

type RuntimeIssue = {
  kind: 'console.error' | 'console.warn' | 'pageerror'
  message: string
}

type PrototypeSideEffect = {
  kind: 'network' | 'storage' | 'websocket'
  detail: string
}

type PrototypeDownload = {
  pageUrl: string
  suggestedFilename: string
  url: string
}

declare global {
  interface Window {
    __recordPrototypeSideEffect?: (
      kind: PrototypeSideEffect['kind'],
      detail: string,
    ) => Promise<void>
  }
}

export const test = base.extend<{
  runtimeIssueGuard: void
  prototypeBoundaryGuard: void
  downloadGuard: void
}>({
  runtimeIssueGuard: [
    async ({ page }, use) => {
      const runtimeIssues: RuntimeIssue[] = []

      page.on('console', (entry) => {
        if (entry.type() === 'error') {
          runtimeIssues.push({ kind: 'console.error', message: entry.text() })
        }
        if (entry.type() === 'warning') {
          runtimeIssues.push({ kind: 'console.warn', message: entry.text() })
        }
      })
      page.on('pageerror', (error) => {
        runtimeIssues.push({ kind: 'pageerror', message: error.message })
      })

      await use()

      expect(runtimeIssues, 'erros ou avisos relevantes no runtime do navegador').toEqual([])
    },
    { auto: true },
  ],
  prototypeBoundaryGuard: [
    async ({ baseURL, context }, use) => {
      if (!baseURL) throw new Error('baseURL é obrigatória para proteger a fronteira do protótipo.')
      const allowedOrigin = new URL(baseURL).origin
      const sideEffects: PrototypeSideEffect[] = []

      await context.exposeBinding(
        '__recordPrototypeSideEffect',
        (_source, kind: PrototypeSideEffect['kind'], detail: string) => {
          sideEffects.push({ kind, detail })
        },
      )

      await context.addInitScript(() => {
        const record = (kind: PrototypeSideEffect['kind'], detail: string) => {
          void window.__recordPrototypeSideEffect?.(kind, detail)
        }

        function findDescriptor(target: object, name: PropertyKey) {
          let current: object | null = target
          while (current) {
            const descriptor = Object.getOwnPropertyDescriptor(current, name)
            if (descriptor) return descriptor
            current = Object.getPrototypeOf(current) as object | null
          }
          return undefined
        }

        for (const name of ['localStorage', 'sessionStorage', 'indexedDB', 'caches'] as const) {
          const descriptor = findDescriptor(window, name)
          if (!descriptor?.get) continue
          Object.defineProperty(window, name, {
            configurable: true,
            enumerable: descriptor.enumerable,
            get() {
              record('storage', `${name}:read`)
              return descriptor.get?.call(window)
            },
          })
        }

        const storageDescriptor = findDescriptor(navigator, 'storage')
        if (storageDescriptor?.get) {
          Object.defineProperty(navigator, 'storage', {
            configurable: true,
            enumerable: storageDescriptor.enumerable,
            get() {
              record('storage', 'navigator.storage:read')
              return storageDescriptor.get?.call(navigator)
            },
          })
        }

        const cookieDescriptor = findDescriptor(document, 'cookie')
        if (cookieDescriptor?.get && cookieDescriptor.set) {
          Object.defineProperty(document, 'cookie', {
            configurable: true,
            enumerable: cookieDescriptor.enumerable,
            get() {
              record('storage', 'document.cookie:read')
              return cookieDescriptor.get?.call(document) ?? ''
            },
            set(value: string) {
              record('storage', 'document.cookie:write')
              cookieDescriptor.set?.call(document, value)
            },
          })
        }
      })

      await context.route('**/*', async (route) => {
        const request = route.request()
        const url = new URL(request.url())
        const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
        const isExternal = isHttp && url.origin !== allowedOrigin
        const isFunctional = ['fetch', 'xhr', 'eventsource', 'ping'].includes(
          request.resourceType(),
        )
        const mutatesServer = !['GET', 'HEAD'].includes(request.method())

        if (isExternal || isFunctional || mutatesServer) {
          sideEffects.push({
            kind: 'network',
            detail: `${request.method()} ${request.resourceType()} ${request.url()}`,
          })
          await route.abort('blockedbyclient')
          return
        }
        await route.continue()
      })

      await context.routeWebSocket(/.*/, async (webSocket) => {
        sideEffects.push({ kind: 'websocket', detail: webSocket.url() })
        await webSocket.close({ code: 1008, reason: 'Protótipo sem integrações' })
      })

      await use()

      const storageState = await context.storageState({ indexedDB: true })
      expect(sideEffects, 'rede externa, chamadas funcionais ou armazenamento').toEqual([])
      expect(storageState.cookies, 'cookies do contexto').toEqual([])
      expect(storageState.origins, 'localStorage ou IndexedDB do contexto').toEqual([])
    },
    { auto: true },
  ],
  downloadGuard: [
    async ({ context, page }, use) => {
      const downloads: PrototypeDownload[] = []
      const observePage = (observedPage: Page) => {
        observedPage.on('download', (download) => {
          downloads.push({
            pageUrl: observedPage.url(),
            suggestedFilename: download.suggestedFilename(),
            url: download.url(),
          })
        })
      }

      observePage(page)
      context.on('page', observePage)

      await use()

      context.off('page', observePage)
      expect(downloads, 'downloads reais iniciados pelo protótipo').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
