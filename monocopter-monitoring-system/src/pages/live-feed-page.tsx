import { VideoPanel } from "@/components/live-feed/video-panel"
import { DetectionStatusCard } from "@/components/live-feed/detection-status-card"
import { DetectionHistoryTable } from "@/components/live-feed/detection-history-table"
import { useDetectionFeed } from "@/hooks/use-detection-feed"

export function LiveFeedPage() {
  const { event, online, cameraOpen, history } = useDetectionFeed()

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_320px] lg:p-6">
      <VideoPanel online={online} cameraOpen={cameraOpen} />

      <div className="flex flex-col gap-4">
        <DetectionStatusCard event={event} />
        <DetectionHistoryTable history={history} />
      </div>
    </div>
  )
}
