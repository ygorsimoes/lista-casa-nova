import { useLayoutEffect, useRef, useState } from 'react'
import { PrintableGiftList, type PrintableGiftListProps } from './PrintableGiftList'

export const printableWidth = 794
export const printableHeight = 1123

// eslint-disable-next-line react-refresh/only-export-components
export function getPrintableScale(frameWidth: number) {
  return Math.min(1, Math.max(0, frameWidth) / printableWidth)
}

export function ScaledPrintablePreview(props: PrintableGiftListProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const update = () => {
      if (frame.clientWidth > 0) setScale(getPrintableScale(frame.clientWidth))
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={frameRef} className="printable-sheet-frame">
      <div
        className="printable-sheet-sizer"
        style={{
          width: `${printableWidth * scale}px`,
          height: `${printableHeight * scale}px`,
        }}
      >
        <div
          className="printable-sheet-canvas"
          style={{
            width: `${printableWidth}px`,
            height: `${printableHeight}px`,
            transform: `scale(${scale})`,
          }}
        >
          <PrintableGiftList {...props} />
        </div>
      </div>
    </div>
  )
}
