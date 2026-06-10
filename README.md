# 🏢 Employee Management System

### Full Stack Web App — Spring Boot + React + MySQL

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![Maven](https://img.shields.io/badge/Maven-Build-red?style=for-the-badge&logo=apachemaven)

---

## 📌 About the Project

A full stack **Employee Management System** with a Spring Boot REST API backend and a React frontend. Supports complete CRUD operations — add, view, update, and delete employees along with their assigned projects.

---

## ✨ Features

- ✅ Add employees with project assignment in one form
- ✅ View all employees in a responsive table
- ✅ Edit and update employee records
- ✅ Delete employees with confirmation
- ✅ Stats dashboard — total employees, active projects, departments
- ✅ Input validation on both frontend and backend
- ✅ Global exception handling with proper HTTP status codes
- ✅ OneToOne JPA relationship between Employee and Project
- ✅ Toast notifications for success and error feedback

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Axios, CSS Modules |
| Backend | Java 21, Spring Boot 4.0 |
| ORM | Spring Data JPA / Hibernate 7 |
| Database | MySQL 8.0 |
| Build Tool | Maven |
| API Testing | Postman |

---

## 📁 Project Structure

```
SpringbootERM_Project/
│
├── src/main/java/com/example/demowithems/
│   ├── DemowithemsApplication.java
│   ├── CorsConfig.java
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
│   └── exception/
│       ├── ResourceNotFoundException.java
│       └── GlobalExceptionHandler.java
│
├── src/main/resources/
│   └── application.properties
│
├── ems-frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── employeeApi.js
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── EmployeeTable.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
└── pom.xml
```

---

## 🔗 API Endpoints

Base URL: `http://localhost:8080/api/employees`

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| `POST` | `/` | Add new employee | 201 Created |
| `GET` | `/` | Get all employees | 200 OK |
| `GET` | `/{id}` | Get employee by ID | 200 OK |
| `PUT` | `/{id}` | Update employee | 200 OK |
| `DELETE` | `/{id}` | Delete employee | 200 OK |

---

## 📥 Sample Request — POST `/api/employees`

```json
{
  "name": "Nithya",
  "department": "Engineering",
  "salary": 60000,
  "p": {
    "projectname": "RoleTrack",
    "clientname": "ABC Corp",
    "status": "Active"
  }
}
```

---

## ⚙️ Setup & Run Locally

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

# 3. Update application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/ems_db
spring.datasource.username=root
spring.datasource.password=your_password

# 4. Run Spring Boot (from STS or terminal)
mvn spring-boot:run
# Backend starts at http://localhost:8080
```

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd ems-frontend

# 2. Install dependencies
npm install

# 3. Start React app
npm run dev
# Frontend starts at http://localhost:5173
```

### Open in browser
```
http://localhost:5173
```

---

## 🗄️ Database Schema

### employee table
| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR | NOT NULL |
| department | VARCHAR | — |
| salary | INT | — |
| project_id | INT | FOREIGN KEY → project.id |

### project table
| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| projectname | VARCHAR | — |
| clientname | VARCHAR | — |
| status | VARCHAR | — |

---

## 🧠 Key Concepts Implemented

**Backend**
- `@RestController` — REST API endpoints returning JSON
- `@OneToOne(cascade = CascadeType.ALL)` — saves Project automatically with Employee
- `@JoinColumn(name = "project_id")` — FK mapping in DB
- `@Valid + @NotBlank + @Min` — request body validation
- `@ControllerAdvice` — global exception handler
- `ResponseEntity<>` — proper HTTP status codes (200, 201, 404, 500)
- `JpaRepository` — built-in CRUD without boilerplate SQL
- `CorsConfig` — allows React frontend to call Spring Boot APIs

**Frontend**
- `Axios` — HTTP client for API calls
- `useState / useEffect` — React state and lifecycle management
- `CSS Modules` — scoped component styling
- Form validation before API call
- Toast notifications for user feedback

---

## 👩‍💻 Developer

**Nithyasree R**  
Java Full Stack Developer
📧 nithyasreerajaram16459@gmail.com 
🔗 [LinkedIn](www.linkedin.com/in/nithyasree3018)  
💻 [GitHub](https://github.com/nithyasreeee)

---

> 🌱 Built as a portfolio project to demonstrate full stack Java development skills.
> Open to entry-level Java Full Stack / Backend Developer roles across India.
