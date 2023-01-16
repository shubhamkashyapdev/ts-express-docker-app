import { z } from 'zod'

const UserZodSchema = z.object({
    body: z
        .object({
            name: z.string({
                required_error: 'Title is required'
            }),
            email: z
                .string({
                    required_error: 'Email is required'
                })
                .email('Not a valid email address'),
            password: z
                .string({
                    required_error: 'Password is required'
                })
                .min(6, 'Password must be at least 6 characters long')
                .max(255, 'Password must be at less than 255 characters long'),
            confirmPassword: z
                .string({
                    required_error: 'Confirm Password is required'
                })
                .optional()
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: 'Password do not match',
            path: ['confirmPassword']
        })
})

export default UserZodSchema
