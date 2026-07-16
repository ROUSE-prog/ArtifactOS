from app import create_app
from app.extensions import db
from app.models import Artifact, Project, Tag, User
app=create_app()
with app.app_context():
    db.drop_all(); db.create_all()
    user=User(email="demo@artifactos.dev"); user.set_password("password123"); db.session.add(user); db.session.flush()
    tags={n:Tag(name=n) for n in ["architecture","authentication","database","flask","react","sql"]}; db.session.add_all(tags.values())
    p1=Project(title="ArtifactOS",description="Engineering artifact knowledge platform.",user_id=user.id)
    p2=Project(title="VisionFore",description="Computer vision workspace.",user_id=user.id)
    db.session.add_all([p1,p2]); db.session.flush()
    db.session.add_all([
      Artifact(title="System Architecture",description="React, Flask, PostgreSQL flow.",artifact_type="diagram",file_url="/demo/system-architecture.png",project_id=p1.id,tags=[tags["architecture"],tags["flask"],tags["react"]]),
      Artifact(title="Database Schema",description="Initial relational schema.",artifact_type="diagram",file_url="/demo/database-schema.png",project_id=p1.id,tags=[tags["database"],tags["sql"]]),
      Artifact(title="JWT Authentication Notes",description="Registration and protected routes.",artifact_type="markdown",text_content="Use access tokens for user-owned resources.",project_id=p1.id,tags=[tags["authentication"],tags["flask"]])
    ])
    db.session.commit(); print("Seeded. Demo: demo@artifactos.dev / password123")
