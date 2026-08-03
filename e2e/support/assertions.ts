/// <reference lib="dom" />

import { AxeBuilder } from '@axe-core/playwright'
import { expect, type Locator, type Page } from '@playwright/test'

const appOrigin = 'http://127.0.0.1:4173'

export function observeForbiddenRequests(page: Page) {
  const forbiddenRequests: string[] = []

  page.on('request', (request) => {
    const requestUrl = new URL(request.url())
    const isFunctionalRequest = ['fetch', 'xhr'].includes(request.resourceType())
    if (isFunctionalRequest || requestUrl.origin !== appOrigin) {
      forbiddenRequests.push(`${request.resourceType()}: ${request.url()}`)
    }
  })

  return () => expect(forbiddenRequests, 'requests funcionais ou externos').toEqual([])
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

export async function expectEmptyBrowserStorage(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => ({
        local: localStorage.length,
        session: sessionStorage.length,
      })),
    )
    .toEqual({ local: 0, session: 0 })
}

export async function expectMinimumTouchTarget(locator: Locator) {
  const target = await locator.boundingBox()
  expect(target, 'controle visível para medição').not.toBeNull()
  expect(target?.height).toBeGreaterThanOrEqual(43.5)
}

export async function expectMinimumFieldFontSize(locator: Locator) {
  const fontSize = await locator.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  )
  expect(fontSize).toBeGreaterThanOrEqual(16)
}

export async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()
  const blockingViolations = results.violations.filter(({ impact }) =>
    ['serious', 'critical'].includes(impact ?? ''),
  )

  expect(
    blockingViolations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map(({ html, target }) => ({ html, target })),
    })),
  ).toEqual([])
}
