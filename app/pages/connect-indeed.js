export default function ConnectIndeed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Connect Indeed</h1>
        <p className="text-gray-600 mb-4 text-center">
          Sync your Indeed account to manage your job postings and applicants
          seamlessly.
        </p>
        <a
          href="/api/connect-indeed"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Connect Indeed Account
        </a>
      </div>
    </div>
  );
}
