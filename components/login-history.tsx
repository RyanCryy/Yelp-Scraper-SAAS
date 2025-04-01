import { formatDistanceToNow } from "date-fns"

interface LoginHistoryProps {
  history: string[]
}

export function LoginHistory({ history }: LoginHistoryProps) {
  // Ensure history is an array
  const safeHistory = Array.isArray(history) ? history : []

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-6">Login History</h2>

      {safeHistory.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No login history available</div>
      ) : (
        <div className="space-y-4">
          {safeHistory.map((dateString, index) => {
            try {
              // Parse the ISO string into a Date object
              const dateObj = new Date(dateString)

              // Verify it's a valid date
              if (isNaN(dateObj.getTime())) {
                return (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <p className="text-base text-gray-500">Invalid date</p>
                  </div>
                )
              }

              return (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <p className="text-base text-gray-900">{dateObj.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{formatDistanceToNow(dateObj, { addSuffix: true })}</p>
                </div>
              )
            } catch (error) {
              return (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <p className="text-base text-gray-500">Error displaying date</p>
                </div>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

