import Link from "next/link";
import { getPublishedChurches } from "@/lib/payload";

export const revalidate = 60;

export default async function HomePage() {
  const churches = await getPublishedChurches();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-slate-100">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
            Churches of Christ in Africa
          </p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Discover congregations and connect with fellow believers across the
            continent
          </h1>
          <p className="mt-6 text-base text-slate-200 sm:text-lg">
            This collaborative directory empowers local congregations to tell
            their story, keep information current, and stay connected with the
            wider family of God.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#directory"
              className="rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              Browse directory
            </Link>
            <Link
              href="/portal"
              className="rounded-full border border-white/50 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Editor portal
            </Link>
          </div>
        </div>
      </header>

      <section id="directory" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Featured congregations</h2>
          <p className="text-sm text-slate-600">
            Recently updated listings from across Africa. Search and filtering
            are coming next.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {churches.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No published congregations yet. Once churches begin publishing
              their pages, they will appear here automatically.
            </div>
          ) : (
            churches.map((church) => (
              <article
                key={church.id}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {church.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {[church.location?.city, church.location?.country]
                    .filter(Boolean)
                    .join(", ") || "Location coming soon"}
                </p>
                {church.denominationAffiliation ? (
                  <p className="mt-3 text-sm text-slate-500">
                    {church.denominationAffiliation}
                  </p>
                ) : null}
                <div className="mt-4 text-sm text-slate-600">
                  {church.contactInformation?.mainEmail ? (
                    <p>Email: {church.contactInformation.mainEmail}</p>
                  ) : null}
                  {church.contactInformation?.mainPhone ? (
                    <p>Phone: {church.contactInformation.mainPhone}</p>
                  ) : null}
                </div>
                <div className="mt-6">
                  <Link
                    href={`/churches/${church.id}`}
                    className="inline-flex items-center text-sm font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
