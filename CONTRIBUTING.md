# Como contribuir

## Fluxo

1. Crie uma branch a partir de `main`: `feat/descricao-curta`, `fix/...` ou `docs/...`.
2. Faça as alterações e rode `npm test`.
3. Teste o site localmente com `npm start` (tela larga e celular).
4. Abra um Pull Request preenchendo o checklist do template.

## Padrão de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

| Tipo | Uso |
|---|---|
| `feat` | Nova seção ou funcionalidade |
| `fix` | Correção |
| `docs` | Documentação |
| `refactor` | Reorganização sem mudar comportamento |
| `test` | Testes |
| `ci` | Workflows do GitHub Actions |
| `chore` | Manutenção geral |

Exemplo: `fix(resultado): corrige rótulo do critério CAU no Quadrado Mágico`

## Regras do projeto

- **Dados**: alterações de notas ou critérios só em `site/assets/js/dados.js`, e os testes devem continuar conferindo com o IntelliC.
- **Privacidade**: não publique fotos reais, e-mails, senhas ou logins.
- **Software IntelliC**: não inclua arquivos do sistema (é de autoria do Prof. Fábio).
- Siga o `.editorconfig` (UTF-8, LF, 2 espaços; 4 em Python).
