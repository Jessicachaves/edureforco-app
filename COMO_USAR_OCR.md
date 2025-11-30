# 📸 Como Usar OCR (Foto → Texto)

## 🎯 O que é OCR?

**OCR** (Optical Character Recognition) = **Reconhecimento Óptico de Caracteres**

Permite **tirar foto de um exercício** (livro, caderno, prova) e automaticamente **extrair o texto** usando IA!

---

## 🚀 Como Funciona?

1. **Tire uma foto** de um exercício
2. **A IA processa** a imagem e extrai o texto
3. **Sugestão automática** dos campos (matéria, dificuldade, resposta)
4. **Você revisa** e ajusta se necessário
5. **Publica** o exercício

---

## 📥 Instalação do Tesseract (Windows)

### Opção 1: Download Direto
1. Baixe o instalador: https://github.com/UB-Mannheim/tesseract/wiki
2. Execute o instalador
3. **Importante**: Instale em `C:\Program Files\Tesseract-OCR\`
4. Marque "Add to PATH" durante instalação

### Opção 2: Via Chocolatey
```bash
choco install tesseract
```

### Verificar Instalação
```bash
tesseract --version
```

---

## 🧪 Testando OCR

### 1. Acesse a página "Criar Exercício"
```
http://localhost:3000/create-exercise
```

### 2. Escolha modo "📸 Foto"

### 3. Tire/envie foto de um exercício

### 4. Aguarde processamento (5-10 segundos)

### 5. Revise e ajuste os campos extraídos

### 6. Clique em "✨ Criar Exercício"

---

## 💡 Dicas para Melhores Resultados

✅ **Foto bem iluminada**
✅ **Texto legível e nítido**
✅ **Sem sombras ou reflexos**
✅ **Enquadre apenas o exercício**
✅ **Evite fotos tremidas**

❌ **Evite:**
- Fotos escuras
- Texto muito pequeno
- Ângulos muito inclinados
- Letras cursivas/manuscritas complexas

---

## 🤖 Como Funciona Internamente?

1. **Upload da foto** → Base64
2. **Tesseract OCR** → Extrai texto bruto
3. **Groq AI (Llama 3.3)** → Analisa e estrutura:
   - Identifica a pergunta
   - Reconhece opções A, B, C, D
   - Sugere matéria e dificuldade
   - Tenta identificar resposta correta
4. **Preenche formulário** automaticamente
5. **Você revisa** antes de salvar

---

## 🔧 Troubleshooting

### Erro: "Tesseract não encontrado"
**Solução**: Instale Tesseract conforme instruções acima

### Texto extraído incorreto
**Solução**: Tire foto melhor (mais luz, foco, ângulo)

### Groq API Error
**Solução**: Verifique `.env` → `GROQ_API_KEY=sua_chave`

---

## 📊 Exemplo de Uso

**Foto Original:**
```
1. Quanto é 2 + 2?
a) 3
b) 4
c) 5
d) 6
```

**Resultado OCR:**
- Título: "Adição simples"
- Pergunta: "Quanto é 2 + 2?"
- Matéria: Matemática
- Opção A: 3
- Opção B: 4
- Opção C: 5
- Opção D: 6
- Resposta: b

---

## 🎉 Benefícios

✅ **Economiza tempo** - Não precisa digitar tudo
✅ **Aumenta conteúdo** - Mais exercícios no banco
✅ **Gamificação** - XP extra por contribuir
✅ **Comunidade** - Ajuda outros alunos

---

## 🔐 Privacidade

- Fotos NÃO são salvas permanentemente
- Apenas texto extraído é armazenado
- Exercícios passam por moderação antes de ficarem públicos

---

## 📞 Suporte

Problemas com OCR? Entre em contato!



