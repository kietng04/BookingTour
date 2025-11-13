package com.example.booking.dto.dashboard;

import java.math.BigDecimal;

public class DashboardStatsDTO {
    private RevenueStats revenue;
    private BookingStats bookings;
    private UserStats users;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(RevenueStats revenue, BookingStats bookings, UserStats users) {
        this.revenue = revenue;
        this.bookings = bookings;
        this.users = users;
    }

    public RevenueStats getRevenue() {
        return revenue;
    }

    public void setRevenue(RevenueStats revenue) {
        this.revenue = revenue;
    }

    public BookingStats getBookings() {
        return bookings;
    }

    public void setBookings(BookingStats bookings) {
        this.bookings = bookings;
    }

    public UserStats getUsers() {
        return users;
    }

    public void setUsers(UserStats users) {
        this.users = users;
    }

    public static class RevenueStats {
        private BigDecimal total;
        private BigDecimal confirmed;
        private BigDecimal pending;
        private Double change;

        public RevenueStats() {}

        public RevenueStats(BigDecimal total, BigDecimal confirmed, BigDecimal pending, Double change) {
            this.total = total;
            this.confirmed = confirmed;
            this.pending = pending;
            this.change = change;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public void setTotal(BigDecimal total) {
            this.total = total;
        }

        public BigDecimal getConfirmed() {
            return confirmed;
        }

        public void setConfirmed(BigDecimal confirmed) {
            this.confirmed = confirmed;
        }

        public BigDecimal getPending() {
            return pending;
        }

        public void setPending(BigDecimal pending) {
            this.pending = pending;
        }

        public Double getChange() {
            return change;
        }

        public void setChange(Double change) {
            this.change = change;
        }
    }

    public static class BookingStats {
        private Long total;
        private Long confirmed;
        private Long pending;
        private Long cancelled;
        private Double conversionRate;

        public BookingStats() {}

        public BookingStats(Long total, Long confirmed, Long pending, Long cancelled, Double conversionRate) {
            this.total = total;
            this.confirmed = confirmed;
            this.pending = pending;
            this.cancelled = cancelled;
            this.conversionRate = conversionRate;
        }

        public Long getTotal() {
            return total;
        }

        public void setTotal(Long total) {
            this.total = total;
        }

        public Long getConfirmed() {
            return confirmed;
        }

        public void setConfirmed(Long confirmed) {
            this.confirmed = confirmed;
        }

        public Long getPending() {
            return pending;
        }

        public void setPending(Long pending) {
            this.pending = pending;
        }

        public Long getCancelled() {
            return cancelled;
        }

        public void setCancelled(Long cancelled) {
            this.cancelled = cancelled;
        }

        public Double getConversionRate() {
            return conversionRate;
        }

        public void setConversionRate(Double conversionRate) {
            this.conversionRate = conversionRate;
        }
    }

    public static class UserStats {
        private Long total;
        private Long newUsers;
        private Long activeUsers;

        public UserStats() {}

        public UserStats(Long total, Long newUsers, Long activeUsers) {
            this.total = total;
            this.newUsers = newUsers;
            this.activeUsers = activeUsers;
        }

        public Long getTotal() {
            return total;
        }

        public void setTotal(Long total) {
            this.total = total;
        }

        public Long getNewUsers() {
            return newUsers;
        }

        public void setNewUsers(Long newUsers) {
            this.newUsers = newUsers;
        }

        public Long getActiveUsers() {
            return activeUsers;
        }

        public void setActiveUsers(Long activeUsers) {
            this.activeUsers = activeUsers;
        }
    }
}
