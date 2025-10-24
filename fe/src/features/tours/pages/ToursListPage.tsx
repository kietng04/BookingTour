import { useState } from 'react'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/common/SearchBar'
import { TourCard } from '@/components/cards/TourCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ToursGridSkeleton } from '@/components/common/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { useToursQuery } from '../hooks/useToursQuery'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ToursListPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)

  const { data, isLoading, error } = useToursQuery({
    keyword,
    page,
    size: 9,
  })

  const handleSearch = () => {
    setKeyword(searchKeyword)
    setPage(0)
  }

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNextPage = () => {
    if (data && page < data.totalPages - 1) {
      setPage((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="py-8">    
      <Container>
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Khám phá Tour Du Lịch</h1>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tìm kiếm và đặt tour du lịch phù hợp với bạn. Trải nghiệm những chuyến đi tuyệt vời cùng chúng tôi.
          </p>
          

          
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchKeyword}
              onChange={setSearchKeyword}
              onSearch={handleSearch}
              placeholder="Tìm kiếm tour theo tên, điểm đến..."
            />
          </div>
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <ToursGridSkeleton count={9} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        ) : data && data.content.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Hiển thị {data.content.length} tour (trang {page + 1}/{data.totalPages})
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.content.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Trang trước
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Trang {page + 1} / {data.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={page >= data.totalPages - 1}
                >
                  Trang sau
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Không tìm thấy tour nào"
            description="Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc"
          />
        )}
      </Container>
    </div>
  )
}

