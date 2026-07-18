# 📊 Báo Cáo Đối Chiếu API (Tự Động)
*Cập nhật lúc: 21:24:57 18/7/2026*

Báo cáo này được tự động sinh ra bởi script để đối chiếu trạng thái phát triển API giữa **Frontend (React)** và **Backend (.NET)**.

---

## 📈 Tóm tắt trạng thái
- **🟢 Connected (Đã ráp & sử dụng):** 36 APIs
- **🟡 BE Only (BE đã viết, FE chưa ráp):** 35 APIs
- **🔴 FE Only (FE định nghĩa nhưng BE chưa có):** 11 APIs

---

## 🔍 Chi tiết trạng thái các API

| Method | Endpoint thực tế | Trạng thái | Nơi sử dụng ở FE | Controller BE (Action) |
| :--- | :--- | :--- | :--- | :--- |
| `GET/POST` | `/cart` | 🔴 FE Only (BE Missing) | `products.js` | `N/A` |
| `POST` | `/cart/add` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/cart/clear` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `PUT` | `/cart/items/${itemId}` | 🔴 FE Only (BE Missing) | `products.js` | `N/A` |
| `DELETE` | `/cart/items/${itemId}` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/products/b2b` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/products/retail` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/suppliers` | 🔴 FE Only (BE Missing) | `products.js` | `N/A` |
| `GET/POST` | `/suppliers/${id}` | 🔴 FE Only (BE Missing) | `ProductApprovalPage.jsx`, `products.js` | `N/A` |
| `GET/POST` | `/suppliers/farms` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/suppliers/farms/${id}` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET` | `/api/Categorys/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `CategorysController.cs (GetById)` |
| `DELETE` | `/api/Categorys/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `CategorysController.cs (Delete)` |
| `GET` | `/api/Farms` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `FarmsController.cs (GetAll)` |
| `POST` | `/api/Farms` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `FarmsController.cs (Create)` |
| `PUT` | `/api/Farms` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `FarmsController.cs (Update)` |
| `GET` | `/api/Farms/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `FarmsController.cs (GetById)` |
| `DELETE` | `/api/Farms/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `FarmsController.cs (Delete)` |
| `GET` | `/api/OrderItems` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (GetAll)` |
| `POST` | `/api/OrderItems` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (Create)` |
| `PUT` | `/api/OrderItems` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (Update)` |
| `GET` | `/api/OrderItems/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (GetById)` |
| `DELETE` | `/api/OrderItems/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (Delete)` |
| `GET` | `/api/Payments` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (GetAll)` |
| `POST` | `/api/Payments` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (Create)` |
| `PUT` | `/api/Payments` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (Update)` |
| `GET` | `/api/Payments/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (GetById)` |
| `DELETE` | `/api/Payments/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (Delete)` |
| `POST` | `/api/Payments/checkout/{orderId}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (Checkout)` |
| `POST` | `/api/Payments/webhook` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (Webhook)` |
| `GET` | `/api/Payouts` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PayoutsController.cs (GetAll)` |
| `POST` | `/api/Payouts/{id}/confirm` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PayoutsController.cs (ConfirmManual)` |
| `GET` | `/api/Reviews` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `ReviewsController.cs (GetAll)` |
| `POST` | `/api/Reviews` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `ReviewsController.cs (Create)` |
| `PUT` | `/api/Reviews` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `ReviewsController.cs (Update)` |
| `GET` | `/api/Reviews/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `ReviewsController.cs (GetById)` |
| `DELETE` | `/api/Reviews/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `ReviewsController.cs (Delete)` |
| `GET` | `/api/Users` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (GetAll)` |
| `POST` | `/api/Users` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (Create)` |
| `PUT` | `/api/Users` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (Update)` |
| `GET` | `/api/Users/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (GetById)` |
| `DELETE` | `/api/Users/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (Delete)` |
| `PUT` | `/api/Users/customer-status/{userId}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (UpdateCustomerStatus)` |
| `PATCH` | `/api/Orders/{id}/status` | 🟡 BE Only (FE Unused) | *Chưa ráp* | `OrdersController.cs (UpdateStatus)` |
| `GET` | `/api/Orders/my-orders` | 🟡 BE Only (FE Unused) | *Chưa ráp* | `OrdersController.cs (GetMyOrders)` |
| `GET` | `/api/Orders/seller-orders` | 🟡 BE Only (FE Unused) | *Chưa ráp* | `OrdersController.cs (GetSellerOrders)` |
| `PUT` | `/api/admin/AdminProfiles/business/{id}/approve` | 🟢 Connected | `profile.js` | `AdminProfilesController.cs (ApproveBusinessProfile)` |
| `GET` | `/api/admin/AdminProfiles/business/pending` | 🟢 Connected | `profile.js` | `AdminProfilesController.cs (GetPendingBusinessProfiles)` |
| `PUT` | `/api/admin/AdminProfiles/seller/{id}/approve` | 🟢 Connected | `profile.js` | `AdminProfilesController.cs (ApproveSellerProfile)` |
| `GET` | `/api/admin/AdminProfiles/seller/pending` | 🟢 Connected | `profile.js` | `AdminProfilesController.cs (GetPendingSellerProfiles)` |
| `POST` | `/api/Auth/change-password` | 🟢 Connected | `auth.js` | `AuthController.cs (ChangePassword)` |
| `POST` | `/api/Auth/forgot-password` | 🟢 Connected | `auth.js` | `AuthController.cs (ForgotPassword)` |
| `POST` | `/api/Auth/google-login` | 🟢 Connected | `auth.js` | `AuthController.cs (GoogleLogin)` |
| `POST` | `/api/Auth/login` | 🟢 Connected | `auth.js` | `AuthController.cs (Login)` |
| `POST` | `/api/Auth/logout` | 🟢 Connected | `auth.js` | `AuthController.cs (Logout)` |
| `POST` | `/api/Auth/register` | 🟢 Connected | `auth.js` | `AuthController.cs (Register)` |
| `POST` | `/api/Auth/reset-password` | 🟢 Connected | `auth.js` | `AuthController.cs (ResetPassword)` |
| `GET` | `/api/Categorys` | 🟢 Connected | `products.js` | `CategorysController.cs (GetAll)` |
| `POST` | `/api/Categorys` | 🟢 Connected | `products.js` | `CategorysController.cs (Create)` |
| `PUT` | `/api/Categorys` | 🟢 Connected | `products.js` | `CategorysController.cs (Update)` |
| `GET` | `/api/Orders` | 🟢 Connected | `products.js` | `OrdersController.cs (GetAll)` |
| `POST` | `/api/Orders` | 🟢 Connected | `products.js` | `OrdersController.cs (Create)` |
| `GET` | `/api/Orders/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `products.js` | `OrdersController.cs (GetById)` |
| `DELETE` | `/api/Orders/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `products.js` | `OrdersController.cs (Delete)` |
| `GET` | `/api/Products` | 🟢 Connected | `products.js` | `ProductsController.cs (GetAll)` |
| `GET` | `/api/Products` | 🟢 Connected | `products.js` | `ProductsController.cs (GetAll)` |
| `POST` | `/api/Products` | 🟢 Connected | `products.js` | `ProductsController.cs (Create)` |
| `POST` | `/api/Products` | 🟢 Connected | `products.js` | `ProductsController.cs (Create)` |
| `GET` | `/api/Products/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `products.js` | `ProductsController.cs (GetById)` |
| `GET` | `/api/Products/{id}` | 🟢 Connected | `products.js` | `ProductsController.cs (GetById)` |
| `GET` | `/api/Products/{id}` | 🟢 Connected | `products.js` | `ProductsController.cs (GetById)` |
| `PUT` | `/api/Products/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `products.js` | `ProductsController.cs (Update)` |
| `PUT` | `/api/Products/{id}` | 🟢 Connected | `products.js` | `ProductsController.cs (Update)` |
| `PUT` | `/api/Products/{id}` | 🟢 Connected | `products.js` | `ProductsController.cs (Update)` |
| `DELETE` | `/api/Products/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `products.js` | `ProductsController.cs (Delete)` |
| `DELETE` | `/api/Products/{id}` | 🟢 Connected | `products.js` | `ProductsController.cs (Delete)` |
| `DELETE` | `/api/Products/{id}` | 🟢 Connected | `products.js` | `ProductsController.cs (Delete)` |
| `PUT` | `/api/Products/{id}/approve` | 🟢 Connected | `products.js` | `ProductsController.cs (Approve)` |
| `POST` | `/api/Profiles/business` | 🟢 Connected | `profile.js` | `ProfilesController.cs (CreateBusinessProfile)` |
| `GET` | `/api/Profiles/business/me` | 🟢 Connected | `profile.js` | `ProfilesController.cs (GetMyBusinessProfile)` |
| `POST` | `/api/Profiles/seller` | 🟢 Connected | `profile.js` | `ProfilesController.cs (CreateSellerProfile)` |
| `GET` | `/api/Profiles/seller/me` | 🟢 Connected | `profile.js` | `ProfilesController.cs (GetMySellerProfile)` |
