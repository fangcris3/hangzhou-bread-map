import { useRef, useEffect } from 'react'
import L from 'leaflet'
import { SITE_CONFIG } from '../../data/config'
import type { Store } from '../../data/types'

interface Props {
  stores: Store[]
}

// 覆盖西湖区、拱墅区、上城区（11家店）
const MAP_CENTER: [number, number] = [30.292, 120.108]
const MAP_ZOOM = 12

const DISTRICT_COLORS: Record<string, string> = {
  '西湖区': '#4A90D9',
  '拱墅区': '#E8845A',
  '上城区': '#7A9B6A',
}

function getDistrictColor(neighborhood: string): string {
  return DISTRICT_COLORS[neighborhood] ?? '#C4893C'
}

function makeIcon(mapNumber: number, neighborhood: string) {
  const color = getDistrictColor(neighborhood)
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:28px;height:28px">
      <div style="position:relative;width:28px;height:28px;border-radius:50%;background:${color};border:2px solid #2C1A0A;display:flex;align-items:center;justify-content:center;box-shadow:2px 3px 10px rgba(44,26,10,.35)">
        <span style="font-family:'Courier Prime',monospace;font-size:10px;font-weight:700;color:#FAF3E4;line-height:1">${mapNumber}</span>
      </div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

export default function HangzhouMap({ stores }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  const mappedStores = stores.filter(s => s.lat != null && s.lng != null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    mappedStores.forEach(store => {
      const marker = L.marker([store.lat!, store.lng!], {
        icon: makeIcon(store.mapNumber, store.neighborhood),
      }).addTo(map)

      const distColor = getDistrictColor(store.neighborhood)
      const sigHtml = store.signatureItems?.length
        ? `<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:3px">${store.signatureItems.map((s: string) => `<span style="font-size:9px;border:1px solid ${distColor}66;color:${distColor};padding:1px 5px;border-radius:2px">${s}</span>`).join('')}</div>`
        : ''
      const badgeHtml = store.rating
        ? `<span style="font-size:9px;background:${store.rating === '强推' ? '#C4893C' : '#9E7A4A'};color:#FAF3E4;padding:1px 5px;border-radius:2px;margin-left:4px">${store.rating}</span>`
        : ''
      const warnHtml = store.confidence === 'low'
        ? `<div style="font-size:9px;color:#9E7A4A;margin-top:4px">⚠ 地址待核实</div>`
        : ''
      marker.bindPopup(`
        <div style="font-family:'Noto Serif SC',serif;min-width:150px">
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:3px">
            <span style="font-size:13px;font-weight:700;color:#2C1A0A">${store.name}</span>${badgeHtml}
          </div>
          <div style="font-size:10px;color:#9E7A4A;margin-bottom:3px">${store.neighborhood} · ${store.address}</div>
          ${sigHtml}${warnHtml}
        </div>
      `, { maxWidth: 230 })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="h-full w-full bg-paper bg-texture font-serif text-ink flex flex-col">
      {/* banner */}
      <div className="bg-grain shrink-0 px-8 py-3 flex items-center justify-between">
        <span className="font-display text-xl font-bold text-paper leading-none tracking-wide">杭州面包地图</span>
        {SITE_CONFIG.googleMapsUrl && (
          <a href={SITE_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="font-mono text-[9px] tracking-widest uppercase text-paper/70 hover:text-paper transition-colors">
            Google Maps ↗
          </a>
        )}
      </div>

      {/* body: map left + legend right */}
      <div className="flex-1 min-h-0 flex">

        {/* map */}
        <div className="flex-[65] min-w-0 p-5 flex flex-col">
          <p className="font-mono text-[10px] tracking-widest uppercase text-sepia mb-3">— 西湖区 · 拱墅区</p>
          <div
            ref={containerRef}
            className="flex-1 min-h-0 border border-dashed border-sepia/40 overflow-hidden rounded-sm"
            style={{ minHeight: 200 }}
          />
        </div>

        {/* legend */}
        <div className="flex-[35] min-w-0 border-l border-dashed border-ink/15 p-5 flex flex-col overflow-y-auto">
          <div className="pb-4 mb-4 border-b border-dashed border-ink/15">
            <p className="font-mono text-[10px] tracking-widest uppercase text-sepia mb-3">区域</p>
            <div className="flex flex-col gap-2">
              {Object.entries(DISTRICT_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-ink/30 shrink-0" style={{ background: color }} />
                  <span className="font-serif text-xs text-ink">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="font-mono text-[10px] tracking-widest uppercase text-sepia mb-4">店铺列表</p>

          {mappedStores.length === 0 ? (
            <p className="font-serif italic text-xs text-ink/40">暂无坐标数据。</p>
          ) : (
            <div className="space-y-3">
              {[...mappedStores].sort((a, b) => a.mapNumber - b.mapNumber).map(store => (
                <div key={store.id} className="flex items-start gap-3">
                  <div className="relative shrink-0 w-6 h-6 mt-0.5">
                    {store.isChain && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-terracotta border border-ink translate-x-[4px] translate-y-[4px] opacity-60" />
                        <div className="absolute inset-0 rounded-full bg-terracotta border border-ink translate-x-[2px] translate-y-[2px] opacity-80" />
                      </>
                    )}
                    <div className="relative w-6 h-6 rounded-full bg-terracotta border border-ink flex items-center justify-center">
                      <span className="font-mono text-[9px] font-bold text-paper">{store.mapNumber}</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-ink leading-tight truncate">{store.name}</p>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-sepia">{store.neighborhood}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
