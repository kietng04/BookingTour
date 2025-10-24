import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

const loginSchema = z.object({
  username: z.string().min(1, 'Username không được để trống'),
  password: z.string().min(1, 'Password không được để trống'),
  role: z.string().min(1, 'Role không được để trống'),
  token: z.string().min(1, 'Token không được để trống'),
  user: z.object({
    username: z.string().min(1, 'Username không được để trống'),
    fullName: z.string().min(1, 'Full name không được để trống'),
    role: z.string().min(1, 'Role không được để trống'),
  }),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'admin',
      password: 'admin',
    },
  })


  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data.username, data.password),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      toast.success('Đăng nhập thành công!')
      navigate('/')
    },
    onError: () => {
      toast.error('Đăng nhập thất bại')
    },
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register('username')} />
              {errors.username && <p className="text-sm text-destructive mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


