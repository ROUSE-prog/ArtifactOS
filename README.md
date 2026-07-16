# ArtifactOS

ArtifactOS is a full-stack engineering knowledge platform for organizing the work behind software systems.

It gives developers one place to preserve architecture diagrams, database schemas, technical notes, code references, documentation, and project decisions that would otherwise become scattered across repositories, drives, and chat threads.

## Features

- Account registration and login
- JWT-based authentication
- Protected frontend routes
- User-owned projects and artifacts
- Create, read, update, and delete projects
- Create, read, update, and delete artifacts
- Project-specific artifact workspaces
- Artifact detail pages
- Search across artifact titles, descriptions, types, filenames, content, and tags
- Server-side pagination for projects and artifacts
- Ownership checks for protected resources
- Responsive glassmorphism interface

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Vite
- CSS

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- SQLAlchemy
- Flask-Migrate / Alembic

### Database

- SQLite for local development

## Project Structure

```text
ArtifactOS/
├── artifactos-backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── __init__.py
│   │   └── extensions.py
│   ├── migrations/
│   ├── requirements.txt
│   └── run.py
│
├── artifactos-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Main Workflows

1. Create an account or log in.
2. Create a project.
3. Open the project workspace.
4. Add diagrams, Markdown notes, documents, images, or code artifacts.
5. Search and organize project knowledge.
6. Edit or delete outdated projects and artifacts.
7. Open individual artifact detail pages for focused viewing.

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ArtifactOS
```

### 2. Start the backend

```bash
cd artifactos-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside `artifactos-backend`:

```env
FLASK_APP=run.py
FLASK_DEBUG=1
SECRET_KEY=replace-with-a-secure-secret
JWT_SECRET_KEY=replace-with-a-secure-jwt-secret
DATABASE_URL=sqlite:///artifactos.db
```

Run database migrations:

```bash
flask db upgrade
```

Start the Flask server:

```bash
python -m flask --app run.py run --debug
```

The API runs at:

```text
http://127.0.0.1:5000
```

### 3. Start the frontend

Open a second terminal:

```bash
cd artifactos-frontend
npm install
npm run dev
```

Vite will display the local frontend URL, usually:

```text
http://localhost:5173
```

## API Routes

### Authentication

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a user account |
| POST | `/api/auth/login` | Log in and receive an access token |

### Projects

| Method | Route | Description |
|---|---|---|
| GET | `/api/projects?page=1&per_page=6` | List the current user's projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get one project and its artifacts |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Artifacts

| Method | Route | Description |
|---|---|---|
| GET | `/api/artifacts?page=1&per_page=6` | List the current user's artifacts |
| POST | `/api/artifacts` | Create an artifact |
| GET | `/api/artifacts/:id` | Get one artifact |
| PATCH | `/api/artifacts/:id` | Update an artifact |
| DELETE | `/api/artifacts/:id` | Delete an artifact |

Protected requests require an authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Example Pagination Response

```json
{
  "artifacts": [],
  "pagination": {
    "page": 1,
    "pages": 3,
    "per_page": 6,
    "total": 15,
    "has_next": true,
    "has_prev": false
  }
}
```

## Data Relationships

- A user can own many projects.
- A project belongs to one user.
- A project can contain many artifacts.
- An artifact belongs to one project.
- Artifacts can be associated with multiple tags.

Deleting a project also deletes its related artifacts.

## Testing Checklist

Before submitting or deploying, verify:

- Registration
- Login and logout
- Protected-route redirects
- Project creation, editing, viewing, and deletion
- Artifact creation, editing, viewing, and deletion
- Project detail loading
- Artifact detail loading
- Dashboard pagination
- Project pagination
- Artifact search
- Empty states
- Error states
- Ownership protection
- Mobile layout

## Screenshots

Add screenshots here after the final UI is complete.

Suggested screenshots:

- Login page
- Dashboard
- Projects page
- Project detail page
- Artifact detail page

Example:

```md
![ArtifactOS dashboard](docs/images/dashboard.png)
```

## Future Improvements

- File uploads and cloud storage
- Tag management interface
- Server-side full-dataset search
- Markdown rendering
- Team workspaces
- Artifact version history
- Automated testing
- Continuous integration
- Production deployment

## Author

**Steven Rouse**

- GitHub: [ROUSE-prog](https://github.com/ROUSE-prog)
- LinkedIn: [Steven Rouse](https://www.linkedin.com/in/stevenrouse)

## License

This project is available for educational and portfolio use.