export function CmsErrorBanner({ message }: { message: string }) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
      <p>
        <strong>CMS:</strong> {message}{" "}
        <span className="text-amber-800">
          Stellen Sie sicher, dass <code className="rounded bg-amber-100 px-1">HYGRAPH_ENDPOINT</code> gesetzt ist und
          Lese-Tokens als{" "}
          <code className="rounded bg-amber-100 px-1">HYGRAPH_PRODUCTION</code> /{" "}
          <code className="rounded bg-amber-100 px-1">HYGRAPH_PREVIEW_TOKEN</code> (oder{" "}
          <code className="rounded bg-amber-100 px-1">HYGRAPH_API_TOKEN</code>) in den Vercel-Umgebungsvariablen
          hinterlegt sind.
        </span>
      </p>
    </div>
  );
}
