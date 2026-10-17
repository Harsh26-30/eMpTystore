# Frontend map (blue theme)

How the screens, files and your backend routes connect. Generated from the code.

## 1. Screens (routes in `src/App.jsx`)

| URL | Screen file | Needs login | Backend routes it calls (also via child components) |
|---|---|---|---|
| `/` | `src/component/auth.jsx` | no | `POST /login`<br>`POST /signup` |
| `/Auth` | `src/component/auth.jsx` | no | `POST /login`<br>`POST /signup` |
| `/sharebydetail` | `src/component/auth.jsx` | no | `POST /login`<br>`POST /signup` |
| `/home` | `src/component/homepage.jsx` | yes | `GET /allshops`<br>`GET /checkuserinfo`<br>`GET /get-user-products`<br>`POST /OrderReached`<br>`POST /Orders`<br>`POST /Outfordelivary`<br>`POST /Updatelatlog`<br>`POST /addui`<br>`POST /confirmOrders`<br>`POST /dponServiceorNotToggle`<br>`POST /handlerejectorder`<br>`POST /readyforDelivary`<br>`POST /removeCartItem`<br>`POST /resendOTP`<br>`POST /toggleShopOpenOrNot`<br>`POST /uidata`<br>`POST /uidatas`<br>`POST /update-stock`<br>`POST /updatePhoneNo`<br>`POST /updateproducttoui`<br>`POST /verifyOTP` |
| `/searchbox` | `src/component/searchbox.jsx` | yes | `GET /checkuserinfo`<br>`POST /buildconnection`<br>`POST /dponServiceorNotToggle`<br>`POST /search`<br>`POST /toggleShopOpenOrNot` |
| `/uploadproduct` | `src/component/uploadproduct.jsx` | yes | `POST /add-product` |
| `/productview` | `src/component/productview.jsx` | yes | `GET /checkuserinfo`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot` |
| `/buynow` | `src/component/buynow.jsx` | yes | `GET /checkuserinfo`<br>`POST /dponServiceorNotToggle`<br>`POST /placeOrder`<br>`POST /toggleShopOpenOrNot`<br>`POST /updateaddress`<br>`POST /updatecontact` |
| `/Menu` | `src/component/Menu.jsx` | yes | `GET /checkuserinfo`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot` |
| `/Order` | `src/component/Order.jsx` | yes | `GET /checkuserinfo`<br>`POST /Orders`<br>`POST /Outfordelivary`<br>`POST /confirmOrders`<br>`POST /handlerejectorder`<br>`POST /readyforDelivary` |
| `/OrderStatus` | `src/component/OrderStatus.jsx` | yes | - |
| `/addAddress` | `src/component/addAddress.jsx` | yes | `POST /updateaddress` |
| `/Key` | `src/component/Key.jsx` | yes | `GET /checkrequeststatus`<br>`GET /checkuserinfo`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot` |
| `/Request` | `src/component/Request.jsx` | yes | `GET /checkuserinfo`<br>`GET /roleUpgradeRequest`<br>`POST /dponServiceorNotToggle`<br>`POST /rejectuserroleupgraderequest`<br>`POST /toggleShopOpenOrNot`<br>`POST /updateuserrole` |
| `/Uploadcomponent` | `src/component/uploadcomponent.jsx` | yes | `POST /uploadui` |
| `/Shopnox/:id` | `src/component/Shopnox.jsx` | yes | `GET /checkuserinfo`<br>`POST /addItemToCart`<br>`POST /uidata` |
| `/ForgotPassword` | `src/component/forgotPassword.jsx` | no | `POST /updatepassword` |
| `/UserProfile` | `src/component/UserProfile.jsx` | yes | `GET /checkuserinfo`<br>`GET /myprofile`<br>`GET /shoporsellerprofile`<br>`POST /buildconnection`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot`<br>`PUT /updateprofileAboutus`<br>`PUT /updateprofilePicture` |
| `/profile/:id` | `src/component/UserProfile.jsx` | yes | `GET /checkuserinfo`<br>`GET /myprofile`<br>`GET /shoporsellerprofile`<br>`POST /buildconnection`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot`<br>`PUT /updateprofileAboutus`<br>`PUT /updateprofilePicture` |
| `/myOrderStatus` | `src/component/MyOrderStatus.jsx` | yes | `GET /checkuserinfo`<br>`POST /dponServiceorNotToggle`<br>`POST /myOrderStatus`<br>`POST /toggleShopOpenOrNot` |
| `/Cart` | `src/component/Cart.jsx` | yes | `GET /checkuserinfo`<br>`POST /create-order`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot`<br>`POST /updateCartItemQuanity`<br>`POST /verify-payment` |
| `/AboutUs` | `src/component/aboutUs.jsx` | yes | `GET /checkuserinfo`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot` |
| `/requestform` | `src/component/requestform.jsx` | yes | `GET /checkuserinfo`<br>`POST /dponServiceorNotToggle`<br>`POST /requestupdateuserrole`<br>`POST /toggleShopOpenOrNot` |
| `/Wallet` | `src/component/wallet.jsx` | yes | `GET /checkuserinfo`<br>`GET /walletTotalAmount`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot`<br>`POST /withdrawWallet` |
| `/MakePayment` | `src/component/MakePayment.jsx` | yes | `GET /checkuserinfo`<br>`GET /userWallet`<br>`GET /withdrawalrequest`<br>`POST /dponServiceorNotToggle`<br>`POST /rejectpayment`<br>`POST /toggleShopOpenOrNot`<br>`POST /updateuserwallet` |
| `/shareAndEarn` | `src/component/shareAndEarn.jsx` | yes | `GET /checkuserinfo`<br>`GET /walletTotalAmount`<br>`POST /dponServiceorNotToggle`<br>`POST /toggleShopOpenOrNot`<br>`POST /updateupiid`<br>`POST /withdrawWallet` |

