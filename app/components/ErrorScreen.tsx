import Link from 'next/link';

interface ErrorScreenProps {
  /** The error message to display */
  message?: string;
  /** URL to navigate back to (defaults to routines) */
  backUrl?: string;
  /** Text for the back link */
  backText?: string;
}

/**
 * Full-screen error display
 * Used across workout pages for consistent error UX
 */
export default function ErrorScreen({
  message = 'Something went wrong',
  backUrl = '/routines',
  backText = 'Back to routines',
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-white text-2xl mb-4">{message}</div>
        <Link href={backUrl} className="text-blue-400 hover:text-blue-300">
          {backText}
        </Link>
      </div>
    </div>
  );
}
