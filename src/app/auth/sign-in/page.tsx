import { SignInForm } from './sign-in-form'

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-500">
          Sign in to your account to continue.
        </p>
        <SignInForm />
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/auth/sign-up" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  )
}
