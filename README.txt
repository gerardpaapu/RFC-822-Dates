RFC-822 Date Parser
===================

This is the most useless javascript module in the world. It provides a function 
to parse rfc-822 compliant dates. This is useless because the Date.parse 
function in basically every browser in the world will accept this format.

I wrote this module because there's nothing (that I can see) in the EcmaScript 
5 spec that requires this behaviour, so any software that parses rfc-822 dates 
in the browser either must impement their own parser or rely on unspecified 
behaviour.

Perhaps instead they will use this module :) it weighs in at a little of 1k.
