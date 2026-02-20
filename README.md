# 🎲 Sistema de Sorteio de Operadores PDV

Um sistema moderno e responsivo para gerenciamento e sorteio de operadores em pontos de venda (PDV), desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## 📋 Sobre o Projeto

Sistema inteligente de sorteio de operadores para supermercados e redes de varejo, com suporte para dois modos de operação:

- **Modo Dia Útil**: Sorteios separados para turno de abertura e fechamento
- **Modo Feriado**: Sorteio geral único para todos os horários

Desenvolvido com foco em usabilidade, performance e experiência do usuário.

---

## ✨ Funcionalidades Principais

### 🎯 Core Features
- ✅ **Modo Dia Útil**: Gerencia 4 campos (Ops Abertura, Ops Fechamento, PDVs Abertura, PDVs Fechamento)
- ✅ **Modo Feriado**: Gerencia 2 campos (Operadores Geral, PDVs Geral)
- ✅ **Sorteio Inteligente**: Embaralhamento Fisher-Yates com validação de repetição
- ✅ **Ordenação Automática**: PDVs ordenados numericamente antes do sorteio
- ✅ **Persistência de Dados**: localStorage com expiração automática (1 hora)

### 🎨 Interface & UX
- ✅ **Design Responsivo**: Otimizado para desktop, tablet e mobile
- ✅ **Chips Dinâmicos**: Interface moderna com chips remináveis
- ✅ **Animações Fluidas**: Transições suaves e feedback visual
- ✅ **Loading Modal**: Animação de carregamento com contador 5 segundos
- ✅ **Seletor de Modo**: Radio buttons para alternar entre Dia Útil/Feriado

### 📱 Recursos Avançados
- ✅ **Impressão Otimizada**: Resultado em página única
- ✅ **Botão de Contato Flutuante**: Links diretos para WhatsApp e LinkedIn
- ✅ **Feedback Contextual**: Mensagens de sucesso, aviso e erro
- ✅ **Ícones Oficiais**: Font Awesome para WhatsApp e LinkedIn
- ✅ **Footer com Créditos**: Identificação do autor

---

## 🚀 Como Usar

### 1️⃣ Acesso Básico
Abra o arquivo `index.html` em qualquer navegador moderno.

### 2️⃣ Modo Dia Útil (Padrão)
```
1. Adicione operadores de abertura
2. Adicione operadores de fechamento
3. Adicione PDVs de abertura
4. Adicione PDVs de fechamento
5. Clique em "Sortear"
6. Imprima o resultado
```

### 3️⃣ Modo Feriado
```
1. Selecione "🎉 Feriado"
2. Adicione operadores (geral)
3. Adicione PDVs (geral)
4. Clique em "Sortear"
5. Imprima o resultado
```

### ➕ Adicionando Itens
- Digite o nome/número no campo
- Pressione **Enter** OU clique no botão **➕**
- O item aparecerá como um chip abaixo
- Clique no **✕** do chip para remover

### 🗑️ Limpando Dados
Clique em **🗑️ Limpar Dados** para remover tudo e recomeçar.

---

## 🛠️ Stack Tecnológico

| Tecnologia | Descrição |
|-----------|-----------|
| **HTML5** | Estrutura semântica e responsiva |
| **CSS3** | Estilos avançados, gradientes, animações |
| **JavaScript (Vanilla)** | Lógica sem dependências externas |
| **Font Awesome 6.4** | Ícones profissionais |
| **localStorage API** | Persistência de dados local |

---

## 📊 Estrutura do Projeto

```
sistemaSorteio/
├── index.html          # Estrutura HTML principal
├── style.css           # Estilos CSS (780+ linhas)
├── script.js           # Lógica JavaScript (490+ linhas)
├── README.md           # Este arquivo
└── old/                # Versões anteriores
```



## 💾 Persistência de Dados

### localStorage
- **Chave**: `sorteio_dados`
- **Expiração**: 1 hora (3.600.000 ms)
- **Dados Armazenados**: Arrays de operadores e PDVs


## 📐 Responsividade

