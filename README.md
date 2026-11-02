TaskFlow – Full-Stack Task Management System

TaskFlow is a full-stack web application designed to help users organize, manage, and track their daily tasks through a clean and user-friendly interface.

The application provides secure authentication, task management, an interactive dashboard, and profile management.

Features

- User Authentication: Secure user registration and login using JWT authentication.
- Dashboard: View and manage tasks from a centralized dashboard.
- Task Management: Create, view, update, and delete tasks.
- Task Status: Organize tasks according to their status.
- Task Details: View individual task information.
- Profile Management: View and update user profile information.
- Password Management: Change account password.
- Confirmation Modal: Custom confirmation dialog before deleting tasks.
- Responsive Interface: Clean and user-friendly frontend.

Tech Stack

Frontend:
- React.js
- JavaScript
- CSS
- Vite
- React Router

Backend:
- C#
- ASP.NET Core Web API
- .NET 8
- Entity Framework Core
- ASP.NET Core Identity
- JWT Authentication
- SignalR

Database
- Microsoft SQL Server

Development Tools
- Visual Studio Code
- Visual Studio / .NET CLI
- Git and GitHub
- Swagger / OpenAPI

Project Structure

TaskFlow/
│
├── Backend/
│   ├── Controllers/
│   ├── Data/
│   ├── DTO/
│   ├── Hubs/
│   ├── MiddleWare/
│   ├── Migrations/
│   ├── Model/
│   ├── Services/
│   ├── Program.cs
│   └── appsettings.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── .gitignore
└── README.md

Getting Started

Follow these steps to run TaskFlow locally.

Prerequisites

Make sure you have installed:

- .NET 8 SDK
- Node.js and npm
- Microsoft SQL Server
- SQL Server Management Studio (SSMS), if needed

1. Clone the Repository

bash
git clone https://github.com/fizzasarfarazkhan/TaskFlow.git
cd TaskFlow

2. Backend Setup

Navigate to the backend directory:

bash
cd Backend

Restore dependencies:

bash
dotnet restore

Configure your own SQL Server connection string and JWT key using .NET User Secrets or another secure configuration provider. Do not commit passwords or secret keys to the repository.

Configure the admin seed credentials using the following configuration keys:

- SeedAdmin:Email
- SeedAdmin:Password

Run database migrations:

```bash
dotnet ef database update
```

Run the backend:

```bash
dotnet run --launch-profile https
```

Backend Swagger documentation:

```text
https://localhost:7025/swagger
```

3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal (usually `http://localhost:5173`).

Make sure the backend is running and the frontend API configuration points to your backend URL.

Learning Outcomes

Through this project, I gained practical experience in:

- Building RESTful APIs using ASP.NET Core.
- Developing interactive frontend applications with React.
- Implementing JWT-based authentication.
- Working with Entity Framework Core and SQL Server.
- Integrating frontend and backend applications.
- Managing application state and API communication.
- Structuring and maintaining a full-stack application.

Project Background

This project was originally developed during the 10Pearls Shine Internship Program and subsequently enhanced and polished as a portfolio project.

Author

Fizza Sarfaraz Khan
Software Developer | Full-Stack Engineer

- GitHub: [@fizzasarfarazkhan](https://github.com/fizzasarfarazkhan)
- Project Repository: [TaskFlow](https://github.com/fizzasarfarazkhan/TaskFlow)

If you find this project interesting, feel free to explore the repository!
