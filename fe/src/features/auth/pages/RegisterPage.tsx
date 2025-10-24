import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/Container'
import { useRegister } from '../hooks/useRegister'

const registerSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(1, 'Họ tên không được để trống'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { mutate: register, isPending } = useRegister()
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    register(data)
  }

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký</CardTitle>
              <CardDescription>
                Tạo tài khoản mới để bắt đầu đặt tour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    {...registerField('username')}
                    placeholder="Nhập tên đăng nhập"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerField('email')}
                    placeholder="Nhập email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    {...registerField('fullName')}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    {...registerField('password')}
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Đăng nhập ngay
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

      </Container>
    </div>
  )
}

