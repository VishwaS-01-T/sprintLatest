function EmptyState({ title, description, action = null }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
      <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export default EmptyState
