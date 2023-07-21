# Коллекция марок

Открытая коллекция марок.

Чтобы добавить марку свяжитесь со мной [@vlasmn](https://t.me/vlasme) или создайте Issue в этом репозитории.

## Как это работает
Проект состоит из
- [Сайта](stamps.pages.dev)
- [Базы марок](https://docs.google.com/spreadsheets/d/11gihx9wG1Qo8Pu7ZBG0LuQkJXF3m_GUFZ23y2EuK7jw/edit#gid=0)

1. База марок через Google App Scripts собирается в JSON.
2. Картинка загружается в /src/images/название-страны/...
2. JSON добавляется в репозиторий Github.
3. Cloudflare, видя изменения в репозитории, деплоит проект.

## Благодарности
- Моей жене Лере, за оцифровку марок
- ChatGPT за написание кода
