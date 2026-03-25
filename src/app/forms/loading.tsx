export default function FormsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="h-7 w-48 rounded bg-zinc-100" />
        <div className="h-9 w-28 rounded bg-zinc-100" />
      </div>

      <div className="mt-6 flex gap-3">
        <div className="h-10 w-44 rounded bg-zinc-100" />
        <div className="h-10 w-44 rounded bg-zinc-100" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <div className="grid grid-cols-12 gap-4 border-b bg-zinc-50 px-4 py-3">
          <div className="col-span-5 h-3 rounded bg-zinc-100" />
          <div className="col-span-3 h-3 rounded bg-zinc-100" />
          <div className="col-span-2 h-3 rounded bg-zinc-100" />
          <div className="col-span-2 h-3 rounded bg-zinc-100" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 border-b px-4 py-4 last:border-b-0">
            <div className="col-span-5 space-y-2">
              <div className="h-3 w-3/4 rounded bg-zinc-100" />
              <div className="h-3 w-1/2 rounded bg-zinc-100" />
            </div>
            <div className="col-span-3 h-3 w-2/3 rounded bg-zinc-100" />
            <div className="col-span-2 h-6 w-20 rounded-full bg-zinc-100" />
            <div className="col-span-2 h-3 w-24 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

