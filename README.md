# Коллекция почтовых марок
Привет! Меня зовут [Женя](https://zhenya.wtf/), я дизайнер.

По наследству от отца мне осталась книга с марками. Всю мою жизнь эта книга путешестовала со мной, куда бы я не переехал. В 2022 гуляя по рынку в Армении, наткнулся на дедушку продающего старые марки. Купив у него несколько книжек, я загорелся желанием поделиться ими с друзьями. Отсюда появилась идея — создать коллекцию.

Для меня, марка — картина. Небольшой клочок бумаги, рассказывающий историю и скрывающий в себе множество деталей. Многие из них результат огромного труда и любви к своей культуре. Это то, что вдохновляет меня.

Буду рад, если эти марки вдохновят и вас.

## 🙌 Хотите пополнить коллекцию?
[Свяжитесь со мной](https://t.me/vlasme) или создайте Issue в этом репозитории.

## ⚙️ Как работает
Проект из 3 частей:
- [Сайт](stamps.pages.dev)
- [Репозиторий](https://github.com/vlasmn/stamps)
- [База в Гугл Таблицах](https://docs.google.com/spreadsheets/d/11gihx9wG1Qo8Pu7ZBG0LuQkJXF3m_GUFZ23y2EuK7jw/edit#gid=0)

Марки добавляются в ручном режиме:
1. Сканирую марку в высоком разрешении
2. Переименовываю по формату `country_year_title_id.png` и добавляю в `/src/images/[country]/...`
3. Название добавляю в Гугл Таблицу, там же прописываю мета-данные
4. Экспортирую всю базу в `gallery.json` с помощью Google App Scripts
5. `gallery.json` заменяется в `/src/_data/`
6. Проект собирается на [Eleventy](https://11ty.dev) с помощью `npx @11ty/eleventy`, а затем пушится в этот репозиторий
3. Cloudflare автоматически деплоит проект видя изменения в репозитории

## ❤️ Благодарности
- [Моей жене Лере](https://t.me/vaalerushka), за оцифровку первой сотни марок
- [Владу Гарбовскому](https://t.me/garbovsky), за фидбек по фильтрации
- [ChatGPT](https://chat.openai.com), за написание кода
