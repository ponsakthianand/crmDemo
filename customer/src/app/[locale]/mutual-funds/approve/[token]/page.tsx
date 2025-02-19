import ApproveRequestClient from "@/src/app/[locale]/mutual-funds/approve/[token]/approve-request";

export default function MFApprovePage({ params }) {
  const { token } = params;
  return (
    <div className="min-h-screen bg-gray-100 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <ApproveRequestClient token={token} />
      </div>
    </div>
  )
}

