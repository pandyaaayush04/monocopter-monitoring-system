import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const ACTIONS = ["Set Waypoint", "Send Monocopter Here", "Mark Hazard Zone", "Add Note"]

export function QuickActionsCard() {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
        <p className="text-muted-foreground text-xs">Command uplink arrives with the real monocopter</p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 px-4">
        {ACTIONS.map((a) => (
          <Tooltip key={a}>
            <TooltipTrigger asChild>
              <span>
                <Button variant="outline" size="sm" disabled>
                  {a}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Available once command uplink is connected</TooltipContent>
          </Tooltip>
        ))}
      </CardContent>
    </Card>
  )
}
