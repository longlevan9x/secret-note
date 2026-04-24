import { ServiceTemplate } from "../schema/types";

export const PREDEFINED_TEMPLATES: ServiceTemplate[] = [
  {
    providerId: "supabase",
    name: "Supabase",
    icon: "supabase",
    secretTemplates: [
      { key: "NEXT_PUBLIC_SUPABASE_URL", description: "Project URL", isSensitive: false },
      { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", description: "Anon / Publishable Key", isSensitive: false },
      { key: "SUPABASE_SERVICE_ROLE_KEY", description: "Service Role / Secret Key", isSensitive: true },
      { key: "DATABASE_URL", description: "PostgreSQL Connection String", isSensitive: true },
    ],
  },
  {
    providerId: "vercel",
    name: "Vercel",
    icon: "vercel",
    secretTemplates: [
      { key: "VERCEL_PROJECT_ID", description: "Project ID", isSensitive: false },
      { key: "VERCEL_ORG_ID", description: "Organization ID", isSensitive: false },
      { key: "VERCEL_TOKEN", description: "Personal Access Token", isSensitive: true },
    ],
  },
  {
    providerId: "upstash",
    name: "Upstash",
    icon: "upstash",
    secretTemplates: [
      { key: "UPSTASH_REDIS_REST_URL", description: "Redis REST URL", isSensitive: false },
      { key: "UPSTASH_REDIS_REST_TOKEN", description: "Redis REST Token", isSensitive: true },
    ],
  },
  {
    providerId: "neon",
    name: "Neon Postgres",
    icon: "neon",
    secretTemplates: [
      { key: "DATABASE_URL", description: "PostgreSQL Connection String", isSensitive: true },
    ],
  },
  {
    providerId: "clerk",
    name: "Clerk",
    icon: "clerk",
    secretTemplates: [
      { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", description: "Publishable Key", isSensitive: false },
      { key: "CLERK_SECRET_KEY", description: "Secret Key", isSensitive: true },
    ],
  },
  {
    providerId: "stripe",
    name: "Stripe",
    icon: "stripe",
    secretTemplates: [
      { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", description: "Publishable Key", isSensitive: false },
      { key: "STRIPE_SECRET_KEY", description: "Secret Key", isSensitive: true },
      { key: "STRIPE_WEBHOOK_SECRET", description: "Webhook Secret", isSensitive: true },
    ],
  },
  {
    providerId: "resend",
    name: "Resend",
    icon: "resend",
    secretTemplates: [
      { key: "RESEND_API_KEY", description: "API Key", isSensitive: true },
    ],
  },
  {
    providerId: "aws",
    name: "AWS",
    icon: "amazonaws",
    secretTemplates: [
      { key: "AWS_ACCESS_KEY_ID", description: "Access Key ID", isSensitive: false },
      { key: "AWS_SECRET_ACCESS_KEY", description: "Secret Access Key", isSensitive: true },
      { key: "AWS_REGION", description: "Region (e.g. us-east-1)", isSensitive: false },
    ],
  },
  {
    providerId: "cloudflare",
    name: "Cloudflare",
    icon: "cloudflare",
    secretTemplates: [
      { key: "CLOUDFLARE_ACCOUNT_ID", description: "Account ID", isSensitive: false },
      { key: "CLOUDFLARE_API_TOKEN", description: "API Token", isSensitive: true },
    ],
  },
  {
    providerId: "firebase",
    name: "Firebase",
    icon: "firebase",
    secretTemplates: [
      { key: "NEXT_PUBLIC_FIREBASE_API_KEY", description: "API Key", isSensitive: false },
      { key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", description: "Project ID", isSensitive: false },
      {key: "FIREBASE_PRIVATE_KEY", description: "Service Account Private Key", isSensitive: true},
      {key: "FIREBASE_CLIENT_EMAIL", description: "Service Account Client Email", isSensitive: false},
    ],
  },
  {
    providerId: "mongodb",
    name: "MongoDB Atlas",
    icon: "mongodb",
    secretTemplates: [
      { key: "MONGODB_URI", description: "Connection String", isSensitive: true },
    ],
  },
  {
    providerId: "auth0",
    name: "Auth0",
    icon: "auth0",
    secretTemplates: [
      { key: "AUTH0_SECRET", description: "Cookie Secret", isSensitive: true },
      { key: "AUTH0_BASE_URL", description: "App Base URL", isSensitive: false },
      { key: "AUTH0_ISSUER_BASE_URL", description: "Issuer URL", isSensitive: false },
      { key: "AUTH0_CLIENT_ID", description: "Client ID", isSensitive: false },
      { key: "AUTH0_CLIENT_SECRET", description: "Client Secret", isSensitive: true },
    ],
  },
  {
    providerId: "twilio",
    name: "Twilio",
    icon: "twilio",
    secretTemplates: [
      { key: "TWILIO_ACCOUNT_SID", description: "Account SID", isSensitive: false },
      { key: "TWILIO_AUTH_TOKEN", description: "Auth Token", isSensitive: true },
      { key: "TWILIO_PHONE_NUMBER", description: "Twilio Phone Number", isSensitive: false },
    ],
  },
  {
    providerId: "sendgrid",
    name: "SendGrid",
    icon: "sendgrid",
    secretTemplates: [
      { key: "SENDGRID_API_KEY", description: "API Key", isSensitive: true },
    ],
  },
  {
    providerId: "planetscale",
    name: "PlanetScale",
    icon: "planetscale",
    secretTemplates: [
      { key: "DATABASE_URL", description: "Connection String", isSensitive: true },
    ],
  },
  {
    providerId: "digitalocean",
    name: "DigitalOcean",
    icon: "digitalocean",
    secretTemplates: [
      { key: "DIGITALOCEAN_TOKEN", description: "Personal Access Token", isSensitive: true },
    ],
  },
  {
    providerId: "github",
    name: "GitHub",
    icon: "github",
    secretTemplates: [
      { key: "GITHUB_TOKEN", description: "Personal Access Token", isSensitive: true },
      { key: "GITHUB_CLIENT_ID", description: "OAuth Client ID", isSensitive: false },
      { key: "GITHUB_CLIENT_SECRET", description: "OAuth Client Secret", isSensitive: true },
    ],
  },
  {
    providerId: "openai",
    name: "OpenAI",
    icon: "openai",
    secretTemplates: [
      { key: "OPENAI_API_KEY", description: "API Key", isSensitive: true },
      { key: "OPENAI_ORG_ID", description: "Organization ID (Optional)", isSensitive: false },
    ],
  },
  {
    providerId: "anthropic",
    name: "Anthropic",
    icon: "anthropic",
    secretTemplates: [
      { key: "ANTHROPIC_API_KEY", description: "API Key", isSensitive: true },
    ],
  },
  {
    providerId: "google-gemini",
    name: "Google Gemini",
    icon: "googlegemini",
    secretTemplates: [
      { key: "GOOGLE_GENERATIVE_AI_API_KEY", description: "API Key", isSensitive: true },
    ],
  },
  {
    providerId: "deepseek",
    name: "DeepSeek",
    icon: "deepseek",
    secretTemplates: [
      { key: "DEEPSEEK_API_KEY", description: "API Key", isSensitive: true },
    ],
  },
  {
    providerId: "mistral",
    name: "Mistral AI",
    icon: "mistralai",
    secretTemplates: [
      { key: "MISTRAL_API_KEY", description: "API Key", isSensitive: true },
    ],
  },
  {
    providerId: "groq",
    name: "Groq",
    icon: "groq",
    secretTemplates: [
      { key: "GROQ_API_KEY", description: "API Key", isSensitive: true },
    ],
  },
  {
    providerId: "langchain",
    name: "LangChain / LangSmith",
    icon: "langchain",
    secretTemplates: [
      { key: "LANGCHAIN_API_KEY", description: "API Key", isSensitive: true },
      { key: "LANGCHAIN_PROJECT", description: "Project Name", isSensitive: false },
      { key: "LANGCHAIN_TRACING_V2", description: "Tracing (true/false)", isSensitive: false },
    ],
  },
];
