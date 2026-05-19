FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire project
COPY . ./

# Build the project
RUN pnpm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

EXPOSE 3000/tcp

# # Health check
# HEALTHCHECK --interval=30s --timeout=30s --retries=3 \
#  CMD curl -f http://127.0.0.1:3000/ || exit 1

CMD ["node", "/app/server/index.mjs"]
