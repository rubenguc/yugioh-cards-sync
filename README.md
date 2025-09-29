# Yu-Gi-Oh! Card Search Engine

This is a NestJS application that syncs Yu-Gi-Oh! card data from the [YGOPRODeck API](https://db.ygoprodeck.com/api-guide/) into a Typesense search engine for fast card searching.

## Features

- Fetches Yu-Gi-Oh! card data from YGOPRODeck API
- Indexes cards into Typesense for fast searching
- Provides REST API for searching cards
- CLI command for syncing card data
- Saves card images to Cloudflare R2 storage (planned)

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
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
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

### Syncing Card Data

To sync card data from the YGOPRODeck API to Typesense:

```bash
# Sync with default parameters (offset=24, limit=24)
bun run sync

# Sync with custom parameters
bun run sync -- -o 48 -l 50
```

### API Endpoints

- `GET /cards/search?q=:query` - Search for cards by name, description, archetype, or race
- `GET /cards/search?q=:query&type=:type` - Search with card type filter
- `GET /cards/search?q=:query&race=:race` - Search with card race filter
- `GET /cards/search?q=:query&archetype=:archetype` - Search with card archetype filter

## Project Structure

```
src/
├── cards/              # Card-related modules and services
│   ├── card-fetcher.service.ts   # Service to fetch cards from YGOPRODeck API
│   ├── card-sync.service.ts      # Service to sync cards to Typesense
│   ├── cards.controller.ts       # REST API controller for cards
│   └── cards.module.ts           # NestJS module for cards
├── interfaces/         # TypeScript interfaces
│   └── card.interface.ts         # Card data interfaces
├── typesense/          # Typesense integration
│   └── typesense.service.ts      # Service to interact with Typesense
├── utils/              # Utility services
│   └── image-storage.service.ts  # Service to handle image storage
├── cli/                # CLI commands
│   ├── cli.module.ts             # CLI module
│   ├── sync.command.ts           # Sync command implementation
│   └── main.ts                   # CLI entry point
├── app.module.ts       # Main application module
└── main.ts             # Application entry point
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