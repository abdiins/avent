import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-mariadb", "mariadb", "bcrypt"],
};

export default nextConfig;
