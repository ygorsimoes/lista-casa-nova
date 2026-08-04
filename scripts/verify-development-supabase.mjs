const environment = process.env.VITE_APP_ENV
const url = process.env.VITE_SUPABASE_URL
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (environment !== 'development' || !url || !publishableKey) {
  throw new Error('A integração exige variáveis completas do ambiente de desenvolvimento.')
}

const headers = {
  apikey: publishableKey,
  Authorization: `Bearer ${publishableKey}`,
}

const giftsResponse = await fetch(`${url}/rest/v1/gifts?select=id&limit=1`, { headers })
if (!giftsResponse.ok || (await giftsResponse.json()).length === 0) {
  throw new Error('O catálogo do ambiente de desenvolvimento não está disponível.')
}

const guestNamesResponse = await fetch(`${url}/rest/v1/reservations?select=guest_name`, { headers })
if (guestNamesResponse.ok) {
  throw new Error('A consulta pública não pode expor nomes de reservas.')
}

console.log('Integração do Supabase de desenvolvimento verificada.')
