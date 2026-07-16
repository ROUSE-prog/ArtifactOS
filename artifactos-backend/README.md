# ArtifactOS Backend Starter

## Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app run.py db init
flask --app run.py db migrate -m "initial schema"
flask --app run.py db upgrade
python seed.py
flask --app run.py run --debug
```

Demo login: `demo@artifactos.dev` / `password123`

Routes:
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/projects`
- `GET|PATCH|DELETE /api/projects/:id`
