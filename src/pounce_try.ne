# Pounce
# 
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives


pounce    ->  pinna_pl | pinna_empty
  pinna_pl ->  _ value (_ value)* _         
  pinna_empty  -> _                             

  word    ->  [a-zA-Z0-9\_\-\+\=\/\~\!\@\$\%\^\&\*\?\<\>]+ [a-zA-Z0-9\_\-\+\=\/\~\!\@\#\$\%\^\&\*\?\.\<\>]*
  value   ->  list | number | word | string | map

  map     ->  "{" _ pair? (_  _ pair)* _ "}"
  pair    ->  word _ ":" _ value               

# # # # Strings JS style ["", '', ``] # # # #
  string    ->  string_s | string_d | string_t
  string_s  ->  "'" [^']* "'" 
  string_d  ->  '"' [^\"]* '"'
  string_t  ->  '`' [^`]* '`' 

  list        ->  list_empty | list_full
  list_empty  ->  "[" _ "]"                        
  list_full   ->  "[" _ value (_ value)* _ "]" 

  number    ->  float1 | float2 | float3 | integer
  float1    ->  "-"? [0-9]+ "." [0-9]+ end_of_word  
  float2    ->  "-"? "." [0-9]+ end_of_word        
  float3    ->  "-"? [0-9]+ "." end_of_word        
  integer   ->  "-"? [0-9]+ end_of_word            

  end_of_word -> &_ | &"[" | &"]" | &"{" | &"}" | [$]+


  comment -> "#" [^\n]*
  end_of_string -> [$]  

# # # # tried many interations of a blacklist word definition rules # # # #
#  word      -> word_aux* 
#  word   ->  (!nonword .)+
#  nonword   ->  _ | "[" | "]" | "{" | ":" | "}"