export default function Loading() {
  return (
    <div className="container-main flex min-h-[45vh] items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
        <p className="mt-4 text-sm text-gray-500">Loading FreshCart...</p>
      </div>
    </div>
  );
}
