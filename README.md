# Sympla Homologation

A Node.js API service for managing and synchronizing event data with the Sympla platform. This service provides real-time order updates, ticket validation, and event management capabilities.

## 🚀 Features

- **Real-time Order Synchronization**: Automatically syncs order updates from Sympla every 10 seconds
- **Ticket Validation**: Manages and validates tickets for events
- **Event Management**: Track event-specific data and updates
- **TypeScript Support**: Full TypeScript implementation with strict typing
- **Scheduled Jobs**: Automated background tasks using node-cron
- **Database Integration**: PostgreSQL database with Prisma ORM

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- TypeScript
- PostgreSQL database

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/MatheusIshiyama/sympla-homologation.git
cd sympla-homologation
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory and configure your environment variables:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/sympla_homologation"
# Add other required environment variables for Sympla API integration
```

4. Set up the database:

```bash
# Generate Prisma client
pnpm db:generate

# Push the schema to your database
pnpm db:push

# Or run migrations (if you prefer migrations)
pnpm db:migrate
```

## 🚀 Usage

### Development

```bash
pnpm dev
```

This starts the development server with hot reload using `tsx watch`.

### Production

```bash
# Build the project
pnpm build

# Start the production server
pnpm start
```

### Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Prisma Studio (database GUI)
pnpm db:studio
```

### Linting

```bash
pnpm lint
```

## 📡 API Endpoints

### Health Check

- **GET** `/health` - Service health status

### Sympla Events

- **GET** `/sympla/events/:eventId` - Get event data including last update date and validated tickets

### Example Requests

```bash
# Health check
curl http://localhost:3000/health

# Get event data
curl http://localhost:3000/sympla/events/3024800
```

## 🔧 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # API controllers
├── jobs/           # Background jobs and scheduled tasks
├── lib/            # Library files (Prisma client)
├── routes/         # Express routes
├── services/       # External service integrations
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

### Event

- Stores event information from Sympla
- Tracks event status, dates, and location
- Related to multiple orders

### Order

- Stores order data from Sympla
- Contains customer information and ticket details
- Linked to events

### IntegrationLog

- Tracks integration activities and errors
- Stores webhook data and sync logs

## 🔄 Background Jobs

The service includes a scheduled job that runs every 10 seconds to:

- Fetch updated orders from Sympla API
- Validate and process tickets
- Update local cache with latest data
- Maintain event synchronization

## 📊 Data Models

### Order

```typescript
interface Order {
  id: string;
  event_id: string;
  order_date: string;
  order_status: string;
  transaction_type: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  updated_date: string;
}
```

### Ticket

```typescript
interface Ticket {
  order_id: string;
  order_status: string;
  ticket_num_qr_code: string;
  checkin: TicketCheckin;
}
```

## 🧪 Testing

Use the provided HTTP request files in the `requests/` directory to test the API endpoints:

- `requests/health.http` - Health check endpoint
- `requests/events.http` - Event data endpoint
- `requests/integrations/sympla.http` - Sympla integration endpoint

## 📝 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/sympla_homologation"
# Add Sympla API credentials and other configuration
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Matheus Ishiyama** - [matheus.ishiyama@outlook.com](mailto:matheus.ishiyama@outlook.com)

## 🔗 Repository

- **GitHub**: [https://github.com/MatheusIshiyama/sympla-homologation.git](https://github.com/MatheusIshiyama/sympla-homologation.git)
