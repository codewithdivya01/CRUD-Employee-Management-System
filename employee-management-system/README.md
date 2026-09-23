# CRUD Employee Management System

A full-stack Employee Management System built according to the provided Task 2 requirements.

## Technology used
- **Frontend:** React.js + Vite + CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **API testing:** Postman

## Features
- Add employee with name, department, role, salary and join date
- View all employees in a responsive data table
- Search by name, department or role
- Sort by name, department, role, salary and join date
- Edit employee using a pre-filled form
- Delete employee with confirmation dialog
- Client-side and server-side validation
- Loading, success and error states
- REST API with POST, GET, PUT and DELETE
- MongoDB persistence
- Postman collection included

## Project structure
```text
employee-management-system/
├── backend/
│   ├── models/Employee.js
│   ├── routes/employees.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/main.jsx
│   ├── src/styles.css
│   ├── index.html
│   └── package.json
├── postman/
│   └── Employee-Management.postman_collection.json
└── README.md
```

## Prerequisites
1. Install **Node.js 18+** (Node.js 20+ recommended).
2. Install **MongoDB Community Server** and make sure the MongoDB service is running.
3. Install **Postman** if you want to test the API separately.

## 1. Start the backend
Open a terminal in the `backend` folder:

```bash
cd backend
npm install
```

Create a `.env` file by copying `.env.example`.

Windows CMD:
```cmd
copy .env.example .env
```

The default `.env` is:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/employee_management
```

Start the backend:
```bash
npm run dev
```

or:
```bash
npm start
```

You should see:
```text
MongoDB connected
Server running at http://localhost:5000
```

## 2. Start the frontend
Open a **new terminal** in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:
```text
http://localhost:5173
```

Keep both terminals running.

## 3. Test with Postman
Import:
`postman/Employee-Management.postman_collection.json`

Run **Create Employee** first. Copy the returned `_id` and replace the `employeeId` collection variable in Postman. Then test:
- Health Check — GET `/api/health`
- Create Employee — POST `/api/employees`
- Get Employees — GET `/api/employees`
- Get Employee By ID — GET `/api/employees/:id`
- Update Employee — PUT `/api/employees/:id`
- Delete Employee — DELETE `/api/employees/:id`

## REST API reference
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | List/search/sort employees |
| GET | `/api/employees/:id` | Get one employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Search and sorting
Example:
```text
GET /api/employees?search=engineering&sortBy=salary&order=desc
```

Allowed `sortBy` values: `name`, `department`, `role`, `salary`, `joinDate`, `createdAt`.

## Common issues
### MongoDB connection refused
Make sure MongoDB is running. The backend uses:
`mongodb://127.0.0.1:27017/employee_management`

### Frontend cannot connect to API
Make sure the backend is running on port `5000`. If you change the backend port, update the `API` constant in `frontend/src/main.jsx`.

### Port already in use
Change `PORT` in `backend/.env`, then update the frontend API URL to match.

## Database schema
The MongoDB `employees` collection stores:
- `name`: String, required, 2–80 characters
- `department`: String, required
- `role`: String, required
- `salary`: Number, required, non-negative
- `joinDate`: Date, required
- `createdAt` / `updatedAt`: automatic timestamps

## Evaluation requirements covered
- Correct CRUD operations: yes
- REST API + error handling: yes
- Searchable/sortable frontend table: yes
- Loading, success and error feedback: yes
- Basic validation: yes
- Database persistence: MongoDB
- Modular code: model + route separation
- Postman collection: included
