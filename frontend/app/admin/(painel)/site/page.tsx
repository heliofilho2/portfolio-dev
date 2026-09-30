import LoadError from '@/components/admin/LoadError'
import SettingsEditor from '@/components/admin/SettingsEditor'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function AdminSite() {
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />
  return <SettingsEditor settings={data.settings} />
}
