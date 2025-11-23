j'utilise pnpm. //racine {
"private": true,
"name": "@stackschool/root",
"version": "1.0.0",
"workspaces": [
"packages/*"
],
"pnpm": {
"overrides": {
"react": "$react",
      "react-dom": "$react-dom"
},
"onlyBuiltDependencies": [
"@prisma/client",
"@prisma/engines",
"esbuild",
"msgpackr-extract",
"ngrok",
"prisma",
"sharp",
"unrs-resolver"
]
},
"scripts": {
"dev:backend": "pnpm --filter @stackschool/backend run dev",
"dev:frontend": "pnpm --filter @stackschool/frontend run dev",
"generate": "pnpm --filter @stackschool/db run generate"
},
"dependencies": {
"react": "19.2.0",
"ts-node-dev": "^2.0.0",
"react-dom": "19.2.0"
},
"devDependencies": {
"@types/react": "19.2.2",
"@types/react-dom": "19.2.2",
"typescript": "^5.9.3",
"@tailwindcss/postcss": "^4",
"tsx": "^4.20.6",
"@types/node": "^20",
"eslint": "^9",
"prisma": "^6.17.1",
"tailwindcss": "^4",
"@babel/core": "^7.20.0"
}
}
// web next.js {
"name": "@stackschool/web",
"version": "0.1.0",
"scripts": {
"dev": "next dev --turbopack -p 3000",
"build": "next build --turbopack",
"start": "next start -p 3000",
"lint": "eslint"
},
"dependencies": {
"@stackschool/shared": "workspace:_",
"@stackschool/ui": "workspace:_",
"@dnd-kit/core": "^6.3.1",
"@dnd-kit/modifiers": "^9.0.0",
"@dnd-kit/sortable": "^10.0.0",
"@dnd-kit/utilities": "^3.2.2",
"@radix-ui/react-accordion": "^1.2.12",
"@radix-ui/react-alert-dialog": "^1.1.15",
"@radix-ui/react-avatar": "^1.1.10",
"@radix-ui/react-checkbox": "^1.3.3",
"@radix-ui/react-collapsible": "^1.1.12",
"@radix-ui/react-dialog": "^1.1.15",
"@radix-ui/react-dropdown-menu": "^2.1.16",
"@radix-ui/react-label": "^2.1.7",
"@radix-ui/react-select": "^2.2.6",
"@radix-ui/react-separator": "^1.1.7",
"@radix-ui/react-slot": "^1.2.3",
"@radix-ui/react-tabs": "^1.1.13",
"@radix-ui/react-toggle": "^1.1.10",
"@radix-ui/react-toggle-group": "^1.1.11",
"@radix-ui/react-tooltip": "^1.2.8",
"@tabler/icons-react": "^3.35.0",
"@tanstack/react-table": "^8.21.3",
"class-variance-authority": "^0.7.1",
"gsap": "^3.13.0",
"input-otp": "^1.4.2",
"lucide-react": "^0.544.0",
"next": "16.0.0",
"next-themes": "^0.4.6",
"react-day-picker": "^9.11.0",
"react-phone-number-input": "^3.4.13",
"recharts": "^2.15.4",
"sonner": "^2.0.7",
"tailwind-merge": "^3.3.1",
"vaul": "^1.1.2"
},
"devDependencies": {
"@eslint/eslintrc": "^3",
"tw-animate-css": "^1.4.0",
"eslint-config-next": "16.0.0"
},
"peerDependencies": {
"react": "19.2.0",
"react-dom": "19.2.0"
},
"overrides": {
"@types/react": "19.2.2",
"@types/react-dom": "19.2.2"
}
}
// mobile expo {
"name": "@stackschool/mobile",
"version": "1.0.0",
"main": "index.ts",
"scripts": {
"start": "expo start",
"android": "expo start --android",
"ios": "expo start --ios",
"web": "expo start --web"
},
"dependencies": {
"@stackschool/ui": "workspace:_",
"@stackschool/shared": "workspace:_",
"@expo/vector-icons": "^15.0.3",
"expo": "~54.0.25",
"expo-constants": "^18.0.10",
"expo-linking": "^8.0.9",
"expo-router": "^6.0.15",
"expo-status-bar": "~3.0.8",
"react-native": "0.81.5",
"react-native-safe-area-context": "^5.6.2",
"react-native-screens": "^4.18.0"
},
"peerDependencies": {
"react": "19.2.0",
"react-dom": "19.2.0"
},
"overrides": {
"@types/react": "19.2.2",
"@types/react-dom": "19.2.2"
},
"private": true
}
// api express {
"name": "@stackschool/api",
"scripts": {
"dev": "ts-node-dev --respawn --transpile-only src/index.ts",
"start": "node dist/index.js",
"build": "tsc"
},
"main": "src/index.js",
"dependencies": {
"@stackschool/shared": "workspace:_",
"@sendgrid/mail": "^8.1.6",
"bcryptjs": "^3.0.2",
"bullmq": "^2.0.0",
"connect-pg-simple": "^10.0.0",
"cookie-parser": "^1.4.7",
"cors": "^2.8.5",
"crypto-js": "^4.2.0",
"depcheck": "^1.4.7",
"dotenv": "^17.2.3",
"express": "^5.1.0",
"express-session": "^1.18.2",
"express-validator": "^7.2.1",
"helmet": "^6.2.0",
"ioredis": "^5.0.0",
"jsonwebtoken": "^9.0.2",
"nodemailer": "^7.0.9",
"passport": "^0.7.0",
"passport-facebook": "^3.0.0",
"passport-google-oauth20": "^2.0.0",
"passport-jwt": "^4.0.1",
"passport-local": "^1.0.0",
"pg": "^8.16.3",
"rate-limiter-flexible": "^8.1.0",
"socket.io": "^4.8.0",
"twilio": "^5.10.3"
},
"devDependencies": {
"@prisma/client": "^6.18.0",
"@prisma/extension-accelerate": "^2.0.2",
"@types/bcryptjs": "^2.4.6",
"@types/connect-pg-simple": "^7.0.3",
"@types/cookie-parser": "^1.4.9",
"@types/cors": "^2.8.19",
"@types/express": "^5.0.3",
"@types/express-session": "^1.18.2",
"@types/jsonwebtoken": "^9.0.10",
"@types/multer": "^2.0.0",
"@types/node": "^24.6.2",
"@types/nodemailer": "^7.0.1",
"@types/passport": "^1.0.17",
"@types/passport-facebook": "^3.0.3",
"@types/passport-google-oauth20": "^2.0.16",
"@types/passport-local": "^1.0.38",
"@types/pg": "^8.15.5",
"@types/redis": "^4.0.11",
"@types/socket.io": "^3.0.2",
"multer": "^2.0.2",
"prisma": "^6.18.0",
"redis": "^5.8.3",
"twilio-run": "^1.1.2"
}
}
// shared partage de db prisma , types et schéma zod {
"name": "@stackschool/shared",
"version": "1.0.0",
"description": "",
"private": true,
"main": "src/index.ts",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"keywords": [],
"author": "",
"license": "ISC",
"packageManager": "pnpm@10.19.0",
"dependencies": {
"@stackschool/db": "workspace:_",
"zod": "^4.1.12",
"axios": "^1.12.2",
"date-fns": "^4.1.0"
}
}
// partage ui entre web et mobile {
"name": "@stackschool/ui",
"version": "1.0.0",
"description": "",
"main": "index.js",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"dependancies": {
"react-hook-form": "^7.66.1",
"@hookform/resolvers": "^5.2.2",
"zustand": "^4.4.0",
"clsx": "^2.1.1"
},
"peerDependencies": {
"react": "^19.2.0",
"react-dom": "19.2.0"
},
"keywords": [],
"author": "",
"license": "ISC",
"packageManager": "pnpm@10.22.0"
}
// db schéma prisma et client {
"name": "@stackschool/db",
"version": "1.0.0",
"main": "src/index.ts",
"scripts": {
"generate": "prisma generate",
"migrate": "prisma migrate dev ",
"seed": "node src/prisma/seed.js"
},
"devDependencies": {
"@prisma/client": "^6.18.0",
"prisma": "^6.19.0",
"typescript": "^5.9.3"
},
"dependencies": {
"dotenv": "^17.2.3"
}
}

{
"name": "@stackschool/mobile",
"version": "1.0.0",
"main": "index.ts",
"scripts": {
"start": "expo start",
"android": "expo start --android",
"ios": "expo start --ios",
"web": "expo start --web"
},
"dependencies": {
"@stackschool/ui": "workspace:_",
"@stackschool/shared": "workspace:_",
"@expo/vector-icons": "^15.0.3",
"expo": "~54.0.25",
"expo-constants": "^18.0.10",
"expo-linking": "^8.0.9",
"expo-router": "^6.0.15",
"expo-status-bar": "~3.0.8",
"react-native": "0.81.5",
"react-native-safe-area-context": "^5.6.2",
"react-native-screens": "^4.16.0"
},
"peerDependencies": {
"react": "19.1.0",
"react-dom": "19.1.0"
},
"overrides": {
"@types/react": "19.1.0",
"@types/react-dom": "19.1.0"
},
"private": true
}
