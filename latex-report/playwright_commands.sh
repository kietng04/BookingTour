#!/bin/bash

# ============================================
# PLAYWRIGHT MCP SCREENSHOT AUTOMATION SCRIPT
# BookingTour - J2EE Report
# ============================================

echo "=========================================="
echo "BookingTour UI Screenshots Automation"
echo "=========================================="
echo ""

# Change to latex-report directory
cd "$(dirname "$0")"

# Create output directory if not exists
mkdir -p images/ui

echo "📁 Output directory: $(pwd)/images/ui"
echo ""

# ============================================
# PREREQUISITE CHECK
# ============================================
echo "⚠️  PREREQUISITES:"
echo "1. All services must be running (docker-compose up)"
echo "2. Frontend must be running (cd frontend && npm run dev)"
echo "3. Admin frontend must be running (cd frontend-admin && npm run dev)"
echo "4. Database must be seeded with sample data"
echo ""
read -p "Press ENTER to continue or Ctrl+C to cancel..."
echo ""

# ============================================
# SCREENSHOT 1: Eureka Dashboard
# ============================================
echo "📸 [1/18] Capturing Eureka Dashboard..."
playwright screenshot http://localhost:8761/ \
  --output images/ui/01_eureka_dashboard.png \
  --viewport-size=1920,1080 \
  --wait-until=networkidle

if [ $? -eq 0 ]; then
    echo "✅ Saved: 01_eureka_dashboard.png"
else
    echo "❌ Failed: 01_eureka_dashboard.png"
fi
echo ""

# ============================================
# SCREENSHOT 2: Login Page
# ============================================
echo "📸 [2/18] Capturing Login Page..."
playwright screenshot http://localhost:3000/login \
  --output images/ui/02_login.png \
  --viewport-size=1366,768

if [ $? -eq 0 ]; then
    echo "✅ Saved: 02_login.png"
else
    echo "❌ Failed: 02_login.png"
fi
echo ""

# ============================================
# SCREENSHOT 3: Register Page
# ============================================
echo "📸 [3/18] Capturing Register Page..."
playwright screenshot http://localhost:3000/register \
  --output images/ui/03_register.png \
  --viewport-size=1366,768

if [ $? -eq 0 ]; then
    echo "✅ Saved: 03_register.png"
else
    echo "❌ Failed: 03_register.png"
fi
echo ""

# ============================================
# SCREENSHOT 4: Homepage
# ============================================
echo "📸 [4/18] Capturing Homepage (full page)..."
playwright screenshot http://localhost:3000/ \
  --output images/ui/04_homepage.png \
  --viewport-size=1920,1080 \
  --full-page

if [ $? -eq 0 ]; then
    echo "✅ Saved: 04_homepage.png"
else
    echo "❌ Failed: 04_homepage.png"
fi
echo ""

# ============================================
# SCREENSHOT 5: Tour Explore Page
# ============================================
echo "📸 [5/18] Capturing Tour Explore Page..."
playwright screenshot http://localhost:3000/tours \
  --output images/ui/05_tour_explore.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 05_tour_explore.png"
else
    echo "❌ Failed: 05_tour_explore.png"
fi
echo ""

# ============================================
# SCREENSHOT 6: Tour Detail Page
# ============================================
echo "📸 [6/18] Capturing Tour Detail Page..."
echo "⚠️  Note: Replace 'sample-tour-slug' with actual tour slug from database"
# Replace with actual tour slug
TOUR_SLUG="ha-long-bay-2-ngay-1-dem"
playwright screenshot "http://localhost:3000/tours/${TOUR_SLUG}" \
  --output images/ui/06_tour_detail.png \
  --viewport-size=1920,1080 \
  --full-page \
  --wait-until=networkidle

if [ $? -eq 0 ]; then
    echo "✅ Saved: 06_tour_detail.png"
else
    echo "❌ Failed: 06_tour_detail.png (Check if tour exists)"
fi
echo ""

# ============================================
# SCREENSHOT 7: Reviews Page
# ============================================
echo "📸 [7/18] Capturing Reviews Page..."
playwright screenshot http://localhost:3000/reviews \
  --output images/ui/07_reviews.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 07_reviews.png"
else
    echo "❌ Failed: 07_reviews.png"
fi
echo ""

# ============================================
# SCREENSHOT 8: Booking Page
# ============================================
echo "📸 [8/18] Capturing Booking Page..."
echo "⚠️  Note: This may require authentication. Skipping if not logged in."
playwright screenshot "http://localhost:3000/booking?tourId=1&departureId=1" \
  --output images/ui/08_booking.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 08_booking.png"
else
    echo "❌ Failed: 08_booking.png (Requires login)"
fi
echo ""

# ============================================
# SCREENSHOT 9: Payment Success Page
# ============================================
echo "📸 [9/18] Capturing Payment Success Page..."
playwright screenshot "http://localhost:3000/payment-status?status=success&bookingId=1" \
  --output images/ui/09_payment_success.png \
  --viewport-size=1366,768

if [ $? -eq 0 ]; then
    echo "✅ Saved: 09_payment_success.png"
