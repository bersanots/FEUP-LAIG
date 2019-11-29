/*get list from matrix*/
get_line_list([H|_T], 1, H).
get_line_list([_H|T], Line, LineList) :-
  Line > 1,
  NextLine is Line - 1,
  get_line_list(T, NextLine, LineList), !.

  
/*get value from list*/
get_value([H|_T], 1, Value) :-
    Value = H.
	
get_value([_H|T], Index, Value) :-
  Index > 1,
  NextIndex is Index - 1,
  get_value(T, NextIndex, Value), !.

  
/*insert value in a matrix*/
insert_value([H|T], [NewH|T], Value, 1, Column) :-
  insert_in_list(H, NewH, Value, Column).

insert_value([H|T], [H|NewT], Value, Line, Column) :-
  Line > 1,
  NextLine is Line - 1,
  insert_value(T, NewT, Value, NextLine, Column), !.
  
  
/*insert value in a list*/
insert_in_list([_H|T], [Value|T], Value, 1).
insert_in_list([H|T], [H|NewT], Value, Index) :-
    Index > 1,
    NextIndex is Index - 1,
    insert_in_list(T, NewT, Value, NextIndex), !.
	
	
/*concatenate lists inside a list*/
concat([],[]).
concat([H|T],L) :-
    concat(T,L2),
	append(H,L2,L).