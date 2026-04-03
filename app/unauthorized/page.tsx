export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500">Add <code className="bg-gray-100 px-1 rounded">?pin=XXXX</code> to the URL</p>
      </div>
    </div>
  );
}
