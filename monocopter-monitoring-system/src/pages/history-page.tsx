import { HistoryDetailCard } from "@/components/history/history-detail-card"
import { HistoryTable } from "@/components/history/history-table"
import { useMockHistoryFeed } from "@/hooks/use-mock-history-feed"

export function HistoryPage() {
  const { sessions, selected, selectedId, select } = useMockHistoryFeed()

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 lg:p-6">
      <HistoryTable sessions={sessions} selectedId={selectedId} onSelect={select} />
      {selected && <HistoryDetailCard session={selected} />}
    </div>
  )
}
