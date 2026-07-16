from datetime import datetime, timezone
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..extensions import bcrypt, db
class User(db.Model):
    __tablename__="users"
    id: Mapped[int]=mapped_column(primary_key=True)
    email: Mapped[str]=mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str]=mapped_column(String(255))
    created_at: Mapped[datetime]=mapped_column(default=lambda: datetime.now(timezone.utc))
    projects: Mapped[list["Project"]]=relationship(back_populates="owner", cascade="all, delete-orphan")
    def set_password(self,password): self.password_hash=bcrypt.generate_password_hash(password).decode()
    def check_password(self,password): return bcrypt.check_password_hash(self.password_hash,password)
    def to_dict(self): return {"id":self.id,"email":self.email,"created_at":self.created_at.isoformat()}
