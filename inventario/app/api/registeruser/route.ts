import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    /**
     * prisma user model 
     * 
     * 
     *   id            String          @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  password       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
     * 
     */


    const body = await request.json();
    const headers = request.headers;
    const apikey = headers.get('apikey');


    if (apikey !== process.env.API_KEY) {
        return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    const { name, email, password } = body;
    // check if user already exists
    const user = await prisma.user.findFirst({
        where: {
            email: email,
        }
    });
    if (user) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    // create user
    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: await hashPassword(password),
        }
    });
    // return user
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });


}

async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword.toString();
}