### Breakpoints
| Dispositivo | Largura | Ajustes |
|-----------|---------|---------|
| Desktop | 1100px | Layout grid 2 colunas |
| Tablet | 768px | Layout adaptado, fontes reduzidas |
| Mobile | 480px | Layout stack, botões full-width |

---

## 🎨 Paleta de Cores

| Elemento | Cor | Código |
|----------|-----|--------|
| Primária | Gradiente Roxo | `#667eea → #764ba2` |
| Secundária | Azul | `#2563eb` |
| Sucesso | Verde | `#16a34a` |
| Erro | Vermelho | `#dc2626` |
| Aviso | Amarelo | `#fcd34d` |
| WhatsApp | Verde | `#25d366` |
| LinkedIn | Azul | `#0a66c2` |

---

## 🔧 Funcionalidades Técnicas

### Validação de Dados
```javascript
// Verifica se todos os campos estão preenchidos
// Verifica se quantidade de operadores = quantidade de PDVs
// Previne duplicatas
// Evita repetições de sorteios anteriores (até 200 tentativas)
```


### Animações
- Fade-in em componentes
- Slide-in em chips
- Bounce em ícones de loading
- Transições suaves em hover

---


### Imagens Demonstrativos

### Tela Inicial

![Tela](/imagens/telainicial.png)

### Tela Inicial preenchida com dados
 "O botao LIMPAR DADOS fica disponivel quando o usuario inicial o preenchimento dos formularios pois o sistema esta configurado para armazenar em localStorage qualquer informação escritas nos inputs."

![Tela](/imagens/uso01.png)


### Tela Sorteando

![Tela](/imagens/sorteando.png)

### Tela Resultado
"O botao de IMPRIMIR ficara disponivel somente quando houver resultados de sorteio."

![Tela](/imagens/resultado.png)


## 📱 Contato

### Links Profissionais
- **WhatsApp**: [Iniciar Conversa](https://wa.me/5565993408371)
- **LinkedIn**: [Ver Perfil](https://www.linkedin.com/in/josue-ocanha-costa/)

---

## 📄 Licença

Projeto desenvolvido por **JOSUE OCANHA COSTA** - 2026
Todos os direitos reservados.

---

## 🎯 Casos de Uso

### Supermercados
- Sorteio de operadores para diferentes turnos
- Distribuição justa entre pontos de venda
- Histórico de sorteios (através do localStorage)

### Redes de Varejo
- Gestão de múltiplos PDVs
- Sorteios diferenciais por tipo de dia
- Impressão de resultados para comunicação interna

### Lanchonetes e Pizzarias
- Distribuição de pontos para entrega
- Sorteio de operadores por turno
- Relatórios impressos para controle

---

## 📈 Versão

**v1.0.0** - Fevereiro 2026


## 🤝 Contribuições

Este é um projeto solo. Para sugestões ou melhorias, entre em contato através dos links profissionais acima.



## 📞 Suporte

Para dúvidas ou reportar bugs:
1. Envie uma mensagem no **WhatsApp**
2. Conecte-se pelo **LinkedIn**

## Author
### Josué Ocanha Costa
#### FrontEnd Developer
#### Redes Sociais

- Linkedin - [JosueOcanhaCosta](https://www.linkedin.com/in/josue-ocanha-costa/)
- Github - [JosueCosta2023](https://github.com/JosueCosta2023)
- Twitter - [@JosueOcanhaCosta](https://twitter.com/josue_ocanha)
- Facebook - [JosueCosta](https://www.facebook.com/JosueOcanhaCosta2023)
- Whatsapp - [Josue2023](https://wa.me/5565996408371?text=Ol%C3%A1%2C+encontrei+seu+whatsapp+no+Github.+Gostaria+de+falar+sobre+seus+projetos.)

# "Vida longa e próspera. 🖖🖖🖖"
Feito com o ❤️ por Josué Ocanha Costa
## [Acesse o Deploy](https://josuecosta2023.github.io/sistemaSorteio/)
### [Acesse o repositório](https://github.com/JosueCosta2023/sistemaSorteio)
