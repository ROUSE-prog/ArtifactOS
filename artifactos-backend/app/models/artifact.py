from datetime import datetime, timezone
from sqlalchemy import Column, ForeignKey, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..extensions import db


artifact_tags = Table(
    "artifact_tags",
    db.metadata,
    Column("artifact_id", ForeignKey("artifacts.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)


class Artifact(db.Model):
    __tablename__ = "artifacts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    artifact_type: Mapped[str] = mapped_column(String(50), index=True)
    filename: Mapped[str | None] = mapped_column(String(255))
    file_url: Mapped[str | None] = mapped_column(String(500))
    text_content: Mapped[str | None] = mapped_column(Text)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    project: Mapped["Project"] = relationship(
        back_populates="artifacts"
    )
    tags: Mapped[list["Tag"]] = relationship(
        secondary=artifact_tags,
        back_populates="artifacts",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "artifact_type": self.artifact_type,
            "filename": self.filename,
            "file_url": self.file_url,
            "text_content": self.text_content,
            "project_id": self.project_id,
            "tags": [tag.to_dict() for tag in self.tags],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }