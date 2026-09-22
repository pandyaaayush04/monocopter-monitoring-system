import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GasTrendsPage } from "@/pages/gas-trends-page"
import { EnvironmentInsightsContent } from "@/pages/environment-insights-content"

export function EnvironmentPage() {
  return (
    <div className="p-4 lg:p-6">
      <Tabs defaultValue="gas" className="gap-4">
        <TabsList>
          <TabsTrigger value="gas">Gas Trends</TabsTrigger>
          <TabsTrigger value="insights">Environment Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="gas">
          <GasTrendsPage />
        </TabsContent>
        <TabsContent value="insights">
          <EnvironmentInsightsContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
