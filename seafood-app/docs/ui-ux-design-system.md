# VAM Seafood — UI/UX Design System Documentation

> **Mục đích:** Tài liệu tham chiếu nhanh để tái sử dụng style, tránh phải đọc lại code mỗi lần tạo page mới.
> **Cập nhật lần cuối:** 2026-06-24

---

## 1. Color Palette

| Token | Hex | Tailwind | Sử dụng |
|-------|-----|----------|---------|
| **Primary** | `#0A2647` | — (inline style) | Headings, navbar active bg, branding text |
| **Accent** | `#00BCD4` | `cyan-500` gần nhất | CTA buttons, active tabs border, icon accent, links |
| **Active highlight bg** | `#F0F9FF` | `blue-50` | Active tab background |
| **Page background** | — | `bg-gray-50` | Mọi page layout |
| **Card background** | — | `bg-white` | Cards, modals, tables |
| **Border** | `#e5e7eb` | `border-gray-200` | Card borders, table dividers, input borders |
| **Body text** | — | `text-gray-600` | Mô tả, subtitle, secondary text |
| **Muted text** | — | `text-gray-500` | Timestamps, hints |
| **Price/highlight** | `#d4183d` | — | Giá tiền đỏ |

### Status Badge Colors

| Status | Background | Text |
|--------|-----------|------|
| Thành công / Đã giao / Active | `bg-green-100` | `text-green-700` |
| Đang xử lý / Đang giao | `bg-blue-100` | `text-blue-700` |
| Chờ duyệt / Pending | `bg-yellow-100` | `text-yellow-700` |
| Từ chối / Inactive / Error | `bg-red-100` | `text-red-700` |

### Gradient Stat Cards

```
bg-gradient-to-br from-blue-50 to-cyan-50    → Tổng quan / Default
bg-gradient-to-br from-yellow-50 to-orange-50 → Warning / Pending
bg-gradient-to-br from-green-50 to-emerald-50 → Success / Approved
bg-gradient-to-br from-red-50 to-pink-50      → Error / Rejected
bg-gradient-to-br from-purple-50 to-indigo-50 → Special / Premium
bg-gradient-to-br from-cyan-50 to-teal-50     → Accent variant
```

---

## 2. Typography

| Element | Classes / Style |
|---------|----------------|
| Page title (h1) | `text-3xl font-bold` + `color: '#0A2647'` |
| Section title (h2) | `text-xl font-bold` + `color: '#0A2647'` |
| Card title (h3/h4) | `font-semibold` + `color: '#0A2647'` |
| Body text | `text-sm text-gray-600` |
| Label | `block font-medium mb-2` + `color: '#0A2647'` |
| Badge / Tag | `px-2 py-1 rounded text-xs` |
| Navbar role | `text-[10px] text-gray-500 font-bold tracking-wider` |

> **Lưu ý:** Project không import Google Fonts. Dùng system font mặc định của Tailwind.

---

## 3. Layout

| Pattern | Value |
|---------|-------|
| Max container width | `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8` |
| Page padding top | `py-8` |
| Card spacing | `gap-6` (grid) |
| Section spacing | `mb-8` |
| Card padding | `p-6` |
| Card radius | `rounded-lg` |
| Card shadow | `shadow-sm` |

### Responsive Grid Patterns

```jsx
// Stats cards: 1 → 2 → 4 columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"

// Charts: 1 → 2 columns
className="grid grid-cols-1 lg:grid-cols-2 gap-6"

// Quick actions: 1 → 3 columns
className="grid grid-cols-1 md:grid-cols-3 gap-4"

// Form fields: 1 → 2 columns
className="grid grid-cols-1 md:grid-cols-2 gap-6"
```

---

## 4. Component Patterns

### Stat Card (Standard)

```jsx
<div className="bg-white rounded-lg shadow-sm p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-gray-600">Label</span>
    <IconComponent className="w-5 h-5" style={{ color: '#00BCD4' }} />
  </div>
  <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>Value</p>
  <p className="text-xs text-green-600 mt-1">+12% so với tháng trước</p>
</div>
```

### Stat Card (Gradient — dùng cho overview)

```jsx
<div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border" 
     style={{ borderColor: '#E0F7FA' }}>
  <p className="text-sm text-gray-600 mb-2">Label</p>
  <p className="text-3xl font-bold mb-2" style={{ color: '#0A2647' }}>Value</p>
  <p className="text-xs text-gray-500">Description</p>
</div>
```

### Tab Navigation

```jsx
<button
  className={`px-6 py-4 flex items-center gap-2 whitespace-nowrap ${
    isActive ? 'border-b-2' : 'text-gray-500'
  }`}
  style={{
    borderColor: isActive ? '#00BCD4' : 'transparent',
    color: isActive ? '#0A2647' : undefined
  }}
>
  <Icon className="w-4 h-4" />
  {label}
</button>
```

### Table

```jsx
<table className="w-full">
  <thead>
    <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
      <td className="py-3 px-4 text-sm">Content</td>
      <td className="py-3 px-4 text-sm text-gray-600">Secondary</td>
    </tr>
  </tbody>
</table>
```

