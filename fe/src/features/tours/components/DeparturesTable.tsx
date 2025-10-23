import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users } from 'lucide-react'
import type { Departure } from '@/lib/types'

interface DeparturesTableProps {
  departures: Departure[]
}

const statusLabels: Record<string, string> = {
  ConCho: 'Còn chỗ',
  SapFull: 'Sắp full',
  Full: 'Hết chỗ',
  DaKhoiHanh: 'Đã khởi hành',
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
  ConCho: 'default',
  SapFull: 'secondary',
  Full: 'destructive',
  DaKhoiHanh: 'secondary',
}

export function DeparturesTable({ departures }: DeparturesTableProps) {
  if (!departures || departures.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Chưa có lịch khởi hành
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-semibold">Ngày khởi hành</th>
            <th className="text-left p-4 font-semibold">Ngày kết thúc</th>
            <th className="text-center p-4 font-semibold">Số chỗ còn lại</th>
            <th className="text-center p-4 font-semibold">Trạng thái</th>
            <th className="text-center p-4 font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {departures.map((departure) => (
            <tr key={departure.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(departure.startDate)}</span>
                </div>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(departure.endDate)}</span>
                </div>
              </td>

              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {departure.remainingSlots}/{departure.totalSlots}
                  </span>
                </div>
              </td>


              <td className="p-4 text-center">
                <Badge variant={statusColors[departure.status] || 'default'}>
                  {statusLabels[departure.status] || departure.status}
                </Badge>
              </td>


              <td className="p-4 text-center">
                <Button
                  size="sm"
                  disabled={departure.status === 'Full' || departure.status === 'DaKhoiHanh'}
                >
                  {departure.status === 'Full' ? 'Hết chỗ' : 
                   departure.status === 'DaKhoiHanh' ? 'Đã khởi hành' : 
                   'Đặt ngay'}
                </Button>
              </td>


              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

