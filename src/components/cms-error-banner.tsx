export function CmsErrorBanner({ message }: { message: string }) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
      <p>
        <strong>CMS:</strong> {message}{" "}
        <span className="text-amber-800">
          Stellen Sie sicher, dass <code className="rounded bg-amber-100 px-1">HYGRAPH_ENDPOINT</code> gesetzt ist und
          bei Bedarf ein Lese-Token als{" "}
          <code className="rounded bg-amber-100 px-1">HYGRAPH_API_TOKEN</code> in den Vercel-Umgebungsvariablen
          hinterlegt ist.
        </span>
      </p>
    </div>
  );
}
