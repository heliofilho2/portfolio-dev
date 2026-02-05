'use client'

import { useState, useEffect } from 'react'
import { profileApi, type ProfileDto } from '@/lib/api'

export default function ContactSection() {
  const [profile, setProfile] = useState<ProfileDto | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profileApi.get()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [])

  return (
    /* CORREÇÃO: Footer background e border para dark mode */
    <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" id="contact">
      <div className="max-w-[1600px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-black mb-2">Request Technical Audit</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Currently accepting selective consulting projects and senior leadership opportunities. Response time &lt; 24h.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap md:justify-end gap-3">
          <a
            href="https://wa.me/5535984727320"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all group shadow-lg hover:shadow-xl whitespace-nowrap flex-shrink-0"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">WhatsApp</span>
          </a>
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-accent hover:text-white transition-all group whitespace-nowrap flex-shrink-0"
            >
            {/* Ícone de e-mail via SVG para evitar depender de fonte externa */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" strokeWidth="2" />
              <path d="M5 7l7 6 7-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Email Node</span>
          </a>
          )}
          {profile?.linkedInUrl && (
            <a
              href={profile.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-accent hover:text-white transition-all group whitespace-nowrap flex-shrink-0"
            >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Professional Hub</span>
          </a>
          )}
          {profile?.gitHubUrl && (
            <a
              href={profile.gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-accent hover:text-white transition-all group whitespace-nowrap flex-shrink-0"
            >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Source Repo</span>
          </a>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-mono">
          © 2026 {profile?.name?.toUpperCase().replace(/\s/g, '_') || 'HELIO_FILHO'}
        </p>
        <div className="flex gap-6 text-[10px] font-mono text-slate-400">
          <span>UPTIME: 99.9%</span>
          <span>PING: 14ms</span>
          <span>LOC: 45.4215° N</span>
        </div>
      </div>
    </footer>
  )
}