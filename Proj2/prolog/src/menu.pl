display_menu :-
  nl,
  write('--------------------- Welcome to Susan ----------------------'),
  nl,
  nl,
  write('   Menu:'), nl,nl,
  write('1. Player vs Player'), nl,
  write('2. Player vs Computer'), nl,
  write('3. Computer vs Player'), nl,
  write('4. Computer vs Computer'), nl,nl,
  write('0. Exit'), nl,nl,
  write('Choose the game mode you want to play: '),
  retrieve_option(Mode, 0, 4),			%Option 0->4
  choose_mode(Mode);
  (write('\nInvalid option!\n'), display_menu).
  

choose_mode(X):-
  (X == 1, pvp_game);
  (X == 2, pvc_menu);
  (X == 3, cvp_menu);
  (X == 4, cvc_menu);
  (X == 0, write('\nExiting the game...\n')).
  
  
pvp_game :-
  start_game('H'-0, 'H'-0).
  
pvc_menu :-
  nl,nl,
  write('Choose the computer level:'),nl,
  write('1) Easy'),nl,
  write('2) Medium'),nl,
  write('3) Hard'),nl,
  write('--> '),
  retrieve_option(X, 1, 3),		%Option 1 to 3
  start_game('H'-0, 'C'-X);
  (write('\nInvalid option!\n'), pvc_menu).
  
cvp_menu :-
  nl,nl,
  write('Choose the computer level:'),nl,
  write('1) Easy'),nl,
  write('2) Medium'),nl,
  write('3) Hard'),nl,
  write('--> '),
  retrieve_option(X, 1, 3),		%Option 1 to 3
  start_game('C'-X, 'H'-0);
  (write('\nInvalid option!\n'), cvp_menu).
  
cvc_menu :-
  nl,nl,
  write('Choose the computer level:'),nl,
  write('1) Easy'),nl,
  write('2) Medium'),nl,
  write('3) Hard'),nl,
  write('PC1 --> '),
  retrieve_option(X1, 1, 3),		%Option 1 to 3
  (nl, write('PC2 --> '),
   retrieve_option(X2, 1, 3),		%Option 1 to 3
   (nl, start_game('C'-X1, 'C'-X2));
   (write('\nInvalid option!\n'), cvc_menu));
  (write('\nInvalid option!\n'), cvc_menu).
  