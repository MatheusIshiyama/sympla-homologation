# Sympla Homologation

A Node.js API service for managing and synchronizing event data with the Sympla platform. This service provides real-time order updates, participant validation, and event management capabilities.

## 🚀 Features

- **Real-time Order Synchronization**: Automatically syncs order updates from Sympla every 20 seconds
- **Participant Management**: Manages and validates participants (tickets) for events
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
DIRECT_URL="postgresql://username:password@localhost:5432/sympla_homologation"
# Add other required environment variables for Sympla API integration
```

4. Set up the database:

```bash
# Generate Prisma client
pnpm prisma:generate

# Push the schema to your database
pnpm prisma:migrate

# Or run migrations (if you prefer migrations)
pnpm prisma:migrate
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
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Open Prisma Studio (database GUI)
pnpm prisma:studio
```

### Linting

```bash
pnpm lint
```

## 📡 API Endpoints

### Health Check

- **GET** `/health` - Service health status

### Sympla Events

- **GET** `/sympla/events/:eventId` - Get event data

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
├── database/        # Database connection (Prisma)
├── jobs/           # Background jobs and scheduled tasks
├── repositories/   # Data access layer
├── routes/         # Express routes
├── services/       # Business logic and external service integrations
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
prisma/
├── models/         # Database model definitions
├── migrations/     # Database migrations
└── schema.prisma   # Main database schema
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

### Event

- Stores event information from Sympla
- Tracks event status, dates, and location
- Related to multiple orders
- Includes `last_update_date` for synchronization tracking

### Order

- Stores order data from Sympla
- Contains order status and transaction information
- Linked to events and participants
- Supports multiple order statuses (APPROVED, CANCELLED, PENDING, etc.)

### Participant

- Represents individual tickets/participants
- Contains QR codes and check-in status
- Linked to orders
- Tracks validation and attendance

## 🔄 Background Jobs

The service includes a scheduled job that runs every 20 seconds for each active event to:

- Fetch updated orders from Sympla API
- Validate and process participants
- Update local cache with latest data
- Maintain event synchronization

## 📊 Data Models

### Event

```typescript
interface Event {
  id: string;
  sympla_event_id: string;
  name: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  last_update_date: Date;
}
```

### Order

```typescript
interface Order {
  id: string;
  sympla_order_id: string;
  event_id: string;
  order_status: OrderStatus;
  created_at: Date;
  updated_at: Date;
}
```

### Participant

```typescript
interface Participant {
  id: string;
  sympla_participant_id: string;
  number: string;
  qr_code: string;
  order_id: string;
  checked_in: boolean;
  created_at: Date;
  updated_at: Date;
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
DIRECT_URL="postgresql://username:password@localhost:5432/sympla_homologation"
# Add Sympla API credentials and other configuration
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Matheus Ishiyama** - [matheus.ishiyama@outlook.com](mailto:matheus.ishiyama@outlook.com)

## 🔗 Repository

- **GitHub**: [https://github.com/MatheusIshiyama/sympla-homologation.git](https://github.com/MatheusIshiyama/sympla-homologation.git)
