%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Base de conhecimento
:- dynamic edificio/1.
:- dynamic piso/3.
:- dynamic passage/4.
:- dynamic elevator/3.
:- dynamic ligacel/2.
:- dynamic m/3.
:- dynamic edge/3.
:- dynamic melhor_sol_dfs/2.
:- dynamic posicaoelevador/2.
:- dynamic posicaopassagem/2.
:- dynamic posicaoinicial/2.
:- dynamic rooms/4.
%:- dynamic tarefa/3.
:- dynamic tarefaCusto/3.

%Servidor

% Bibliotecas 
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(date)).
:- use_module(library(random)).
:- use_module(library(http/http_client)).

:- ensure_loaded('algoritmos.pl').
:- ensure_loaded('algoritmoPlaneamento.pl').

% Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/json)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_client)).


% Gerir servidor
startServer(Port) :-
    http_server(http_dispatch, [port(Port)]),
    asserta(port(Port)).

stopServer:-
    retract(port(Port)),
    http_stop_server(Port,_).

%-------------------------------------------------------------------------------------------------------------

% Funções do Servidor

% Buscar os buildings
:- http_handler('/buildingsList',get_all_buildings,[]).
get_all_buildings():-
    setup_call_cleanup(
        http_open('http://localhost:3000/api/building/buildingsList', In, []),
        json_read_dict(In, JSONObject),
        close(In)
    ),
    carregar_edificios(JSONObject).

carregar_edificios([]).
carregar_edificios([H|T]):- 
    Id = H.code,
    (\+ edificio(Id) -> assertz(edificio(Id)); true),
    carregar_edificios(T).

% Buscar os floors
:- http_handler('/floorList',get_all_floors,[]).
get_all_floors():-
    setup_call_cleanup(
        http_open('http://localhost:3000/api/floor/getFloors', In, []),
        json_read_dict(In, JSONObject),
        close(In)
    ),
    carregar_pisos(JSONObject).

carregar_pisos([]).
carregar_pisos([H|T]):-
    Id = H.name,
    FBC = H.buildingCode,
    Level = H.level,
    (\+ piso(FBC,Id,Level) -> assertz(piso(FBC,Id,Level)); true),
    carregar_pisos(T).

% Buscar as passages
:- http_handler('/passageList',get_all_passages,[]).
get_all_passages():-
    setup_call_cleanup(
        http_open('http://localhost:3000/api/passage/getAllPassages', In, []),
        json_read_dict(In, JSONObject),
        close(In)
    ),
    carregar_passagens(JSONObject). 

carregar_passagens([]).
carregar_passagens([Dict|T]):-
    get_dict('codeBuilding1', Dict, CBI),
    get_dict('codeBuilding2', Dict, CBF),
    get_dict('FloorBuilding1Name', Dict, FNI),
    get_dict('FloorBuilding2Name', Dict, FNF),
    (\+ passage(CBI,CBF,FNI,FNF) -> assertz(passage(CBI,CBF,FNI,FNF)); true),
    carregar_passagens(T).

% Buscar os elevadores
:- http_handler('/getElevators',get_all_elevators,[]).
get_all_elevators():-
    setup_call_cleanup(
        http_open('http://localhost:3000/api/elevator/getElevators', In, []),
        json_read_dict(In, JSONObject),
        close(In)
    ),
    carregar_elevadores(JSONObject).

carregar_elevadores([]).
carregar_elevadores([Dict|T]):-
    get_dict('BuildingCode', Dict, BC),
    get_dict('ElevatorCode', Dict, EC),
    get_dict('FloorsAttended', Dict, FA),
    (\+ elevator(BC,EC,FA) -> assertz(elevator(BC,EC,FA)); true),
    carregar_elevadores(T).

%-------------------------------------------------------------------------------------------------------------

% Organização
pisos(Edif, L):-
    findall(Piso, piso(Edif,Piso,_), L).

liga(Edif1, Edif2):-
    passage(Edif1,Edif2,_,_).

elevador(Edif, L):-
    elevator(Edif,_,Flo),
    buscar_pisos(Edif, Flo, L).

buscar_pisos(_, [], []).
buscar_pisos(Edif, [H|T], [Piso|L]):-
    number_string(H, Le),
    piso(Edif,Piso,Le),
    buscar_pisos(Edif, T, L).

corredor(EdAct,EdSeg,PisoAct,PisoSeg):-
    passage(EdAct,EdSeg,PisoAct,PisoSeg).

