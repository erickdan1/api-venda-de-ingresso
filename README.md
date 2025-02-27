# 🎟️ Sistema de Venda de Ingressos

## Requerimentos
- Node.js 20+
- Docker

## Sobre o Sistema
Este sistema é uma API REST desenvolvida para facilitar a criação, o gerenciamento e a venda de ingressos para eventos por meio de parceiros comerciais. Ele foi projetado para ser escalável e suportar um alto volume de acessos simultâneos.

A arquitetura segue o padrão **MVC (Model-View-Controller)**, garantindo organização e separação de responsabilidades. Além disso, utiliza os seguintes **Design Patterns** para melhorar a estrutura e a reutilização do código:

- **Application Service:** Separa a lógica de negócios da camada de controle, garantindo um código mais modular e testável.
- **Active Record:** Facilita o gerenciamento das entidades do banco de dados diretamente nos modelos.
- **Singleton:** Garante que a conexão com o banco de dados seja única e reutilizável em toda a aplicação.

## Funcionalidades

### 📍 Gestão de Eventos e Ingressos
- Apenas o parceiro criador do evento pode gerenciar os ingressos associados.
- Ingressos são criados em lote e começam com o status **"disponível"**.
- Os parceiros podem visualizar as vendas de tickets associadas aos seus eventos.

### 🎟️ Venda de Ingressos
- Clientes podem comprar múltiplos ingressos de diferentes eventos em uma única compra.
- Apenas um cliente pode adquirir um ticket específico por vez (controle de concorrência).
- Se a compra falhar, os dados serão registrados com o motivo da falha.

### 👥 Gerenciamento de Parceiros e Clientes
- Parceiros podem criar eventos e gerenciar seus ingressos.
- Clientes podem visualizar eventos disponíveis e efetuar compras de ingressos.

## Estrutura do Banco de Dados
O sistema possui quatro entidades principais:

### 🏢 Parceiros
Criadores dos eventos e responsáveis pela gestão dos ingressos.

**Campos:**
- `id` (numérico) - Identificador único.
- `nome` (string) - Nome completo do parceiro.
- `email` (string) - E-mail para login e contato.
- `senha` (string) - Senha criptografada.
- `nome_da_empresa` (string) - Nome da empresa associada.

### 👤 Clientes
Usuários que compram os ingressos.

**Campos:**
- `id` (numérico) - Identificador único.
- `nome` (string) - Nome completo do cliente.
- `email` (string) - E-mail para login e contato.
- `senha` (string) - Senha criptografada.
- `endereco` (string) - Endereço do cliente.
- `telefone` (string) - Telefone para contato.

### 🎭 Eventos
Representam os eventos criados pelos parceiros.

**Campos:**
- `id` (numérico) - Identificador único.
- `nome` (string) - Nome do evento.
- `descricao` (string) - Breve descrição do evento.
- `data` (datetime) - Data e hora do evento.
- `local` (string) - Local onde será realizado.
- `parceiro_id` (numérico) - ID do parceiro que criou o evento (chave estrangeira).

### 🎫 Tickets
Representam os ingressos disponíveis para cada evento.

**Campos:**
- `id` (numérico) - Identificador único.
- `evento_id` (numérico) - ID do evento associado (chave estrangeira).
- `local` (string) - Identificador do assento (e.g., A1, B2).
- `preco` (decimal) - Preço do ticket.
- `status` (string) - Disponível, vendido.

📌 **Diagrama disponível em** `./docs/eer_diagram_venda_de_ingressos_v2.png`

## Escalabilidade
O sistema foi projetado para suportar **altas cargas de acesso simultâneo**, garantindo eficiência na venda de ingressos mesmo em cenários de grande demanda.

## Configuração e Execução
1. Clone este repositório:
   ```bash
   git clone https://github.com/erickdan1/api-venda-ingressos.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o Docker:
   ```bash
   docker-compose up
   ```
4. Execute o app:
    ```bash
    npx nodemon
    ```
