# Online Goru Kena Becha Backend

## Live Link:

https://goru-kena-becha.vercel.app/

## Application Routes:

> Auth

- api/v1/auth/signup (POST)

> User

- api/v1/users (GET)
- api/v1/users/6177a5b87d32123f08d2f5d4 (Single GET)
- api/v1/users/6177a5b87d32123f08d2f5d4 (PATCH)
- api/v1/users/6177a5b87d32123f08d2f5d4 (DELETE)

> Cows

- api/v1/cows (GET)
- api/v1/cows (POST)
- api/v1/cows/6177a5b87d32123f08d2f5d4 (Single GET)
- api/v1/cows/6177a5b87d32123f08d2f5d4 (PATCH)
- api/v1/cows/6177a5b87d32123f08d2f5d4 (DELETE)

> Pagination and Filtering routes of Cows

- api/v1/cows?pag=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?searchTerm=co
- api/v1/cows?location=comilla

> Orders

### Orders POST Request body:

{
"cow": "648ddd670c9ed4b30e69f485",
"buyer": "648dda19ace455c2e52f69fb"
}

- api/v1/orders (POST)
- api/v1/orders (GET)
