# Yu-Gi-Oh! Card Search Engine

This is a NestJS application that syncs Yu-Gi-Oh! card data from the [YGOPRODeck API](https://db.ygoprodeck.com/api-guide/) into a Typesense search engine for fast card searching.

## Features

- Fetches Yu-Gi-Oh! card data from YGOPRODeck API
- Indexes cards into Typesense for fast searching
- Saves card images to Cloudflare R2 storage

## Prerequisites

- Node.js or Bun
- Typesense server running locally or remotely
- Cloudflare R2 bucket (for image storage)

## Installation

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

## Configuration

Create a `.env` file with the following variables:

```env
TYPESENSE_HOST=
TYPESENSE_PORT=
TYPESENSE_PROTOCOL=
TYPESENSE_API_KEY=

CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_MODE=
CLOUDFLARE_DEV_DOMAIN=

DATABASE_URL
```

## Usage

### Running the API Server

```bash
# Development mode
bun run start:dev

# Production mode
bun run build
bun run start:prod
```


## Development

### Adding New Features

1. Create a new branch for your feature
2. Implement your changes
3. Test your changes
4. Submit a pull request

### Testing

```bash
# Run unit tests
bun run test

# Run end-to-end tests
bun run test:e2e

# Run tests in watch mode
bun run test:watch
```

## License

This project is licensed under the MIT License.