### CTA Button (Primary)

```jsx
<button
  className="px-6 py-3 rounded-md text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
  style={{ backgroundColor: '#00BCD4' }}
>
  <Icon className="w-5 h-5" />
  Label
</button>
```

### CTA Button (Secondary/Outline)

```jsx
<button
  className="px-6 py-3 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
  style={{ borderColor: '#0A2647', color: '#0A2647' }}
>
  <Icon className="w-5 h-5" />
  Label
</button>
```

### Quick Action Card (Dashed border)

```jsx
<button
  className="p-6 border-2 border-dashed rounded-lg hover:bg-blue-50 transition-colors text-left cursor-pointer"
  style={{ borderColor: '#00BCD4' }}
>
  <Icon className="w-8 h-8 mb-3" style={{ color: '#00BCD4' }} />
  <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Title</h4>
  <p className="text-sm text-gray-600">Description</p>
</button>
```

### Input Field

```jsx
<input
  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
  style={{ borderColor: '#e5e7eb' }}
/>
```

### Info Notice

```jsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <p className="text-sm text-blue-800">
    <strong>Lưu ý:</strong> Message content
  </p>
</div>
```

---

## 5. Charts (Recharts)

### Line Chart

```jsx
<ResponsiveContainer width="100%" height={250}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#00BCD4" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

### Bar Chart

```jsx
<ResponsiveContainer width="100%" height={250}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#0A2647" />
  </BarChart>
</ResponsiveContainer>
```

---

## 6. Icons

- **Library:** `lucide-react`
- **Size:** `w-4 h-4` (inline), `w-5 h-5` (card header), `w-6 h-6` (navbar), `w-8 h-8` (feature), `w-12 h-12` (empty state)
- **Color accent:** `style={{ color: '#00BCD4' }}`
- **Color primary:** `style={{ color: '#0A2647' }}`
- **Empty state icon:** `className="text-gray-300"`
- **KHÔNG dùng emoji** làm icon

### Icons thường dùng

| Mục đích | Icon |
|----------|------|
| Đơn hàng | `Package` |
| Doanh thu | `DollarSign` |
| Thống kê | `TrendingUp`, `BarChart3` |
| Người dùng | `User`, `Users` |
| Thương lượng | `MessageSquare` |
| Hợp đồng | `FileText` |
| Lịch sử | `History` |
| Thông báo | `Bell` |
| Tải lên | `Upload` |
| Lưu | `Save` |
| Gửi | `Send` |
| Menu | `Menu` |
| Đóng | `X` |
| Giỏ hàng | `ShoppingCart` |
| Đăng xuất | `LogOut` |
| Cảnh báo | `AlertCircle` |

---

## 7. Navbar

- **Sticky:** `sticky top-0 z-50`
- **Background:** `bg-white shadow-md`
- **Active item:** `backgroundColor: '#0A2647'`, `color: 'white'`
- **Inactive item:** `color: '#0A2647'`
- **Login button:** `backgroundColor: '#00BCD4'`, `text-white`
- **Mobile breakpoint:** `lg:hidden` / `hidden lg:flex`

---

## 8. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.4 |
| Build tool | Vite | 8.0.4 |
| Styling | Tailwind CSS | 4.2.2 |
| Icons | lucide-react | 1.8.0 |
| Charts | recharts | 3.8.1 |
| Toast | react-hot-toast | 2.6.0 |
| Routing | Manual state-based (`currentPage` in App.jsx) | — |
| API | Custom Fetch wrapper (`apiClient.js`) | — |
| Auth | JWT token in localStorage | — |

---

## 9. File Structure

```
src/
├── api/
│   ├── apiClient.js      # Fetch wrapper with auth headers
│   ├── auth.js            # Auth API calls
│   ├── endpoints.js       # Centralized endpoint constants
│   └── index.js           # Re-exports
├── components/
│   ├── ui/                # Shared UI components
│   ├── Navbar.jsx         # Sticky navigation
│   ├── Footer.jsx         # Page footer
│   ├── Logo.jsx           # SVG logo
│   ├── ProductCard.jsx    # Product display card
│   └── ...
├── pages/
│   ├── admin/             # Admin-only pages
│   ├── buyer/             # Buyer pages (Cart, Checkout, Retail...)
│   ├── seller/            # Seller pages (Dashboard, Listings...)
│   └── common/            # Shared pages (Login, Contact, Homepage...)
├── App.jsx                # Root component, routing, auth
├── main.jsx               # Entry point
└── index.css              # @import "tailwindcss"
```

---

## 10. Routing & Auth Pattern

```jsx
// Navigation: state-based, no react-router
const [currentPage, setCurrentPage] = useState('home');
const handleNavigate = (page, id) => {
  setCurrentPage(page);
  setPageData({ id });
  window.scrollTo(0, 0);
};

// Access control by role
const canAccess = (page) => {
  if (!user) return ['home', 'login', 'retail', ...].includes(page);
  const role = user.role?.toLowerCase();
  if (role === 'admin') return true; // Admin has access to everything
  // ... role-specific checks
};
```
