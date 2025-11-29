from rest_framework import serializers
from .models import Article, Category, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author_name', 'content', 'created_date']

class ArticleListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'author', 'category',
            'image', 'published_date', 'views', 'is_featured', 'comment_count'
        ]

    def get_comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()

class ArticleDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'content', 'author', 'category',
            'image', 'published_date', 'views', 'is_featured', 'comments'
        ]