%-------------------------------------------------------------------------------------------------------------


create_rooms():-
    setup_call_cleanup(
        http_open('http://localhost:3000/api/floor/getFloors', In, []),
        json_read_dict(In, JSONObject),
        close(In)
    ),
    carregar_rooms(JSONObject).
    
carregar_rooms([]).
carregar_rooms([H|T]):-
    get_dict('name', H, Name),
    get_dict('plant', H, Plant),
    get_dict('maze', Plant, Maze),
    get_dict('rooms', Maze, Rooms),
    maplist(carregar_room(Name), Rooms),
    carregar_rooms(T).

carregar_room(Name, Room):-
    get_dict('nome', Room, Nome),
    get_dict('x', Room, X),
    get_dict('y', Room, Y),
    (\+ rooms(Name,Nome,X,Y) -> assertz(rooms(Name,Nome,X,Y)); true).







create_floor_matrix(Edif, Piso):-
    atom_concat('http://localhost:3000/api/floor/getPlant?buildingCode=', Edif, TempURL),
    atom_concat(TempURL, '&floorName=', TempURL2),
    atom_concat(TempURL2, Piso, URL),
    setup_call_cleanup(
        http_open(URL, In, []),
        json_read_dict(In, JSONObject),
        close(In)
    ),
    retractall(m(_,_,_)),
    retractall(ligacel(_,_)),
    retractall(edge(_,_,_)),
    retractall(posicaoelevador(_,_)),
    retractall(posicaopassagem(_,_)),
    carregar_matriz(JSONObject).

carregar_matriz([]).
carregar_matriz(Dict):-
    get_dict('plant', Dict, Plant),
    get_dict('maze', Plant, Maze),
    get_dict('map', Maze, Map),
    load_map(Map, 0),
    get_dict('size', Maze, Size),
    get_dict('depth', Size, X),
    get_dict('width', Size, Y),
    get_dict('elevators', Maze, Elevators),
    load_posicaoEle(Elevators),
    get_dict('exitLocation', Maze, Exit),
    maplist(load_passagelocation(), Exit),
    load_passagelocation(Exit),
    cria_grafo(X,Y),
    cria_grafo_astar(X,Y).



% load_passagelocation for an array of arrays
load_passagelocation([]).
load_passagelocation([H|T]):-
    is_list(H), !,
    load_passagelocation(H),
    load_passagelocation(T).
load_passagelocation([H|[T]]):-
    assertz(posicaopassagem(H,T)).


posicaoProxPassagem(PisoDest, PisoOr, Xn, Yn):-
    piso(EdDest, PisoDest,_),
    create_floor_matrix2(EdDest, PisoDest, PisoOr, Xn, Yn).


create_floor_matrix2(Edif, Piso, PisoOr, Xn, Yn):-
    atom_concat('http://localhost:3000/api/floor/getPlant?buildingCode=', Edif, TempURL),
    atom_concat(TempURL, '&floorName=', TempURL2),
    atom_concat(TempURL2, Piso, URL),
    setup_call_cleanup(
        http_open(URL, In, []),
        json_read_dict(In, JSONObject),
        close(In)
    ),
    retractall(m(_,_,_)),
    retractall(ligacel(_,_)),
    retractall(edge(_,_,_)),
    retractall(posicaoelevador(_,_)),
    retractall(posicaopassagem(_,_)),
    find_new_initial_position(PisoOr, NewExit, JSONObject, Xn, Yn).



find_new_initial_position([]).
find_new_initial_position(PisoOr, NewExit, Dict, Xn, Yn):-
    get_dict('plant', Dict, Plant),
    get_dict('maze', Plant, Maze),
    get_dict('exitLocation', Maze, Exit),
    get_dict('exitFloor', Maze, Flo),
    nth0(Index, Flo, PisoOr), % Find the index of PisoOr in Flo
    nth0(Index, Exit, NewExit), % Get the element at the same index in Exit
    NewExit = [Xn, Yn]. % Unify Xn and Yn with the elements of NewExit



load_posicaoEle([]).
load_posicaoEle([[H|[T|_]]|_]):-
    assertz(posicaoelevador(H,T)).

load_map([], _).
load_map([Row|Rows], Y):-
    load_row(Row, 0, Y),
    Y1 is Y + 1,
    load_map(Rows, Y1).

