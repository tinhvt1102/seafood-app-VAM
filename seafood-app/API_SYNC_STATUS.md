# 📊 Báo Cáo Đối Chiếu API (Tự Động)
*Cập nhật lúc: 12:00:46 15/8/2026*

Báo cáo này được tự động sinh ra bởi script để đối chiếu trạng thái phát triển API giữa **Frontend (React)** và **Backend (.NET)**.

---

## 📈 Tóm tắt trạng thái
- **🟢 Connected (Đã ráp & sử dụng):** 74 APIs
- **🟡 BE Only (BE đã viết, FE chưa ráp):** 18 APIs
- **🔴 FE Only (FE định nghĩa nhưng BE chưa có):** 11 APIs

---

## 🔍 Chi tiết trạng thái các API

| Method | Endpoint thực tế | Trạng thái | Nơi sử dụng ở FE | Controller BE (Action) |
| :--- | :--- | :--- | :--- | :--- |
| `GET/POST` | `/cart` | 🔴 FE Only (BE Missing) | `orders.js`, `products.js`, `users.js` | `N/A` |
| `POST` | `/cart/add` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/cart/clear` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `PUT` | `/cart/items/${itemId}` | 🔴 FE Only (BE Missing) | `products.js`, `reviews.js` | `N/A` |
| `DELETE` | `/cart/items/${itemId}` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/products/b2b` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/products/retail` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `GET/POST` | `/suppliers` | 🔴 FE Only (BE Missing) | `orders.js`, `products.js`, `reviews.js`, `users.js` | `N/A` |
| `GET/POST` | `/suppliers/${id}` | 🔴 FE Only (BE Missing) | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `N/A` |
| `GET/POST` | `/suppliers/farms` | 🔴 FE Only (BE Missing) | `products.js` | `N/A` |
| `GET/POST` | `/suppliers/farms/${id}` | 🔴 FE Only (BE Missing) | *Chưa ráp* | `N/A` |
| `POST` | `/api/Auth/refresh-token` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `AuthController.cs (RefreshToken)` |
| `GET` | `/api/Categorys/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `CategorysController.cs (GetById)` |
| `DELETE` | `/api/Categorys/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `CategorysController.cs (Delete)` |
| `GET` | `/api/OrderItems` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (GetAll)` |
| `POST` | `/api/OrderItems` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (Create)` |
| `PUT` | `/api/OrderItems` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (Update)` |
| `GET` | `/api/OrderItems/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (GetById)` |
| `DELETE` | `/api/OrderItems/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `OrderItemsController.cs (Delete)` |
| `POST` | `/api/Payments/payout/{orderId}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (TriggerPayout)` |
| `POST` | `/api/Payments/webhook` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PaymentsController.cs (Webhook)` |
| `GET` | `/api/Payouts` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PayoutsController.cs (GetAll)` |
| `POST` | `/api/Payouts/{id}/confirm` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `PayoutsController.cs (ConfirmManual)` |
| `GET` | `/api/Products/my-products` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `ProductsController.cs (GetMyProducts)` |
| `GET` | `/api/Products/seller/{sellerId}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `ProductsController.cs (GetBySeller)` |
| `GET` | `/api/Users/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (GetById)` |
| `DELETE` | `/api/Users/{id}` | 🟡 BE Only (FE Missing) | *Chưa ráp* | `UsersController.cs (Delete)` |
| `GET` | `/api/Payments/{id}` | 🟡 BE Only (FE Unused) | *Chưa ráp* | `PaymentsController.cs (GetById)` |
| `DELETE` | `/api/Payments/{id}` | 🟡 BE Only (FE Unused) | *Chưa ráp* | `PaymentsController.cs (Delete)` |
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
| `GET` | `/api/Categorys` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `CategorysController.cs (GetAll)` |
| `POST` | `/api/Categorys` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `CategorysController.cs (Create)` |
| `PUT` | `/api/Categorys` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `CategorysController.cs (Update)` |
| `GET` | `/api/Farms` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `FarmsController.cs (GetAll)` |
| `POST` | `/api/Farms` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `FarmsController.cs (Create)` |
| `PUT` | `/api/Farms` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `FarmsController.cs (Update)` |
| `GET` | `/api/Farms/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `FarmsController.cs (GetById)` |
| `DELETE` | `/api/Farms/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `FarmsController.cs (Delete)` |
| `GET` | `/api/Orders` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `OrdersController.cs (GetAll)` |
| `GET` | `/api/Orders` | 🟢 Connected | `products.js`, `reviews.js` | `OrdersController.cs (GetAll)` |
| `POST` | `/api/Orders` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `OrdersController.cs (Create)` |
| `POST` | `/api/Orders` | 🟢 Connected | `products.js`, `reviews.js` | `OrdersController.cs (Create)` |
| `GET` | `/api/Orders/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `OrdersController.cs (GetById)` |
| `DELETE` | `/api/Orders/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `OrdersController.cs (Delete)` |
| `PATCH` | `/api/Orders/{id}/status` | 🟢 Connected | `orders.js`, `products.js` | `OrdersController.cs (UpdateStatus)` |
| `PUT` | `/api/Orders/{id}/status` | 🟢 Connected | `orders.js`, `products.js` | `OrdersController.cs (UpdateStatus)` |
| `GET` | `/api/Orders/my-orders` | 🟢 Connected | `orders.js`, `products.js` | `OrdersController.cs (GetMyOrders)` |
| `GET` | `/api/Orders/seller-orders` | 🟢 Connected | `orders.js`, `products.js` | `OrdersController.cs (GetSellerOrders)` |
| `GET` | `/api/Payments` | 🟢 Connected | `products.js`, `reviews.js` | `PaymentsController.cs (GetAll)` |
| `POST` | `/api/Payments` | 🟢 Connected | `products.js`, `reviews.js` | `PaymentsController.cs (Create)` |
| `PUT` | `/api/Payments` | 🟢 Connected | `products.js`, `reviews.js` | `PaymentsController.cs (Update)` |
| `POST` | `/api/Payments/checkout/{orderId}` | 🟢 Connected | `products.js` | `PaymentsController.cs (Checkout)` |
| `GET` | `/api/Products` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `ProductsController.cs (GetAll)` |
| `GET` | `/api/Products` | 🟢 Connected | `products.js`, `reviews.js` | `ProductsController.cs (GetAll)` |
| `POST` | `/api/Products` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `ProductsController.cs (Create)` |
| `POST` | `/api/Products` | 🟢 Connected | `products.js`, `reviews.js` | `ProductsController.cs (Create)` |
| `GET` | `/api/Products/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `ProductsController.cs (GetById)` |
| `GET` | `/api/Products/{id}` | 🟢 Connected | `products.js`, `reviews.js` | `ProductsController.cs (GetById)` |
| `GET` | `/api/Products/{id}` | 🟢 Connected | `orders.js`, `products.js` | `ProductsController.cs (GetById)` |
| `PUT` | `/api/Products/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `ProductsController.cs (Update)` |
| `PUT` | `/api/Products/{id}` | 🟢 Connected | `products.js`, `reviews.js` | `ProductsController.cs (Update)` |
| `PUT` | `/api/Products/{id}` | 🟢 Connected | `orders.js`, `products.js` | `ProductsController.cs (Update)` |
| `DELETE` | `/api/Products/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `ProductsController.cs (Delete)` |
| `DELETE` | `/api/Products/{id}` | 🟢 Connected | `products.js`, `reviews.js` | `ProductsController.cs (Delete)` |
| `DELETE` | `/api/Products/{id}` | 🟢 Connected | `orders.js`, `products.js` | `ProductsController.cs (Delete)` |
| `PUT` | `/api/Products/{id}/approve` | 🟢 Connected | `products.js` | `ProductsController.cs (Approve)` |
| `POST` | `/api/Profiles/business` | 🟢 Connected | `profile.js` | `ProfilesController.cs (CreateBusinessProfile)` |
| `GET` | `/api/Profiles/business/me` | 🟢 Connected | `profile.js` | `ProfilesController.cs (GetMyBusinessProfile)` |
| `POST` | `/api/Profiles/seller` | 🟢 Connected | `profile.js` | `ProfilesController.cs (CreateSellerProfile)` |
| `GET` | `/api/Profiles/seller/me` | 🟢 Connected | `profile.js` | `ProfilesController.cs (GetMySellerProfile)` |
| `GET` | `/api/Profiles/sellers` | 🟢 Connected | `auth.js` | `ProfilesController.cs (GetApprovedSellers)` |
| `GET` | `/api/Profiles/sellers/{id}` | 🟢 Connected | `auth.js` | `ProfilesController.cs (GetSellerDetail)` |
| `GET` | `/api/Reviews` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `ReviewsController.cs (GetFiltered)` |
| `GET` | `/api/Reviews` | 🟢 Connected | `products.js`, `reviews.js` | `ReviewsController.cs (GetFiltered)` |
| `POST` | `/api/Reviews` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `ReviewsController.cs (Create)` |
| `POST` | `/api/Reviews` | 🟢 Connected | `products.js`, `reviews.js` | `ReviewsController.cs (Create)` |
| `GET` | `/api/Reviews/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `ReviewsController.cs (GetById)` |
| `GET` | `/api/Reviews/{id}` | 🟢 Connected | `products.js`, `reviews.js` | `ReviewsController.cs (GetById)` |
| `GET` | `/api/Reviews/{id}` | 🟢 Connected | `orders.js`, `products.js` | `ReviewsController.cs (GetById)` |
| `PUT` | `/api/Reviews/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `ReviewsController.cs (Update)` |
| `PUT` | `/api/Reviews/{id}` | 🟢 Connected | `products.js`, `reviews.js` | `ReviewsController.cs (Update)` |
| `PUT` | `/api/Reviews/{id}` | 🟢 Connected | `orders.js`, `products.js` | `ReviewsController.cs (Update)` |
| `DELETE` | `/api/Reviews/{id}` | 🟢 Connected | `ProductApprovalPage.jsx`, `orders.js`, `products.js` | `ReviewsController.cs (Delete)` |
| `DELETE` | `/api/Reviews/{id}` | 🟢 Connected | `products.js`, `reviews.js` | `ReviewsController.cs (Delete)` |
| `DELETE` | `/api/Reviews/{id}` | 🟢 Connected | `orders.js`, `products.js` | `ReviewsController.cs (Delete)` |
| `POST` | `/api/Reviews/{id}/reply` | 🟢 Connected | `reviews.js` | `ReviewsController.cs (SellerReply)` |
| `GET` | `/api/Reviews/can-review` | 🟢 Connected | `reviews.js` | `ReviewsController.cs (CanUserReview)` |
| `GET` | `/api/Reviews/product/{productId}/summary` | 🟢 Connected | `reviews.js` | `ReviewsController.cs (GetProductRatingSummary)` |
| `GET` | `/api/Reviews/seller/{sellerId}/summary` | 🟢 Connected | `reviews.js` | `ReviewsController.cs (GetSellerRatingSummary)` |
| `GET` | `/api/Users` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `UsersController.cs (GetAll)` |
| `POST` | `/api/Users` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `UsersController.cs (Create)` |
| `PUT` | `/api/Users` | 🟢 Connected | `orders.js`, `products.js`, `reviews.js`, `users.js` | `UsersController.cs (Update)` |
| `PUT` | `/api/Users/customer-status/{userId}` | 🟢 Connected | `users.js` | `UsersController.cs (UpdateCustomerStatus)` |
