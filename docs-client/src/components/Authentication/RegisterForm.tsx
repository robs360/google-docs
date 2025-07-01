'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import Image from "next/image";
import logo from '../../assets/Google-Docs-Logo-2014.png'
import { useState } from "react";
import { uploadImageToImgBB } from "@/utils/imgbb";
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions/authentication';

const RegisterForm = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            let imageUrl = '';

            if (data.image) {
                imageUrl = await uploadImageToImgBB(data.image);
            }
           
            const result = await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                image: imageUrl
            });
            console.log("it is result ",result)
            if (result.success) {
                router.push('/login');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Handle error (show error message to user)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="flex flex-col items-center">
                    <Image src={logo} width={40} height={40} alt="logo" className="mb-4" />
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        to continue to Google Docs
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="rounded-md space-y-4">
                        <div>
                            <input
                                type="text"
                                {...register("name", { required: true })}
                                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Full name"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                {...register("password", { required: true, minLength: 6 })}
                                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password (minimum 6 characters)"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setValue("image", file);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;