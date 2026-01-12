# Quiz Builder

## 🚀 Describe how to: Start frontend and backend

This project is organized into `backend` and `frontend` directories.

### Method 1: Using Docker (Recommended)

To run both the frontend and backend services simultaneously:

1. Make sure Docker is running.
2. Run the following command in the root directory:

   ```bash
   docker-compose up --build
   ```

### Method 2: Manual Startup

If you prefer running services locally, follow the steps below for the backend and frontend.

#### **Backend Setup**

1. **Install Dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the `backend` directory and configure the database connection:
   ```env
   DATABASE_URL
   ```

3. **Set up Database:**
   Ensure your PostgreSQL database is up and running.

* **Local:** Make sure your local PostgreSQL service is active.
* **Docker (DB only):** If you want to run just the database via Docker:

   ```bash
   docker-compose up -d postgres
   ```

3. **Database Migrations (Prisma):**
   Run the following command to generate the client and apply migrations to your local database:
   ```bash
   npx prisma migrate dev
   ```

4. **Start Server:**
   ```bash
   npm run start:dev
   ```

#### **Frontend Setup**

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the `frontend` directory and set the API URL:
   ```env
   NEXT_PUBLIC_API_URL
   ```

3. **Start Application:**
   ```bash
   npm run dev
   ```

## 📝 Create sample quiz

You can create a sample quiz using the API.

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
  "title": "Java Core Basics Test",
  "description": "Test on Java Core basics",
  "questions": [
    {
      "text": "Which access modifier makes a variable visible only within the class?",
      "type": "MULTIPLE_CHOICE",
      "options": [
        {
          "text": "public",
          "isCorrect": false
        },
        {
          "text": "private",
          "isCorrect": true
        },
        {
          "text": "protected",
          "isCorrect": false
        }
      ]
    },
    {
      "text": "Java supports multiple inheritance of classes.",
      "type": "TRUE_FALSE",
      "options": [
        {
          "text": "True",
          "isCorrect": false
        },
        {
          "text": "False",
          "isCorrect": true
        }
      ]
    },
    {
      "text": "Write the result of the expression 2 + 2 * 2",
      "type": "SHORT_ANSWER",
      "options": [
        {
          "text": "6",
          "isCorrect": true
        }
      ]
    }
  ]
}

'