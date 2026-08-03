import { cn } from '@/lib/cn'

export interface IllustrativeQrProps {
  label: string
  size?: 'small' | 'large'
}

const qrCells = [
  1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1,
  0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
  1, 1, 1, 1, 1,
]

export function IllustrativeQr({ label, size = 'large' }: IllustrativeQrProps) {
  return (
    <div
      className={cn('illustrative-qr', `illustrative-qr--${size}`)}
      role="img"
      aria-label="QR Code ilustrativo, não utilizável"
    >
      <span className="illustrative-qr__cells" aria-hidden="true">
        {qrCells.map((filled, index) => (
          <span key={index} className={filled ? 'illustrative-qr__cell--filled' : undefined} />
        ))}
      </span>
      <span className="illustrative-qr__label">{label}</span>
    </div>
  )
}
