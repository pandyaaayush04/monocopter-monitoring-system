import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { DetectionEvent } from "@/lib/detection-types"

export function DetectionHistoryTable({ history }: { history: DetectionEvent[] }) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="flex-row items-center justify-between px-4">
        <CardTitle className="text-sm font-semibold">Detection History (Recent)</CardTitle>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        <Table>
          <TableBody>
            {history.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground py-2 pl-0 font-mono text-xs tabular-nums">
                  {row.time}
                </TableCell>
                <TableCell className="py-2 text-xs font-medium">{row.label}</TableCell>
                <TableCell className="py-2 pr-0 text-right text-xs font-medium">
                  {row.confidence ? `${Math.round(row.confidence * 100)}%` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
