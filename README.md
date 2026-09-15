# ShowList

**ShowList** is a full-stack web application for discovering limited-run shows and performances. I built this project as a hands-on learning and portfolio project to develop practical experience in **backend development, database integration, authentication, data processing, API integration, and cloud deployment**.

The application is built with **Node.js and Express.js**, uses **Supabase for authentication and database services**, and is deployed on **Render**.

> **Project purpose:** This is a portfolio project. It is not operated as a commercial service.

**Live Demo:** https://full-stack-web-av68.onrender.com

---

## Demo Account

A test account is available for evaluating the deployed application:

```text
Email:    test1@test.com
Password: 123456
```
---

## Project Overview

ShowList provides authenticated users with access to a collection of current and upcoming limited-run shows.

From a backend perspective, the project demonstrates a complete application flow:

```text
User Request
     │
     ▼
Express.js Server
     │
     ├── Authentication
     │       │
     │       ▼
     │   Supabase Auth
     │
     ├── Application Logic
     │
     ├── Input Validation
     │
     ├── Rate Limiting
     │
     └── Database Access
             │
             ▼
        Supabase Database
             │
             ▼
       Processed Data
             │
             ▼
        EJS Templates
             │
             ▼
        HTML Response
```
---

## Key Technical Features

### Backend Development

* Built the server-side application using **Node.js and Express.js**
* Implemented server-side routing and request handling
* Separated application logic from presentation using EJS templates
* Implemented protected routes for authenticated users
* Processed and validated user-submitted data
* Added rate limiting to the contact form
* Managed configuration using environment variables

### Database Integration

* Integrated **Supabase as the application's backend database**
* Connected server-side application logic to persistent data storage
* Retrieved and processed application data before rendering it to users
* Worked with database-backed authentication and user sessions

### Authentication & Authorization

* Implemented email/password authentication
* Integrated Google OAuth through Supabase
* Managed authenticated user sessions
* Restricted protected application functionality to authenticated users

### Data Processing

The application processes data through multiple stages:

```text
External / Stored Show Data
          │
          ▼
    Backend Processing
          │
          ▼
     Data Validation
          │
          ▼
    Application Logic
          │
          ▼
      EJS Rendering
          │
          ▼
        User UI
```

### Cloud Deployment

* Deployed the application using **Render**
* Configured environment variables for production
* Connected the deployed application to Supabase services
* Troubleshot deployment and configuration issues between multiple services

---

## Security & Reliability Considerations

The project incorporates several basic backend security and reliability practices:

* Authentication for protected application functionality
* Google OAuth integration through Supabase
* Environment variables for sensitive configuration
* Server-side input validation
* Rate limiting on the contact form
* Separation of authentication and application data
* Protected routes for authenticated functionality

The project is intended for educational use and is not presented as a production-hardened commercial system.

---

## Tech Stack

| Layer                 | Technology            |
| --------------------- | --------------------- |
| Runtime               | Node.js               |
| Backend Framework     | Express.js            |
| Server-Side Rendering | EJS                   |
| Authentication        | Supabase Auth         |
| Database              | Supabase              |
| OAuth                 | Google OAuth          |
| Frontend              | HTML, CSS, JavaScript |
| UI Framework          | Bootstrap             |
| Configuration         | dotenv                |
| Deployment            | Render                |
| Version Control       | Git / GitHub          |

---

## Backend Engineering Skills Demonstrated

This project provided practical experience with:

* **HTTP request/response lifecycle**
* **REST-style backend routing**
* **Express.js middleware**
* **Authentication and authorization**
* **OAuth integration**
* **Database integration**
* **CRUD-oriented application data handling**
* **Server-side rendering**
* **Input validation**
* **Rate limiting**
* **Environment configuration**
* **Error handling**
* **Cloud deployment**
* **Git-based development**

---

## Future Improvements

Possible future improvements include:

* Add automated unit and integration tests
* Introduce a more structured REST API layer
* Improve application logging and monitoring
* Add pagination for larger datasets
* Add search and filtering functionality
* Improve database indexing and query performance
* Add a dedicated data ingestion process for show information
* Implement scheduled data updates
* Add CI/CD using GitHub Actions
* Containerize the application using Docker
* Add a separate data-processing pipeline for transforming and loading show data

These improvements would provide opportunities to extend the project toward more dedicated **backend and data engineering workflows**.

---

## License

This project is licensed under the ISC License.
