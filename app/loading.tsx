/**
 * Navigation fallback only. It must not become the page's indexable content.
 */
export default function Loading() {
  return (
    <div aria-hidden="true" className="min-h-screen bg-background">
      <div className="h-20 animate-pulse bg-muted" />
      <div className="min-h-[70vh] animate-pulse bg-muted/40" />
    </div>
  )
}
