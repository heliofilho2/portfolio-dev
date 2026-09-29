import { products } from '@/lib/hub'
import { ArrowIcon } from '@/components/icons'

export default function Products() {
  return (
    <section id="produtos" className="mb-16 scroll-mt-20">
      <h2 className="section-title">Produtos</h2>
      <div className="grid gap-3">
        {products.map((product) => {
          const isLive = product.status === 'live'
          const body = (
            <>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      isLive
                        ? 'text-accent bg-accent-soft'
                        : 'text-stone-600 dark:text-stone-400 bg-stone-500/10'
                    }`}
                  >
                    {isLive ? 'No ar' : 'Em construção'}
                  </span>
                </div>
                {product.url && (
                  <ArrowIcon className="w-5 h-5 text-stone-400 group-hover:text-accent transition-colors" />
                )}
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{product.tagline}</p>
              {product.highlight && (
                <p className="mt-3 text-xs font-mono font-bold text-accent">{product.highlight}</p>
              )}
            </>
          )

          return product.url ? (
            <a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-link group p-5"
            >
              {body}
            </a>
          ) : (
            <div key={product.name} className="card p-5">
              {body}
            </div>
          )
        })}
      </div>
    </section>
  )
}
