# Online Goru Kena Becha Backend

## Live Link:

https://online-cow-buy-sell.vercel.app/

## Application Routes:

> Auth (User)

- /api/v1/auth/signup (POST)
- /api/v1/auth/login (POST)
- /api/v1/auth/refresh-token (POST)

> Auth (Admin)

- /api/v1/admins/create-admin (POST)
- /api/v1/admins/login (POST)
- /api/v1/admins/refresh-token (POST)

> User

- /api/v1/users (GET)
- /api/v1/users/649b2a2479bd77cd166783d1 (Single GET)
- /api/v1/users/649b2a2479bd77cd166783d1 (PATCH)
- /api/v1/users/649b2a2479bd77cd166783d1 (DELETE)
- /api/v1/users/my-profile (GET)
- /api/v1/users/my-profile (PATCH)

> Cows

- /api/v1/cows (POST)
- /api/v1/cows (GET)
- /api/v1/cows/649b26fe79bd77cd166783b3 (Single GET)
- /api/v1/cows/649b26fe79bd77cd166783b3 (PATCH)
- /api/v1/cows/649b26fe79bd77cd166783b3 (DELETE)

> Pagination and Filtering routes of Cows

- /api/v1/cows?pag=1&limit=10
- /api/v1/cows?sortBy=price&sortOrder=asc
- /api/v1/cows?minPrice=20000&maxPrice=70000
- /api/v1/cows?searchTerm=co
- /api/v1/cows?location=Chattogram

> Orders

- /api/v1/orders (POST)
- /api/v1/orders (GET)
- /api/v1/orders/649b2c6179bd77cd16678406 (GET Single)

### Request bodies:

Route: /api/v1/admins/create-admin (POST)  
Request body:

```json
{
 "password":"123456",
 "role": "admin",
  "name":{
     "firstName": "Mr. Admin"
     "lastName": "Bhai"
   },
 "phoneNumber":"01711111111",
 "address": "Uganda",
}
```

Route: /api/v1/admins/login (POST)
Request body:

```json
{
  "phoneNumber": "01711111111",
  "password": "123456"
}
```

Route: /api/v1/auth/login (POST)
Request body:

```json
{
  "phoneNumber": "01711111111",
  "password": "1234567"
}
```

Route: /api/v1/users/my-profile (PATCH)
Request body:

```json
{
 "password":"1234567",
  "name":{
     "firstName": "Mr. Update Password"
     "lastName": "Bhai"
   },
 "phoneNumber":"01711111111",
 "address": "Namibia",
}
```

Route: /api/v1/orders (PATCH)
Request body:

```json
{
  "cow": "649b225a8cef012312dd4558",
  "buyer": "649b20bd8cef012312dd452c"
}
```
