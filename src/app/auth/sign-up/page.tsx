import { SignUpForm } from './sign-up-form'

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Create an account</h1>
        <p className="mb-6 text-sm text-gray-500">
          Sign up to get started.
        </p>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/auth/sign-in" className="font-medium text-indigo-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}
