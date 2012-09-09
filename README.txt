RFC-822 Date Parser
===================

This is the most useless javascript module in the world. It provides a function 
to parse RFC 822 date time strings (as updated in RFC 1123). This is useless 
because the Date.parse function in basically every browser in the world will 
accept this format.  

I wrote this module because there's nothing (that I can see) in the EcmaScript 
5 spec that requires this behaviour, so any software that parses RFC 822 date 
time strings in the browser either must impement their own parser or rely on 
unspecified behaviour.

Perhaps instead they will use this module :) it weighs in at a little over 1k.

The contents of this repo are provided under the MIT-Style License in LICENSE
