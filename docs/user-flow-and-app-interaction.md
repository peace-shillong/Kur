Tip kur: Feature 1
When response in json is found=false

This is the flow which we will ask in a chat using State Management:

Phi khlem lap mo ka Jait jong phi?
You didn't find your surname here?

(We got the user's surname from his first input)

Kane ka dei ka jait jong phi __________?
Is this your surname ________ ?
- hooid
- em 

If user selects Em: Ask kaei ka jait jong phi? / What is your surname?

Then we will look into our DB if the surname exists
(Check if someone has submitted the surname) 
If it doesn't exists then continue:

    Sngewbha iathuh ka kyrteng ba Pura jong phi: 

    Ai lem ka email jong phi: 
    - @ 
    Ba ngin contact ia phi da donkam 

    Sngewbha thoh ki jait ba phi ia dei shi kur, wei hadien kawei: show example
    Surname A, Surname B,..., 

    Dang don shuh kiba ia teh kur? 
    Hooid 
    Em

    If user selects Hooid:
    Kiei de ki jait ba phi ia teh kur? 
    Phi don ne em? 
    - Don 
    - ym don shuh 

    If user selects: Don
    Da don: iathuh lem ia ngi: 
    Surname C, Surname D,...

    Finish with a greeting
    To khublei shibun.

    We can let user enter his related surnames one after the other by comma, of one message after the other.
    Wait for some time after the first message and ask if he would like to continue or he doesn't have any more surnames to add.

Else if the surname exists then:
Show the user his surname to confirm
Then show the related surnames to confirm, first the first level, then second and third level surnames

and we will store this now as a struture for our graph later.