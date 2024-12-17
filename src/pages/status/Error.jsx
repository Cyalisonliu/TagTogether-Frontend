import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-100 bg-gray-900">
      <div className="p-6 text-center bg-gray-800 rounded-lg shadow-lg w-96">
        <h1 className="mb-4 text-4xl font-bold text-purple-500">Oops!</h1>
        <p className="mb-2 text-lg text-gray-300">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="italic text-gray-400">
          {error.statusText || error.message}
        </p>
      </div>
    </div>
  );
}
