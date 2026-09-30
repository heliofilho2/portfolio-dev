// Busca o README de verdade de um repositório público do GitHub, pra pré-preencher o README
// do projeto no /admin sem copiar e colar. Só leitura, sem token (API pública, 60 req/hora
// por IP, de sobra pro uso manual daqui).
const REPO_RE = /github\.com\/([^/\s]+)\/([^/\s]+)/i
const README_NAMES = ['README.md', 'Readme.md', 'readme.md', 'README.MD']
const headers = { 'User-Agent': 'heliofilho-dev-admin' }

// Nome do repositório pode ter ponto de verdade (next.js, socket.io); só corta ".git" do fim.
export function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(REPO_RE)
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/i, '') } : null
}

export async function fetchReadme(repoUrl: string): Promise<{ markdown: string } | { error: string }> {
  const parsed = parseGitHubRepo(repoUrl)
  if (!parsed) return { error: 'Link do GitHub inválido. Use o formato https://github.com/usuario/repositorio.' }
  const { owner, repo } = parsed

  try {
    const meta = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
    if (meta.status === 404) return { error: 'Repositório não encontrado. Ele é público?' }
    if (!meta.ok) return { error: `GitHub respondeu ${meta.status}. Tenta de novo em alguns minutos.` }
    const branch = ((await meta.json()) as { default_branch?: string }).default_branch ?? 'main'

    for (const name of README_NAMES) {
      const raw = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`)
      if (!raw.ok) continue
      const text = await raw.text()
      // Em monorepo, às vezes o README da raiz é um link simbólico pra um README de verdade
      // em outra pasta; o conteúdo "bruto" desse link é só o caminho, uma linha curta sem
      // formatação de markdown. Não dá pra usar isso como README.
      if (text.trim().length < 80 && !text.includes('\n')) continue
      return { markdown: text }
    }
    return { error: 'Esse repositório não tem um README.md de verdade na raiz (pode ser um link simbólico, comum em monorepo).' }
  } catch {
    return { error: 'Não consegui acessar o GitHub agora. Tenta de novo.' }
  }
}
