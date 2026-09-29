import { stats } from '@/lib/hub'

export default function Stats() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
      {stats.map((stat) => (
        <div key={stat.label} className="card p-4">
          <div className="font-serif text-3xl font-semibold tracking-tight">{stat.value}</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </section>
  )
}
