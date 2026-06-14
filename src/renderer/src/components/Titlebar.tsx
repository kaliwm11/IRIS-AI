import { useState, useEffect } from 'react'
import {
  RiSubtractLine,
  RiCloseLine,
  RiCheckboxBlankLine,
  RiCheckboxMultipleBlankLine,
  RiFingerprintLine
} from 'react-icons/ri'

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    if (window.electron && window.electron.process) {
      setIsMac(window.electron.process.platform === 'darwin')
    } else {
      setIsMac(navigator.userAgent.toLowerCase().includes('mac'))
    }
  }, [])

  const minimize = () => window.electron.ipcRenderer.send('window-min')
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
    window.electron.ipcRenderer.send('window-max')
  }
  const close = () => window.electron.ipcRenderer.send('window-close')

  return (
    <div className="w-full h-10 flex items-center justify-between bg-[#050505] border-b border-white/[0.04] drag-region select-none z-50">
      {/* ── LEFT: Branding / Mac Controls ── */}
      <div className="flex items-center h-full min-w-[140px] pl-4 no-drag">
        {isMac ? (
          <div className="flex items-center gap-2 group/mac">
            <button
              onClick={close}
              className="w-3 h-3 rounded-full bg-zinc-800 hover:bg-[#ff5f56] border border-white/5 transition-colors flex items-center justify-center"
            >
              <RiCloseLine
                size={8}
                className="opacity-0 group-hover/mac:opacity-100 text-[#4c0002]"
              />
            </button>
            <button
              onClick={minimize}
              className="w-3 h-3 rounded-full bg-zinc-800 hover:bg-[#ffbd2e] border border-white/5 transition-colors flex items-center justify-center"
            >
              <RiSubtractLine
                size={8}
                className="opacity-0 group-hover/mac:opacity-100 text-[#5c3e00]"
              />
            </button>
            <button
              onClick={toggleMaximize}
              className="w-3 h-3 rounded-full bg-zinc-800 hover:bg-[#27c93f] border border-white/5 transition-colors flex items-center justify-center"
            >
              <RiCheckboxBlankLine
                size={6}
                className="opacity-0 group-hover/mac:opacity-100 text-[#024d04]"
              />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 opacity-80">
            <div className="flex items-center justify-center w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20">
              <RiFingerprintLine size={10} className="text-emerald-500" />
            </div>
            <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-zinc-300 uppercase">
              IRIS_OS
            </span>
          </div>
        )}
      </div>

      {/* ── CENTER: Minimalist Status ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-80">
        <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
          System Core
        </span>
        <span className="text-[9px] font-mono text-zinc-700">/</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-300 uppercase">
            Online
          </span>
        </div>
      </div>

      {/* ── RIGHT: Windows Controls / Mac Spacer ── */}
      <div className="flex h-full min-w-[140px] justify-end no-drag">
        {!isMac ? (
          <div className="flex h-full items-center">
            <button
              onClick={minimize}
              className="w-12 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
            >
              <RiSubtractLine size={14} />
            </button>
            <button
              onClick={toggleMaximize}
              className="w-12 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
            >
              {isMaximized ? (
                <RiCheckboxMultipleBlankLine size={12} />
              ) : (
                <RiCheckboxBlankLine size={12} />
              )}
            </button>
            <button
              onClick={close}
              className="w-12 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-red-500 transition-colors"
            >
              <RiCloseLine size={16} />
            </button>
          </div>
        ) : (
          <div className="w-12 h-full pointer-events-none" />
        )}
      </div>
    </div>
  )
}
