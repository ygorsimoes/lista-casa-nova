import { useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'

export default function AdminPage() {
  const adminUnlocked = useDemoSelector((state) => state.adminUnlocked)
  const { lockAdmin, unlockAdmin } = useDemoActions()

  return (
    <AppShell>
      {adminUnlocked ? <AdminDashboard onExit={lockAdmin} /> : <AdminLogin onEnter={unlockAdmin} />}
    </AppShell>
  )
}
