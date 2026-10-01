// Helpers reutilizáveis pra automatizar o /admin de heliofilho.dev via Playwright.
// Ver SKILL.md nessa mesma pasta pro fluxo completo. Não existe API: tudo aqui preenche
// e clica na UI real do /admin, porque é isso que o painel expõe.
//
// Descobertas que custaram tempo de debug (não reabrir):
// - Next.js hidrata um instante depois do primeiro render: o PRIMEIRO fill() logo após
//   `waitForSelector` às vezes não gruda. Por isso todo fillSafe() confere e tenta de novo.
// - StringListField/ObjectListField (arch, decisões, trade-offs, materiais) sempre
//   re-renderizam o botão "+ Adicionar" como o ÚLTIMO <button> dentro do <label> do campo -
//   por isso .locator('button').last(), nunca getByRole('button', {name}) (o "+ " vira nó de
//   texto separado por comentário do React e a computação de nome acessível falha sem avisar).
// - page.click()/page.fill() (API legada, sem Locator) NÃO fazem strict-mode: se o seletor
//   bater em mais de 1 elemento, clica/preenche o primeiro sem erro nenhum - prefira sempre
//   Locator (page.locator(...).click()) pra pegar o erro de ambiguidade na hora.

export const PLAYWRIGHT_CORE_ENTRY =
  'file:///C:/Users/helio.ferreira/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright-core/index.mjs'

export async function login(page, password) {
  await page.goto('https://heliofilho.dev/admin/login', { waitUntil: 'domcontentloaded' })
  await page.fill('input[name=password]', password)
  await page.click('button[type=submit]')
  await page.waitForURL('**/admin', { timeout: 15000 })
}

// Preenche e confere; tenta de novo se o valor não colou (corrida de hidratação).
export async function fillSafe(locator, value, label = '') {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await locator.fill(value)
    if ((await locator.inputValue()) === value) return
    await locator.page().waitForTimeout(300)
  }
  throw new Error(`fillSafe falhou em: ${label || value.slice(0, 30)}`)
}

// Pra StringListField (lista de texto simples: arch, decisions, tradeoffs) e
// ObjectListField (materiais do cofre, com Nome/Detalhe/Link) - ambos usam o mesmo padrão de
// botão "+ Adicionar" como último <button> do <label> do campo.
export async function fillListField(page, fieldLabelText, items) {
  const label = page.locator(`label:has-text("${fieldLabelText}")`)
  for (let i = 0; i < items.length; i++) await label.locator('button').last().click()
  const inputs = label.locator('input')
  // StringListField: 1 input por item. ObjectListField: N inputs por item (preencher todos).
  const perItem = (await inputs.count()) / items.length
  for (let i = 0; i < items.length; i++) {
    const values = Array.isArray(items[i]) ? items[i] : [items[i]]
    for (let j = 0; j < values.length; j++) await fillSafe(inputs.nth(i * perItem + j), values[j], `${fieldLabelText}[${i}]`)
  }
}

export async function saveAndVerify(page, outDir, name) {
  await page.screenshot({ path: `${outDir}/${name}-before-save.png`, fullPage: true })
  await page.getByRole('button', { name: 'Salvar' }).click()
  await page.waitForTimeout(1200)
  const toast = await page.locator('[role=status]').textContent().catch(() => null)
  await page.screenshot({ path: `${outDir}/${name}-after-save.png`, fullPage: true })
  return { toast, url: page.url() }
}
