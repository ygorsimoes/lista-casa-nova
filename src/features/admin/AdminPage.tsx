import { useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { useState } from 'react'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'

export default function AdminPage() {
  const adminUnlocked = useDemoSelector((state) => state.adminUnlocked)
  const { lockAdmin, unlockAdmin } = useDemoActions()
  const [shouldFocusLoginTitle, setShouldFocusLoginTitle] = useState(false)

  function enterDemo() {
    setShouldFocusLoginTitle(false)
    unlockAdmin()
  }

  function exitDemo() {
    setShouldFocusLoginTitle(true)
    lockAdmin()
  }

  return (
    <AppShell>
      {adminUnlocked ? (
        <AdminDashboard onExit={exitDemo} />
      ) : (
        <AdminLogin focusTitle={shouldFocusLoginTitle} onEnter={enterDemo} />
      )}
    </AppShell>
  )
}
