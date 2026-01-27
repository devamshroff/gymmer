/**
 * Full-screen loading indicator
 * Used across workout pages for consistent loading UX
 */
export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}
