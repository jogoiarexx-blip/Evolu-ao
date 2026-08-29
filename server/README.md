# Web Push do EVOLUÇÃO

1. Instale Node.js 20+.
2. Entre nesta pasta e rode `npm install`.
3. Rode `npm run keys` uma vez e guarde as duas chaves.
4. Configure `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` e `VAPID_SUBJECT` no servidor.
5. Rode `npm start`.
6. Em produção publique a pasta inteira por HTTPS usando este servidor (Render/Railway/VPS etc.).

O PWA continua funcionando offline sem o servidor. Com o servidor configurado, o botão **Permitir notificações** registra Web Push e sincroniza somente o estado necessário aos lembretes. O servidor verifica a cada 5 minutos e respeita horário silencioso, intervalo, metas e progresso conhecido.

Observação: `push-data.json` é armazenamento simples para uma instalação pequena. Em produção multiusuário, troque por SQLite/Postgres.


## v1.2.1 — estabilidade do Push
- O cliente envia um token aleatório por aparelho para proteger sincronização/remoção da própria assinatura.
- Endpoints de escrita têm rate limit básico.
- `POST /api/push/unsubscribe` remove a assinatura do servidor quando o usuário desativa o Web Push.
- Progresso em água/passos reinicia o intervalo do lembrete em vez de gerar cobrança imediata.
- O scheduler avalia todas as pendências e escolhe a mais prioritária que já pode ser enviada.

Para produção com muitos usuários, use banco persistente (SQLite/Postgres), HTTPS e, idealmente, autenticação de conta.
