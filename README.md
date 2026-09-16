# ShowList

ShowList is a web application that helps users discover limited-run shows and performances. Users can browse a collection of current and upcoming shows, view show information, and access the application’s features after signing in.

The application supports user registration and login through email/password or Google authentication. Authenticated users can access protected features, while the contact form allows users to submit inquiries.

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

## Application Flow
The following diagram illustrates the user flow and key features of the application.

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

## Key Features
* **Backend Development:** Built server-side application logic and routing with Node.js and Express.js.
* **Authentication & Authorization:** Implemented email/password authentication and Google OAuth using Supabase, with protected routes for authenticated users.
* **Database Integration:** Connected the Express backend to a Supabase database for persistent application data.
* **Data Processing & Validation:** Retrieved, processed, and rendered application data using server-side logic; implemented server-side input validation for user-submitted data.
* **Security & Reliability:** Used environment variables for sensitive configuration and implemented rate limiting for the contact form.
* **Server-Side Rendering:** Used EJS to dynamically generate pages from backend data.
* **Responsive Frontend:** Built a responsive interface using Bootstrap, HTML, CSS, and JavaScript.
* **Cloud Deployment:** Deployed the application on Render and configured its connection to Supabase services.

---

## Tech Stack
* **Backend:** `Node.js`, `Express.js`, `EJS`

* **Database & Authentication:** `Supabase`, `PostgreSQL`, `Google OAuth`

* **Frontend:** `HTML`, `CSS`, `JavaScript`, `Bootstrap`

* **Deployment & Tools:** `Render`, `Git`, `GitHub`, `dotenv`

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

These improvements would provide opportunities to extend the project toward more dedicated backend and data engineering workflows.
