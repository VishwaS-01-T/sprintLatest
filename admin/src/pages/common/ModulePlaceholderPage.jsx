import PageHeader from '@/components/shared/PageHeader'

function ModulePlaceholderPage({ title }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description="This module scaffold is ready. Add feature-specific tables, forms, and charts next."
      />

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10">
        <h2 className="font-display text-xl font-semibold text-slate-900">{title} Module</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          The navigation, route, and layout for {title.toLowerCase()} are already wired. You can now
          connect API endpoints and business flows for this section.
        </p>
      </div>
    </div>
  )
}

export default ModulePlaceholderPage
