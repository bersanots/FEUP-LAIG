/*find all the possible valid moves a Player can make,
combining placing and sliding pieces*/
valid_moves(Board, Player, ListOfMoves) :-	
  findall(Line+Column,											%find all empty cells
			(between(1,9,Line), between(1,9,Column),
			 check_cell(Board, 0, Line, Column)), 					
		  PlacePiece),
  findall(Line+Column-To,										%find cells with Player's pieces
			(between(1,9,Line), between(1,9,Column),
			 check_cell(Board, Player, Line, Column), 					
			 surrounding_cells(Board, Line, Column, Cells, 6),
			 findall(Elem,											%find all empty cells surrounding the Player's piece
			         (length(Cells,Length),
			          between(1,Length,Index),
			          nth1(Index,Cells,Elem),
			          Elem = A+B,
			          check_cell(Board, 0, A, B)),
			         To)),
		  SlidePiece),
  maplist(distribute_moves, SlidePiece, SlidePieceDistributed),
  concat(SlidePieceDistributed, SlidePieceConcat),
  append(PlacePiece, SlidePieceConcat, ListOfMoves).

  
/*create moves from the format Move-[List of Moves]*/
distribute_moves(_Move-[], []).
distribute_moves(Move-[H|T], Result) :-
  H=A+B,
  distribute_moves(Move-T, NewResult),
  append([Move-A+B], NewResult, Result).
  
  
/*find the move that will make the Player 
closer to winning or further from losing*/
best_move(Board, Level, Player, Move) :-
  valid_moves(Board, Player, ListOfMoves),
  findall(Value,								%calculate values for each possible new board
        (length(ListOfMoves,Length),
		 between(1,Length,Index),
		 nth1(Index, ListOfMoves, Elem),
		 move(Elem, Board, Player, NewBoard),	%simulate the boards resulting of each possible move
		 value(NewBoard, Level, Player, Value)),		
	    MovesValues),
  max_member(MaxVal, MovesValues),
  nth1(Index, MovesValues, MaxVal),
  nth1(Index, ListOfMoves, Move).
  
  
/*evaluate the board, depending on the the player's or
the opponent's piece that is the closest to being surrounded*/
 value(Board, Level, Player, Value) :-
  ((Player =:= 1, OtherPlayer is 2); OtherPlayer is 1),
   min_empty_surr_cells(Board, Player, NDef),
   min_empty_surr_cells(Board, OtherPlayer, NOff),
  ((NDef =:= 0, Value is 0);																%lost
  ((Level =:= 0; Level =:= 1; Level =:= 2), Value is 7 - NOff);			%move value is the offensive value (move value range 0->7)
  (Level =:= 3, ((NOff =:= 0, Value is 11); (Value is NDef - NOff + 6)))), !.	%move value is the difference between the defensive and offensive move value (move value range 0->11)