export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins}m`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`
  return formatDate(dateString)
}

export function getConditionLabel(condition: string): string {
  const map: Record<string, string> = {
    como_nuevo: 'Como nuevo',
    muy_buen_estado: 'Muy buen estado',
    buen_estado: 'Buen estado',
    usado: 'Usado',
    para_reparar: 'Para reparar',
  }
  return map[condition] ?? condition
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Activo',
    reserved: 'Reservado',
    sold: 'Vendido',
  }
  return map[status] ?? status
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    reserved: 'bg-amber-100 text-amber-700',
    sold: 'bg-slate-100 text-slate-500',
  }
  return map[status] ?? 'bg-slate-100 text-slate-500'
}
