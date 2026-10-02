# Client Project Tracker

**Tech Stack:**

- React (Vite)
- Laravel
- MySQL (XAMPP)

## Features

- Create, view, edit, and delete projects
- Dashboard with totals and upcoming deadlines
- Search, filter by status and priority, and sort by column
- Validation with clear error messages

## Requirements

- XAMPP (PHP 8.2+ and MySQL)
- Composer 2.x
- Node.js 20.19+ (includes npm)

Check your versions:

```bash
php -v
composer -V
node -v
```

> If `php` is not recognized on Windows, add `C:\xampp\php` to your PATH and reopen the terminal.

## Setup

### 1. Start MySQL

Open the XAMPP Control Panel and click **Start** next to **MySQL**.

### 2. Backend (Laravel)

```bash
cd server
composer install
cp .env.example .env        # Windows cmd: copy .env.example .env
php artisan key:generate
```

In `server/.env`, set:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_tracker
DB_USERNAME=root
DB_PASSWORD=
SESSION_DRIVER=file
```

Then run:

```bash
php artisan migrate
php artisan db:seed     # this is optional if you want to add a data instantly
php artisan serve
```

The API runs at http://localhost:8000.

### 3. Frontend (React)

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## API Endpoints

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | `/projects`     | Get all projects |
| GET    | `/projects/:id` | Get one project  |
| POST   | `/projects`     | Create a project |
| PUT    | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

**Validation rules**

- `client_name` and `project_name`: required
- `status`: `Planning`, `In Progress`, `On Hold`, or `Completed`
- `priority`: `Low`, `Medium`, or `High`
- `start_date` and `due_date`: required, and `due_date` cannot be earlier than `start_date`

Invalid requests return HTTP `422` with a JSON `errors` object.

## Technical Decisions

- Validation runs in both React and Laravel.
- Routes are in `web.php` with CSRF disabled for `/projects`, because the app has no login or session. See `server/bootstrap/app.php`.
- Search, filter, and sort run in the browser, which is fine for a small dataset. For large data, move them to query parameters on `GET /projects`.

## Troubleshooting

**"Could not load projects"**
Start `php artisan serve` and MySQL in XAMPP.

**`Connection refused` or `Unknown database`**
Start MySQL and create the `project_tracker` database.

**`Access denied for user 'root'`**
Check `DB_USERNAME` and `DB_PASSWORD` in `server/.env`.

**CORS error**
Make sure the frontend runs at `http://localhost:5173`, then run `php artisan config:clear`.

**`composer install` fails on missing extensions**
In `C:\xampp\php\php.ini`, remove the `;` before `extension=gd`, `extension=zip`, `openssl`, `pdo_mysql`, and `fileinfo`.

**Reset the data**
Run `php artisan migrate:fresh --seed`.
