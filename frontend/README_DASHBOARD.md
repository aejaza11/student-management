# Student Management Dashboard UI

A professional, modern admin dashboard built with React, TypeScript, and Tailwind CSS for managing students and administrators.

## Features

### 🎨 Design
- **Professional Dashboard Layout** - Clean, organized interface with sidebar navigation
- **Modern UI** - Glassmorphism effects, soft shadows, and smooth transitions
- **Dark Mode Support** - Toggle between light and dark themes
- **Responsive Design** - Mobile-friendly layout that adapts to all screen sizes
- **Icon Integration** - Beautiful icons from lucide-react

### 📊 Tables & Data Display
- **Advanced Table Component** - Featuring:
  - Search/filter functionality across multiple fields
  - Column sorting (ascending/descending)
  - Pagination with customizable page size
  - Alternating row colors (striped effect)
  - Hover effects for better UX
- **Action Buttons** - Edit and Delete operations
- **Empty States** - Beautiful "No Data Found" message

### 📝 Forms & Modals
- **Modal Popups** - Clean, centered modals for forms
- **Form Features**:
  - Input validation
  - Error handling
  - Loading states
  - Responsive form fields
- **Forms Included**:
  - Add/Update Student
  - Add/Update Admin

### ✅ Functionality
- **API Integration** - Axios-based API calls to Flask backend
- **Loading States** - Animated spinners while fetching data
- **Toast Notifications** - Success/error messages via react-toastify
- **Dark Mode Toggle** - Theme preference saved to localStorage

### 📄 Pages
- **Dashboard** - Statistics cards, recent activity, overview
- **Students** - Manage students with full CRUD operations
- **Admins** - Manage administrators with full CRUD operations

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Table.tsx          # Reusable table component with sorting/filtering/pagination
│   │   ├── Modal.tsx          # Reusable modal and form field components
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   └── Navbar.tsx         # Top navigation bar with theme toggle
│   ├── pages/
│   │   ├── Dashboard.tsx      # Dashboard with statistics
│   │   ├── Students.tsx       # Student management page
│   │   └── Admins.tsx         # Admin management page
│   ├── services/
│   │   └── api.ts             # API integration with Axios
│   ├── App.tsx                # Main app component
│   ├── App.css                # App styles (empty, uses Tailwind)
│   ├── index.css              # Tailwind directives and custom styles
│   └── main.tsx               # Application entry point
├── public/                     # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Update the API base URL in `src/services/api.ts` if needed:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## Technologies Used

- **Framework**: React 19 with React Router
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 3.4 with PostCSS
- **HTTP Client**: Axios 1.6
- **UI Icons**: lucide-react 0.408
- **Notifications**: react-toastify 10.0
- **Build Tool**: Vite 8.0
- **Package Manager**: npm

## Component API Reference

### Table Component

```typescript
<Table<StudentData>
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
  ]}
  data={students}
  loading={isLoading}
  pageSize={10}
  onEdit={handleEdit}
  onDelete={handleDelete}
  searchFields={['name', 'email']}
/>
```

### Modal Component

```typescript
<Modal
  isOpen={isOpen}
  title="Add Student"
  onClose={handleClose}
  onSubmit={handleSubmit}
  submitText="Save"
  isLoading={isSaving}
>
  <FormField
    label="Name"
    value={name}
    onChange={setName}
    required
  />
</Modal>
```

## API Endpoints

The application expects the following API endpoints from the Flask backend:

### Students
- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Admins
- `GET /api/admins` - List all admins
- `GET /api/admins/:id` - Get admin by ID
- `POST /api/admins` - Create new admin
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin

## Customization

### Color Scheme

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9', // Customize primary color
      },
    },
  },
}
```

### Dark Mode

The app automatically detects system dark mode preference. Users can override with the theme toggle button.

### Page Size

Change pagination default in `Table.tsx`:

```typescript
pageSize={10} // Change this value
```

## Features in Detail

### Search Functionality
- Real-time search across specified fields
- Case-insensitive matching
- Automatically resets to page 1 when searching

### Sorting
- Click column headers to sort
- Toggle between ascending/descending
- Visual indicator shows active sort

### Pagination
- Customizable page size
- Shows total records and current range
- Previous/Next buttons and page number selection

### Dark Mode
- Automatic detection of system preference
- User preference saved to localStorage
- Smooth transitions between themes
- Full UI support with appropriate color schemes

### Delete Confirmation
- Modal popup before deletion
- Prevents accidental deletions
- Clear action buttons (Cancel/Delete)

## Error Handling

All API calls include error handling with user-friendly toast notifications:
- Failed API requests
- Form validation errors
- Session timeouts
- Network errors

## Browser Support

- Modern browsers with ES2020+ support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Optimizations

- Code splitting via Vite
- Lazy component loading
- Efficient re-renders with React 19
- Tailwind CSS tree-shaking
- Optimized bundle size

## Development Tips

1. **Hot Module Replacement** - Changes auto-reload in dev mode
2. **TypeScript** - Full type checking for safer development
3. **Linting** - Run `npm run lint` to check code quality
4. **Components** - Create reusable components in the `components/` folder
5. **Pages** - Create new pages in the `pages/` folder

## Common Issues

### API Connection Errors
- Check if Flask backend is running on `http://localhost:5000`
- Update API_BASE_URL in `src/services/api.ts`
- Check CORS settings on Flask backend

### Styling Issues
- Ensure Tailwind CSS is properly built
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Rebuild with `npm run build`

### Dark Mode Not Working
- Check browser localStorage is enabled
- Clear browser cache and localStorage
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## License

See LICENSE file in root directory

## Support

For issues or questions, check:
1. Console for JavaScript errors
2. Network tab for API errors
3. Browser DevTools for styling issues
