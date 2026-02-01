# 🔐 Relatório de Segurança - Gitleaks

**Data do Scan:** 28 de Janeiro de 2026
**Ferramenta:** Gitleaks v8.30.0
**Status:** ⚠️ **CRÍTICO - Credenciais Expostas**

---

## 📊 Resumo da Análise

- **Total de Commits Escaneados:** 89
- **Total de Exposições Encontradas:** 27
- **Bytes Analisados:** ~2.49 MB
- **Tempo de Scan:** 190ms

---

## 🚨 Principais Problemas Identificados

### 1. **Arquivo `.env` comitado com credenciais reais**
**Severidade:** 🔴 **CRÍTICA**

O arquivo `.env` com as credenciais do Firebase foi comitado em pelo menos 2 commits:

- **Commit:** `c4dd0b68449d1439e09ce3b60d9c901911c7ec91`
  - Autor: Kaique Furukawa
  - Data: 30/12/2025
  - Exposições: Firebase API Key completa

- **Commit:** `4e240aefc2b4758e7f3b10ef0f7c9def9b614484`
  - Autor: Kaique Furukawa
  - Data: 30/12/2025
  - Exposições: Todas as credenciais Firebase

**Credenciais Expostas:**
- ✗ `EXPO_PUBLIC_FIREBASE_API_KEY`
- ✗ `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✗ `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- ✗ `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✗ `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✗ `EXPO_PUBLIC_FIREBASE_APP_ID`
- ✗ `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

### 2. **Credenciais hardcoded em `src/config/firebase.ts`**
**Severidade:** 🔴 **CRÍTICA**

- **Commit:** `8d0d4667beeee317937e849c7a256cd7e903beae`
- Autor: Fernanda Campos
- Data: 09/12/2025
- Firebase API Key estava diretamente no código fonte

### 3. **Exemplos em arquivos de documentação**
**Severidade:** 🟡 **BAIXA** (Falso positivos)

Arquivos de documentação (`FIREBASE.md`, `FIREBASE_STORAGE_SETUP.md`) contêm exemplos genéricos que foram detectados, mas não são credenciais reais.

---

## ✅ Ações Recomendadas (URGENTE)

### **Prioridade 1: Revogar e Regenerar Credenciais**

1. **Revogar/Regenerar Firebase API Keys:**
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Vá para o projeto `[PROJECT_ID_REMOVIDO]`
   - Em **Configurações do Projeto > Chaves de API da Web**
   - Delete ou regenere a chave `[CREDENCIAL_REMOVIDA]`

2. **Criar novas credenciais:**
   - Gere novas credenciais no Firebase
   - Atualize o arquivo `.env` local (NÃO comitar)

### **Prioridade 2: Limpar Histórico Git (Opcional mas Recomendado)**

⚠️ **ATENÇÃO:** Isso reescreve o histórico e requer force push!

```bash
# Opção 1: Usar git filter-repo (recomendado)
# Instalar: brew install git-filter-repo
git filter-repo --invert-paths --path .env --force

# Opção 2: Usar BFG Repo-Cleaner
# Instalar: brew install bfg
bfg --delete-files .env

# Depois de limpar, force push
git push --force --all
```

**Alternativa Menos Invasiva:**
Se não puder reescrever o histórico, certifique-se de que:
- As credenciais antigas foram revogadas
- Novas credenciais foram criadas
- `.env` está no `.gitignore` (já está ✓)

### **Prioridade 3: Configurar Proteções**

#### A. **Atualizar `.gitignore`** (✓ Feito)
```gitignore
# Gitleaks
gitleaks-report.json
.gitleaks-report.json
```

#### B. **Configurar Git Hook para prevenir futuros commits** (✓ Feito)

✅ **Husky + Gitleaks implementado com sucesso!**

Configuração atual:
- Husky instalado como dependência de desenvolvimento
- Pre-commit hook configurado em `.husky/pre-commit`
- Gitleaks executa automaticamente antes de cada commit
- Commits com secrets são bloqueados automaticamente
- Desenvolvedor recebe feedback imediato com instruções

Para mais detalhes, veja: [HUSKY_SETUP.md](HUSKY_SETUP.md)

#### C. **GitHub Actions para CI/CD** (Recomendado)

Criar `.github/workflows/gitleaks.yml`:
```yaml
name: Gitleaks Security Scan

on: [push, pull_request]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 📋 Checklist de Segurança

- [x] Gitleaks instalado e configurado
- [x] Scan completo executado
- [x] Relatório gerado
- [x] `.gitignore` atualizado
- [x] **Husky instalado e configurado**
- [x] **Pre-commit hook implementado**
- [x] **Bloqueio automático de commits com secrets**
- [ ] **Credenciais Firebase revogadas/regeneradas**
- [ ] **Arquivo `.env` com novas credenciais (local apenas)**
- [ ] GitHub Actions configurado (opcional)
- [ ] Histórico Git limpo (executado)
- [ ] Equipe notificada sobre as mudanças

---

## 🔍 Como Executar Novos Scans

### Scan completo no histórico:
```bash
gitleaks detect --verbose --report-path gitleaks-report.json
```

### Scan apenas em arquivos staged (antes de commit):
```bash
gitleaks protect --staged --verbose
```

### Scan em um commit específico:
```bash
gitleaks detect --log-opts="<commit-hash>"
```

---

## 📚 Recursos Adicionais

- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 🎯 Próximos Passos

1. **IMEDIATAMENTE:**
   - [ ] Revogar credenciais expostas no Firebase Console
   - [ ] Gerar novas credenciais
   - [ ] Atualizar `.env` local (não comitar)
   - [ ] Reiniciar aplicação com novas credenciais

2. **Em Seguida:**
   - [ ] Considerar limpeza do histórico Git
   - [ ] Configurar git hooks
   - [ ] Implementar CI/CD security checks

3. **Longo Prazo:**
   - [ ] Revisar políticas de segurança da equipe
   - [ ] Treinar equipe sobre gestão de secrets
   - [ ] Implementar rotação regular de credenciais

---

**Nota:** Este relatório foi gerado automaticamente pelo Gitleaks. Para mais detalhes, consulte `gitleaks-report.json`.
