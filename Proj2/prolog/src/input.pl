/*read letter from user's input to get a line*/
retrieve_line(Line) :-
  get_char(Letter),
  peek_char(NextLineChar),
  skip_line, !,
  NextLineChar=='\n',						%only one character typed
  letter(Line, Letter).						%Letter between A-I -> Line between 1-9		
  
  
/*read number from user's input to get a column*/
retrieve_column(Column) :-
  get_char(ColChar),
  char_code(ColChar, ColCode), !,
  (between(49,57,ColCode), !,				%Column between 1-9
  (number_chars(Column, [ColChar]),
   peek_char(NextColChar),
   skip_line);
  skip_line),
  NextColChar=='\n'.						%only one character typed
   
   
/*read number from user's input
to get an option choice between Min and Max*/
retrieve_option(Option, Min, Max) :-
  get_char(Char),
  char_code(Char, Code),
  number_codes(Min, CodeMin), CodeMin = [CMin|_],
  number_codes(Max, CodeMax), CodeMax = [CMax|_], !,
  (between(CMin,CMax,Code), !,				
  (number_chars(Option, [Char]),
   peek_char(NextChar),
   skip_line);
  skip_line),
  NextChar=='\n'.							%only one character typed