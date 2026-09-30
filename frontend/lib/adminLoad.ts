import { AdminError, loadAll, type AdminData } from './adminStore'

// loadAll() com erro amigável: as páginas do painel mostram um aviso em vez de quebrar.
export async function loadAdmin(): Promise<{ data: AdminData; error: null } | { data: null; error: string }> {
  try {
    return { data: await loadAll(), error: null }
  } catch (e) {
    return { data: null, error: e instanceof AdminError ? e.message : 'Não consegui ler o banco.' }
  }
}
