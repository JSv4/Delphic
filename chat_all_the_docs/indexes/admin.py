from django.contrib import admin
from .models import Collection, Document, APIKey


class DocumentInline(admin.StackedInline):
    model = Document
    extra = 0
    fields = ('id', 'file', 'description', 'created', 'modified')
    readonly_fields = ('created', 'modified')


class CollectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'status', 'created', 'modified')
    list_filter = ('status',)
    search_fields = ('title', 'description')
    fields = ('api_key', 'title', 'description', 'status', 'created', 'modified', 'model')
    readonly_fields = ('created', 'modified')
    inlines = [DocumentInline]


admin.site.register(Collection, CollectionAdmin)


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('collection', 'description', 'created', 'modified')
    list_filter = ('created', 'modified')
    search_fields = ('description',)
    fields = ('collection', 'file', 'description', 'created', 'modified')
    readonly_fields = ('created', 'modified')


admin.site.register(Document, DocumentAdmin)
