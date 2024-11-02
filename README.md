### Как развернуть проект локально

1. Создать `.env`:
```shell
cp .env.example .env
```
2. Установить зависимости _(node версии 20+)_
```shell
npm install
```

#### Используемые внешние сервисы:
- **Supabase** в качестве БД - https://supabase.com/
- **ProxyAPI** в качестве прокси к OpenAI - https://proxyapi.ru/

#### Схема БД:
![](https://raw.githubusercontent.com/mcandylab/bot-petr/refs/heads/main/public/schema.png)
