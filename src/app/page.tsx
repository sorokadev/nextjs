export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-zinc-600">Mini-app</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">
              Forms Dashboard
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              Create and manage forms fast. Roles, validation, SSR/SSG, SEO — all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                Sign in
              </a>
              <a
                href="/forms"
                className="inline-flex items-center justify-center rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                Go to forms
              </a>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-3 w-2/3 rounded bg-zinc-100" />
              <div className="h-3 w-5/6 rounded bg-zinc-100" />
              <div className="h-3 w-3/4 rounded bg-zinc-100" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border bg-zinc-50 p-4">
                  <div className="text-xs text-zinc-600">Roles</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">Admin / Individual</div>
                </div>
                <div className="rounded-2xl border bg-zinc-50 p-4">
                  <div className="text-xs text-zinc-600">Statuses</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">
                    Draft / Active / Archived
                  </div>
                </div>
                <div className="rounded-2xl border bg-zinc-50 p-4">
                  <div className="text-xs text-zinc-600">API</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">Route Handlers</div>
                </div>
              </div>
              <p className="text-sm text-zinc-600">
                Under the hood: Next.js App Router, Zod (client+server), Zustand, MongoDB Atlas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
