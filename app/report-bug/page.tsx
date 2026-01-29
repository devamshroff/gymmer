const statusMessages = {
  sent: {
    title: 'Thanks for the report!',
    body: 'Your bug report is on its way. We will take a look shortly.'
  },
  error: {
    title: 'Something went wrong',
    body: 'We could not send your report. Please try again in a moment.'
  },
  'invalid-file': {
    title: 'Screenshot not accepted',
    body: 'Please upload a PNG, JPG, GIF, or WEBP image under 5MB.'
  }
} as const;

type ReportBugPageProps = {
  searchParams?: {
    status?: keyof typeof statusMessages;
  };
};

export default function ReportBugPage({ searchParams }: ReportBugPageProps) {
  const status = searchParams?.status;
  const message = status ? statusMessages[status] : null;

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Report a bug
          </p>
          <h1 className="text-3xl font-bold">Help us squash this bug</h1>
          <p className="text-zinc-300">
            Tell us what went wrong and where you saw it. Screenshots help us fix issues faster.
          </p>
        </header>

        {message && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
            <p className="font-semibold">{message.title}</p>
            <p className="text-sm text-zinc-300">{message.body}</p>
          </div>
        )}

        <div className="space-y-4 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-6">
          <form
            action="/api/report-bug"
            method="post"
            encType="multipart/form-data"
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-zinc-200">
                What happened?
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Describe the bug and what you expected to happen."
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="steps" className="text-sm font-semibold text-zinc-200">
                Steps to reproduce (optional)
              </label>
              <textarea
                id="steps"
                name="steps"
                rows={4}
                placeholder="1. Go to ...\n2. Click ...\n3. See the error"
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="screenshot" className="text-sm font-semibold text-zinc-200">
                Screenshot (strongly recommended)
              </label>
              <input
                id="screenshot"
                name="screenshot"
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-600"
              />
              <p className="text-xs text-zinc-500">PNG, JPG, GIF, or WEBP up to 5MB.</p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Send report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
