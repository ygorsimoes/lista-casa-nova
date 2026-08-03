import { expect, test as base } from '@playwright/test'

type RuntimeIssue = {
  kind: 'console.error' | 'console.warn' | 'pageerror'
  message: string
}

export const test = base.extend<{ runtimeIssueGuard: void }>({
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
})

export { expect }