load_row([], _, _).
load_row([Cell|Cells], X, Y):-
    (Cell =:= 3 -> NewCell = 1; Cell =:= 2 -> NewCell = 1; NewCell = Cell),
     assertz(m(Y,X,NewCell)),
    X1 is X + 1,
    load_row(Cells, X1, Y),!.


% Criar grafo

cria_grafo(-1,_):-!.
cria_grafo(Lin,Col):-
    cria_grafo_lin(Lin,Col),Lin1 is Lin-1,
    cria_grafo(Lin1,Col).

cria_grafo_lin(_,-1):-!.
cria_grafo_lin(Lin,Col):-m(Lin,Col,0),!,
    LinS is Lin+1, LinA is Lin-1, ColS is Col+1,ColA is Col-1,
    ((m(Lin,ColS,0),assertz(ligacel(cel(Lin,Col),cel(Lin,ColS)));true)),
    ((m(Lin,ColA,0),assertz(ligacel(cel(Lin,Col),cel(Lin,ColA)));true)),
    ((m(LinS,Col,0),assertz(ligacel(cel(Lin,Col),cel(LinS,Col)));true)),
    ((m(LinA,Col,0),assertz(ligacel(cel(Lin,Col),cel(LinA,Col)));true)),
    Col1 is Col-1,
    cria_grafo_lin(Lin,Col1).
cria_grafo_lin(Lin,Col):-Col1 is Col-1,cria_grafo_lin(Lin,Col1).

% Cria grafo A*
cria_grafo_astar(-1,_):-!.
cria_grafo_astar(Lin,Col):-cria_grafo_lin_astar(Lin,Col),Lin1 is Lin-1,cria_grafo_astar(Lin1,Col).

cria_grafo_lin_astar(_,-1):-!.
cria_grafo_lin_astar(Lin,Col):-m(Lin,Col,0),!,
    LinS is Lin+1, LinA is Lin-1, ColS is Col+1,ColA is Col-1,
    ((m(Lin,ColS,0),assertz(edge(cel(Lin,Col),cel(Lin,ColS),1)));true),
    ((m(Lin,ColA,0),assertz(edge(cel(Lin,Col),cel(Lin,ColA),1)));true),
    ((m(LinS,Col,0),assertz(edge(cel(Lin,Col),cel(LinS,Col),1)));true),
    ((m(LinA,Col,0),assertz(edge(cel(Lin,Col),cel(LinA,Col),1)));true),
    %hipotenusas
    ((m(LinS,ColS,0),assertz(edge(cel(Lin,Col),cel(LinS,ColS),1.41)));true),
    ((m(LinA,ColA,0),assertz(edge(cel(Lin,Col),cel(LinA,ColA),1.41)));true),
    ((m(LinS,ColA,0),assertz(edge(cel(Lin,Col),cel(LinS,ColA),1.41)));true),
    ((m(LinA,ColS,0),assertz(edge(cel(Lin,Col),cel(LinA,ColS),1.41)));true),
    Col1 is Col-1,
    cria_grafo_lin_astar(Lin,Col1).
cria_grafo_lin_astar(Lin,Col):-Col1 is Col-1,cria_grafo_lin_astar(Lin,Col1).



% Initialize a matrix with 0s
init_matrix(0, _, _) :- !.
init_matrix(X, Y, Value) :-
    init_row(Y, X, Value),
    X1 is X - 1,
    init_matrix(X1, Y, Value).

init_row(0, _, _) :- !.
init_row(Y, X, Value) :-
    assertz(m(X, Y, Value)),
    Y1 is Y - 1,
    init_row(Y1, X, Value).



% uniao
:- http_handler('/uniao', handle_uniao,[]).
handle_uniao(Request):-
    http_parameters(Request,[
        param1(Param1, [optional(false)]),
        param2(Param2, [optional(false)])
    ]),
    atom_string(Param1, F1),
    atom_string(Param2, F2),
    uniao(F1,F2,Res),
    with_output_to(string(ResString), write(Res)),
    Path = json([res=ResString]),
    reply_json(Path).




:- http_handler('/', handle_root, []).

handle_root(_Request) :-
    format('Content-type: text/plain~n~n'),
    format('Hello, World!~n').

% iniciar o servidor

inicializar:- 
    get_all_buildings(),
    get_all_floors(),
    get_all_passages(),
    get_all_elevators(),
    create_rooms().


inicializar_server:-
    startServer(5000),!,
    inicializar,!.

:- inicializar_server.