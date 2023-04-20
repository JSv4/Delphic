from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class IndexesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "delphic.indexes"

    verbose_name = _("Indexes")

    def ready(self):
        try:
            import delphic.indexes.signals  # noqa: F401
        except ImportError:
            pass
