# Architecture & Data Flow

## Component Hierarchy

```
App.tsx (Main App Component)
│
├── State Management
│   ├── activeMenu (current page)
│   ├── sidebarOpen (mobile toggle)
│   ├── darkMode (theme)
│   └── Dynamic page rendering
│
├── Sidebar.tsx
│   ├── Logo
│   ├── Navigation Menu
│   │   ├── Dashboard (icon)
│   │   ├── Students (icon)
│   │   └── Admins (icon)
│   ├── Menu State Management
│   │   ├── Active menu highlighting
│   │   └── Mobile toggle
│   └── Logout Button
│
├── Main Content Wrapper
│   │
│   ├── Navbar.tsx
│   │   ├── Page Title (Dynamic)
│   │   ├── Notification Bell
│   │   ├── Dark Mode Toggle
│   │   │   └── LocalStorage Persistence
│   │   └── Profile Button
│   │
│   └── Page Content (Dynamic Based on activeMenu)
│       │
│       ├── Dashboard Page
│       │   ├── Statistics Cards (4)
│       │   │   ├── Total Students
│       │   │   ├── Total Admins
│       │   │   ├── Active Users
│       │   │   └── Completion Rate
│       │   └── Recent Activity Feed
│       │
│       ├── Students Page
│       │   ├── Header + Add Button
│       │   ├── Table Component (Reusable)
│       │   │   ├── Search Bar
│       │   │   ├── Sortable Headers
│       │   │   ├── Data Rows
│       │   │   ├── Edit/Delete Buttons
│       │   │   └── Pagination Controls
│       │   ├── Modal Component (Add/Edit)
│       │   │   ├── FormField x 5
│       │   │   └── Submit/Cancel Buttons
│       │   └── Confirmation Modal (Delete)
│       │
│       └── Admins Page
│           ├── Header + Add Button
│           ├── Table Component (Reusable)
│           │   ├── Search Bar
│           │   ├── Sortable Headers
│           │   ├── Data Rows
│           │   ├── Edit/Delete Buttons
│           │   └── Pagination Controls
│           ├── Modal Component (Add/Edit)
│           │   ├── FormField x 4
│           │   └── Submit/Cancel Buttons
│           └── Confirmation Modal (Delete)
│
└── Toast Container
    └── Notifications (success/error)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  Sidebar │ Navbar │ Main Content │ Toast Notifications  │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │ User Actions
                            ▼
┌─────────────────────────────────────────────────────────┐
│             REACT COMPONENT STATE                        │
│  - activeMenu (page)                                    │
│  - darkMode (theme)                                     │
│  - students/admins (data)                               │
│  - modals (visibility)                                  │
│  - loading states                                       │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │ Event Handlers
                            ▼
┌─────────────────────────────────────────────────────────┐
│              SERVICE LAYER (api.ts)                      │
│  - Axios HTTP Client                                    │
│  - Request/Response Handling                            │
│  - Error Management                                     │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────┐
│            BACKEND API (Flask)                           │
│  http://localhost:5000/api/                             │
│  ├── /students (CRUD)                                   │
│  └── /admins (CRUD)                                     │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │ Database Queries
                            ▼
┌─────────────────────────────────────────────────────────┐
│             MYSQL DATABASE                              │
│  - students table                                       │
│  └── admins table                                       │
└─────────────────────────────────────────────────────────┘
```

---

## State Management Flow

### Page Navigation
```
User clicks sidebar menu
        ↓
onMenuChange() called
        ↓
setActiveMenu() updates state
        ↓
App component re-renders
        ↓
renderContent() returns new page component
        ↓
UI displays new page
```

### Table Operations

#### Search/Filter
```
User types in search box
        ↓
onChange() event triggered
        ↓
setSearchTerm() updates state
        ↓
filteredData computed (client-side)
        ↓
Table re-renders with filtered results
```

#### Sorting
```
User clicks column header
        ↓
handleSort() called
        ↓
setSortConfig() updates sort order
        ↓
sortedData computed (client-side)
        ↓
Table re-renders sorted
```

