import { useLayoutEffect, useRef, useState } from 'react'

const TYPE_ICON = {
  person: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  ),
  company: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M9 12h.01M15 9h.01M15 12h.01M3 21h18" />
    </svg>
  ),
  trust: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2.5l7.5 3.5v5c0 5-3.2 8.7-7.5 10.5-4.3-1.8-7.5-5.5-7.5-10.5V6l7.5-3.5z" />
    </svg>
  ),
  fund: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 20V11m6 9V6m6 14v-8m6 8V4" />
    </svg>
  ),
  charity: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 20.5s-7.5-4.6-9.5-9A5 5 0 0112 6.5a5 5 0 019.5 5c-2 4.4-9.5 9-9.5 9z" />
    </svg>
  ),
}

const TYPE_COLOR = {
  person: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
  company: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
  trust: 'text-violet-400 border-violet-500/40 bg-violet-500/10',
  fund: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  charity: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
}

function anchorPoint(rect, containerRect, side) {
  const x = rect.left - containerRect.left
  const y = rect.top - containerRect.top
  if (side === 'top') return { x: x + rect.width / 2, y }
  if (side === 'bottom') return { x: x + rect.width / 2, y: y + rect.height }
  if (side === 'left') return { x, y: y + rect.height / 2 }
  return { x: x + rect.width, y: y + rect.height / 2 }
}

export default function OwnershipDiagram({ nodes, edges }) {
  const containerRef = useRef(null)
  const nodeRefs = useRef({})
  const [lines, setLines] = useState([])

  const maxCol = Math.max(0, ...nodes.map((n) => n.col))
  const maxRow = Math.max(0, ...nodes.map((n) => n.row))

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const rowOf = Object.fromEntries(nodes.map((n) => [n.id, n.row]))
      const colOf = Object.fromEntries(nodes.map((n) => [n.id, n.col]))

      const next = edges.map((e) => {
        const fromEl = nodeRefs.current[e.from]
        const toEl = nodeRefs.current[e.to]
        if (!fromEl || !toEl) return null
        const fromRect = fromEl.getBoundingClientRect()
        const toRect = toEl.getBoundingClientRect()

        let fromSide, toSide
        if (rowOf[e.from] < rowOf[e.to]) { fromSide = 'bottom'; toSide = 'top' }
        else if (rowOf[e.from] > rowOf[e.to]) { fromSide = 'top'; toSide = 'bottom' }
        else if (colOf[e.from] < colOf[e.to]) { fromSide = 'right'; toSide = 'left' }
        else { fromSide = 'left'; toSide = 'right' }

        const p1 = anchorPoint(fromRect, containerRect, fromSide)
        const p2 = anchorPoint(toRect, containerRect, toSide)
        return { id: `${e.from}-${e.to}`, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, label: e.label }
      }).filter(Boolean)

      setLines(next)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [nodes, edges])

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: (maxRow + 1) * 92 }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="ownership-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#64748b" />
          </marker>
        </defs>
        {lines.map((l) => (
          <line key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#ownership-arrow)" />
        ))}
      </svg>

      {lines.map((l) => (
        <span
          key={`label-${l.id}`}
          className="absolute text-[10px] font-semibold text-slate-200 bg-[#0e0e0e] border border-slate-600/60 px-1.5 py-0.5 rounded-full whitespace-nowrap"
          style={{ left: (l.x1 + l.x2) / 2, top: (l.y1 + l.y2) / 2, transform: 'translate(-50%, -50%)' }}
        >
          {l.label}
        </span>
      ))}

      <div
        className="grid gap-x-4 gap-y-10"
        style={{
          gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${maxRow + 1}, auto)`,
        }}
      >
        {nodes.map((n) => (
          <div
            key={n.id}
            ref={(el) => { nodeRefs.current[n.id] = el }}
            style={{ gridColumn: n.col + 1, gridRow: n.row + 1 }}
            className="self-center justify-self-center w-full max-w-[180px]"
          >
            <div className={`rounded-xl border px-3 py-2.5 text-center ${TYPE_COLOR[n.type] || TYPE_COLOR.company}`}>
              <div className="flex items-center justify-center mb-1">{TYPE_ICON[n.type] || TYPE_ICON.company}</div>
              <p className="text-xs font-semibold text-white leading-snug">{n.label}</p>
              {n.sub && <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{n.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
