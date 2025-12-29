# Task Glitch – Bug Fix Assignment

A task management web application built for sales teams to track, manage, and prioritize tasks based on ROI (Return on Investment).

This project focuses on **fixing real-world bugs** in an existing React application, improving stability, correctness, and user experience.

---

## 🚀 Live Demo
 [https://YOUR-NETLIFY-LINK.netlify.app](https://chimerical-yeot-a6cf89.netlify.app/)

---

##  Project Overview

Each task contains:
- Revenue
- Time Taken
- ROI (Revenue ÷ Time)
- Priority
- Status
- Notes

The app allows users to manage tasks efficiently and view performance insights.

---

##  Bugs Fixed

### 1️⃣ Double Fetch Issue
- Fixed duplicate task loading on page refresh
- Ensured data loads only once on app startup

### 2️⃣ Undo Snackbar Bug
- Fixed issue where old deleted tasks reappeared
- Reset delete state when snackbar closes

### 3️⃣ Unstable Sorting
- Implemented stable sorting for tasks with same ROI & priority
- Added deterministic tie-breaker (task title)

### 4️⃣ Double Dialog Opening
- Prevented Edit/Delete clicks from opening View dialog
- Fixed event bubbling using `stopPropagation`

### 5️⃣ ROI Calculation Errors
- Handled division by zero
- Prevented `NaN` / `Infinity` values
- Standardized ROI formatting

---

## ✨ Features

- Add, edit, delete tasks
- Undo delete via snackbar
- Stable ROI & priority-based sorting
- Task performance metrics & insights
- LocalStorage-based persistence
- Clean, modular React architecture

---

##  Tech Stack

- React + TypeScript
- Vite
- Material UI
- LocalStorage (no backend)
- Netlify (deployment)

---

##  Setup & Run Locally

```bash
npm install
npm run dev
