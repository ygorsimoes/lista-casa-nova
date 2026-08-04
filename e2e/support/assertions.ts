/// <reference lib="dom" />

import { AxeBuilder } from '@axe-core/playwright'
import { expect, type Locator, type Page } from '@playwright/test'

export interface AxeAllowlistEntry {
  ruleId: string
  target: string
  reason: string
}

function axeTarget(target: readonly (string | string[])[]) {
  return target.map((part) => (Array.isArray(part) ? part.join(' ') : part)).join(' > ')
}

export async function expectNoAccessibilityViolations(
  page: Page,
  allowlist: readonly AxeAllowlistEntry[] = [],
) {
  for (const entry of allowlist) {
    expect(entry.reason.trim(), `justificativa axe para ${entry.ruleId}`).not.toBe('')
  }

  const results = await new AxeBuilder({ page }).analyze()
  const unexpected = results.violations.flatMap((violation) =>
    violation.nodes
      .filter((node) => {
        const target = axeTarget(node.target)
        return !allowlist.some((entry) => entry.ruleId === violation.id && entry.target === target)
      })
      .map((node) => ({
        id: violation.id,
        impact: violation.impact,
        target: axeTarget(node.target),
        html: node.html,
      })),
  )

  expect(unexpected, 'violações axe não justificadas').toEqual([])
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

export async function expectMinimumTouchTarget(locator: Locator) {
  const target = await locator.boundingBox()
  expect(target, 'controle visível para medição').not.toBeNull()
  expect(target?.width).toBeGreaterThanOrEqual(44)
  expect(target?.height).toBeGreaterThanOrEqual(44)
}

export async function expectMinimumFieldFontSize(locator: Locator) {
  const fontSize = await locator.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  )
  expect(fontSize).toBeGreaterThanOrEqual(16)
}

export async function expectComputedFocusVisible(locator: Locator) {
  await expect(locator).toBeFocused()
  await locator.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  const style = await locator.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      outlineColor: computed.outlineColor,
      outlineOffset: Number.parseFloat(computed.outlineOffset),
      outlineStyle: computed.outlineStyle,
      outlineWidth: Number.parseFloat(computed.outlineWidth),
    }
  })
  expect(style.outlineStyle, 'estilo do indicador de foco').not.toBe('none')
  expect(style.outlineWidth, 'largura do indicador de foco').toBeGreaterThan(0)
  expect(style.outlineOffset, 'afastamento do indicador de foco').toBeGreaterThan(0)
  expect(style.outlineColor, 'cor do indicador de foco').not.toBe('rgba(0, 0, 0, 0)')
}

export async function expectNoHorizontalClipping(locator: Locator) {
  const dimensions = await locator.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

export async function expectHorizontalScrollContained(page: Page, scroller: Locator) {
  await expectNoHorizontalOverflow(page)
  const dimensions = await scroller.evaluate((element) => {
    const initialScrollLeft = element.scrollLeft
    element.scrollLeft = element.scrollWidth
    const finalScrollLeft = element.scrollLeft
    element.scrollLeft = initialScrollLeft
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
      initialScrollLeft,
      finalScrollLeft,
    }
  })
  expect(['auto', 'scroll']).toContain(dimensions.overflowX)
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth)
  expect(dimensions.finalScrollLeft).toBeGreaterThan(dimensions.initialScrollLeft)
  await expectNoHorizontalOverflow(page)
}

export async function expectSingleEditorialColumn(items: Locator) {
  const boxes = await items.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect()
      return { left: Math.round(box.left), top: box.top, bottom: box.bottom }
    }),
  )
  expect(boxes.length).toBeGreaterThan(0)
  expect(new Set(boxes.map(({ left }) => left)).size).toBe(1)
  for (let index = 1; index < boxes.length; index += 1) {
    expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom - 1)
  }
}

export async function expectReducedMotionApplied(page: Page) {
  const result = await page.evaluate(() => {
    const toMilliseconds = (value: string) =>
      value.endsWith('ms')
        ? Number.parseFloat(value)
        : Number.parseFloat(value.replace('s', '')) * 1000
    const durations = Array.from(document.querySelectorAll('*')).flatMap((element) => {
      const style = getComputedStyle(element)
      return [...style.transitionDuration.split(','), ...style.animationDuration.split(',')]
        .map((value) => toMilliseconds(value.trim()))
        .filter(Number.isFinite)
    })
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      maxDuration: Math.max(0, ...durations),
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    }
  })
  expect(result.matches).toBe(true)
  expect(result.maxDuration).toBeLessThanOrEqual(0.01)
  expect(result.scrollBehavior).not.toBe('smooth')
}
