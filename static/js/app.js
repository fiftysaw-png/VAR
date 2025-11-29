class NewsApp {
  constructor() {
    this.apiBase = "/api";
    this.init();
  }

  init() {
    this.loadArticles();
  }

  async fetchData(url) {
    try {
      console.log("🔄 Запрос к API:", url);
      const response = await fetch(url);

      if (!response.ok) {
        console.error("❌ Ошибка API:", response.status, response.statusText);
        throw new Error(
          `API ошибка: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Данные получены:", data);
      return data;
    } catch (error) {
      console.error("❌ Ошибка загрузки:", error);
      this.showError(error.message);
      return null;
    }
  }

  async loadArticles() {
    this.showLoading();
    console.log("📰 Загружаем список статей...");
    const data = await this.fetchData(`${this.apiBase}/articles/`);
    if (data) {
      console.log(`📊 Найдено статей: ${(data.results || data).length}`);
      this.renderArticles(data.results || data);
    }
  }

  async loadArticleDetail(articleId) {
    this.showLoading();
    console.log(`📖 Загружаем статью ID: ${articleId}`);

    const data = await this.fetchData(`${this.apiBase}/articles/${articleId}/`);
    if (data) {
      console.log("✅ Статья загружена:", data.title);
      this.renderArticleDetail(data);
    }
  }

  renderArticles(articles) {
    const content = document.getElementById("content");

    if (!articles || articles.length === 0) {
      content.innerHTML = `
                <div class="error">
                    <h2>Новости не найдены</h2>
                    <p>Попробуйте создать статьи в админке</p>
                    <button onclick="app.loadArticles()">Обновить</button>
                </div>
            `;
      return;
    }

    let html =
      '<h2 style="text-align: center; margin-bottom: 2rem;">Последние новости</h2>';
    html += '<div class="articles-grid">';

    articles.forEach((article) => {
      const imageUrl = this.getImageUrl(article.image);

      html += `
                <div class="article-card" onclick="app.loadArticleDetail(${
                  article.id
                })" style="cursor: pointer;">
                    ${
                      imageUrl
                        ? `<img src="${imageUrl}" alt="${article.title}" class="article-image">`
                        : `<div class="article-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="fas fa-newspaper" style="font-size: 2rem;"></i>
                        </div>`
                    }
                    <div class="article-content">
                        <h3 class="article-title">${article.title}</h3>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <div class="article-meta">
                            <span>${new Date(
                              article.published_date
                            ).toLocaleDateString("ru-RU")}</span>
                            <span>👁️ ${article.views}</span>
                            ${
                              article.category
                                ? `<span class="article-category">${article.category.name}</span>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            `;
    });

    html += "</div>";
    content.innerHTML = html;
  }

  renderArticleDetail(article) {
    const content = document.getElementById("content");
    const imageUrl = this.getImageUrl(article.image);

    content.innerHTML = `
            <div class="article-detail">
                <button onclick="app.loadArticles()" style="margin-bottom: 2rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ← Назад к списку новостей
                </button>
                
                <article style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #333;">${
                      article.title
                    }</h1>
                    
                    <div style="margin: 1rem 0; padding: 1rem 0; border-bottom: 1px solid #eee; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <span><strong>Опубликовано:</strong> ${new Date(
                          article.published_date
                        ).toLocaleDateString("ru-RU")}</span>
                        <span><strong>Просмотры:</strong> ${
                          article.views
                        }</span>
                        ${
                          article.category
                            ? `<span class="article-category">${article.category.name}</span>`
                            : ""
                        }
                    </div>
                    
                    ${
                      imageUrl
                        ? `<img src="${imageUrl}" alt="${article.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; margin: 1rem 0;">`
                        : `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; margin: 1rem 0;">
                            <i class="fas fa-newspaper" style="font-size: 3rem;"></i>
                        </div>`
                    }
                    
                    <div style="line-height: 1.8; font-size: 1.1rem; margin-top: 2rem; color: #333;">
                        ${article.content
                          .split("\n")
                          .map((paragraph) =>
                            paragraph.trim()
                              ? `<p style="margin-bottom: 1.5rem;">${paragraph}</p>`
                              : ""
                          )
                          .join("")}
                    </div>
                </article>
            </div>
        `;
  }

  getImageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return imagePath;
    return `/media/${imagePath}`;
  }

  showLoading() {
    document.getElementById("content").innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Загрузка...</p>
            </div>
        `;
  }

  showError(message) {
    document.getElementById("content").innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка</h3>
                <p>${message}</p>
                <div style="margin-top: 1rem;">
                    <button onclick="app.loadArticles()" style="padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 0.5rem;">
                        К списку новостей
                    </button>
                    <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Обновить страницу
                    </button>
                </div>
            </div>
        `;
  }
}

// Инициализация приложения
const app = new NewsApp();
