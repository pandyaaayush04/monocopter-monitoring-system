import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BatteryPage } from "@/pages/battery-page"
import { SystemStatusContent } from "@/pages/system-status-content"

export function MonocopterPage() {
  return (
    <div className="p-4 lg:p-6">
      <Tabs defaultValue="status" className="gap-4">
        <TabsList>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="battery">Battery</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <SystemStatusContent />
        </TabsContent>
        <TabsContent value="battery">
          <BatteryPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
