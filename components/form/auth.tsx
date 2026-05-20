import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { KeyRound, Mail } from 'lucide-react'
import { ROUTES } from '@/utils/constants/routes'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

type AuthFormProps = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isPending: boolean
    errorMessage?: string
}
const AuthForm = ({ handleSubmit, isPending, errorMessage }: AuthFormProps) => {
    const pathname = usePathname()
    const isLogin = pathname === ROUTES.LOGIN
    const { t } = useLanguage()

    return (
        <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-2xl font-bold text-white">OwwiMoney</h1>
                    </div>
                    <p className="text-sky-100 text-sm">{isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}</p>
                </div>

                <div className="px-8 py-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.emailAddress')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"><Mail /></span>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder={t('auth.enterEmail')}
                                    className="pl-12 h-12 border-2 focus:border-sky-500 transition-colors"
                                    autoComplete="email"
                                    aria-label={t('auth.emailAddress')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.password')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"><KeyRound /></span>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder={t('auth.enterPassword')}
                                    className="pl-12 h-12 border-2 focus:border-sky-500 transition-colors"
                                    autoComplete="current-password"
                                    aria-label={t('auth.password')}
                                    required
                                />
                            </div>
                        </div>

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
                                    <span>{isLogin ? t('auth.signingIn') : t('auth.signingUp')}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>{isLogin ? t('auth.signIn') : t('auth.signUp')}</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        {isLogin ? (
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <p>
                                    <Link href="/forgot-password" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors">
                                        {t('auth.forgotPassword')}
                                    </Link>
                                </p>
                                <p>
                                    {t('auth.noAccount')}{" "}
                                    <Link href="/register" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors">
                                        {t('auth.signUpHere')}
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('auth.haveAccount')}{" "}
                                <Link href="/login" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors">
                                    {t('auth.signInHere')}
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.allRightsReserved', { year: new Date().getFullYear() })}</p>
            </div>
        </div>
    )
}

export default AuthForm
