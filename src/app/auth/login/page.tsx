'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState('agent@example.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="border  min-h-screen flex items-center justify-center shadow-default border-stroke bg-white dark:bg-boxdark dark:border-strokedark">

            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="px-26 py-17.5 text-center">
                        <Link className="mb-5.5 inline-block" href="/">
                            <Image
                                src={"/images/logo/lookcard-logo.png"}
                                alt="Logo"
                                width={176}
                                height={32}
                            />
                        </Link>

                        <p className="2xl:px-20">
                            Welcome to Lookcard Reseller Portal. Please sign in to continue.
                        </p>

                        <span className="mt-15 inline-block">
                            {/* Your existing SVG */}
                        </span>
                    </div>
                </div>

                <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                            Sign In to Agent Dashboard
                        </h2>

                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Email
                                </label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        required
                                    />
                                    <span className="absolute right-4 top-2">
                                        <Mail />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        required
                                    />
                                    <span className="absolute right-4 top-2">
                                        <LockKeyhole />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-5">
                                <Button
                                    type="submit"
                                    className="w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                >
                                    Sign In
                                </Button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Test credentials: agent@example.com / password
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}