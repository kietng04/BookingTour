import { Container } from './Container'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">

      <Container>


        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">BookingTour</h3>
            <p className="text-sm text-muted-foreground">
              Khám phá những điểm đến tuyệt vời cùng chúng tôi. 
              Trải nghiệm du lịch đáng nhớ với dịch vụ tốt nhất.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Liên kết</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@bookingtour.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BookingTour. All rights reserved.
        </div>

      </Container>


      
    </footer>
  )
}

