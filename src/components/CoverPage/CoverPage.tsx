export default function CoverPage() {
  return (
    <div className="h-full w-full bg-paper bg-texture relative overflow-hidden flex flex-col">

      {/* top rule */}
      <div className="shrink-0 mx-8 mt-8 border-t-2 border-ink" />

      {/* header row */}
      <div className="shrink-0 mx-8 mt-3 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-sepia">Field Guide · 路书</span>
        <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-sepia">杭州 · Hangzhou</span>
      </div>

      {/* hero title block */}
      <div className="flex-1 flex flex-col justify-center px-8">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-terracotta mb-4">No. 001</p>

        <h1 className="font-display leading-none text-ink mb-2" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
          杭州
        </h1>
        <h1 className="font-display leading-none text-ink mb-6" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
          面包地图
        </h1>

        {/* divider with wheat motif */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-ink/25" />
          <svg viewBox="0 0 32 16" className="w-8 h-4 text-terracotta" fill="currentColor">
            <ellipse cx="8" cy="8" rx="6" ry="3.5" />
            <ellipse cx="16" cy="8" rx="6" ry="3.5" opacity="0.6" />
            <ellipse cx="24" cy="8" rx="6" ry="3.5" opacity="0.35" />
          </svg>
          <div className="flex-1 h-px bg-ink/25" />
        </div>

        <p className="font-serif text-sm text-ink/70 leading-relaxed max-w-xs">
          一份用脚丈量出来的面包地图。<br />
          记录西湖边的烤炉，运河旁的酸种，<br />
          以及每一个值得专程跑一趟的理由。
        </p>
      </div>

      {/* bottom info strip */}
      <div className="shrink-0 mx-8 mb-8">
        <div className="border-t border-dashed border-ink/20 pt-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-[8px] tracking-widest uppercase text-sepia mb-0.5">覆盖区域</p>
            <p className="font-serif text-xs text-ink">西湖 · 拱墅 · 上城 · 滨江 · 江干</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8px] tracking-widest uppercase text-sepia mb-0.5">评分维度</p>
            <p className="font-serif text-xs text-ink">酥脆 · 松软 · 风味</p>
          </div>
        </div>
      </div>

      {/* bottom rule */}
      <div className="shrink-0 mx-8 mb-0 border-b-2 border-ink" />

      {/* corner stamp */}
      <div className="absolute top-16 right-8 -rotate-12 origin-center">
        <div className="border-2 border-terracotta px-3 py-2 rounded-sm">
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-terracotta text-center leading-tight">
            Personal<br />Guide
          </p>
        </div>
      </div>

    </div>
  )
}
