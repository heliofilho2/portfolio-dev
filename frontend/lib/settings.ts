import { supabase } from './supabase'
import { devRead, devStoreOn } from './devStore'
import { defaultSettings, mergeSettings, type SiteSettings } from './settingsModel'

export * from './settingsModel'

export async function getSiteSettings(): Promise<SiteSettings> {
  if (devStoreOn) return mergeSettings((await devRead()).settings)
  if (!supabase) return defaultSettings
  const { data } = await supabase.from('site_settings').select('data').eq('id', 'main').maybeSingle()
  return mergeSettings(data?.data as Partial<SiteSettings> | undefined)
}
