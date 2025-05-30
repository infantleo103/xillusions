import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const DatabasePage = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Database Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">Monitor and maintain database health</p>
      </div>

      {/* Responsive stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{/* stats cards */}</div>

      {/* Responsive tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tables" className="text-xs sm:text-sm">
            Tables
          </TabsTrigger>
          <TabsTrigger value="backups" className="text-xs sm:text-sm">
            Backups
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs sm:text-sm">
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Make tables scrollable on mobile */}
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Table Name</TableHead>
                      <TableHead className="min-w-[100px]">Records</TableHead>
                      <TableHead className="min-w-[100px]">Size</TableHead>
                      <TableHead className="min-w-[120px]">Last Updated</TableHead>
                      <TableHead className="min-w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* table content */}
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DatabasePage
