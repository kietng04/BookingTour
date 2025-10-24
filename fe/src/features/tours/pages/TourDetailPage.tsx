import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TourGallery } from '../components/TourGallery'
import { DeparturesTable } from '../components/DeparturesTable'
import { useTourQuery } from '../hooks/useTourQuery'
import { ArrowLeft, MapPin, Clock, Calendar, Users } from 'lucide-react'

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: tour, isLoading, error } = useTourQuery(id!)
  

  if (isLoading) {
    return (
      <div className="py-8">
        <Container>
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Không tìm thấy tour hoặc đã có lỗi xảy ra.</p>
            <Button onClick={() => navigate('/tours')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách tour
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Active: 'bg-green-500',
    Unactive: 'bg-gray-500',
    Full: 'bg-red-500',
    End: 'bg-blue-500',
  }

  return (
    <div className="py-8">
      <Container>
        <Button
          variant="ghost"
          onClick={() => navigate('/tours')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold">{tour.tourName}</h1>
                <Badge className={statusColors[tour.status] || 'bg-gray-500'}>
                  {tour.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.departurePoint} → {tour.mainDestination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{tour.days} ngày {tour.nights} đêm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(tour.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <TourGallery images={tour.images || []} tourName={tour.tourName} />

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Mô tả tour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {tour.description || 'Chưa có mô tả chi tiết cho tour này.'}
                </p>
              </CardContent>
            </Card>

            {/* Schedule */}
            {tour.schedules && tour.schedules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lịch trình tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tour.schedules
                      .sort((a, b) => a.dayNumber - b.dayNumber)
                      .map((schedule) => (
                        <div key={schedule.id} className="border-l-2 border-primary pl-4">
                          <h4 className="font-semibold mb-1">Ngày {schedule.dayNumber}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {schedule.scheduleDescription}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Departures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Lịch khởi hành
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeparturesTable departures={tour.departures || []} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Thông tin giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Giá người lớn</p>
                  <p className="text-2xl font-bold text-primary">
                    {tour.adultPrice.toLocaleString('vi-VN')} ₫
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Giá trẻ em</p>
                  <p className="text-xl font-semibold">
                    {tour.childPrice.toLocaleString('vi-VN')} ₫
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    {tour.departures?.length || 0} lịch khởi hành khả dụng
                  </p>
                </div>

                <Button className="w-full" size="lg" disabled={tour.status !== 'Active'}>
                  {tour.status === 'Active' ? 'Đặt tour ngay' : 'Không khả dụng'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Liên hệ với chúng tôi để được tư vấn chi tiết
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}

