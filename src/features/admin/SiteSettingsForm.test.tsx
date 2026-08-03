import AdminPage from '@/features/admin/AdminPage'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

async function openSettings() {
  const user = userEvent.setup()
  renderWithApp(<AdminPage />, { route: '/admin' })
  await user.click(screen.getByRole('button', { name: /entrar na demonstração/i }))
  return user
}

describe('SiteSettingsForm', () => {
  it('atualiza apenas as configurações públicas editáveis nesta sessão', async () => {
    const user = await openSettings()
    const title = screen.getByLabelText(/título do site/i)

    await user.clear(title)
    await user.type(title, 'Nosso novo lar')
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    expect(screen.getByText(/alterações mantidas somente nesta sessão/i)).toBeVisible()
    expect(screen.getByText(/banco fictício/i)).toBeVisible()
    expect(screen.getByDisplayValue('Nosso novo lar')).toBeVisible()
  })

  it('não envia campos obrigatórios vazios e foca o primeiro erro', async () => {
    const user = await openSettings()
    const title = screen.getByLabelText(/título do site/i)

    await user.clear(title)
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    expect(screen.getByText(/informe entre 2 e 60 caracteres/i)).toBeVisible()
    expect(title).toHaveFocus()
  })
})