#### Pagination
```
User clicks page number
        ↓
setCurrentPage() updates state
        ↓
paginatedData = slice(data)
        ↓
Table displays page data
```

### CRUD Operations

#### Add/Create
```
User clicks "Add Student"
        ↓
setIsModalOpen(true)
        ↓
Modal component renders form
        ↓
User fills form and clicks "Save"
        ↓
handleSubmit() called
        ↓
apiService.createStudent(formData)
        ↓
Axios POST request to backend
        ↓
Backend creates record in DB
        ↓
Response returns to frontend
        ↓
If success: toast notification & fetchStudents()
If error: error notification
        ↓
Modal closes, table refreshes
```

#### Update/Edit
```
User clicks "Edit" button
        ↓
handleOpenModal(student) called
        ↓
setEditingStudent(student)
        ↓
setFormData(student) pre-fills form
        ↓
setIsModalOpen(true)
        ↓
Modal renders with populated form
        ↓
User modifies data and clicks "Update"
        ↓
handleSubmit() called
        ↓
apiService.updateStudent(id, formData)
        ↓
Axios PUT request to backend
        ↓
Backend updates record in DB
        ↓
Response returns to frontend
        ↓
If success: toast notification & fetchStudents()
If error: error notification
        ↓
Modal closes, table refreshes
```

#### Delete
```
User clicks "Delete" button
        ↓
handleDeleteClick(student) called
        ↓
setDeleteConfirm({ open: true, id: student.id })
        ↓
Confirmation modal opens
        ↓
User clicks "Delete" button
        ↓
handleConfirmDelete() called
        ↓
apiService.deleteStudent(id)
        ↓
Axios DELETE request to backend
        ↓
Backend deletes record from DB
        ↓
Response returns to frontend
        ↓
If success: toast notification & fetchStudents()
If error: error notification
        ↓
Confirmation modal closes, table refreshes
```

---

## Component Props Flow

### Table Component Props
```typescript
<Table<Student>
  columns={Column[]}           // Column definitions
  data={Student[]}             // Data to display
  loading={boolean}            // Loading state
  pageSize={10}                // Items per page
  onEdit={(item) => void}      // Edit callback
  onDelete={(item) => void}    // Delete callback
  searchFields={string[]}      // Fields to search
/>
```

### Modal Component Props
```typescript
<Modal
  isOpen={boolean}             // Visibility
  title={string}               // Dialog title
  onClose={() => void}         // Close callback
  onSubmit={(e) => void}       // Form submission
  children={ReactNode}         // Form content
  submitText={string}          // Button label
  isLoading={boolean}          // Loading state
/>
```

### FormField Component Props
```typescript
<FormField
  label={string}               // Field label
  type={string}                // Input type
  placeholder={string}         // Input placeholder
  value={string}               // Input value
  onChange={(v) => void}       // Change callback
  required={boolean}           // Required indicator
  error={string}               // Error message
/>
```

---

## API Service Architecture

```
services/api.ts
│
├── Configuration
│   └── axios.create() with base URL
│
├── Student Endpoints
│   ├── getStudents()              → GET /students
│   ├── getStudentById(id)         → GET /students/:id
│   ├── createStudent(data)        → POST /students
│   ├── updateStudent(id, data)    → PUT /students/:id
│   └── deleteStudent(id)          → DELETE /students/:id
│
├── Admin Endpoints
│   ├── getAdmins()                → GET /admins
│   ├── getAdminById(id)           → GET /admins/:id
│   ├── createAdmin(data)          → POST /admins
│   ├── updateAdmin(id, data)      → PUT /admins/:id
│   └── deleteAdmin(id)            → DELETE /admins/:id
│
└── Error Handling
    └── Toast notifications for failures
```

---

## Styling Layer Architecture

