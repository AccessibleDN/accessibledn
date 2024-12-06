'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '~/providers/AuthenticationProvider';
import Error from '~/components/Error';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const formFields = [
        {
            id: 'username',
            label: 'Username',
            type: 'text',
            placeholder: 'Enter your username'
        },
        {
            id: 'email',
            label: 'Email',
            type: 'email', 
            placeholder: 'Enter your email'
        },
        {
            id: 'password',
            label: 'Password',
            type: 'password',
            placeholder: 'Enter your password'
        },
        {
            id: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            placeholder: 'Confirm your password'
        }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await register(formData.username, formData.email, formData.password);
        } catch (err) {
            setError(err instanceof Error ? (err as Error).message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {formFields.map((field, index) => (
                <motion.div 
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-200">
                        {field.label}
                    </label>
                    <motion.input
                        id={field.id}
                        type={field.type}
                        required
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800/50 
                                 text-gray-100 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary 
                                 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder={field.placeholder}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>
            ))}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Error 
                            title="Registration Failed"
                            message={error}
                            retry={() => {
                                setError('');
                                setIsLoading(false);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                         shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                         disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
            >
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
        </motion.form>
    );
}
