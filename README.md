
# Task Management System

A full-stack task management application built with **Next.js**, **React**, **MongoDB**, and **Tailwind CSS**. This app supports task creation, editing, filtering, role-based access, login/registration, and responsive UI components.

---

## 🚀 Features

- User authentication (Register & Login)
- Create, edit, delete, and view tasks
- Filter tasks by status and priority
- Role-based authorization
- Responsive design with Tailwind CSS
- API routes with MongoDB integration

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Next.js (App Router), Tailwind CSS, React Hook Form
- **Backend:** API Routes (Next.js), MongoDB, Mongoose
- **Authentication:** JWT

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Avinashpotnuru/task-manager/.git
cd task-manager
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create `.env.local` File

```bash
touch .env.local
```

Add the following variables:

```

MONGODB_URI="mongodb+srv://potnuruavinash111:I695pKKzpTJ9j29K@cluster0.gx4mjyh.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="dev_dummy_jwt_secret_key_456789@Avinash"


NEXT_PUBLIC_SERVICE_ID="service_oql7bhj"
NEXT_PUBLIC_TEMPLATE_ID="template_zm935ps"
NEXT_PUBLIC_PUBLIC_KEY="QfEGbzlQ-M-R-nrmU"
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---


## ✨ Author

Made with ❤️ by [Your Name](https://github.com/Avinashpotnuru)
