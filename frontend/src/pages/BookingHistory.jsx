import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle, CreditCard, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, toursAPI } from '../services/api';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const pageSize = 5;

  useEffect(() => {
    if (user) {
      fetchBookingHistory(0);
    }
  }, [user]);

  const handlePageChange = (page) => {
    fetchBookingHistory(page);
  };

  const fetchBookingHistory = async (page = 0) => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching booking history for user:', user.userId, 'page:', page);
      
      const response = await bookingsAPI.getUserBookings(user.userId, {
        page: page.toString(),
        size: pageSize.toString()
      });
      console.log('API response:', response);
      
      if (response) {
        const bookingList = response.content || [];
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setCurrentPage(response.number || 0);
        
        const enrichedBookings = await Promise.all(
          bookingList.map(async (booking) => {
            let tourInfo = null;
            let departureInfo = null;
            
            try {
              if (booking.tourId) {
                tourInfo = await toursAPI.getById(booking.tourId);
              }
              
              if (tourInfo && tourInfo.departures && booking.departureId) {
                departureInfo = tourInfo.departures.find((dep) => dep.id === booking.departureId);
              }
              
              if (!departureInfo && booking.tourId && booking.departureId) {
                try {
                  const departuresResponse = await toursAPI.getDepartures(booking.tourId);
                  if (departuresResponse && departuresResponse.content) {
                    departureInfo = departuresResponse.content.find((dep) => dep.id === booking.departureId);
                  }
                } catch (depError) {
                  console.error('Error fetching departures separately:', depError);
                }
              }
            } catch (error) {
              console.error('Error fetching tour/departure info for booking', booking.id, ':', error);
            }
            
            let imageUrl = '/placeholder-tour.jpg';
            
            if (tourInfo?.images && Array.isArray(tourInfo.images) && tourInfo.images.length > 0) {
              const primaryImage = tourInfo.images.find((image) => image.isPrimary === true);
              
              if (primaryImage && primaryImage.imageUrl && primaryImage.imageUrl.trim() !== '') {
                imageUrl = primaryImage.imageUrl.trim();
              } else {
                for (let i = 0; i < tourInfo.images.length; i++) {
                  const img = tourInfo.images[i];
                  if (img && img.imageUrl && img.imageUrl.trim() !== '') {
                    imageUrl = img.imageUrl.trim();
                    break;
                  }
                }
              }
            }
            
            return {
              id: booking.id,
              userId: booking.userId,
              tourId: booking.tourId,
              departureId: booking.departureId,
              numSeats: booking.numSeats,
              totalAmount: booking.totalAmount,
              status: booking.status || 'PENDING',
              notes: booking.notes,
              paymentOverride: booking.paymentOverride,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              tourName: tourInfo?.tourName || tourInfo?.name || tourInfo?.title || `Tour #${booking.tourId}`,
              tourSlug: tourInfo?.slug || '',
              destination: tourInfo?.mainDestination || tourInfo?.destination || tourInfo?.location || tourInfo?.address || 'Đang cập nhật',
              tourImage: imageUrl,
              departureDate: departureInfo?.startDate || departureInfo?.departureDate || departureInfo?.date || null,
              departureInfo: departureInfo,
              bookingDate: booking.createdAt || booking.updatedAt || new Date().toISOString(),
              paymentStatus: booking.paymentStatus || 'PENDING',
              guestDetails: { adults: booking.numSeats || 1, children: 0 }
            };
            
            console.log(`📋 Booking ${booking.id} processed:`, {
              tourName: tourInfo?.tourName,
              departureId: booking.departureId,
              departureFound: !!departureInfo,
              departureDate: departureInfo?.startDate,
              rawDepartureInfo: departureInfo
            });
          })
        );
        
        setBookings(enrichedBookings);
      } else {
        setBookings([]);
        setTotalPages(0);
        setTotalElements(0);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
      setBookings([]);
      setTotalPages(0);
      setTotalElements(0);
      setCurrentPage(0);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'PENDING':
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'PENDING':
      default:
        return 'Chờ xử lý';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const handleCancelBooking = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      setCancellingBookingId(bookingToCancel.id);
      
      await bookingsAPI.cancel(bookingToCancel.id);
      
      setShowCancelModal(false);
      setBookingToCancel(null);
      
      fetchBookingHistory(currentPage);
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancellingBookingId(null);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'FAILED':
        return 'Thanh toán thất bại';
      case 'PENDING':
      default:
        return 'Chờ thanh toán';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Invalid Date') {
      return 'Chưa xác định';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
        return 'Chưa xác định';
      }
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Chưa xác định';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lịch sử đặt tour...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đặt tour</h1>
        <p className="text-gray-600">Quản lý và theo dõi các chuyến đi của bạn</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bạn hiện chưa đặt tour nào cả, hãy đến đặt tour để đi du lịch !!!</h3>
          <a
            href="/tours"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Khám phá tour
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Tour Image */}
                  <div className="lg:w-48 lg:flex-shrink-0">
                    <img
                      src={booking.tourImage || '/placeholder-tour.jpg'}
                      alt={booking.tourName}
                      className="w-full h-32 lg:h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Tour Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.tourName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.destination}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">Ngày khởi hành</div>
                          <div>{formatDate(booking.departureDate)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">Số khách</div>
                          <div>
                            {booking.guestDetails?.adults || booking.numSeats || 1} người lớn
                            {(booking.guestDetails?.children || 0) > 0 && `, ${booking.guestDetails?.children} trẻ em`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">Tổng tiền</div>
                          <div className="text-brand-600 font-semibold">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Đặt ngày {formatDate(booking.bookingDate)}
                        <span className="mx-2">•</span>
                        <span className={`font-medium ${booking.paymentStatus === 'PAID' ? 'text-green-600' : booking.paymentStatus === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {getPaymentStatusText(booking.paymentStatus)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <a
                          href={`/tours/${booking.tourSlug}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                        >
                          Xem chi tiết
                        </a>
                        {(() => {
                          let departureDate = null;
                          let departureDateString = booking.departureDate || booking.departureInfo?.startDate || booking.departureInfo?.departureDate || booking.startDate;
                          
                          if (departureDateString && departureDateString !== 'Invalid Date') {
                            try {
                              departureDate = new Date(departureDateString);
                              if (isNaN(departureDate.getTime())) {
                                departureDate = null;
                              }
                            } catch (error) {
                              console.error('Error parsing departure date:', departureDateString, error);
                              departureDate = null;
                            }
                          }
                          
                          const currentDate = new Date();
                          const isBeforeDeparture = departureDate && departureDate > currentDate;
                          
                          console.log('🔍 Booking Cancel Debug:', {
                            bookingId: booking.id,
                            status: booking.status,
                            originalDepartureDate: booking.departureDate,
                            departureDateString: departureDateString,
                            parsedDepartureDate: departureDate ? departureDate.toISOString() : 'NULL',
                            currentDate: currentDate.toISOString(),
                            isBeforeDeparture: isBeforeDeparture,
                            departureInfo: booking.departureInfo,
                            timeDiff: departureDate ? `${Math.ceil((departureDate - currentDate) / (1000 * 60 * 60 * 24))} ngày` : 'N/A'
                          });
                          
                          const isPending = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
                          const isNotCancelled = booking.status !== 'CANCELLED';
                          const canCancelTour = isPending && isBeforeDeparture && isNotCancelled;
                          
                          if (canCancelTour) {
                            return (
                              <button 
                                onClick={() => handleCancelBooking(booking)}
                                disabled={cancellingBookingId === booking.id}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancellingBookingId === booking.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                    Đang hủy...
                                  </>
                                ) : (
                                  'Hủy đặt tour'
                                )}
                              </button>
                            );
                          } else if (booking.status === 'CANCELLED') {
                            return (
                              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                                Đã hủy
                              </span>
                            );
                          } else if (!isBeforeDeparture && departureDate) {
                            const daysPast = Math.floor((currentDate - departureDate) / (1000 * 60 * 60 * 24));
                            return (
                              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-md" title={`Đã khởi hành ${daysPast} ngày trước`}>
                                Đã khởi hành - Không thể hủy
                              </span>
                            );
                          } else if (!departureDate) {
                            return (
                              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 rounded-md" title="Không tìm thấy thông tin ngày khởi hành">
                                Chưa có ngày khởi hành
                              </span>
                            );
                          } else if (!isPending) {
                            return (
                              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-md" title={`Trạng thái: ${booking.status}`}>
                                Không thể hủy ({getStatusText(booking.status)})
                              </span>
                            );
                          } else {
                            return (
                              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-md" title="Điều kiện hủy tour không thỏa mãn">
                                Không thể hủy
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${
                  currentPage === i
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && bookingToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận hủy tour</h3>
              <button 
                onClick={closeCancelModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn hủy tour <strong>{bookingToCancel.tourName}</strong> không?
              </p>
              
              {/* Thông tin booking */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Thông tin booking:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Mã booking:</strong> {bookingToCancel.id}</p>
                  <p><strong>Trạng thái:</strong> {bookingToCancel.status}</p>
                  {bookingToCancel.totalAmount && (
                    <p><strong>Số tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookingToCancel.totalAmount)}</p>
                  )}
                  {bookingToCancel.departureDate && (
                    <p><strong>Ngày khởi hành:</strong> {new Date(bookingToCancel.departureDate).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Chính sách hủy tour:</strong><br/>
                  • Số tiền đã thanh toán sẽ được hoàn trả trong vòng 3-5 ngày làm việc<br/>
                  • Số lượng chỗ sẽ được khôi phục tự động<br/>
                  • Bạn sẽ nhận được email xác nhận hủy tour
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeCancelModal}
                disabled={cancellingBookingId === bookingToCancel.id}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={cancellingBookingId === bookingToCancel.id}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancellingBookingId === bookingToCancel.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang hủy...
                  </>
                ) : (
                  'Xác nhận hủy'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;