```
Tailwind CSS
│
├── Base Styles (index.css)
│   ├── @tailwind base
│   ├── @tailwind components
│   └── @tailwind utilities
│
├── Component Classes (Custom)
│   ├── .glass-effect          → backdrop-blur + bg
│   ├── .card-shadow           → box-shadow
│   ├── .btn-primary           → blue button
│   ├── .btn-secondary         → gray button
│   ├── .btn-danger            → red button
│   └── .input-field           → styled input
│
├── Dark Mode (tailwind.config.js)
│   ├── darkMode: 'class'      → media query based
│   └── Theme colors           → light/dark variants
│
└── Responsive Breakpoints
    ├── sm: 640px
    ├── md: 768px
    ├── lg: 1024px
    └── xl: 1280px
```

---

## File Dependency Graph

```
App.tsx
├── Sidebar.tsx
├── Navbar.tsx
│   └── (Icon from lucide-react)
├── pages/Dashboard.tsx
│   └── (lucide-react icons)
├── pages/Students.tsx
│   ├── components/Table.tsx
│   │   └── (lucide-react icons)
│   ├── components/Modal.tsx
│   │   ├── components/FormField
│   │   └── (lucide-react icons)
│   └── services/api.ts
│       └── axios
├── pages/Admins.tsx
│   ├── components/Table.tsx
│   ├── components/Modal.tsx
│   └── services/api.ts
└── ToastContainer (react-toastify)

index.css
├── @tailwind directives
├── @layer components (custom classes)
└── theme configuration

tailwind.config.js
├── theme extensions
├── darkMode configuration
└── plugins

package.json
├── react
├── react-dom
├── react-router-dom
├── axios
├── lucide-react
├── react-toastify
├── clsx
└── [build tools]
```

---

## Lifecycle Flow

### Application Startup
```
1. main.tsx loads
2. App.tsx renders
3. useEffect checks dark mode preference
4. Initial state set:
   - activeMenu = 'dashboard'
   - darkMode = system preference
   - sidebarOpen = false
5. Dashboard page renders
6. Mock data displays (or API fetches if available)
```

### Page Navigation
```
1. User clicks menu item
2. Sidebar's onClick handler fires
3. onMenuChange() called with page ID
4. setActiveMenu() updates state
5. app re-renders with new page
6. Page component (Students/Admins/Dashboard) mounts
7. useEffect fetches data from API
8. setLoading(true) while fetching
9. Data renders when received
10. If error, mock data shows
```

### Data Modification
```
1. User interacts with form or buttons
2. Modal opens (Add/Edit/Delete)
3. User submits form
4. API call made via services/api.ts
5. setLoading(true) during request
6. Response received
7. If success: toast notification + data refresh
8. If error: toast error notification
9. Modal closes
10. Table updates with new data
```

---

## Performance Considerations

### Optimization Strategies
```
✅ Component Memoization Ready
   - Table data stays stable unless changed
   - Modal only updates when state changes

✅ Event Handler Optimization
   - Search debouncing ready (can add)
   - Sorting computed client-side (fast)
   - Pagination computed client-side (fast)

✅ Network Optimization
   - API calls only on user action
   - Mock data fallback (no unnecessary requests)
   - Toast notifications (no page reloads)

✅ Bundle Optimization
   - Tailwind CSS tree-shaking (unused classes removed)
   - Vite code splitting
   - React 19 optimizations
   - Lucide icons (tree-shakeable)
```

---

## Error Handling Strategy

```
Try-Catch Blocks
    ↓
Catch Error
    ↓
Check Error Type
    ├── Network Error → "Connection failed"
    ├── API Error → Use error message from response
    └── Other Error → "Operation failed"
    ↓
Log to Console (development)
    ↓
Show Toast Notification
    ↓
Update UI (disable buttons, etc.)
    ↓
Allow user to retry
```

---

## Security Considerations

```
✅ Type Safety
   - TypeScript prevents type errors

✅ Input Validation
   - HTML5 validation ready
   - Required field indicators
   - Email validation available

✅ XSS Protection
   - React auto-escapes content
   - No innerHTML used

✅ API Security
   - Ready for HTTPS in production
   - API endpoints configurable
   - Secrets stored in .env (setup ready)

✅ CORS
   - Configure on Flask backend
   - Frontend doesn't need CORS setup
```

---

This architecture provides a solid, scalable foundation for a professional admin dashboard! 🎉
