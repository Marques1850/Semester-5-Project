% encontrar caminhos entre pisso de eficios

caminho_edificios(EdOr,EdDest,LEdCam):-
    caminho_edificios2(EdOr,EdDest,[EdOr],LEdCam).
caminho_edificios2(EdX,EdX,LEdInv,LEdCam):-!,reverse(LEdInv,LEdCam).
caminho_edificios2(EdAct,EdDest,LEdPassou,LEdCam):-
    (liga(EdAct,EdInt);liga(EdInt,EdAct)), 
    \+member(EdInt,LEdPassou),
    caminho_edificios2(EdInt,EdDest,[EdInt|LEdPassou],LEdCam).


caminho_pisos(PisoOr,PisoDest,LEdCam,LLig):-
    piso(EdOr,PisoOr,_),pisos(EdOr,LPisosOr),member(PisoOr,LPisosOr),
    piso(EdDest,PisoDest,_),pisos(EdDest,LPisosDest),member(PisoDest,LPisosDest),
    caminho_edificios(EdOr,EdDest,LEdCam),
    segue_pisos(PisoOr,PisoDest,LEdCam,LLig).

segue_pisos(PisoDest,PisoDest,_,[]).
segue_pisos(PisoDest1,PisoDest,[EdDest],[elev(PisoDest1,PisoDest)]):-
    PisoDest\==PisoDest1,
    elevador(EdDest,LPisos), member(PisoDest1,LPisos), member(PisoDest,LPisos).
segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[cor(PisoAct,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct)),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).
segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[elev(PisoAct,PisoAct1),cor(PisoAct1,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct1,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct1)),
    PisoAct1\==PisoAct,
    elevador(EdAct,LPisos),member(PisoAct,LPisos),member(PisoAct1,LPisos),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).



% Deep First Search

dfsTeste(Orig,Dest,Cam):-
    get_time(Ti),
    (dfs2(Orig,Dest,[Orig],Cam);true),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

dfs(Orig,Dest,Cam):-
    dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
    reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-ligacel(Act,X),\+ member(X,LA),
    dfs2(X,Dest,[X|LA],Cam).

all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
    shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
    length(L,NL),
    ((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).



% Breadth first search

bfs(Orig,Dest,Cam):-
get_time(Ti),
(bfs2(Dest,[[Orig]],Cam);true),
get_time(Tf),
 T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.


bfs2(Dest,[[Dest|T]|_],Cam):-reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-LA=[Act|_],
findall([X|LA],
(Dest\==Act,ligacel(Act,X),\+ member(X,LA)),Novos),
append(Outros,Novos,Todos),
bfs2(Dest,Todos,Cam).



% A* search

aStar(Orig,Dest,Cam,Custo):-
    get_time(Ti),
    (aStar2(Dest,[(_,0,[Orig])],Cam,Custo);true),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

aStar2(Dest,[(_,Custo,[Dest|T])|_],Cam,Custo):-
	reverse([Dest|T],Cam).

aStar2(Dest,[(_,Ca,LA)|Outros],Cam,Custo):-
	LA=[Act|_],
	findall((CEX,CaX,[X|LA]),
		(Dest\==Act,(edge(Act,X,CustoX);edge(X,Act,CustoX)), \+ member(X,LA),
		CaX is CustoX + Ca, estimativa(X,Dest,EstX),
		CEX is CaX +EstX),Novos),
	append(Outros,Novos,Todos),
	sort(Todos,TodosOrd),
	aStar2(Dest,TodosOrd,Cam,Custo).

estimativa(cel(X1,Y1),cel(X2,Y2),Estimativa):-
	Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).



% melhor dfs
better_dfs1(Orig,Dest,LCaminho_minlig):-
    get_time(Ti),
    (better_dfs11(Orig,Dest);true),
    retract(melhor_sol_dfs(LCaminho_minlig,_)),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.
better_dfs11(Orig,Dest):-
    asserta(melhor_sol_dfs(_,10000)),
    dfs(Orig,Dest,LCaminho),
    atualiza_melhor_dfs(LCaminho),
    fail.
atualiza_melhor_dfs(LCaminho):-
    melhor_sol_dfs(_,N),
    length(LCaminho,C),
    C<N,retract(melhor_sol_dfs(_,_)),
    asserta(melhor_sol_dfs(LCaminho,C)).



% união
uniao(RoomOr,RoomDest,Lista):-
    rooms(PisoOr, RoomOr,Xp,Yp), rooms(PisoDest, RoomDest,Xd,Yd),
    caminho_pisos(PisoOr,PisoDest,_,LLig),
    piso(EdOr,PisoOr,_),
    piso(EdDest,PisoDest,_),
    create_floor_matrix(EdOr,PisoOr),
    (EdOr \= EdDest -> 
        (percorreLlig(LLig,ListaResult,cel(Xp,Yp),cel(Xfinal,Yfinal)),
        create_floor_matrix(EdDest,PisoDest),
        aStar(cel(Xfinal,Yfinal),cel(Xd,Yd),CaminhoFinal,_),
        append(ListaResult,CaminhoFinal,Lista))
    ; aStar(cel(Xp,Yp),cel(Xd,Yd),Cam2,_),
      append(Lista,Cam2,ListaResult), !,
      Lista = ListaResult).
    
% percorre lista de ligações
percorreLlig([],[],_, _).
percorreLlig([elev(PisoOr,PisoDest)|LLig], [(Cam1|elev(PisoOr,PisoDest))|L], cel(Xi,Yi), _):-
    piso(EdOr,PisoOr,_),
    create_floor_matrix(EdOr,PisoOr),
    posicaoelevador(Xe,Ye),
    aStar(cel(Xi,Yi),cel(Xe,Ye),Cam1,_),
    percorreLlig(LLig,L,cel(Xe,Ye), _).

percorreLlig([cor(PisoOr,PisoDest)|LLig], [(Cam1|cor(PisoOr,PisoDest))|L], cel(Xi,Yi), cel(Xn,Yn)):-
    piso(EdOr,PisoOr,_),
    create_floor_matrix(EdOr,PisoOr),
    posicaopassagem(Xp,Yp),
    aStar(cel(Xi,Yi),cel(Xp,Yp),Cam1,_),
    posicaoProxPassagem(PisoDest, PisoOr, Xn, Yn),
    percorreLlig(LLig,L,cel(Xn,Yn),_).



% Algoritmo permutacao

permutacao([],[]).
permutacao(L,[X|L1]):-apaga1(X,L,Li),permutacao(Li,L1).

apaga1(X,[X|L],L).
apaga1(X,[Y|L],[Y|L1]):-apaga1(X,L,L1).