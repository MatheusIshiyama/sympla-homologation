# Sympla Homologation API

A Node.js API service for integrating with Sympla's event management platform. This service provides event synchronization, order management, and automated data updates between your system and Sympla.

## 🚀 Features

- **Event Management**: Sync and manage events from Sympla platform
- **Order Processing**: Automatically update and sync orders with status tracking
- **Background Jobs**: Automated order updates every 20 seconds for active events
- **Database Integration**: PostgreSQL database with Prisma ORM
- **RESTful API**: Clean REST endpoints for event and order operations
- **TypeScript**: Full TypeScript support with strict typing

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (recommended) or npm

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/MatheusIshiyama/sympla-homologation.git
cd sympla-homologation
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sympla_homologation"
DIRECT_URL="postgresql://username:password@localhost:5432/sympla_homologation"

# Server
PORT=3000
```

4. **Database Setup**

```bash
# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate
```

## 🚀 Usage

### Development

```bash
# Start development server with hot reload
pnpm dev
```

### Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

### Database Management

```bash
# Open Prisma Studio (database GUI)
pnpm prisma:studio

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate
```

## 📚 API Documentation

### Health Check

```http
GET /health
```

### Events

```http
GET /sympla/events/:eventId
```

Returns event information by ID.

**Example:**

```bash
curl http://localhost:3000/sympla/events/1111111
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

### Events

- Event management with integration details
- Support for private/public events
- Status tracking (active, published, cancelled)
- Date range management (start_date, end_date)

### Orders

- Order processing and status tracking
- Buyer information management
- Transaction details and pricing
- UTM tracking support

### Participants

- Attendee management for events
- Order association
- Contact information

### Integrations

- API configuration management
- Credential storage
- Service-specific settings

## 🔄 Background Jobs

The application runs automated jobs every 20 seconds to:

1. **Fetch Active Events**: Retrieve all active events from the database
2. **Update Orders**: Sync new orders from Sympla API for each active event
3. **Status Validation**: Filter orders with valid status ("A" for approved)
4. **Database Updates**: Store new order data in the local database

## 🏗️ Project Structure

```
src/
├── config/          # Environment and configuration
├── controllers/     # API controllers
├── database/        # Database connection
├── jobs/           # Background job processing
├── repositories/    # Data access layer
├── routes/         # API route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 🧪 Testing

Use the provided HTTP request files in the `requests/` directory to test the API:

- `requests/events.http` - Event endpoint testing
- `requests/health.http` - Health check testing
- `requests/integrations/sympla.http` - Integration testing

## 📝 Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `pnpm dev`             | Start development server with hot reload |
| `pnpm build`           | Build the project for production         |
| `pnpm start`           | Start production server                  |
| `pnpm lint`            | Run ESLint for code quality              |
| `pnpm prisma:generate` | Generate Prisma client                   |
| `pnpm prisma:migrate`  | Run database migrations                  |
| `pnpm prisma:studio`   | Open Prisma Studio GUI                   |

## 🔧 Configuration

### Environment Variables

| Variable       | Description                  | Required |
| -------------- | ---------------------------- | -------- |
| `DATABASE_URL` | PostgreSQL connection string | Yes      |
| `DIRECT_URL`   | Direct database connection   | No       |
| `PORT`         | Server port (default: 3000)  | No       |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Matheus Ishiyama** - [matheus.ishiyama@outlook.com](mailto:matheus.ishiyama@outlook.com)

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