else
    echo "❌ Failed: 09_payment_success.png"
fi
echo ""

# ============================================
# SCREENSHOT 10: Booking History
# ============================================
echo "📸 [10/18] Capturing Booking History..."
echo "⚠️  Note: Requires authentication. Skipping if not logged in."
playwright screenshot http://localhost:3000/booking-history \
  --output images/ui/10_booking_history.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 10_booking_history.png"
else
    echo "❌ Failed: 10_booking_history.png (Requires login)"
fi
echo ""

# ============================================
# SCREENSHOT 11: My Reviews
# ============================================
echo "📸 [11/18] Capturing My Reviews..."
echo "⚠️  Note: Requires authentication. Skipping if not logged in."
playwright screenshot http://localhost:3000/my-reviews \
  --output images/ui/11_my_reviews.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 11_my_reviews.png"
else
    echo "❌ Failed: 11_my_reviews.png (Requires login)"
fi
echo ""

# ============================================
# ADMIN FRONTEND SCREENSHOTS
# ============================================
echo "=========================================="
echo "Admin Frontend Screenshots"
echo "=========================================="
echo ""

# ============================================
# SCREENSHOT 12: Admin Dashboard
# ============================================
echo "📸 [12/18] Capturing Admin Dashboard..."
echo "⚠️  Note: Requires admin authentication."
playwright screenshot http://localhost:5174/dashboard \
  --output images/ui/12_admin_dashboard.png \
  --viewport-size=1920,1080 \
  --full-page \
  --wait-until=networkidle

if [ $? -eq 0 ]; then
    echo "✅ Saved: 12_admin_dashboard.png"
else
    echo "❌ Failed: 12_admin_dashboard.png (Requires admin login)"
fi
echo ""

# ============================================
# SCREENSHOT 13: Admin Tours List
# ============================================
echo "📸 [13/18] Capturing Admin Tours List..."
playwright screenshot http://localhost:5174/tours \
  --output images/ui/13_admin_tours.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 13_admin_tours.png"
else
    echo "❌ Failed: 13_admin_tours.png (Requires admin login)"
fi
echo ""

# ============================================
# SCREENSHOT 14: Admin Tour Create
# ============================================
echo "📸 [14/18] Capturing Admin Tour Create Form..."
playwright screenshot http://localhost:5174/tours/create \
  --output images/ui/14_admin_tour_create.png \
  --viewport-size=1920,1080 \
  --full-page

if [ $? -eq 0 ]; then
    echo "✅ Saved: 14_admin_tour_create.png"
else
    echo "❌ Failed: 14_admin_tour_create.png (Requires admin login)"
fi
echo ""

# ============================================
# SCREENSHOT 15: Admin Departures
# ============================================
echo "📸 [15/18] Capturing Admin Departures..."
playwright screenshot http://localhost:5174/departures \
  --output images/ui/15_admin_departures.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 15_admin_departures.png"
else
    echo "❌ Failed: 15_admin_departures.png (Requires admin login)"
fi
echo ""

# ============================================
# SCREENSHOT 16: Admin Bookings
# ============================================
echo "📸 [16/18] Capturing Admin Bookings..."
playwright screenshot http://localhost:5174/bookings \
  --output images/ui/16_admin_bookings.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 16_admin_bookings.png"
else
    echo "❌ Failed: 16_admin_bookings.png (Requires admin login)"
fi
echo ""

# ============================================
# SCREENSHOT 17: Admin Reviews
# ============================================
echo "📸 [17/18] Capturing Admin Reviews..."
playwright screenshot http://localhost:5174/reviews \
  --output images/ui/17_admin_reviews.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 17_admin_reviews.png"
else
    echo "❌ Failed: 17_admin_reviews.png (Requires admin login)"
fi
echo ""

# ============================================
# SCREENSHOT 18: Admin Users
# ============================================
echo "📸 [18/18] Capturing Admin Users..."
playwright screenshot http://localhost:5174/users \
  --output images/ui/18_admin_users.png \
  --viewport-size=1920,1080

if [ $? -eq 0 ]; then
    echo "✅ Saved: 18_admin_users.png"
else
    echo "❌ Failed: 18_admin_users.png (Requires admin login)"
fi
echo ""

# ============================================
# SUMMARY
# ============================================
echo "=========================================="
echo "Screenshot Capture Complete!"
echo "=========================================="
echo ""
echo "📊 Summary:"
echo "   Total screenshots: 18"
echo "   Output directory: $(pwd)/images/ui/"
echo ""
echo "⚠️  Notes:"
echo "   - Some screenshots may require authentication"
echo "   - For authenticated pages, please login manually first"
echo "   - Or use Playwright scripts with authentication"
echo ""
echo "📋 Next Steps:"
echo "   1. Review all screenshots in images/ui/"
echo "   2. Retake any failed screenshots manually"
echo "   3. Capture source code screenshots (see README_IMAGES.md)"
echo "   4. Create diagrams (see README_IMAGES.md)"
echo "   5. Compile LaTeX report (pdflatex report.tex)"
echo ""
echo "✨ Done!"
