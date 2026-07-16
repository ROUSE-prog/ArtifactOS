from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..extensions import db
from .artifact import artifact_tags
class Tag(db.Model):
    __tablename__="tags"
    id: Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str]=mapped_column(String(75), unique=True, index=True)
    artifacts: Mapped[list["Artifact"]]=relationship(secondary=artifact_tags, back_populates="tags")
    def to_dict(self): return {"id":self.id,"name":self.name}
