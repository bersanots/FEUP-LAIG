start_game(PlayerType1, PlayerType2, Res) :-
  initTab(InitialTab),
  InitialTab = Tab-Player,
  display_game(Tab),
  translate(Player, P),
  write('\nPLAYER '), write(P) , write(' TURN\n'),
  ((PlayerType1 == 'H'-0, Res = InitialTab/PlayerType1/PlayerType2);
   game_cycle(InitialTab, PlayerType1, PlayerType2, _, 0, Res)).
	
	
/*repeat the game loop until there is a winner or a draw*/	
game_cycle(CurrentTab, ActivePlayerType, NextPlayerType, Move, DrawCount, Res) :-
  (CurrentTab = Tab-Player,
   ActivePlayerType = PlayerType-Level,
   %((PlayerType == 'H',
    %((is_slide_possible(Tab, Player), choose_option(Option));true),			%don't let the player slide a piece if he doesn't have pieces on the board
    %choose_cells(Tab, Option, Move, Player));
    ((PlayerType == 'C',
     (choose_move(Tab, Level, Move, Player);true),
	   write('\nPress ENTER to continue...'), get_char(_), skip_line);true),
   move(Move, Tab, Player, NewTab),
   ((Move = _X+_Y-_A+_B, NextCount is DrawCount + 1); NextCount is 0),			%check if a piece was slided or placed
   display_game(NewTab)), !,
   ((game_over(NewTab-Player, Level, Winner, NextCount),
    ((Winner =:= 0, write('Pieces were slided for six turns in a row. The game ended in a DRAW.\n'));
     (write('End of the game. The winner is PLAYER '), translate(Winner, W), write(W), nl)), 
     Res = NewTab-NextPlayer/NextPlayerType/ActivePlayerType/NextCount/Winner);  
    (((Player=:=1, NextPlayer is 2); NextPlayer is 1),
     translate(NextPlayer, P),
     write('\nPLAYER '), write(P) , write(' TURN\n'),
     ((PlayerType == 'H', Res = NewTab-NextPlayer/NextPlayerType/ActivePlayerType/NextCount);
      game_cycle(NewTab-NextPlayer, NextPlayerType, ActivePlayerType, Move, NextCount, Res)))).

	 
/*user choice to place or slide a piece*/
choose_option(Option) :-
  write('\nChoose an option:\n 1: Place a new piece\n 2: Slide an existing piece\nOption: '),
  retrieve_option(Option,1,2);	%Option==1 or Option==2
  (write('Choose a valid option!\n\n'), choose_option(Option)).
  
  
/*place new player piece*/
choose_cells(Board, 1, Move, Player) :- 
  write('\nType the coordinates of an empty cell:\n'),
  write('Line [A-I]: '),
  retrieve_line(NewLine),
  (write('Column [1-9]: '),
   retrieve_column(NewColumn),
   (check_cell(Board, 0, NewLine, NewColumn),						%check if cell is empty
   (Move = NewLine+NewColumn; Move = _X+_Y);					%check if move is already defined, if not, define it
    (write('This cell is either invalid or not empty!\n'), choose_cells(Board, 1, Move, Player)));
   (write('Choose a valid column!\n\n'), choose_cells(Board, 1, Move, Player)));					
  (write('Choose a valid line!\n'), choose_cells(Board, 1, Move, Player)).
  
  
/*slide existing player piece*/
choose_cells(Board, 2, Move, Player) :- 
  write('\nType the coordinates of the piece to slide:\n'),
  write('Line [A-I]: '),
  retrieve_line(Line),
  (write('Column [1-9]: '),
   retrieve_column(Column),
   (check_cell(Board, Player, Line, Column), 	 				%check if the piece on this cell belongs to the player
    (write('\nType the coordinates to where the piece should slide:\n'),
	 write('Line [A-I]: '),
     retrieve_line(NewLine),
     (write('Column [1-9]: '),
	  retrieve_column(NewColumn),
      ((check_cell(Board, 0, NewLine, NewColumn), !,					%check if cell is empty
       neighbour_cell(Board, Move, Line, Column, NewLine, NewColumn, Player)),
       (Move = Line+Column-NewLine+NewColumn; Move = _X+_Y-_A+_B);					%check if move is already defined, if not, define it
	   (write('This cell is either invalid or not empty!\n'), choose_cells(Board, 2, Move, Player)));
	  (write('Choose a valid column!\n'), choose_cells(Board, 2, Move, Player)));
	 (write('Choose a valid line!\n'), choose_cells(Board, 2, Move, Player)));
    (write('This cell is either invalid or does not contain a piece from this Player!\n'), choose_cells(Board, 2, Move, Player)));
   (write('Choose a valid column!\n'), choose_cells(Board, 2, Move, Player)));			
  (write('Choose a valid line!\n'), choose_cells(Board, 2, Move, Player)).
  
  
/*choose random computer's move*/
choose_move(Board, 1, Move, Player) :-
  valid_moves(Board, Player, ListOfMoves),
  random_member(Move, ListOfMoves).
  
/*choose best offensive computer's move*/
choose_move(Board, 2, Move, Player) :-
  best_move(Board, 2, Player, Move).

/*choose best possible computer's move*/
choose_move(Board, 3, Move, Player) :-
  best_move(Board, 3, Player, Move).
  
  
/*insert the move in the current board and return the resulting board*/
move(Move, Board, Player, NewBoard) :-
  (Move = X+Y-A+B,										%slide piece from X,Y to A,B
  insert_value(Board, AuxBoard, 0, X, Y),				%empty the original cell
  insert_value(AuxBoard, NewBoard, Player, A, B));		
  (Move = A+B,											%place new piece on cell A,B
  insert_value(Board, NewBoard, Player, A, B)).			
 
 
/*check if the player's move made him win, lose, or the match ended in a draw*/ 
game_over(Board, Level, Winner, DrawCount) :-
  Board = Tab-Player,
  ((Player =:= 1, OtherPlayer is 2); OtherPlayer is 1),
  ((DrawCount =:= 6, Winner is 0);				%players slided pieces 6 times in a row
   (value(Tab, Level, Player, Value), !,
   ((Value =:= 0, Winner is OtherPlayer);		%has a surrounded piece
    ((Level =:= 0; Level =:= 1; Level =:= 2), (Value =:= 7, Winner is Player));
	(Level =:= 3, (Value =:= 11, Winner is Player))))).			%surrounded an opponent's piece

/*check if there is at least one player piece on the board*/	
is_slide_possible(Board, Player) :-
  findall(Line+Column,											%find all player cells
			(between(1,9,Line), between(1,9,Column),
			 check_cell(Board, Player, Line, Column)), 					
          PlayerCells), !,
  \+ length(PlayerCells, 0).
  
  
/*find the Player's piece with the least amount 
of empty surrounding cells, and return that amount*/
min_empty_surr_cells(Board, Player, Min) :- 
  findall(Num,											
			(between(1,9,Line), between(1,9,Column),
			 check_cell(Board, Player, Line, Column),				%check if piece belongs to the player
			 surrounding_cells(Board, Line, Column, Cells, 6),		%find surrounding cells, maximum of 6
			 num_empty_cells(Board, Cells, Num)),					%number of empty cells surrounding this piece	
          EmptySurrCells),
  ((min_member(N, EmptySurrCells), Min is N); (Min is 6)), !.
    
	
num_empty_cells(_Board, [], 0).  
  
/*calculate how many cells from a list are empty*/
num_empty_cells(Board, [H|T], Num) :-
  H = Line+Column,
  (\+(valid_player_piece(Board, 0, Line, Column)),		%not empty
   num_empty_cells(Board, T, Num));
   (num_empty_cells(Board, T, AddNum),
    Num is AddNum + 1).

	
/*check if a cell is neighbour of another cell*/
neighbour_cell(Board, Move, Line, Column, NewLine, NewColumn, Player) :-
  surrounding_cells(Board, Line, Column, Cells, 6), !,				%get a list of the surrounding cells, maximum of 6
  (select(NewLine+NewColumn, Cells, _Residue);						%check if the cell on (NewLine,NewColumn) belongs to the calculated list
  (write('This cell is not a neighbour of the previous one!\n'),
  choose_cells(Board, 2, Move, Player))).
  
  
surrounding_cells(_Board, _Line, _Column, [], 0).
  
/*calculate and save on a list the coordinates (format X+Y) of the cells surrounding a certain cell*/
surrounding_cells(Board, Line, Column, Cells, MaxCells) :-
  ((MaxCells =:= 6,				%test the cell on the left
    TestLine is Line,
    TestColumn is Column - 1);
   (MaxCells =:= 5,				%test the cell on the right
    TestLine is Line,
    TestColumn is Column + 1);
   (MaxCells =:= 4,				%test one cell on the top
    TestLine is Line - 1,
    TestColumn is Column);
   (MaxCells =:= 3,				%test one cell on the bottom
    TestLine is Line + 1,
    TestColumn is Column);
   (MaxCells < 3,				%test the other cells (another top, another bottom)
    ((Line =:= 5,
     ((MaxCells =:= 2,
       TestLine is Line - 1,
       TestColumn is Column - 1);
      (MaxCells =:= 1,
       TestLine is Line + 1,
       TestColumn is Column - 1)));
	(Line < 5,
     ((MaxCells =:= 2,
       TestLine is Line - 1,
       TestColumn is Column - 1);
      (MaxCells =:= 1,
       TestLine is Line + 1,
       TestColumn is Column + 1))); 
	(Line > 5,
      ((MaxCells =:= 2,
       TestLine is Line - 1,
       TestColumn is Column + 1);
      (MaxCells =:= 1,
       TestLine is Line + 1,
       TestColumn is Column - 1)))))),
  NextMax is MaxCells - 1,
  ((valid_cell(Board, TestLine, TestColumn),
   surrounding_cells(Board, Line, Column, AddCells, NextMax),
   append(AddCells, [TestLine+TestColumn], Cells));
  (surrounding_cells(Board, Line, Column, AddCells, NextMax),
   append(AddCells, [], Cells))), !.

   
/*check if cell exists and is filled with a Player's piece*/
check_cell(Board, Player, Line, Column) :- 
  valid_cell(Board, Line, Column), !,
  valid_player_piece(Board, Player, Line, Column), !.

  
/*cell within the limits of the board*/  
valid_cell(Board, Line, Column) :-  
  valid_line(Board, Line, LineList), !,
  valid_column(LineList, Column).
  
valid_line(Board, Line, LineList) :-
  length(Board, Value),
  Line >= 1,
  Line =< Value,
  !,
  get_line_list(Board, Line, LineList).
  
valid_column(LineList, Column) :-
  length(LineList, Value),
  Column >= 1,
  Column =< Value.
  
  
/*check if piece in (Line, Column) belongs to Player*/
valid_player_piece(Board, Player, Line, Column) :-
  get_line_list(Board, Line, LineList),
  get_value(LineList, Column, Value), !,
  Value =:= Player.
 