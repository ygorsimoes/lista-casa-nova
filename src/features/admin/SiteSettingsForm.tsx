import { useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Notice } from '@/components/ui/Notice'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import type { EditableSiteSettings } from '@/domain/types'
import { useRef, useState, type FormEvent } from 'react'

type SettingsErrors = Partial<Record<keyof EditableSiteSettings, string>>

function validateSettings(values: EditableSiteSettings): SettingsErrors {
  const errors: SettingsErrors = {}
  if (values.title.trim().length < 2 || values.title.trim().length > 60) {
    errors.title = 'Informe entre 2 e 60 caracteres.'
  }
  if (values.message.trim().length < 10 || values.message.trim().length > 240) {
    errors.message = 'Informe entre 10 e 240 caracteres.'
  }
  if (values.footer.trim().length < 2 || values.footer.trim().length > 120) {
    errors.footer = 'Informe entre 2 e 120 caracteres.'
  }
  return errors
}

export function SiteSettingsForm() {
  const settings = useDemoSelector((state) => state.settings)
  const { updateSiteSettings } = useDemoActions()
  const { showToast } = useToast()
  const [values, setValues] = useState<EditableSiteSettings>(() => ({
    title: settings.title,
    message: settings.message,
    footer: settings.footer,
  }))
  const [errors, setErrors] = useState<SettingsErrors>({})
  const [saved, setSaved] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function updateValue(key: keyof EditableSiteSettings, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  function focusField(name: keyof EditableSiteSettings) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateSettings(values)
    setErrors(nextErrors)
    if (nextErrors.title) return focusField('title')
    if (nextErrors.message) return focusField('message')
    if (nextErrors.footer) return focusField('footer')

    updateSiteSettings({
      title: values.title.trim(),
      message: values.message.trim(),
      footer: values.footer.trim(),
    })
    setSaved(true)
    showToast({ title: 'Alterações salvas nesta sessão.' })
  }

  return (
    <section className="admin-panel" aria-labelledby="site-settings-title">
      <div className="admin-panel__header">
        <div>
          <h2 id="site-settings-title" tabIndex={-1}>
            Configurações da lista
          </h2>
          <p>Edite somente o conteúdo público do protótipo. Nada é persistido ao recarregar.</p>
        </div>
      </div>
      <form className="site-settings-form" ref={formRef} noValidate onSubmit={handleSubmit}>
        <Input
          label="Título do site"
          name="title"
          value={values.title}
          error={errors.title}
          maxLength={60}
          onChange={(event) => updateValue('title', event.target.value)}
        />
        <Textarea
          label="Mensagem de abertura"
          name="message"
          value={values.message}
          error={errors.message}
          maxLength={240}
          onChange={(event) => updateValue('message', event.target.value)}
        />
        <Textarea
          label="Rodapé da lista"
          name="footer"
          value={values.footer}
          error={errors.footer}
          maxLength={120}
          onChange={(event) => updateValue('footer', event.target.value)}
        />
        <aside className="site-settings-form__pix" aria-label="Dados Pix fictícios">
          <strong>Dados fictícios</strong>
          <p>
            Pix somente leitura — {settings.pix.recipient}, {settings.pix.institution}.
          </p>
          <code>{settings.pix.copyAndPaste}</code>
        </aside>
        <div className="site-settings-form__actions">
          <Button type="submit" variant="secondary">
            Salvar alterações
          </Button>
          <p>As alterações existem apenas nesta aba.</p>
        </div>
      </form>
      {saved ? (
        <Notice className="admin-panel__feedback" tone="success" role="status">
          Alterações mantidas somente nesta sessão. Recarregar restaura os dados iniciais.
        </Notice>
      ) : null}
    </section>
  )
}
