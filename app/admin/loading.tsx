export default function AdminLoading() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-12 w-64 animate-pulse bg-white" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse bg-white" />
        ))}
      </div>
      <div className="h-64 animate-pulse bg-white" />
      <div className="h-48 animate-pulse bg-white" />
    </div>
  )
}
