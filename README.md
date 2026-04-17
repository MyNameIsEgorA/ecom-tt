# Инструкции по запуску

## Через docker
Необходимо освободить или переназначить порты 3000 (json-server) и 5173 (само приложение)
```
docker compose up --build
```

## Dev-mode
```
bun install
bun run dev
```
вместо bun можно использовать npm, yarn или pnpm

## Самостоятельно собрать build
```
bun install
bun run build
bun run preview
```

# Стек технологий: 
1. React - для реактивного интерфейса
2. Mobx - state manager, чтобы отказаться от props drilling и не придумывать свое решение (через сохранение состояния в контекстах*)
3. json-server - для мока backend'а

*контекст все равно используется для аналога DI
