import axios from "axios";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
} from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify"; "next-auth/providers/spotify";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			sub?: string;
			accessToken?: string;
			tokenExpires?: number;
			refreshToken?: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	interface JWT extends DefaultJWT {
		accessToken: string;
		tokenExpires: number;
		refreshToken: string;
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt"
	},
	pages: {
		signIn: "/sign-in"
	},
	callbacks: {
		session: async ({ session, token }) => {
			if (token) {
				session.user!.name = token.name
				session.user!.sub = token.sub
				session.user!.email = token.email
				session.user!.accessToken = token.accessToken as string
				session.user!.tokenExpires = token.tokenExpires as number
				session.user!.refreshToken = token.refreshToken as string
			}

			return session
		},
		jwt: async ({ token, account }) => {
			if (account) {
				token.id = account.id
				token.accessToken = account.access_token
				token.tokenExpires = account.expires_at
				token.refreshToken = account.refresh_token

				return token

				//@ts-expect-error
			} else if (Date.now() < token.tokenExpires * 1000) {
				return token
			} else {
				try {
					const { data } = await axios.post(`https://accounts.spotify.com/api/token`, {
						grant_type: 'refresh_token',
						refresh_token: token.refreshToken
					}, {
						headers: {
							Authorization: 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
							'Content-Type': "application/x-www-form-urlencoded",
						},
					})

					token.accessToken = data.access_token
					token.tokenExpires = Math.floor(Date.now() / 1000 + data.expires_in)

					return token
				} catch (err) {
					console.error("Error refreshing access token", err)
					return { ...token, error: "RefreshAccessTokenError" as const }
				}
			}
		},
		redirect: ({ url, baseUrl }) => {
			return "/"
		}
	},
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID!,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
		})
	],
};

export const getServerAuthSession = () => getServerSession(authOptions);