## 2. Who sees what (set by `role` from `/checkuserinfo`)

- **Customer:** home (shops near you), search, cart, orders, share and earn, profile, menu, about.
- **Seller:** home with three tabs (Orders, Products, Shop style), wallet, menu, role request.
- **Delivery_partner:** home (delivery dashboard with map), wallet, menu.
- **Admin:** home, menu with Role requests, Upload layout and Make payments.

## 3. Folder map

```
frontend/
  index.html            page shell, Razorpay script, fonts
  vite.config.js        Vite settings
  .env                  YOUR keys (not in git). See .env.example
  public/               images, PDFs and videos used by screens
  src/
    main.jsx            starts the app, loads index.css and ds.css, theme.css
    App.jsx             all routes; also shows the bottom tab bar
    index.css           colours, fonts, radius tokens (the theme lives here)
    ds.css              shared buttons, cards, inputs, tabs, alerts
    theme.css           blue theme on top of the tokens; welcome, home, store rows
    component/          one JSX and CSS pair per screen or part
```

## 4. Component groups

| Group | Files |
|---|---|
| Sign in | `auth`, `AuthLayout`, `AuthField`, `logincard`, `signupcard`, `forgotPassword`, `addAddress`, `EmailVerification`, `updatePhoneNo` |
| Customer | `homepage`, `NearByShop`, `searchbox`, `searchresult`, `Shopnox`, `productview`, `buynow`, `Cart`, `MyOrderStatus`, `OrderQr`, `UserProfile`, `shareAndEarn`, `generatelinkbtnbox`, `aboutUs`, `Menu`, `BottomNav` |
| Seller | `Order`, `OrderStatus`, `Product`, `UI`, `uploadproduct`, `updateproductuiid`, `rendercomponent`, `QrScanner`, `rejectpOrderform`, `connections` |
| Delivery | `DeliveryPartnerdashboard`, `deliveryorderdetail` |
| Wallet and admin | `wallet`, `wallettotalamount`, `walletwithdrawbtn`, `upiIdForm`, `MakePayment`, `Request`, `requestform`, `Key` |
| Shared | `header2`, `footer`, `modal`, `Loaderpage`, `Routeloder`, `ProtectedRoute` |
