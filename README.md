Este sistema é uma **API REST** desenvolvida para facilitar a criação, o gerenciamento e a venda de ingressos para eventos por meio de parceiros comerciais. Ele foi projetado para ser escalável e suportar um alto volume de acessos simultâneos.

A arquitetura segue o padrão **MVC (Model-View-Controller)**, garantindo organização e separação de responsabilidades. Além disso, utiliza os seguintes **Design Patterns** para melhorar a estrutura e a reutilização do código:

*   **Application Service**: Separa a lógica de negócios da camada de controle, garantindo um código mais modular e testável.
*   **Active Record**: Facilita o gerenciamento das entidades do banco de dados diretamente nos modelos.
*   **Singleton**: Garante que a conexão com o banco de dados seja única e reutilizável em toda a aplicação.

Funcionalidades
------------------

1.  **Gestão de Eventos e Ingressos**
2.  **Venda de Ingressos**
3.  **Cancelamento e Reembolso**
4.  **Gerenciamento de Parceiros e Clientes**

Estrutura do Banco de Dados
-------------------------------

O sistema possui quatro entidades principais:

*   **Parceiros**: Criadores dos eventos e responsáveis pela gestão dos ingressos.
*   **Clientes**: Usuários que compram os ingressos.
*   **Eventos**: Representam os eventos disponíveis no sistema.
*   **Tickets**: Os ingressos vendidos para cada evento.

O modelo **EER (Entidade-Relacionamento Estendido)** detalha a estrutura do banco de dados e suas relações.

📌 _Diagrama disponível em_ `./docs/eer_diagram_venda_de_ingressos.png`

