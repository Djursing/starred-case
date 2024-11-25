# starred-case
Techstack:
- Backend
  - Adonisjs (TS)
  - sqlite

- Frontend
  - React (TS)
  - TailwindCSS
  - ReactQuery

**Requirements for candidates**
- Candidates should be able to browse job opportunities which include job titles, descriptions and company names
- Candidates should be able to search by job title to narrow down the results
- Candidates should be able to "favourite" the jobs they found interesting. Favouriting a job should let users easily find it again
- (Nice to) Any other functionality that you think would help candidates find relevant opportunities

## Starting the project

### Clone project
```
git clone git@github.com:Djursing/starred-case.git
```

## Backend
```
cd backend
npm install
```

#### Run Migrations
```
node ace migration:fresh
```

#### Seed DB
```
node ace db:seed
```

#### Start Backend server
```
node ace serve
```
Backend can be accessed via `localhost:3333`

Available endpoints:
- GET `localhost:3333/jobs`
  - Query params support: (one at a time)
    - `?search={string}`
    - `?page={number}`
- GET `localhost:3333/jobs/{id}`
- PUT `localhost:3333/jobs/{id}/favourite`


## Frontned
Open another terminal, navigate to the frontend folder and run:
```
npm install
npm run start
```
Frontend can be accessed via `localhost:3000`
