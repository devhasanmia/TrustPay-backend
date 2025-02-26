import { z } from 'zod';

export const userValidationSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string"
    }).min(3, "Name must be at least 3 characters long"),
    pin: z.string().regex(/^\d{5}$/, "PIN must be exactly 5 digits"),
    mobileNumber: z.string({
        required_error: "Mobile Number is required",
        invalid_type_error: "Mobile Number must be a String"
    }).regex(/^\d{11}$/, "Mobile Number must be exactly 11 digits"),
    email: z.string().email("Invalid email format"),
    accountType: z.enum(["Agent", "User"], {message: "Account Type must be either Agent or User"}).default("User"),
    nid: z.string()
        .regex(/^\d+$/, "NID must be a number")
        .refine(val => val.length === 10 || val.length === 13 || val.length === 17, {
            message: "NID must be either 10, 13, or 17 digits long"
        }),
    balance: z.number().min(0, "Balance cannot be negative").default(0),
    status: z.enum(["Pending", "Approve", "Blocked", "Rejected"]).default("Pending")
});
