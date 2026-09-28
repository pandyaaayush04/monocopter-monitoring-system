import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KEY_LOCATIONS, KEY_TYPE_LABEL } from "@/data/mock-map"
import { STATUS_BADGE_CLASS, STATUS_LABEL } from "@/lib/status"

export function KeyLocationsTable() {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Key Locations</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="py-1 pr-2 font-medium">Type</th>
                <th className="py-1 pr-2 font-medium">Name</th>
                <th className="py-1 pr-2 font-medium">Distance</th>
                <th className="py-1 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {KEY_LOCATIONS.map((l) => (
                <tr key={l.id} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 text-muted-foreground">{KEY_TYPE_LABEL[l.type]}</td>
                  <td className="py-1.5 pr-2 font-medium">{l.name}</td>
                  <td className="py-1.5 pr-2 tabular-nums">{l.distanceM} m</td>
                  <td className="py-1.5">
                    <Badge className={STATUS_BADGE_CLASS[l.status]}>{STATUS_LABEL[l.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
