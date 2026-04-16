/**
 * 클라이언트 포털 로그인 폼 컴포넌트
 * React Hook Form + Zod + useActionState 조합
 * Client Component (폼 상호작용 처리)
 */

'use client'

import { useActionState, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { loginAction } from '@/app/(client-auth)/client-login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { ClientLoginResult } from '@/types/client'

/**
 * 로그인 폼 유효성 검증 스키마
 */
const loginFormSchema = z.object({
  /** 이메일 주소 */
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
  /** 접속 토큰 */
  token: z.string().min(1, '접속 토큰을 입력해주세요.'),
})

/** 로그인 폼 입력 타입 */
type LoginFormValues = z.infer<typeof loginFormSchema>

/** useActionState 초기 상태 */
const initialState: ClientLoginResult = {
  success: false,
  message: '',
}

/**
 * 클라이언트 포털 로그인 폼
 * useActionState로 Server Action 연결, React Hook Form으로 클라이언트 유효성 검증
 */
export function ClientLoginForm() {
  // 접속 토큰 표시/숨기기 상태
  const [showToken, setShowToken] = useState(false)

  // useActionState로 Server Action 에러 상태 관리
  const [state, formAction] = useActionState(loginAction, initialState)

  // useTransition으로 pending 상태 관리 (formAction을 직접 호출할 때 필수)
  const [isPending, startTransition] = useTransition()

  // React Hook Form 설정 (클라이언트 유효성 검증)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      token: '',
    },
  })

  /**
   * 폼 제출 핸들러
   * React Hook Form 유효성 검증 통과 후 Server Action 호출
   */
  function handleSubmit(values: LoginFormValues) {
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('token', values.token)
    // startTransition 내부에서 호출해야 isPending이 정상 동작
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5"
        noValidate
      >
        {/* Server Action 에러 메시지 표시 */}
        {state.message && !state.success && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {/* 이메일 입력 필드 */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  autoComplete="email"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 접속 토큰 입력 필드 (보기/숨기기 토글 포함) */}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>접속 토큰</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showToken ? 'text' : 'password'}
                    placeholder="발급받은 접속 토큰을 입력하세요"
                    autoComplete="current-password"
                    disabled={isPending}
                    className="pr-10"
                    {...field}
                  />
                  {/* 토큰 표시/숨기기 토글 버튼 */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowToken(prev => !prev)}
                    tabIndex={-1}
                    aria-label={
                      showToken ? '접속 토큰 숨기기' : '접속 토큰 보기'
                    }
                  >
                    {showToken ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 로그인 버튼 */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </Button>
      </form>
    </Form>
  )
}
