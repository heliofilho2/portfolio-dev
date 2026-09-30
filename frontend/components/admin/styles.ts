// Classes de botão do /admin. Fora do arquivo client pra poder ser usado em páginas de servidor.
export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-ink text-surface hover:text-surface text-sm font-medium cursor-pointer disabled:opacity-50 transition-transform hover:-translate-y-px',
  ghost: 'inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full border border-line bg-surface text-ink hover:text-ink hover:border-ink text-sm font-medium cursor-pointer disabled:opacity-50',
  danger: 'inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium cursor-pointer text-[#B4453A] hover:bg-rose disabled:opacity-50',
  small: 'inline-flex items-center justify-center w-8 h-8 rounded-full border border-line bg-surface text-muted hover:text-ink hover:border-ink cursor-pointer text-sm disabled:opacity-40',
}
