# Documentação das alterações realizadas no modelo dominio



### 10 de Outubro de 2023

1. **Pacote Edifício**: O pacote Edifício foi reestruturado para incluir mais classes e atributos, tais como Planta, Sala, Elevador, Corredor, grelha, dimensões, porta, localização, início e destino.

2. **Classe Estado**: A classe Estado foi alterada de uma classe regular para uma classe enum com dois valores: ativo e inativo.

3. **Classe Tarefa**: A classe Tarefa foi movida para um pacote separado e foi associada a uma nova classe TarefaTipo, que tem os atributos id, nome e descrição.

4. **Pacote Utilizador**: Foi adicionado um novo pacote Utilizador, que contém uma classe Utilizador com os atributos id, nome, email e password, e uma classe enum Role com quatro valores: AdministradorDeSistema, GestorDeFrota, GestorDeCampus e Utente.

5. **Relações entre as classes**: As relações entre as classes foram modificadas para refletir a nova estrutura e semântica do modelo de domínio. Por exemplo, Edifício agora possui Piso em vez de piano, Robô agora executa Tarefa em vez de requestTask, e Utilizador agora tem permissão para Robô em vez de estar associado a ele.

---

### 12 de Outubro de 2023

1. **Pacote Robo**: A classe Robo no pacote Robo foi alterada para incluir dois novos atributos: +frabricante e +numeroDeSerie.

2. **Pacote Tarefa**: No pacote Tarefa, foram adicionadas duas novas classes: Vigilância e Transporte. Estas classes também estão ligadas à classe Tarefa com a relação “é do tipo”.

3. **Pacote Utilizador**: No pacote Utilizador, foi adicionado um novo atributo +description à classe Utilizador. A relação entre Utilizador e Role foi alterada de “é do tipo” para “tem permissao”. Além disso, foi estabelecida uma nova relação “é criada por” entre Utilizador e Tarefa.

4. **Relações entre as classes**: As relações entre as classes foram alteradas.
    - **Relação entre Robo e Tipo**: A relação entre Robo e Tipo foi alterada de “é do tipo” para “pode ser para”.

    - **Relação entre Tipo, EspacoInterno e EspacoExterno**: As relações entre Tipo, EspacoInterno, e EspacoExterno foram alteradas de “é do tipo” para “pode ser para”.

    - **Relação entre Sala, Elevador, Corredor e Planta**: As relações entre Sala, Elevador, e Corredor com Planta foram alteradas de “localiza-se em” para “representados”.

    - **Relação entre Robo e Tarefa**: A relação entre Robo e Tarefa foi alterada de “executa” para “tem permissao”.

    - **Relação entre Utilizador e Role**: A relação entre Utilizador e Role foi alterada de “é do tipo” para “tem permissao”.

    - **Nova relação entre Utilizador e Tarefa**: Foi estabelecida uma nova relação “é criada por” entre Utilizador e Tarefa.

---
### 14 de Outubro de 2023
**Pacote Elevador**: A classe Elevador foi promovida a root para ficar de acordo com as especificações do projeto e foi alterada para refletir esta mudança.

---

### 25 de Outubro de 2023

1. **Pacotes Renomeados**: O pacote `Edificio` foi renomeado para `Building`, `Piso` para `Floor`, `Robo` para `Robot`, `Utilizador` para `User`.

2. **Novas Classes**: Foram adicionadas novas classes como `Room`, `Roomtype`, `RobotType`, `RobotStatus`, `VigilanceTask`, `PickupTask`, `Passage`, `Elevator` e `ElevatorType`.

3. **Classes Removidas**: Algumas classes foram removidas, como `Planta`, `Corredor`, `Tipo`, `Estado`, `AreaDeAtuacao`, `TarefaTipo`, `Vigilância` e `Transporte`.

4. **Alterações nas Classes**: As classes existentes foram modificadas com novos atributos. 
    - A classe `Building` agora tem atributos como `codigo`, `name` e `description`. 
    - A classe `Robot` agora tem atributos como `code`, `nickname`, `robotTypeCode`.

5. **Relações Alteradas**: As relações entre as classes também foram alteradas. 
    - A relação entre a classe `Building` e a classe `Floor` agora é representada por "possui".

6. **Novas Relações**: Foram adicionadas novas relações, como entre a classe `Robot` e as classes de tarefa (`PickupTask` e `VigilanceTask`), e entre a classe de tarefa e a classe de usuário (`User`).
