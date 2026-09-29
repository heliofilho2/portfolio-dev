import { channels } from '@/lib/hub'
import { ArrowIcon, channelIcons } from '@/components/icons'

export default function Channels() {
  return (
    <section id="conteudo" className="mb-16 scroll-mt-20">
      <h2 className="section-title">Conteúdo</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {channels.map((channel) => {
          const Icon = channelIcons[channel.icon]
          const body = (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </span>
                {channel.url ? (
                  <ArrowIcon className="w-5 h-5 text-stone-400 group-hover:text-accent transition-colors" />
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Em breve</span>
                )}
              </div>
              <h3 className="font-bold tracking-tight mb-1">{channel.name}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{channel.description}</p>
            </>
          )

          return channel.url ? (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${channel.name}: ${channel.label}`}
              className="card card-link group p-5"
            >
              {body}
            </a>
          ) : (
            <div key={channel.name} className="card p-5 opacity-70">
              {body}
            </div>
          )
        })}
      </div>
    </section>
  )
}
