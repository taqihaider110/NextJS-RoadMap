import {connectToDatabase} from "@/dbConfig/dbConfig"
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


export async function POST(request: NextRequest) {
    try {
        console.log("=== Signup Route Started ===");
        
        // Step 1: Parse request body
        let body;
        try {
            body = await request.json();
            console.log("✓ Request body parsed successfully");
        } catch (parseError: any) {
            console.error("✗ Failed to parse request body:", parseError.message);
            return NextResponse.json(
                { 
                    error: "Invalid JSON in request body",
                    details: parseError.message 
                }, 
                { status: 400 }
            );
        }
        
        const { username, email, password } = body;
        console.log("Request data:", { username, email, passwordLength: password?.length });
        
        // Step 2: Validate required fields
        if (!username || !email || !password) {
            console.error("✗ Missing required fields:", { 
                hasUsername: !!username, 
                hasEmail: !!email, 
                hasPassword: !!password 
            });
            return NextResponse.json(
                { 
                    error: "Missing required fields",
                    required: ["username", "email", "password"],
                    received: { hasUsername: !!username, hasEmail: !!email, hasPassword: !!password }
                }, 
                { status: 400 }
            );
        }
        
        // Step 3: Connect to database
        console.log("Connecting to database...");
        try {
            await connectToDatabase();
            console.log("✓ Database connected successfully");
        } catch (dbError: any) {
            console.error("✗ Database connection failed:", {
                message: dbError.message,
                stack: dbError.stack,
                name: dbError.name
            });
            return NextResponse.json(
                { 
                    error: "Database connection failed",
                    details: dbError.message 
                }, 
                { status: 500 }
            );
        }
        
        // Step 4: Check if user already exists
        console.log("Checking if user exists with email:", email);
        let existingUser;
        try {
            existingUser = await User.findOne({ email });
            console.log("✓ User existence check completed:", existingUser ? "User exists" : "User does not exist");
        } catch (findError: any) {
            console.error("✗ Error checking user existence:", {
                message: findError.message,
                stack: findError.stack,
                name: findError.name
            });
            return NextResponse.json(
                { 
                    error: "Error checking user existence",
                    details: findError.message 
                }, 
                { status: 500 }
            );
        }
        
        if (existingUser) {
            console.log("✗ User already exists with email:", email);
            return NextResponse.json(
                { error: "User already exists with this email" }, 
                { status: 400 }
            );
        }
        
        // Step 5: Hash password
        console.log("Hashing password...");
        let hashedPassword;
        try {
            hashedPassword = await bcryptjs.hash(password, 10);
            console.log("✓ Password hashed successfully");
        } catch (hashError: any) {
            console.error("✗ Error hashing password:", {
                message: hashError.message,
                stack: hashError.stack
            });
            return NextResponse.json(
                { 
                    error: "Error hashing password",
                    details: hashError.message 
                }, 
                { status: 500 }
            );
        }
        
        // Step 6: Create new user
        console.log("Creating new user...");
        let newUser;
        try {
            newUser = new User({
                username,
                email,
                password: hashedPassword,
            });
            console.log("✓ User object created");
        } catch (createError: any) {
            console.error("✗ Error creating user object:", {
                message: createError.message,
                stack: createError.stack
            });
            return NextResponse.json(
                { 
                    error: "Error creating user object",
                    details: createError.message 
                }, 
                { status: 500 }
            );
        }
        
        // Step 7: Save user to database
        console.log("Saving user to database...");
        try {
            await newUser.save();
            console.log("✓ User saved successfully with ID:", newUser._id);
        } catch (saveError: any) {
            console.error("✗ Error saving user:", {
                message: saveError.message,
                stack: saveError.stack,
                name: saveError.name,
                code: saveError.code,
                errors: saveError.errors
            });
            
            // Check for duplicate key error (unique constraint violation)
            if (saveError.code === 11000) {
                const duplicateField = Object.keys(saveError.keyPattern || {})[0];
                return NextResponse.json(
                    { 
                        error: `User with this ${duplicateField} already exists`,
                        details: saveError.message 
                    }, 
                    { status: 400 }
                );
            }
            
            return NextResponse.json(
                { 
                    error: "Error saving user to database",
                    details: saveError.message 
                }, 
                { status: 500 }
            );
        }
        
        console.log("=== Signup Route Completed Successfully ===");
        return NextResponse.json(
            { 
                message: "User created successfully",
                userId: newUser._id 
            }, 
            { status: 201 }
        );
        
    } catch (error: any) {
        console.error("=== UNHANDLED ERROR in signup route ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        
        return NextResponse.json(
            { 
                error: "Internal server error",
                message: error.message,
                type: error.name,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            }, 
            { status: 500 }
        );
    }
}