import { z } from 'zod'

const PostZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required'
        }),
        body: z.string({
            required_error: 'Body is required'
        })
    })
})

export default PostZodSchema
