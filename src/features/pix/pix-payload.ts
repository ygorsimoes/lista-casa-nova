function normalize(value: string, maximumLength: number): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 $%*+\-./:]/g, '')
    .toUpperCase()
    .slice(0, maximumLength)
}

function field(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

function crc16(value: string): string {
  let crc = 0xffff
  for (const character of value) {
    crc ^= character.charCodeAt(0) << 8
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function createPixPayload(key: string, receiverName: string, city: string): string {
  const merchantAccount = field('00', 'BR.GOV.BCB.PIX') + field('01', key.trim())
  const additionalData = field('05', '***')
  const payload = [
    field('00', '01'),
    field('26', merchantAccount),
    field('52', '0000'),
    field('53', '986'),
    field('58', 'BR'),
    field('59', normalize(receiverName, 25)),
    field('60', normalize(city, 15)),
    field('62', additionalData),
    '6304',
  ].join('')
  return `${payload}${crc16(payload)}`
}
