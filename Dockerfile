# Use the official Bun image as the base
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files (use bun.lock instead of bun.lockb)
COPY package.json bun.lock ./

# Install production dependencies
RUN bun install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN bun run build

# Expose the port (Render will override this with PORT env variable)
EXPOSE 3000

# Run the app
CMD ["bun", "run", "start"]