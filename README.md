# 🏢 WorkForce — Employee Management System

### Full Stack HR Management Platform

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-green?style=for-the-badge&logo=springboot)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-darkgreen?style=for-the-badge&logo=springsecurity)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)

---

## 📌 About

A production-ready **HR Management System** with JWT authentication, role-based access control, interactive dashboard with charts, and complete employee management — built with Spring Boot and React.

---

## ✨ Features

- 🔐 JWT Authentication — Login, Register, token-based security
- 👥 Role System — SUPER_ADMIN, ADMIN, EMPLOYEE with different permissions
- 📊 Dashboard — Charts for department breakdown, salary analysis, project status distribution
- 👤 User Management — SUPER_ADMIN can promote or demote user roles
- ✅ Full CRUD — Add, view, edit, delete employees with project tracking
- 🌓 Dark / Light theme toggle
- 🛡 Route protection — APIs secured by role, UI adapts to user role
- 📱 Responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios, Recharts, CSS Modules |
| Backend | Java 21, Spring Boot 4.0 |
| Security | Spring Security, JWT (jjwt 0.11.5) |
| ORM | Spring Data JPA, Hibernate 7 |
| Database | MySQL 8.0 |
| Build Tool | Maven |

---

## 👥 Role Permissions

| Role | View Employees | Add / Edit / Delete | User Management |
|---|---|---|---|
| SUPER_ADMIN | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ❌ |
| EMPLOYEE | ✅ | ❌ | ❌ |

---

## 📁 Project Structure

SpringbootERM_Project/

│

├── src/main/java/com/example/demowithems/

│   ├── auth/

│   │   ├── User.java

│   │   ├── UserRepo.java

│   │   ├── AuthController.java

│   │   ├── AuthRequest.java

│   │   ├── AuthResponse.java

│   │   ├── JwtUtil.java

│   │   ├── JwtFilter.java

│   │   ├── SecurityConfig.java

│   │   └── UserDetailsServiceImpl.java

│   ├── controller/

│   │   └── EmployeeController.java

│   ├── service/

│   │   └── EmployeeService.java

│   ├── entity/

│   │   ├── Employee.java

│   │   └── Project.java

│   ├── dao/

│   │   ├── EmployeeRepo.java

│   │   └── ProjectRepo.java

│   ├── exception/

│   │   ├── GlobalExceptionHandler.java

│   │   └── ResourceNotFoundException.java

│   └── CorsConfig.java

│

├── ems-frontend/

│   ├── src/

│   │   ├── api/

│   │   │   ├── authApi.js

│   │   │   └── employeeApi.js

│   │   ├── components/

│   │   │   ├── Sidebar.jsx

│   │   │   ├── EmployeeForm.jsx

│   │   │   ├── EmployeeTable.jsx

│   │   │   └── Toast.jsx

│   │   ├── context/

│   │   │   └── AuthContext.jsx

│   │   ├── pages/

│   │   │   ├── LoginPage.jsx

│   │   │   ├── Dashboard.jsx

│   │   │   └── UserManagement.jsx

│   │   └── App.jsx

│   └── package.json

│

└── README.md


---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /auth/register | Public | Register new user |
| POST | /auth/login | Public | Login and get JWT token |
| GET | /auth/users | SUPER_ADMIN | Get all users |
| PUT | /auth/users/{id}/role | SUPER_ADMIN | Update user role |

### Employees
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/employees | All roles | Get all employees |
| GET | /api/employees/{id} | All roles | Get employee by ID |
| POST | /api/employees | ADMIN and above | Add new employee |
| PUT | /api/employees/{id} | ADMIN and above | Update employee |
| DELETE | /api/employees/{id} | ADMIN and above | Delete employee |

---

## ⚙️ Setup and Run Locally

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.x

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/nithyasreeee/SpringbootERM_Project.git

# 2. Create MySQL database
mysql -u root -p
CREATE DATABASE ems_db;

# 3. Update src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/ems_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
spring.application.name=Employee Management System

# 4. Run the application
mvn spring-boot:run
```

Backend starts at: http://localhost:8080

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd ems-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Frontend starts at: http://localhost:5173

---

## 🚀 First Time Setup
1.Open http://localhost:5173
2.Click Create account tab
3.Register your first user — automatically becomes SUPER_ADMIN
4.Register more users — they get EMPLOYEE role by default
5.Login as SUPER_ADMIN
6.Go to User Management in sidebar
7.Promote users to ADMIN role using the dropdown

---

## 🗄️ Database Schema

### users table
| Column | Type | Description |
|---|---|---|
| id | INT | Primary key, auto increment |
| username | VARCHAR | Unique username |
| password | VARCHAR | BCrypt encrypted password |
| role | VARCHAR | SUPER_ADMIN, ADMIN, or EMPLOYEE |

### employee table
| Column | Type | Description |
|---|---|---|
| id | INT | Primary key, auto increment |
| name | VARCHAR | Employee full name |
| department | VARCHAR | Department name |
| salary | INT | Monthly salary |
| project_id | INT | Foreign key to project table |

### project table
| Column | Type | Description |
|---|---|---|
| id | INT | Primary key, auto increment |
| projectname | VARCHAR | Project name |
| clientname | VARCHAR | Client name |
| status | VARCHAR | Active, In Progress, Completed, On Hold |

---

## 🧠 Key Concepts Implemented

**Backend**
- `@RestController` with `ResponseEntity` for proper HTTP status codes
- Spring Security with stateless JWT authentication
- `@OncePerRequestFilter` for JWT validation on every request
- `BCryptPasswordEncoder` for secure password storage
- `@ControllerAdvice` for global exception handling
- `@OneToOne(cascade = CascadeType.ALL)` for Employee-Project relationship
- Role-based API protection using `hasRole()` and `hasAnyRole()`
- First-user detection with `userRepo.count() == 0` for auto SUPER_ADMIN

**Frontend**
- React Context API for global auth state management
- JWT token stored in localStorage and sent via Axios interceptors
- Role-based UI rendering — components adapt based on user role
- Recharts for interactive data visualization
- CSS Modules for scoped component styling
- Dark and Light theme using CSS variables and data-theme attribute

---

## 📸 Screenshots

### Login Page
Clean split-layout login with feature highlights and tech stack badges

### Dashboard
Interactive charts showing department breakdown, salary analysis, and project status distribution

### Employee Management
Full CRUD table with search, sort, role-based action buttons

### User Management
SUPER_ADMIN exclusive page to manage user roles with a permissions reference card

---

## 👩‍💻 Developer

**Nithyasree R**
B.E. Computer Science and Engineering
Java Full Stack Developer — 2026 Fresher

Open to entry-level opportunities in Java Full Stack, Backend, and Software Developer roles across Chennai, Coimbatore, and Bangalore.

[![GitHub](https://img.shields.io/badge/GitHub-nithyasreeee-black?style=flat&logo=github)](https://github.com/nithyasreeee)

---

> Built as a portfolio project to demonstrate full stack Java development with Spring Boot, React, JWT authentication, and role-based access control.
