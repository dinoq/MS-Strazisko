import { verifyPassword } from "@features/auth/lib/authFunc";
import { prisma } from "lib/server/prisma";
import bcrypt from "bcryptjs";
import { User, AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const userFromDB = await prisma.user.findUnique({
                    where: {
                        username: credentials?.username,
                    },
                });

                if (!userFromDB) {
                    throw new Error("Unknown user");
                }

                const validPwd = await bcrypt.compare(
                    credentials?.password || "",
                    userFromDB.password_hash
                );

                if (!validPwd) {
                    throw new Error("InvalidPwd");
                    return null;
                }

                const user: User = {
                    id: userFromDB.id_user.toString(),
                };

                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages:{
      signIn: "../../admin/login"
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
