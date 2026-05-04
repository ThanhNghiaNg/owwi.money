import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { KeyRound, Mail } from 'lucide-react'
import { ROUTES } from '@/utils/constants/routes'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ProfileResponse } from '@/api/user'

type AuthFormProps = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isPending: boolean
    errorMessage?: string
    profiles?: ProfileResponse[]
    selectedProfileId?: string
    onSelectProfile?: (profileId: string) => void
}
const AuthForm = ({ handleSubmit, isPending, errorMessage, profiles = [], selectedProfileId, onSelectProfile }: AuthFormProps) => {
    const pathname = usePathname()
    const isLogin = pathname === ROUTES.LOGIN
    const hasProfiles = isLogin && profiles.length > 0
    return (
        <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-2xl font-bold text-white">OwwiMoney</h1>
                    </div>
                    <p className="text-sky-100 text-sm">{isLogin ? 'Welcome back! Please sign in to your account' : 'Create an account to get started'}</p>
                </div>

                <div className="px-8 py-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"><Mail /></span>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-12 h-12 border-2 focus:border-sky-500 transition-colors"
                                    autoComplete="email"
                                    aria-label="Email Address"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"><KeyRound /></span>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="pl-12 h-12 border-2 focus:border-sky-500 transition-colors"
                                    autoComplete="current-password"
                                    aria-label="Password"
                                    required
                                />
                            </div>
                        </div>

                        {hasProfiles && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile</label>
                                <select
                                    name="profileId"
                                    value={selectedProfileId || ''}
                                    onChange={(e) => onSelectProfile?.(e.target.value)}
                                    className="w-full h-12 rounded-md border-2 border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Select profile after login</option>
                                    {profiles.map((profile) => (
                                        <option key={profile._id} value={profile._id}>
                                            {profile.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">Nếu account có nhiều profile, bạn có thể chọn trước hoặc đổi sau khi đăng nhập.</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
                                {errorMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-12 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{isLogin ? "Signing in..." : "Signing up..."}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        {isLogin ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors">
                                    Sign up here
                                </Link>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link href="/login" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} OwwiMoney. All rights reserved.</p>
            </div>
        </div>
    )
}

export default AuthForm
