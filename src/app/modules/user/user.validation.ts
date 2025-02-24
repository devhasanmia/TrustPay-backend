import { z } from 'zod';

export const userValidationSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string"
    }).min(3, "Name must be at least 3 characters long"),
    pin: z.number({
        required_error: "PIN is required",
        invalid_type_error: "PIN must be a number"
    }).refine(val => val >= 10000 && val <= 99999, {
        message: "PIN must be exactly 5 digits"
    }),
    mobileNumber: z.string({
        required_error: "Mobile Number is required",
        invalid_type_error: "Mobile Number must be a String"
    }).regex(/^\d{11}$/, "Mobile Number must be exactly 11 digits"),
    email: z.string().email("Invalid email format"),
    accountType: z.enum(["Agent", "User"]).default("User"),
    nid: z.string().length(13, "NID must be 13 digits").regex(/^\d{13}$/, "NID must be a 13-digit number"),
    balance: z.number().min(0, "Balance cannot be negative").default(0)
});

