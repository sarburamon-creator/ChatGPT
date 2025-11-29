import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import OpenAI from "openai";
import fetch from "node-fetch";
import Tesseract from "tesseract.js";
import dotenv from "dotenv";

dotenv.config();

// --- Regulament (text pe care botul îl va folosi) ---
const regulamentText = `Regulament Fplayt
Cand iti este permis sa intri frontal in mod intentionat intr-un alt vehicul?
Raspunsuri:
"Sub nicio circumstanta aceasta actiune nu este permisa."
"Aceasta actiune nu este permisa niciodata pe server in nici un context."
Daca o persoana necunoscuta vine si iti ofera o suma de bani nejustificati sau
arme fara motiv, cum procedezi?
Raspuns: "Sa anunt imediat un membru staff, deoarece risc si eu la randul meu, sa iau ban
permanent
pentru complicitate in cazul in care persoana respectiva avea hack sau a facut ,,Bug abuse"."
Ce este Metagaming-ul?
Raspunsuri:
"Metagamingul inseamna ca folosesc informatiile din OOC in IC."
"Metagamingul reprezinta utilizarea informatiilor OOC in roleplay-uri."
"Metagamingul arata un abuz in care un player foloseste informatii dobandite in mod OOC in
roleplay
pentru a crea un avantaj."
In care din cazurile urmatoare se regaseste Metagaming-ul?
Raspunsuri:
"Vine un baiat mascat la mine, dar eu il cunosc din viata reala si ii spun pe nume."
"Atunci cand un prieten imi spune pe Discord sa vin la el IC sa-l ajut cu ceva, iar eu ma duc."
"Vad liveul unui streamer ca merge la jefuit, iar eu merg dupa el sa-l omor."
"Eu primesc o informatie pe Discord ca e razie Cayo si distribui informatia pe statie."
In care din situatiile de mai jos regasiti incalcata regula ce tine de Powergaming?
Raspunsuri:
"In momentul in care bag un item in inventarul cuiva random."
"In momentul in care fac accident cu cineva si in jefuiesc imediat dupa."
"In momentul in care arunc din inventar un item de fata cu politia."
"In momentul in care vorbesc pe sub apa"
"In momentul in care sun pe cineva dar eu am catuse la maini."
"In momentul in care fac accident si nu rolez."
"In momentul in care vorbesc pe statie, dar eu sunt incatusat"
"In momentul in care leg pe cineva de un copac si il las acolo 10 ore."
Ce reprezinta termenul ,,No-Fear"?
Cand imi este permis sa atac un transport de detinuti?
Raspunsuri:
"Pot sa atac un astfel de transport daca se afla in el liderul, avand doar 5 minute la dispozitie de
a pleca
de la inceperea atacului."

"Pot sa atac un astfel de transport doar daca se afla in el minim 4 membri ai organizatiei mele,
avand
doar 5 minute la dispozitie de a pleca de la inceperea atacului."
"Pot sa atac un astfel de transport doar daca se afla in el minim 4 membri ai organizatiei mele
sau
liderul, avand doar 5 minute la dispozitie de a pleca de la inceperea atacului."
Ce reprezinta termenul de ,,Rob & Kill"?
Raspuns: "Acest termen reprezinta jefuirea unei persoane de bunurile sale urmand sa il omor
ulterior."
In care dintre urmatoarele situatii regasim incalcarea regulii ,,Rob & Kill"?
Raspunsuri:
"Eu jefuiesc o persoana, iar acecasta incepe sa ma insulte. Vazand situatia, eu il impusc."
"Sunt cu un prieten la jefuit, gasim un baiat, il jefuiesc, iar prietenul meu il omoara."
"Dupa ce jefuiesc o persoana intr-o zona rau famata, o omor si fug."
"Dupa ce jefuiesc o persoana, o oblig sa se arunce de pe pod."
Ce fac in situatia in care un player vine random la mine si incepe sa ma injure,
scuipe sau sa ma bata?
"Ma retrag din zona si fac ticket deoarece persoana respectiva a incalcat o regula OOC."
"Imi pastrez calmul, fac un ticket si astept sosirea membrului staff."
Ce inseamna termenul ,,Player-kill"?
Raspuns: ",,Player-kill-ul", reprezinta momentul in care ai ajuns in coma si folosesti tasta ,,Space"
pentru
a-ti da respawn la spital, uitand informatiile din actiunea roleplay anterioara."
Ce reprezinta termenul de ,,Cop Bait"?
Raspuns: ",,Cop Bait-ul" este atunci cand fac anumite actiuni pentru a atrage politia dupa mine
deoarece
ma plictisesc"
Ce intelegi prin regula ,,Cop-Fear"?
Raspuns: "Inteleg ca nu imi este permis sa iau la misto politistii indiferent de situatie."
In care din situatiile de mai jos regasim ,,MIXING"?
Raspunsuri:
"Ma aflu intr-o locatie departe de oras si chem un prieten pe Discord sa vina la locatia respectiva
sa ma
ia."
"Sunt intr-un roleplay. Simt ca imi este sete si spun pe voice-chat ,,ma pun pe ganduri sa beau
apa", iar
eu ma ridic de la PC mergand la bucatarie."
"Sunt taximetrist si nu primesc apeluri. De suparare, scriu pe CHAT-ul global "Taxi liber si curat,
apasa F
si am plecat!"."

"Rog pe discord un prieten sa-mi imprumute niste bani."
Care sunt criteriile obligatorii de indeplinit in momentul in care faci un job legal?
Raspunsuri:
"In momentul in care practic un job legal, trebuie sa folosesc masina de job si uniforma specifica.
Pe
toata durata job-ului, imi este interzis sa fac actiuni ilegale fiind necesar sa am un comportament
decent."
"In momentul in care fac un job legal trebuie sa am uniforma, masina de job si sa nu fac
ilegalitati."
"In momentul in care fac un job legal trebuie sa am uniforma, masina specifice jobului si sa nu
comit
ilegalitati."
Ce reprezinta termenul de ,,Drop & Kill"?
Raspunsuri:
"Acest termen reprezinta momentul in care oblig un jucator sa arunce bunurile din inventarul sau,
urmand sa il omor ulterior."
"Acest termen reprezinta fortarea unui jucator sa arunce itemele aflate in inventarul sau dupa
care sa ii
pun capat vietii."
La cate ore ai dreptul de a jefui pe cineva?
Raspuns: "Am dreptul de a jefui pe cineva la 100 de ore pe caracter."
Care este minimul necesar de ore pe caracter pentru a jefui?
Raspuns: "Am nevoie de 100 de ore pe caracter pentru a face acest tip de roleplay."
Daca am intentia de a jefui pe cineva si nu sunt multumit de bunuruile ce le
poseda respectivul, in ce situatie il pot omori?
Raspunsuri:
"Nu pot face acest lucru, deoarece regulamentul imi interzice."
"Din moment ce persoana are asupra ei o suma oarecare, am obligatia sa il las in viata sau sa il
jefuiesc."
In care dintre urmatoarele situatii primesti ,,Character-kill"?
Raspunsuri:
"In momentul in care sunt membru al unei organizatii si decid sa o tradez, dand informatiile din
aceasa
politiei ori altei organizatii."
"In cazul in care esti lovit de tren si intri in coma."
"In momentul in care am acumulat numarul de 5 caziere."
"In momentul in care comit infractiuni ce echivaleaza cu inchisoare pe viata."
"In urma unui roleplay in care decid sa imi pun capat vietii."
Ce inseamna ,,Revenge-kill"?

Raspuns: ",,Revenge-kill" este atunci cand mor intr-o situatie roleplay corecta, primesc respawn
la spital
si ma duc inapoi la cel care m-a omorat pentru a-l omori si eu la randul meu."
In care din situatiile de mai jos regasim ,,Revenge-kill"?
Raspunsuri:
"Sunt omorat de catre un mafiot cu scopul de a primi PLAYER-KILL (PK), imi iau respawn la spital
si ma
duc inapoi in locul in care am fost omorat cu scopul de a ma razbuna."
"Un jefuitor ma omoara deoarece am avut un comportament inadecvat in momentul in care am
interactionat cu el, dupa ce primesc respawn la spital ma duc in locul in care am fost omorat si
ma
razbun."
Unde iti este permis sa aterizezi cu un elicopter sau avion?
Raspunsuri:
"Imi este permis sa aterizez pe aeroporturi cu avionul, iar cu elicopterul pe blocuri, case si spatii
ce detin
un Helipad."
"Imi este permis sa aterizez in spatiile special amenajate (Aeroport sau Helipad)."
Cand imi este permis sa jefuiesc o persoana indiferent de ora?
Raspuns: "Imi este permis sa jefuiesc o persoana indiferent de ora, atunci cand detin propia mea
locatie
ilegala iar aceasta refuza sa plateasca taxa."
Odata la cat timp este permis sa jefuiesti aceeasi persoana? (exclus Cayo Perico)
Raspunsuri:
"Nu pot sa jefuiesc aceeasi persoana la un interval mai mic de 3 ore."
"Imi este permis sa jefuiesc aceeasi persoana o data la 3 ore."
"O singura data la 3 ore."
La ce interval de timp am dreptul de a jefui aceeasi persoana pe insula Cayo?
Raspuns: "Pot sa jefuiesc aceeasi persoana de cate ori o prind."
Ai voie sa jefuiesti politisti OFF-DUTY?
Raspunsuri:
"Da, iti este permis acest lucru deoarece politistul OFF-DUTY este lipsit de avantajele de
serviciu."
"Da, ai voie"
Poti livra marfa ilegala cu o masina de la un job legal?
Raspunsuri:
"Nu am voie sa ma folosesc de masini de la job in scopuri personale sau sa livrez marfa ilegala."
"Nu, regulamentul interzice aceasta actiune."
Pot livra marfa ilegala intr-o uniforma de job legal?
Raspunsuri:

"Nu, este strict interzis sa folosesc uniforma de job legal in scopuri personale."
"Nu, conform regulamentului, uniforma de job legal este necesara doar cand practic acel job
legal."
Pot sa dau /sleep pe plaja sau in padure?
Raspuns: "Nu, regulamentul imi interzice aceasta actiune. Pot dormi doar in apartament, casa,
autorulota sau penitenciar."
Care este viteza maxima admisa pe un drum ,,OFF-ROAD" cu un vehicul ,,OFFROAD"?
Raspuns: "Viteza maxima pe un astfel de drum este de 40 - 60 KM/H, iar daca sunt urmarit si
viata este
pusa in pericol, 80 - 100 KM/H"
Care este viteza maxima admisa pe un drum ,,EXTREM OFF-ROAD" cu un vehicul
,,EXTREM OFF-ROAD"?
Raspuns: "Viteza maxima pe un astfel de drum este de 40 - 60 KM/H indiferent de situatie"
Cand puteti efectua manevra de ,,PIT-STOP" si cu ce clase de masini?
Raspuns: "Viteza maxima este de 150 KM/H si am voie sa fac aceasta manevra doar daca masina
mea
face parte din urmatoarele clase: clasa C, clasa B, clasa LOWRIDER sau masini de mafie"
Ce reprezinta termenul de ,,Chicken-run"?
Raspuns: "Acest termen reprezinta alergarea in zig-zag in timp ce se trage asupra ta."
Ce reprezinta termenul de Bombardier?
Raspuns: "Atunci cand am un comportament neadecvat si ma cert, injur lumea pe strada fara a
avea un
motiv intemeiat de a face aceste actiuni."
Ce reprezinta termenul ,,Olympic Swim"?
Raspuns: "Acest termen reprezinta inotarea unei distante considerabile fara a face pauze de
oboseala."
In care din situatiile urmatoare regasim Condusul Non-Roleplay?
Raspunsuri:
"In momentul in care intru intentionat intr-un autovehicul stationat."
"Cand intru frontal intr-un autovehicul."
Cand iti este permis sa faci o actiune terorista?
Raspuns: "Este permis sa fac o astfel de actiune doar dupa ce discut detaliile actiunii cu un
,,Administrator+" si primesc aprobarea sa."
Care este valoarea maxima in bunuri sau bani pe care o poti jefui de pe o
persoana?
Raspunsuri:
"Am dreptul de a fura totul de pe acesta, cu exceptia obiectelor specifice unui job legal."
"Am dreptul de fura totul de pe acesta, cu exceptia itemelor de job legal."
Ce reprezinta termenul ,,Roleplay"?

"Termenul de Roleplay reprezinta rolarea actiunilor din viata reala pe cat de bine posibil."
"Prin Roleplay intelegem jucarea unui rol. Practic, facem pe un joc tot ce facem si-n viata reala, in
limitele regulamentului si a scripturilor."
"Termenul de Roleplay este un joc de imaginatie. Trebuie sa ne imaginam actiunile ce pot fi
facute in
viata reala si sa le transpunem in joc, in limitele regulamentului."
Pe cine nu ai voie sa jefuiesti din lista de mai jos?
Raspunsuri:
"Nu am voie sa jefuiesc persoanele ce se afla intr-o zona publica."
"Nu am voie sa jefuiesc medici."
"Nu am voie sa jefuiesc politisti."
"Nu am voie sa jefuiesc oameni ce practica un job legal."
Care este intervalul orar in care imi este permis sa jefuiesc o persoana aflata in
Los Santos?
Raspunsuri:
"Intervalul este de la 8 seara la 8 dimineata."
"Am dreptul sa jefuiesc doar in intervalul orar 20:00 - 08:00."
"Pot sa jefuiesc incepand de la ora 20:00 la 08:00"
Ce faci cand esti implicat intr-un accident auto?
Raspunsuri:
"Rolez accidentul cat mai bine posibil, interactionez cu jucatorul respectiv si chemam politia
daca este
cazul."
"Dupa ce termin de rolat accidentul, ma duc sa interactionez cu celalalt participant, incercand sa
rezolv
problema."
"Dupa ce rolez accidentul, incerc sa scot la cale amiabila sau daca este necesar sun la politie."
Care este maximul de persoane pe care le pot rapii singur in momentul in care
conduc o masina?
Raspuns: "Nu am cum sa rapesc de unul singur o persoana, atat timp cat conduc."
Cand imi este permis sa omor o persoana?
Raspuns: "Imi este permis sa fac acest lucru doar daca am un motiv foarte bine intemeiat."
Cand se face roleplay pe server?
Raspunsuri:
"Roleplay-ul pe server este continuu, incepe din momentul in care dam connect si se sfarseste in
momentul in care iesim de pe server, cu exceptia momentului in care avem aprobarea unui
membru
STAFF de a deschide OOC-ul."
"Avand in vedere ca serverul este Advanced, roleplay-ul este in continua desfasurare de la

momentul
conectarii pana la disconnect, cu exceptia ticketelor."
Ce trebuie sa faci cand intri prima data pe server?
Raspuns: "Ceea ce trebuie sa fac atunci cand intri prima data pe server este sa-mi creez un
buletin, sa-mi
fac caracterul si sa ma imbrac, urmand sa ma indrept catre scoala de soferi pentru a obtine
permisul
permisul auto."
In care din situatiile prezentate se regaseste ,,Roleplay-ul scarbos"?
Raspunsuri:
"In momentul in care violez pe cineva fara aprobarea sa out-of-character (OOC)."
"In momentul in care oblig o persoana sa se dezbrace NUD."
"In momentul in care se fac actiuni de necrofilie."
"In momentul in care urinez pe cineva."
Cand este permis sa faceti ,,Roleplay scarbos"?
Raspunsuri:
"Pot face roleplay scarbos atunci cand toti participantii sunt total de acord in mod OOC cu
participarea la
cesta."
"Pot face roleplay scarbos doar atunci cand toti participantii si-au dat acordul out-of-character
(OOC) in
legatura cu participarea la acesta."
Pot fi sanctionat daca dau scam in situatia ,,item ilegal pe bani"?
Raspunsuri:
"Da, deoarece regulamentul server-ului imi interzice acest lucru si se sanctioneaza ca atare."
"Da, se considera scam deoarece nu respect promisiunea/intelegerea."
"Se considera scam din punct de vedere al regulamentului OOC, fapt in care imi este interzis sa
nu
respect afacerea."
Ce intelegeti prin termenul ,,Deathmatch"?
Raspunsuri:
"Prin Deathmatch intelegem atacarea/uciderea cuiva fara a fi avut un motiv intemeiat."
"Prin Deathmatch intelegem ca nu este permis sa ucidem un player fara motiv."
Ce pot cere in schimbul unui ostatic?
Raspunsuri:
"Pot cere maxim 200.000$ in bunuri/bani sau in cazul in care nu am varianta de rascumparare il
pot
pune sa munceasca pe insula Cayo maxim 1 ora."
"Pot cere maxim 200.000$ in bunuri sau bani."
Pot sa iau ostatic la jaf de Banca sau Bijuterie?

Raspunsuri:
"Nu, indiferent de situatie."
"Bineinteles ca nu."
"Nu, clar!"
In care dintre situatiile urmatoare regasiti un scam sanctionabil?
Raspunsuri:
"Stabilesc o suma pentru prestarea unor servicii, iar dupa ce acestea se finalizeaza, nu se mai
dau banii."
"Fac o intelegere de tip Schimb pe schimb + diferenta. Eu vand masina, celalalt vinde masina dar
diferenta nu se mai ofera."
"Fac un pariu pe ceva, spunand ca cel ce pierde are de oferit 500.000$. Eu pierd pariul dar nu
ofer banii
respectivi."
"Sun la taxi si il rog sa ma duca in port. Cand ajungem acolo, eu ma dau jos si o iau la fuga,
neplatind
cursa."
"Vand un AK-47 unui baiat pe 200.000$, iar acesta nu plateste."
In momentul in care doresti sa dai un ,,Scam", care este maximul permis in
bunuri sau bani?
Raspuns: "Nu am voie sa dau un scam ce sa valoreze mai mult de 5.000$ in bunuri sau bani."
REGULAMENT FIVEM FPLAYT
TERMENI SI CONDITII
INFO: Staff-ul FPlayT isi REZERVA DREPTUL sa isi selecteze jucatorii care doresc sa
joace pe Comunitatea FPlayT. Persoanele care sunt TOXICE / CANCER etc sau
persoanele pe care le consideram INAPTE pentru a face un minim de Roleplay pot fi
BANATE PERMANENT!
Cuprins ( STANDARD )
CAP. 1. Regulament Roleplay
CAP. 2. Regulament OOC ( Out of Character )
CAP. 3. Regulament General
CAP. 1. Regulament Roleplay
(1)01. NU FACETI METAGAMING. (MG)
MetaGaming-ul - Este folosirea informatiilor tale OOC intr-o situatie IC,va voi da
niste exemple pentru evitarea MetaGaming-ului.
Sa zicem ca eu merg la dealerul de masini Los Santos,si acolo il vad pe
'Carlito',care are o masina ,eu cautand o masina,mi-a sarit in ochi masina lui
'Carlito' si vreau sa o cumpar,spunandu-i: Salut Carlito!,sunt interesat de masina
ta,o vinzi?Ei bine acesta este un mod de actionare Non Role Play deoarece in viata
reala,numele oamenilor nu sta deasupra capului lor,deci nu asa actionam intr-un caz
de acest gen,ci asa: Buna seara,ma numesc Hara si a-s fi interesat sa cumpar masina

dumneavoastra,este de vanzare?Si el raspunzand astfel: Salutare,ma numesc Carlito
si da,este de vanzare aceasta masina.
(1)02. NU FACETI POWERGAMING. (PG)
Power Gaming, prescurtarea acestui terment e PG, este atunci cand nu ii dai voie
unui 'player' sa raspunda la Role Play-ul facut de tine,s-au mai pe scurt a face
Role Play exagerat ( A face actiuni supraomenesti ).
(1)03. NU FACETI DEATH MATCH. (DM)
Death Match , prescutarea acestui termen e DM . Acest termen se intalneste pe toate
serverele cu orice mod existent in GTA5. Acest termen reprezinta practicarea unor
actiuni non-rp . Adica omorarea unu-i individ de pe server fara motiv.
(1)04. NU FACETI REVENGEKILL. (RK)
Revenge Kill - Atunci cand un player te-a ucis,te-a omorat in joc,iar tu ai sansa
de a veni la el inapoi si de a-l omori inapoi. Practic dupa ce te-a impuscat acel
player,tu ai murit,ai fost dus la spital pentru a te face bine,iar memoria ta a
fost stearsa,nu iti amintesti nimic ce s-a produs,ce s-a intamplat acum cateva
minute.
(1)05. NU FACETI MIXING. (MX)
Mixing-ul reprezintÄ transmiterea de informaČii (IC-OOC).TotodatÄ, este interzisÄ
specificarea acČiunilor pe care le faci OOC pe VOICECHAT. Informatiile OOC se
discute pe chat-ul normal!
Un exemplu de Mixing: Eu ma aflu la sectia de Politie, iar eu chem pe cineva pe
CHAT-ul OOC sa vina sa ma ia din locatia respectiva.
(1)06. Despre CHARACTER KILL. (CK)
CHARACTER KILL (CK) reprezintÄ, uciderea unui jucÄtor. DacÄ un jucÄtor primeČte CK,
characterul o sa fie resetat complet si trebuie sa inceapa cu un nou character.
Pentru a acorda un CK, jucÄtorul care doreČte sÄ o facÄ trebuie sÄ aibÄ un motiv
foarte bun (de exemplu, ĂŽntr-o mafie, un asociat se duce la poliČie Či dÄ
informaČii despre mafia ĂŽn care este - respectivul poate primi CK dacÄ mafia aflÄ
ce a fÄcut). TotodatÄ, roleplay-ul fÄcut pentru un CK trebuie sÄ fie complex.
Ăn cazul unei sinucideri sau ĂŽn urma unui acord ĂŽncheiat ĂŽntre ambele pÄrČi
(atacator/victimÄ).
Ăn cazul ĂŽn care jucÄtorul se aflÄ ĂŽntr-o acČiune cu Los Santos Police Department
Či decide sÄ comitÄ un act de suicid ĂŽn mod intenČionat, pentru a scÄpa de
acuzaČii. (ex. Un jucÄtor se aflÄ ĂŽntr-o urmÄrire Či decide sÄ intre ĂŽntr-un copac,
rolĂ˘ndu-Či astfel moartea.)
Ăn cazul ĂŽn care un jucÄtor comite infracČiuni care echivaleazÄ ĂŽnchisoarea pe
viaČÄ.
Ăn cazul ĂŽn care un jucÄtor trÄdeazÄ o anumitÄ grupare/organizaČie Či ia legÄtura
cu altÄ facČiune pentru a acorda informaČii despre respectiva grupare/organizaČie.
Ăn cazul ĂŽn care esti lovit de tren si intrii in coma.

ATENTIE! Dupa CHARACTER KILL (CK) nu aveti voie:
Nu aveti dreptul sa va faceti un character care are vreo legatura cu fostul
character. ( Ruda / Prieten )
Nu aveti dreptul sa va faceti characterul la fel cum era inainte de CK.
Nu aveti dreptul sa folositi acelasi nume sau apropiat in buletin.
Nu aveti dreptul sa aveti aceeasi porecla.
In cazul in care erati intr-o ORGANIZATIE nu mai aveti dreptul sa reintrati in acea
organizatie.
ATENTIE! Dupa CHARACTER KILL (CK) persoanele care detin bunuri cumparate cu FPT
Coin-uri:
VIP-ul ramane activ dupa CHARACTER KILL (CK).
FPT Coin-urile raman pe cont dupa CHARACTER KILL (CK).
Masinile cumparate separat cu FPT Coin-uri raman pe cont dupa CHARACTER KILL (CK).
Casa VIP ramane pe cont dupa CHARACTER KILL (CK).
Banii cumparati cu FPT Coin nu se primesc inapoi dupa CHARACTER KILL (CK).
Numarul de TELEFON / INMATRICULARE nu se primeste inapoi dupa CHARACTER KILL (CK).
ATENTIE! La 3 CHARACTER KILL ( CK ) acumulate se primeste sanctiunea de BAN ( Fara
drept de plata )
(1)07. Despre ROLEPLAY. (RP)
Roleplay , prescurtarea acestui termen e RP. Acest termen se intalneste pe
serverele cu mod RolePlay. Semnificatia acestui termen reprezinta simularea sau
practicarea une-i vieti reale dar in situatia noastra e o viata virtuala. Fiecare
om isi poate reprezenta viata reala intr-un oras din Los Santos,cu o functie
diferita chiar si o infatisare diferita si calitati diferite.
Deci mai pe scurt acest termen reprezinta simularea unei vieti reale intr-o viata
virtuala.
(1)08. Despre IN-CHARACTER. (IC)
In Character , prescutarea acestui termen e IC . Acest termen reprezinta toate
informatiile si actiuniile facute/gasite de noi in joc. Reprezentarea informatiilor
sau actiuniilor facute de noi in joc, se foloseste VOICECHAT!
Daca cumva in VOICECHAT se vorbesc informatii OUT OF CHARACTER ( OOC ) se formeaza
MetaGamming , si in acez caz contrat sunteti non-regulamentari.
(1)09. Despre OUT-OF-CHARACTER. (OOC)
Out Of Character , prescurtarea acestui termen e OOC . Acest termen reprezinta
toate actiuniile sau informatiile facute in viata REALA si se reprezinta cu
ajutorul unor chaturi specifice. (Chat In Game / Discord / Skype etc.)
In caz ca folositi niste informatii OOC in IC se va forma MetaGamming ca urmare
veti fi non-regulamentari.
Este permis doar cand un Helper/Moderator/Administrator/Owner va permite sa vorbiti
OOC.

Pentru discutiile OOC aveti chatul unde acolo puteti vorbii sau sa puneti
intrebari.
(1)10. Despre PLAYER-KILL. (PK)
Player Kill , prescurtarea acestui termen e PK . Acest termen se intalneste pe
serverele cu mod RolePlay . Acest termen reprezinta resetarea tuturor informatiilor
IC ( Resurselor ) cu persoanele aflate in acel roleplay. Mai pe intelesul tuturor
in momentul in care mori si te respawn-ezi la spital acela este momentul in care se
uita toate informatiile cu persoanele respective care s-au aflat la roleplay-ul
respectiv.
(1)11. NU FACETI CHICKEN-RUN (CR)
Chicken-running este atunci cĂ˘nd un jucÄtor fuge dintr-o parte ĂŽn altÄ astfel ĂŽncĂ˘t
sÄ evite gloanČele, ceea ce este non roleplay Či interzis. Aceaste regulÄ se aplicÄ
Či ĂŽn cazul unui brawl(Fight-Bataie in grup). Atunci cĂ˘nd are loc un brawl, nu
aveČi voie sÄ fugiČi Či sÄ loviČi cu bĂ˘ta.
(1)12. NU FACETI OLYMPIC-SWIM. (OS)
Olympic-Swim , prescurtarea acestui termen este OS. Acest termen face referinta la
jucatorii care innoata foarte mult fara sa se opreasca. In realitate doar olimpici
la innot pot innota distante lungi, un om de rand nu are capacitatea fizica incat
sa innoate pe distante lungi. Mai pe inteles pentru a nu incalca aceasta regula
trebuie sa incercati pe cat posibil sa nu innotati pe distante lungi si cu pauze
intre, iar daca aveti posibilitatea trebuie sa incercati sa ajungeti cat mai repede
la mal sau pe o barca.
(1)13. NO-FEAR (NF)
NO-FEAR, prescurtarea acestui termen este (NF). Acest terment reprezinta actiunile
unui jucÄtor care alege sa nu roleaze frica atunci cand este necesar. Ca sa
intelegeti mai bine termenul de NO-FEAR o sa oferim cateva exemple clare.
EXEMPLE:
Este NO-FEAR atunci cand esti inconjurat de oameni inarmati care te ameninta, iar
tu alegi sa fugi sau sa ii bati cu pumnii.
Este NO-FEAR atunci cand esti urmarit de oameni inarmati si tu alegi sa mergi intro zona SAFE-ZONE ( Zona publica ) si incepi sa ii injuri / jignesti / provoci.
[ Daca faceti acest lucru datoria ta este sa stai cuminte si sa cauti o alternativa
de a scapa din situatie. ]
(1)14. COP FEAR (CF)
COP FEAR sau prescurtarea (CF) este o ramura din regula NO-FEAR si face referinta
la persoanele care nu au frica de politisti. In realitate mai bine de 99% din voi
nu cred ca aveti tupeul sa comentati la Politisti din ori ce prostie. Ce vedeti voi
pe YouTube/Facebook oameni care comenteaza la politie sunt oamenii aia care au WCul in curte sau oamenii care au deficienta mentala. Mai pe intelesul tuturor
trebuie sa aveti un comportament civilizat si respectuos fata de Politisti

indiferent daca faceti parte dintr-o Organizatie sau nu.
Mai jos o sa va precizam cateva exemple de (CF) ca sa intelegeti mai bine regula:
Este STRICT INTERZIS sa luati la misto un politist indiferent de situatie.
Este STRICT INTERZIS sa va luati la impuscat / batut cu D.I.I.C.O.T.-ul deoarece in
mod normal ar trebuii sa rolati frica cand ii vedeti si sa fugiti fara sa va mai
uitati in spate sau sa va predati. ( Aceasta regula nu se aplica la jafuri de
Magazine / Banca sau in zona Groove doar in intervalul de ora 20:00 - 08:00 si nu
se mai aplica regula in cazul in care va aflati la locatiile ilegale de Droguri /
Tigari / Hacker / Etnobotanice / Atasamente. )
Este STRICT INTERZIS sa faci COP-BAIT la Politie pentru a fii urmarit. ( COP-BAIT
inseamna sa atragi intentionat politia asupra ta sa te urmareasca.
(1)15. DROP & KILL. (DK)
Este INTERZIS sa fortezi o persoana sa arunce toate bunurile de pe el, iar dupa sa
il omori. Daca l-ati fortat sa arunce trebuie sa il lasati in viata, iar daca vreti
sa il omorati nu aveti voie sa il puneti sa arunce bunurile de pe el.
(1)16. ROB & KILL. (RB)
Este INTERZIS sa jefuiesti o persoana, iar dupa sa o omori deoarece in realitate in
cele mai multe cazuri cand un hot vrea sa te jefuiasca nu o sa se riste niciodata
sa te si omoare.
(1)17. ROLEPLAY DEZGUSTATOR / SCARBOS.
Abuzul sexual (violul), canibalismul, necrofilia, pedofilia Či alte tipuri de
roleplay dezgustÄtor sunt permise pe server doar cu acordul OOC al ambelor pÄrČi
implicate ĂŽn acČiune. ( ATENTIE: Nu se incadreaza RP-ul de tortura ca roleplay
dezgustator, adica taiat de degete, scos de unghii etc )
CAP. 2. Regulament OOC ( Out of Character )
(2)01. ACUMULARE 4 WARNURI.
OdatÄ cu acumularea a 4 avertismente (warn-uri) veČi fi banati automat. Warn-urile
sunt acordate jucÄtorilor care ĂŽncalcÄ anumite reguli Či ĂŽn funcČie de decizia
administratorului.
(2)02. SANCTIUNI ACUMULATE
S-a observat ca exista multe persoane pe comunitatea noastra care in decurs scurt
de timp au acumulat foarte multe sanctiuni si foarte multi dintre acestia nu au
invatat nimic din acele sanctiuni. Asa ca pentru a ne asigura ca jucatorii nostri o
sa inceapa sa invete din greseli am adaugat aceasta regula.
La 5 BAN-URI PROVIZORII o sa se primeasca BAN PERMANENT cu drept de plata.
La 2 BAN-URI PERMANENTE acumultate din BAN-URI PROVIZORII o sa se primeasca BAN
PERMANENT fara drept de plata.
Consideram ca daca dupa atatea ban-uri nu ai invatat nimic inseamna ca nu esti apt
pentru a te juca pe aceasta comunitate.
(2)03. SUFERINTE / JIGNIRI OOC

Aceasta regula s-a adaugat in mod special pentru persoanele care nu stiu sa se
joace frumos si incep sa SUFERE / JIGNEASCA din diferite motive cauzate pe
Comunitatea FPlayT. Atentie, o sa fiti foarte grav sanctionati pentru incalcarea
acestei regului.
Este INTERZIS sa SUFERITI / JIGNITI pe chat In-Game.
Este INTERZIS sa SUFERITI / JIGNITI pe voice In-Game.
Este INTERZIS sa SUFERITI / JIGNITI pe Discord in privat, pe server-ul comunitatii
sau pe alte servere.
Este INTERZIS sa SUFERITI / JIGNITI pe Live-uri in chat.
Exemple Suferinte OOC:
"Politistilor, ce faceti ma, cum e vremea pe jos acolo, iar muriti?"
"Mafiotilor, mai invatati si voi sa trageti?"
"Uite, asa se face un roleplay de calitate, nu ce faceti voi.
Exemple sunt foarte multe si le cunoasteti si voi care sunt, v-am oferit niste mici
exemple doar ca si idee despre ce e vorba.
(2)04. BAN PROVIZORIU FARA DREPT DE PLATA
Aceasta regula a fost adaugata deoarece multe persoane abuzeaza de faptul ca pot
plati ban-ul provizoriu in anumite situatii.
Disconnect in Roleplay - Ban 14 zile ( Fara drept de plata )
Metagaming / Mixing - Ban 7 zile ( Fara drept de plata )
No-Fear - Ban 7 zile ( Fara drept de plata )
Condus Non-Roleplay - Ban 3 zile ( Fara drept de plata )
Plans Nejustificat - Ban 1 zi ( Fara drept de plata ) [Acest ban se refera strict
la persoanele care plang fara motiv in actiuni roleplay sau asupra anumitor decizii
luate pe comunitate]
(2)05. BAN EVADING
BAN EVADING este atunci cand ai BAN Provizoriu / Permanent la noi pe comunitate si
intrii sa te joci de pe un alt cont. Asa cum face si referire numele la aceasta
regula BAN EVADING ( Evadare de Ban ) este complet interzisa si se poate sanctiona
si cu BAN PERMANENT fara drept de plata.
(2)06. POST HUNT
Aceasta regula a fost adaugata pentru a oprii Hate-ul si Certurile inutile create
de anumiti jucatori cu frustrari.
Este INTERZIS sa faceti o reclamatie in care nu aveti nici un fel de implicare.
Aveti dreptul de a face o reclamatie doar in cazul in care sunteti partas in
actiunea respectiva.
Este INTERZIS sa faceti o reclamatie in locul altei persoane. Daca persoana
respectiva doreste sa faca o reclamatie consideram ca nu are nevoie de avocati.
Este INTERZIS sa faceti o reclamatie daca au trecut mai mult de 24h de la
actiunea / fail-ul facut. ( Pentru a evita POSTHUNT-u / SANTAJUL OOC si multe

altele )
ATENTIE! Trebuie sa fiti intelegatori, deoarece si noi ca staff daca stam 24h pe un
anumit jucator sigur il prindem facand o greseala pentru care putem sa il
sanctionam!
(2)07. SCAM ( INSELACIUNE )
In momentul in care aveti de gand sa dati SCAM la o persoana trebuie sa respectati
urmatoarea regula.
Este STRICT INTERZIS ca SCAM-ul sa fie mai mare de 5.000$ in bunuri sau bani.
Exemple:
- Cei care muncesc legal / ilegal pentru o persoana. ( Explicatie: Tu angajezi o
persoana sa munceasca pentru tine, iar la final nu il mai rasplatesti asa cum v-ati
inteles. )
- In momentul in care faci un pariu si il pierzi. ( Explicatie: Adica pariati pe
ceva anume ce valoreaza mai mult de 5.000$. )
- In momentul in care imparti un Business cu cineva. ( Explicatie: Daca ai cazut de
comun acord cu cineva sa aveti un Business impreuna, iar din diferite motive nu va
mai intelegeti sau s-a intamplat ceva intre voi aveti OBLIGATIA sa vindeti acel
Business sau sa va intelegeti la o suma de bani incat la final toata lumea sa fie
multumita. )
- Schimb de masini / Schimb de masini + diferenta. ( Explicatie: In realitate
astfel de lucruri se fac la notar, ceea ce inseamna ca practic este imposibil sa
fie un astfel de scam. Daca ati cazut de comun acord la acel schimb de masini sau
schimb de masini + diferenta aveti obligatia sa va tineti de cuvant. )
ATENTIE: Trebuie sa existe dovezi video/photo clare cu acordul intre cele doua
parti.
ATENTIE!
Nu se considera SCAM daca imprumutati la cineva de buna voie o masina si nu o mai
primiti inapoi.
Nu se considera SCAM daca imprumutati pe cineva de buna voie o suma de bani si nu o
mai primiti inapoi.
Nu se considera SCAM daca incerci sa fentezi taxa de 3% si vinzi masina pe 1$ la un
jucator, iar restul de bani nu ii mai primesti de la jucatorul respectiv.
Nu se considera SCAM daca accepti sa dai banii inainte pentru a cumpara masina de
la un jucator.
(2)08. NU FACETI TROLLING.
Trolling-ul pe server este interzis. Prin trolling se ĂŽnČelege cÄ unul sau mai
mulČi jucÄtori nu au dispoziČia necesarÄ desfÄČurÄrii unei acČiuni roleplay Či nu
fac altceva decĂ˘t sÄ caute atenČie, sÄ se bage ĂŽn seamÄ cu alČi jucÄtori cu scopul
de a ĂŽi face pe acei jucÄtori sÄ interacČioneze, chiar dacÄ aceČtia nu ĂŽČi doresc
acest lucru. Practic, respectivul sau respectivii nu fac decĂ˘t sÄ provoace ceilalČi

jucÄtori cu scopul de a crea oarecare conflicte sau pentru a se amuza, prin asta
deranjĂ˘nd acČiunile roleplay ale celorlalČi jucÄtori.
(2)09. NU FACETI RECLAMA.
AČa cum Či noi le interzicem membrilor sÄ facÄ reclamÄ cu comunitatea noastra pe
alte comunitÄČi de FiveM, la fel se ĂŽntĂ˘mplÄ Či ĂŽn cazul nostru. Orice tip de
reclamÄ adusÄ altor comunitÄČi pe acest server este interzisÄ, atĂ˘t pe server cĂ˘t
Či pe forum sau discord !
(2)10. NU FACETI BUG ABUSE.
DacÄ gÄsiČi sau aveČi cunoČtinČÄ de unul sau mai multe bug-uri existente pe server,
anunČaČi de ĂŽndatÄ, fie direct pe server prin chatul OOC, fie pe Discord. Ăn niciun
caz nu este permisÄ abuzarea de eventualele bug-uri descoperite.
SANCTIUNI BUG ABUSE:
Prima abatere: Ban Permanent (CU DREPT DE PLATA) + CK (Character Kill)
A doua abatere: Ban Permanent (FARA DREPT DE PLATA)
(2)11. NU FOLOSITI HACK.
DacÄ sunteČi prinČi folosind ori ce fel de HACK la noi pe comunitate o sÄ fiČi
drastic sancČionaČi deoarece nu ĂŽncurajÄm Či nu dorim astfel de persoane la noi pe
comunitate.
SANCTIUNI HACK:
Prima abatere: Ban Permanent (CU DREPT DE PLATA) + CK (Character Kill) +
Interzicerea de a mai intra in POLITIE sau MAFIE!
A doua abatere: Ban Permanent (FARA DREPT DE PLATA)
ATENTIE!
Ne rezervam dreptul sa sanctionam persoane pentru hack pe baza unui video sau a mai
multor dovezi incriminatorii.
Ne rezervam dreptul sa sanctionam persoane pentru hack in cazul in care dorim sa
facem niste verificari si gasim urme sterse din PC sau pentru refuzul de
verificare.
(2)12. Afilierea unei comunitÄČi care ĂŽncalcÄ regulamentul FPlayT.
DacÄ sunteČi depistaČi fÄcĂ˘nd parte dintr-un grup ĂŽn care se ĂŽncalcÄ regulamentul
nostru ne rezervÄm dreptul de a sancČiona fiecare utilizator prezent ĂŽn acesta.
Cele mai uzuale sunt cele ĂŽn care se promoveazÄ diferite metode de ban evade,
tranzacČii OOC, hack-uri sau denigrÄri la adresa noastrÄ.
SANCČIUNEA ACORDATÄ:
La fiecare abatere: BAN PERMANENT cu DREPT de PLATÄ.
ATENTIE!
SancČionÄm toate persoanele prezente pe acestea, indiferent de implicarea voastrÄ
ĂŽn aceasta chiar Či dacÄ nu aČi interacČionat cu aceČtia vreodatÄ.
Pentru a preveni aceastÄ sancČiune: asiguraČi-vÄ cÄ pÄrÄsiČi orice server de
discord care ĂŽncalcÄ regulamentul Či raportaČi-l.

DacÄ aČi fost sancČionaČi o datÄ pentru ĂŽncÄlcarea acestei reguli, sunteČi
predispuČi la multiple sancČiuni similare ĂŽn cazul ĂŽn care continuaČi sÄ fiČi
prezenČi ĂŽn aceste comunitÄČi.
(2)13. FILMARE OBLIGATORIE IN TIMPUL BATAILOR.
DacÄ doriČi sÄ folosiČi arma de foc aveČi obligaČia sÄ aveČi filmarea completÄ de
la ĂŽnceputul acČiunii panÄ la final! AceastÄ regulÄ este pentru a diminua ticketele
Či reclamaČiile inutile ĂŽn care de cele mai multe ori se ajung la frustrÄri Či
certuri cand se poate rezolva foarte usor orice fel de suspiciune pe baza filmarii.
SANCTIUNI ACORDATA:
La fiecare abatere: BAN 30 DE ZILE fara DREPT de PLATÄ.
ATENTIE!
Pentru cei care au PC-uri mai slabe puteČi face un live pe YOUTUBE pe nelistat ĂŽn
timpul ĂŽn care vÄ jucaČi cu in bitrate mic 720p. ( DacÄ nici aČa nu se poate atunci
vÄ puteČi cauta un alt tip de activitate. )
(2)14. NU INTERPRETATI REGULAMENTUL.
Interpretarea regulilor din regulamentul server-ului este strict interzisÄ. Nu
puteČi interpreta dupÄ bunul plac aceste reguli, doar pentru a vÄ favoriza ĂŽn
momentul ĂŽn care sunteČi pus ĂŽn faČa unei situaČii neplÄcute ĂŽn care aČi ĂŽncÄlcat
una dintre reguli. Chiar dacÄ anumite reguli lasÄ loc de interpretare, staff-ul
server-ului sunt cei care decid ĂŽn ce condiČii se vor aplica sancČiunile.
(2)15. TRANZACTII OOC.
Persoanele care VAND sau CUMPARA bunuri sau bani IC pe sume de bani OOC sunt aspru
sanctionati!
SANCTIUNE TRANZACTII OOC:
Ban Permanent (FARA DREPT DE PLATA)
(2)16. AMENINTARI.
Pretinderea cÄ deČineČi funcČii, cÄ aveČi relaČii cu membrii din staff-ul serverului sau ameninČÄri cu intervenČia membrilor staff-ului sunt strict interzise.
(2)17. INSTIGAREA.
Instigarea altor persoane la ĂŽncÄlcarea oricÄrei reguli din regulamentul va fi
pedepsitÄ cu sancČiunea corespunzÄtoare regulii la care s-a instigat.
(2)18. NUME IN-CHARACTER (IC) INTERZISE.
Nume celebre. (Numele unei persoane cunoscute ĂŽn ĂŽntreaga lume, o anumitÄ culturÄ
sau doar o ČarÄ)
Nume nerealiste.
Fund etc.)
Nume puse pentru a stĂ˘rni amuzamentul (Tom Beron, Al Qaeda, Iulia Gunoier, John
(2)19. NUME OUT-OF-CHARACTER (OOC) INTERZISE.
Nu aveti voie sa folositi nume OOC Vlad CSGOBAZAR.COM sau chesti de genul nu se
accepta reclama pe server prin nume sau alte metode!

(2)20. COMPORTAMENT CU FETELE.
Este STRICT INTERZIS sa aveti un comportament neadecvat cu fetele pe care nu le
cunoasteti sau nu ati avut nici o interactiune. ( Jigniri / Amenintari / Scarbos
etc )
Este PERMIS sa aveti un comportament urat cu o fata atunci cand va cunoasteti de o
perioada de timp sau daca incepe aceasta sa aiba un comporament urat fata de dvs.
Daca incepeti sa interactionati cu o fata, iar aceasta nu se simte confortabil cu
modul de comunicare abordat de dvs. si va roaga frumos sa o lasati in pace, sunteti
OBLIGAT sa incheiati discutia intr-un mod civilizat, fara a-i aduce orice tip de
jignire, doar din simplul fapt ca aceasta nu doreste sa interactioneze cu dvs.
(2)21. CANCER
Aceasta regula a fost adaugata deoarece dorim sa ne rezervam drepturile sa ne
alegem ce jucatori merita sa joace pe aceasta comunitate.
Persoanele care sunt CANCER o sa primeasca BAN PERMANENT pe aceasta comunitate
FARA DREPT DE PLATA!
Ce inseamna sa fii o persoana CANCER?
Inseamna sa fii o persoana frustrata care instiga oamenii din jurul lui la URA sau
CERTURI OOC pe baza actiunilor desfasurate IC.
Inseamna sa fii o persoana care prin orice modalitate posibila le strica jocul
persoanelor care doresc sa se joace linistitti.
Inseamna sa fii genul ala de persoana care dupa o ACTIUNE IC incepi sa injuri /
jignesti persoane OOC pe Privat sau Stream-uri.
ATENTIE! Doar un ADMINISTRATOR+ poate lua decizia cu privinta la un jucator daca
este CANCER sau nu!
(2)22. BAN PERMANENT FARA DREPT DE PLATA
Persoanele care primesc sanctiunea de BAN PERMANENT FARA DREPT DE PLATA din
diferite motive ( HACK / BUG ABUZ / NERESPECTAREA REGULAMENTULUI etc ) trebuie sa
ia la cunostinta urmatoarele aspecte:
Nu oferim REFUND la FPT Coin-urile cumparate pe cont in nici o situatie! Inclusiv
persoanelor cu BAN PERMANENT cu drept care nu doresc sa isi plateasca sanctiunea!
Exista posibilitatea la anumite persoane dupa o perioada de timp in functie de
Comportament / Sanctiune sa ii fie acordat dreptul la plata pentru ban-ul
permanent!
Asa cum este specificat si la inceputul REGULAMENTULUI ne REZERVAM DREPTUL sa
selectam jucatorii care sa joace pe Comunitatea FPlayT. Persoanele care sunt TOXICE
/ CANCER etc sau persoanele pe care le consideram INAPTE pentru a face un minim de
Roleplay nu au ce cauta pe aceasta Comunitate!
CAP. 3. Regulament General
(3)01. BOMBARDIER
Bombarideri sunt considerate persoanele care se incadreaza in situatiile de mai

jos. Este STRICT INTERZIS sa faceti acest tip de actiuni si nu sunt deloc bine
primiti acesti oameni, iar sanctiunile sunt unele foarte mari.
Este STRICT INTERZIS sa omori o persoana direct.
INFORMATII: Este atunci cand omori o persoana fara sa interactionezi cumva intr-o
maniera roleplay.
EXEMPLU (1) : Vezi un "inamic/persoana" care te-a deranjat intr-un anumit fel,
cobori la el si il impusti direct.
EXEMPLU (2) :Vezi un "inamic/persoana" care se ia de prietenul tau si il impusti
direct.
Este STRICT INTERZIS sa agresezi verbal o persoana direct.
INFORMATII: Este atunci cand incepi sa injuri random o persoana pe care nu o
cunosti si nu ti-a facut nimic.
EXEMPLU (1) : Vezi o persoana care vine la tine si incerca sa poarte o discutie,
iar tu incepi sa il injuri si sa il injosesti fara nici un fel de motiv.
EXEMPLU (2) : Vezi un spalator de geamuri si incepi sa il injuri si sa il jignesti
fara nici un motiv.
Este STRICT INTERZIS sa cauti scandal cu oamenii cu care nu ai interactionat
niciodata.
INFORMATII: Este atunci cand cauti sa te certi cu persoane, sau instigi persoanele
de langa tine la cearta fara nici un motiv.
EXEMPLU (1) : Vezi o persoana care sta linistit la semafor, iar intrii intentionat
in el ca sa cauti sa te certi cu el.
EXEMPLU (2) : Vezi o persoana pe care nu o cunosti si incepi sa cauti motive de
cearta cu persoana respectiva.
(3)02. JOBURI LEGALE.
Este INTERZIS sa jefuiesti in timpul in care iti faci jobul sau esti cu masina de
job.
Este INTERZIS sa rapesti in timpul in care iti faci jobul sau esti cu masina de
job.
Este INTERZIS sa faci joburile cu masina personala. ( Referinta la joburile unde
exista o masina de job. )
Este INTERZIS sa faci joburile fara uniforma. ( Referinta la joburile unde exista o
uniforma la job. )
Este INTERZIS sa folosesti masina de job in scopuri personale.
Este INTERZIS sa ai un comportament indecent in timpul in care iti faci jobul.
( EXPLICATIE: In realitate nu ai risca sa iti pierzi locul de munca pentru un
comportament indecent. )
(3)03. REGULAMENT ACHIZITIE CAMION / REMORCI
Aveti obligatia sa respectati urmatoarele reguli de mai jos:
Este STRICT INTERZIS sa bagati in remorcile de job ( Remorca de Lemne / Remorca de

Minereu / Remorca de Combustibil ) alte obiecte inafara de obiectele pentru care au
fost facute remorcile respective.
Este PERMIS sa bagati in Remorca cu Prelata ori ce fel de obiect doriti indiferent
daca e legal sau ilegal, inclusiv Minereu / Lemne / Combustibil.
Este PERMIS sa bagati in capul tractor ori ce fel de obiect doriti indiferent daca
va aflati cu o remorca de job.
(3)04. OSTATIC
Aceasta regula a fost adaugata deoarece se face un abuz cand vine vorba de ostatic
si se exagereaza foarte mult.
Este INTERZIS sa luati ostatic o persoana random fara sa existe un motiv bine
intemeiat.
Este INTERZIS sa tineti pe cineva ostatic fara sa cereti ceva pe el mai mult de 2
ore. In cazul in care nu aveti cu cine sa vorbiti pentru o intelegere aveti dreptul
sa tineti ostaticul pana va raspunde cineva.
Este INTERZIS sa cereti pe un ostatic o suma mai mare de 200.000$ in bani sau
bunuri. ( In cazul in care se alege sa nu accepte oferta aveti dreptul sa ii dati
CK [Character-Kill] ostaticului doar daca este membru de Organizatie. Daca este
civil/sageata aveti dreptul sa ii dati PK [Player-Kill]. )
Este INTERZIS sa aveti pretentii mari precum pe baza la un ostatic ca un lider sau
o intreaga organizatie sa se prezinte fortat intr-o anumita locatie.
Este OBLIGATORIU ca dupa o intelegere/negociere pe baza ostaticului sa va tineti de
cuvant si sa nu fie o inselaciune la mijloc. Este valabil de ambele parti
implicate.
Este INTERZIS sa aveti pretentii mari din partea Politiei precum sa plece toate
echipajele, sa lase armele sau sa cereti eliberarea suspectilor din custodie daca
acestia au fost deja luati de la locul faptei. Adica fara exagerari foarte mari.
( ATENTIE: In cazul in care cereti o masina sa puteti fugii sau o cale de scapare
Politia are obligatia sa se tina de cuvant si sa nu traga fix in momentul in care
ostaticul este lasat. Politia in acel moment se pregateste de urmarire. )
Este INTERZIS la jafuri de Banca / Bijuterie sa aveti ostatic.
In cazul in care persoana respectiva o luati OSTATIC si nu gasiti o varianta de
rascuparare aveti DREPTUL sa il puneti sa munceasca pe insula Cayo MAXIM 1 ORA.
Dupa care aveti OBLIGATIA sa il eliberati!
(3)05. RAPIRI
Este INTERZIS sa rapesti o persoana SINGUR in timp ce conduci o masina.
( EXPLICATIE: Este considerat FAIL deoarece singur nu ai cum sa fii atent la
persoana pe care ai rapito, sa mai tii si arma, sa mai si conduci. Asa ca pentru a
putea rapii o persoana cu o masina este necesar minim 2 persoane. )
Este INTERZIS sa rapesti o persoana si sa ceri RASCUMPARARE pe acea persoana de la
Politie.
(3)06. ACTIUNI TERORISTE

Este interzis sÄ faci roleplay de acest gen.Trebuie sÄ discuČi despre fiecare
detaliu cu un membru staff Či fiecare lucru pe care vrei sa-l faci in acČiunea
respectivÄ. De asemenea in cazul in care vi se ofera permisiunea un membru staff va
urmÄri toatÄ acČiunea roleplay care urmeazÄ a fi efectuatÄ.
(3)07. EVENIMENTE ORGANIZATE
Orice adunare unde se strĂ˘nge o masÄ de oameni (petrecere, protest, conferinČÄ de
presÄ, car meeting, competiČie, etc) este consideratÄ un eveniment, iar deranjarea
lui sau influenČarea lui negativÄ va fi interzisÄ. Pentru a putea realiza o acČiune
ce are ca scop deranjarea acestui eveniment va fi nevoie de permisiunea unui
Administrator de Joc.
(3)08. CONDUS NON-ROLEPLAY
Sunt cateva subiecte mai delicate care intra in aceasta categorie unde jucatorii
nostri nu au inteles.
OFF-ROAD:
Este STRICT INTERZIS sa mergeti cu masini cu garda joasa pe drumuri forestiere sau
drumuri care nu sunt asfaltate. ( Facem referinta la masinile foarte lasate din
suspensie sau masinile din fabrica care vin foarte lasate. ) Mai pe intelesul
tuturor imaginati-va garda unui Logan, cat timp garda masinii pe care o conduceti
este apropiata de garda unui Logan este permis.
Este STRICT INTERZIS sa mergeti pe aceste drumuri cu o viteza mai mare de
40-60KM/h, iar in cazul in care sunteti urmariti sau viata voastra este pusa in
pericol aveti dreptul sa mergeti maxim cu viteza de 80-100KM/h.
OFF-ROAD EXTREM:
Este STRICT INTERZIS sa urcati cu masinile sau motociclete pe munti sau drumuri
care nu sunt marcate cu exceptia vehiculelor care sunt destinate pentru un astfel
de drum. ( Exemple: Jeep Wrangler, Jeep Rubicon, Ford Raptor, SFX450, TMF450 etc )
Dar ATENTIE, daca vehiculele nu sunt echipate cu cauciucuri OFF-ROAD nu au ce cauta
pe aceste trasee.
Este STRICT INTERZIS sa mergeti pe aceste tipuri de trasee cu o viteza mai mare de
40-60KM/h indiferent de situatie.
ACCIDENTE:
Este STRICT INTERZIS sa intrii frontal intr-un alt autovehicul intentionat doar
pentru a il oprii indiferent ca aveti un Camion sau ori ce alt tip de vehicul
masiv.
Este STRICT INTERZIS sa intrii intentionat intr-un vehicul oprit.
ELICOPTERE:
Este STRICT INTERZIS sa aterizati cu un elicopter pe insule.
Este STRICT INTERZIS sa atreizati cu un elicopter pe strazi. ( Cu exceptia
elicopterelor de SMURD si Politie. )
Este STRICT INTERZIS sa aterizati cu un elicopter pe blocurile din LOS SANTOS cu

exceptia unde exista un HELIPAD.
Este STRICT INTERZIS sa aterizati cu un elicopter pe case indiferent de zona.
(3)09. PIT-STOP
Este INTERZIS sa faceti manevra PIT-STOP la o viteza mai mare de 150km/h deoarece
intr-o situatie roleplay daca faceti aceasta manevra in realitate ar fii sanse
extrem de mari ca persoana respectiva sa moara.
Este INTERZIS sa faceti manevra PIT-STOP cu anumite clase de masini exceptand
masinile de la CLASA C / CLASA B / CLASA LOWRIDER / Masini Mafie, deoarece in
realitate nimeni nu si-ar strica masina de sute de mii de euro doar ca sa il
opreasca pe unu.
INFORMATII: Pit-Stop pe intelesul tuturor este acea manevra de oprire a masinii
prin intrarea in lateral sau in spatele masinii pe care vreti sa o opriti.
(3)10. TRANSPORT DETINUTI
Pentru a intervenii la un transport de detinuti trebuie sa tineti cont de
urmatoarele criterii.
Doar membrii "organizatiei" au dreptul sa intervina, insa doar pentru membri lor.
Adica nu aveti dreptul sa interveniti la un astfel de transport daca nu aveti
membrii in transportul respectiv.
Aveti dreptul sa interveniti doar daca in transport se afla LIDERUL sau minim 4
MEMBRI din "organizatia" din care faceti parte.
Aveti timp 5 minute sa eliberati zona din momentul in care atacul asupra
Transportului a inceput. In cazul in care nu eliberati zona aveti sansa ca armata
sa intervina in aceasta actiune.
(3)11. AFK / REFUZ ROLEPLAY
Refuzul unei acČiuni roleplay reprezintÄ refuzul unui jucÄtor de a face roleplay cu
alČi jucÄtori, ĂŽngreunĂ˘nd astfel acČiunile roleplay ale acestora, prin pÄrÄsirea
jocului (/quit, crash sau trecerea jocului ĂŽn barÄ - AFK). De asemenea este
interzis sÄ treceČi jocul ĂŽn barÄ.
Este interzis sÄ staČi AFK mai mult de cinci minute ĂŽn timp ce sunteČi ON DUTY ca
Politist / Medic (se poate considera cÄ staČi AFK pentru payday Či puteČi fi
sancČionaČi ca atare). TotodatÄ, este interzis sÄ staČi AFK ĂŽntr-o zonÄ publicÄ
mai mult de 2 minute.
DacÄ un jucÄtor este AFK, nu aveČi voie sÄ interacČionaČi cu el ĂŽn niciun fel;
aceastÄ regulÄ se aplicÄ doar dacÄ jucÄtorul a fost AFK ĂŽnainte sÄ ĂŽncepeČi o
anumitÄ acČiune cu el; dacÄ jucÄtorul respectiv s-a pus AFK ĂŽn timpul acČiunii,
atunci acesta poate fi reclamat (roleplay-ul nu va fi continuat).
De asemenea, este interzis orice fel de program anti-afk, blocarea tastelor sau
orice altÄ metodÄ pentru a nu lua kick de la sistemul de ANTI-AFK.
(3)12. COMA
In momentul in care esti in coma trebuie sa respecti urmatoarele reguli:

Este STRICT INTERZIS sa vorbesti in timp ce esti in COMA.
Este STRICT INTERZIS sa vorbesti pe statie in timp ce esti in COMA.
Este STRICT INTERZIS sa trimiti mesaje sau sa suni pe cineva cand esti in COMA.
Este PERMIS sa chemi medicul singur cu conditia daca ai intrat in COMA din cauza
unui accident.
(3)13. SLEEP ( /SLEEP )
In momentul in care doriti sa va puneti characterul sa doarma ( /sleep ) trebuie sa
respectati urmatoarele reguli.
Este STRICT INTERZIS sa folositi comanda /sleep daca nu va aflati pe un pat /
canapea.
Este STRICT INTERZIS sa folositi comanda /sleep in alta parte inafara de locuinta /
puscarie.
Este PERMIS sa va puneti characterul sa doarma in puscarie.
Este PERMIS sa va puneti characterul sa doarma in casa / apartament.
(3)14. LIVE-STREAM
Aceasta regula este dedicata persoanelor care fac Video-uri / Stream-uri la noi pe
comunitate!
Persoanele care fac VIDEO-uri / STREAM-uri la noi pe comunitate au obligatia sa isi
ASUME faptul ca sunt mult mai predispusi la incalcarea regulamentului, asta
insemnand ca trebuie sa fie mult mai atenti. Faptul ca voi doriti sa faceti VIDEOuri / STREAM-uri la noi pe comunitate este decizia voastra si nu va obliga nimeni
sa o faceti!
Persoanele care fac VIDEO-uri / STREAM-uri la noi pe comunitate le este STRICT
INTERZIS sa denigreze imaginea comunitatii indiferent daca trec prin niste fail-uri
sau anumite abuzuri din partea unor jucatori sau membri STAFF. Aceste lucruri se
discuta OFF-STREAM pentru rezolvarea problemelor, deoarece exista posibilitatea sa
fie doar o neintelegere care se poate rezolva amiabil.
Persoanele care fac VIDEO-uri / STREAM-uri la noi pe comunitate le este INTERZIS sa
instige la ura persoanele care vizioneaza.
EXEMPLU: Tu ca streamer ti se pare ca persoana X sau organizatia Y a incalcat o
regula din regulament si incepi sa il jignesti / injuri si faci tot odata si
persoanele care vizioneaza sa il jigneasca / injure etc.
Persoanele care fac VIDEO-uri / STREAM-uri la noi pe comunitate au obligatia sa
PUNA VIDEO-UL / LIVE-UL PE MUTE atunci cand este un TICKET OOC CU STAFF-UL in
desfasurare! Indiferent daca este pe DISCORD sau pe SERVER!
EXPLICATIE: Majoritatea persoanelor de pe LIVE nu inteleg sau nu joaca la noi pe
comunitate, iar in cazul in care se incalca regulamentul persoanele de pe chat
incep sa fie usor CANCER si se ajunge la un HATE inutil. Multe persoane o fac
intentionat doar pentru a face STREAM-erul sa se enerveze si sa se porneasca un
scandal!

ATENTIE! In cazul in care nu puteti respecta cele 4 cerinte scrise mai sus, ne
rezervam dreptul de a va INTERZICE sa mai faceti VIDEO-uri / STREAM-uri la noi pe
comunitate. Daca dupa ce primiti INTERDICTIE de a mai face VIDEO-uri / STREAM-uri
la noi pe comunitate continuati sa mai faceti o sa primiti BAN PERMANENT!
(3)15. JAFURI PERSOANE
Aceasta regula a fost adaugata pentru cei care doresc sa JEFUIASCA PERSOANE.
-----------------------------------------------------------------------[1] Aveti drept de a jefuii doar dupa ce treceti de pragul de 100 ore pe Character.
ATENTIE: Sa nu confundati orele de pe Character cu cele de pe Cont.
EXPLICATIE: Aceasta regula a fost facuta deoarece dorim ca jucatorii noi care intra
pe comunitatea noastra sa aiba timp sa invete si sa se acomodeze cu modul nostru de
joc.
-----------------------------------------------------------------------[2] Aveti voie sa jefuiti doar seara incepand de la 20:00 - 08:00, de la 08:01 19:59 NU AVETI VOIE SA JEFUITI NICI O PERSOANA.
ATENTIE: PE CAYO PERICO NU AVETI VOIE SA JEFUITI IN INTERVALUL 12:00 - 18:00! AVETI
VOIE SA JEFUITI DOAR IN INTERVALUL 18:01 - 11:59!
EXPLICATIE: Aceasta regula a fost facuta din cateva motive simple, in realitate
cazurile de jaf pe timp de zii sunt foarte scazute, iar prin aceasta regula dorim
ca jucatorii sa mai faca si alte lucruri inafara de a jefuii. Adica mai pe scurt sa
se mai faca si alte tipuri de roleplay.
-----------------------------------------------------------------------[3] Nu aveti voie sa jefuiti o persoana in zone publice! [ Banca / Magazin / Peco /
Bancomat ]
EXPLICATIE: Teoretic in realitate in aceste zone sunt camere de supraveghere, iar
prin acest lucru sunt extrem de putine persoane care si-ar asuma acest risc sa
jefuiasca o persoana.
Harta in afara orasului Los Santos unde vi se permite sa jefuiti o persoana:
Verde = Zona unde NU AVETI VOIE sa jefuiti.
Rosu = Zona unde AVETI VOIE sa jefuiti.
Harta_RF_8k.png?ex=662527fd&is=6612b2fd&
-----------------------------------------------------------------------[4] Nu aveti voie sa jefuiti persoanele care fac un job legal si sunt prinsi la
locul de munca, adica ori cu masina de job ori in locul in care trebuie sa faca
jobul respectiv. In atata timp cat aceste persoane sunt in afara jobului aceasta
regula nu se aplica!
EXPLICATIE: Aceasta regula a fost facuta dintr-un motiv foarte simplu, dorim ca
persoanele care incearca sa mearga pe o cale legala sa nu fie jefuita din 5 in 5
minute si sa fie practic obligati sa treaga pe o parte ilegala pentru a se putea
juca cat de cat linistiti. In plus nu este roleplay sa jefuiesti acele persoanele

care lucreaza la joburile mentionate mai sus, deoarece sunt extrem de rare cazurile
in care acele persoane ar putea fii jefuite.
-----------------------------------------------------------------------[5] Nu aveti voie sa jefuiti Politisti / Medici ( Nu se aplica regula daca
Politistii / Medicii sunt OFF-DUTY, adica fara masina de serviciu si uniforma. )
EXPLICATIE: In realitate cazurile in care un Politist sau Medic sa fie jefuiti
sunt extrem de rare, iar nimeni nu si-ar asuma acest risc fiind intreg la cap, dar
daca acestia sunt OFF-Duty aveti dreptul sa ii jefuiti.
-----------------------------------------------------------------------[6] Nu mai aveti voie sa jefuiti aceeasi persoana timp de 3 ORE!
ATENTIE: ACEASTA REGULA NU SE APLICA PE INSULA CAYO PERICO!
EXPLICATIE: Aceasta regula a fost facuta deoarece este destul de frustrant sa fii
jefuit de aceeasi persoana de mai multe ori intr-un timp scurt, iar prin aceasta
regula incercam sa evitam certurile intre playeri cum ca o persoana vaneaza o
anumita persoana doar sa o jefuiasca.
-----------------------------------------------------------------------[7] Nu aveti voie sa fortati o persoana sa scoata banii din banca pentru a il
jefuii.
EXPLICATIE: Aceasta regula a fost facuta deoarece intervine si regula de mai sus [
2 ], prin care va este interzis sa jefuiti o persoana la banca sau bancomat.
-----------------------------------------------------------------------[8] Aveti dreptul sa jefuiti o persoana de absolut tot ce detine pe el si din
masina pe care o conduce, dar nu aveti voie sa il fortati sa scoata toate masinile
din garaj pentru a le jefuii.
EXPLICATIE: Aceasta regula a fost facuta deoarece in realitate poti fura tot ce
are pe el si in masina pe care o conduce, dar nu ii poti spune sa aduca toate
masinile sa le jefuiesti deoarece acolo intervine Fail-RP.
-----------------------------------------------------------------------[9] Nu aveti voie sa omorati o persoana si sa o jefuiti sau invers sa jefuiti o
persoana, iar dupa sa o omorati. Daca in momentul in care voi amenintati persoana
respectiva sa va dea lucrurile pe care le doriti si acesta refuza sa vi dea puteti
sa ii omorati si sa faceti roleplay ca furati banii de la el. ( Daca nici asa nu va
ofera bunurile chemati un admin sau faceti o reclamatie pe discord. )
EXPLICATIE: Aceasta regula a fost facuta deoarece prin regulament se interzice Rob
& Kill. Ideea acestei regule este ca in realitate cazurile in care o persoana este
jefuita, iar apoi omorata sunt extrem de rare. In general lumea fura ceva si fuge.
-----------------------------------------------------------------------[10] Un membru al mafiei are dreptul sa jefuiasca indiferent de ora la locatiile
ilegale detinute doar obiectele pe care le procura persoana respectiva la locatie
doar in cazul in care persoana pe care o jefuieste refuza sa plateasca taxa de

protectie la locatia respectiva. Daca plateste taxa nu mai are dreptul sa il
jefuiasca!
EXPLICATIE: Aceasta regula a fost facuta deoarece multe persoane profitau de
regula [ 1 ], iar in cazul in care erau prinsi refuzau sa plateasca taxa si plecau
de la locatie cu obiectele ilegale deja procurate.
(3)16. ORGANIZATII IN-CHARACTER (IC)
Aceasta regula este destinata persoanelor care doresc sa isi infiinteze o
organizatie In-Character (IC) la noi pe comunitate.
INFORMATII: Dupa cum bine stiti la noi pe comunitate exista "Organizatie Oficiala"
care au mai multe beneficii si "Organizatie Non-Oficiala" unde au mai putine
beneficii. Termentul de "Organizatie IC" a fost dobandit mai recent si ne folosim
de acest lucru pentru persoanele care doresc sa avanseze mai departe. Prin acest
mod vedem devotamentul si munca depusa in timp, iar in momentul in care cererile
pentru Organizatii sunt deschise aceste "Organizatii IC" au mai multe sanse sa
mearga mai departe.
-----------------------------------------------------------------------Ce inseamna sa fii o "Organizatie In-Character(IC)"?
Inseamna ca reusesti sa strangi un grup de persoane cu care incepi sa faci diferite
afaceri prin oras. Afaceri legale si ilegale.
Inseamna ca reusesti sa cunosti oameni importanti din oras cu care sa faci afaceri
mai importante.
Inseamna ca trebuie sa iti castigi respectul in fata oamenilor si sa stiti cand
trebuie sa lasati capul jos.
Inseamna ca trebuie sa luati in considerare ca porniti de jos si nu este nimic
usor, asta inseamna ca e nevoie de timp ca sa avansati.
-----------------------------------------------------------------------Cum deveniti o "Organizatie Non-Oficiala"?
Numarul de locuri este unul limitat. Sunt in total 8 Organizatii Oficiale si 8
Organizatii Non-Oficiale. In functie de cum se elibereaza locurile atunci se si
deschid cererile pentru Organizatie Non-Oficiala.
Cererile pentru Organizatie Non-Oficiala se fac pe discordul comunitatii FPlayT.
Aveti un model pe care trebuie sa il completati si sunt si anumite cerinte de care
trebuie sa tineti cont.
Cererile se accepta in functie de vechimea organizatiei, activitate, devotament
plus multe alte criterii.
-----------------------------------------------------------------------REGULAMENT ORGANIZATII IN-CHARACTER (IC)
Aveti dreptul sa va creati propiul server de discord unde aveti voie ca singurele
camere In-Character(IC) sa fie CV-urile pentru Angajati / Pontaje / Anunturi /
Demisii / Cereri de inactivitate / Uniforme / Regulament/ Angajati.
Aveti dreptul sa va faceti ce camere text considerati voi OOC, dar in cazul in care

sunteti prinsi ca vorbiti chestii IC pe acele camere o sa fiti sanctionati!
Este STRICT INTERZIS sa aveti camere VOICE pe acel server de discord.
In cazul in care Organizatia pe care o detineti face multe probleme prin care
incalca Regulamentul Server-ului FPLAYT exista mari sanse sa vi se interzica sa mai
continuati cu acea Organizatie


Aici pune textul regulamentului tău.
Botul va folosi acest text ca referință pentru a răspunde corect.
`;

// --- Client Discord ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// --- OpenAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Slash Command /openai ---
const commands = [
  { name: "openai", description: "Pornește o conversație cu AI" }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log("✔ Comanda /openai înregistrată!");
  } catch (err) {
    console.error("❌ Eroare la înregistrarea comenzii:", err);
  }
}
deployCommands();

// --- Handle slash command ---
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "openai") {
    await interaction.reply("🔵 **AI activat!** Trimite-mi mesajul tău sau o poză.");
  }
});

// --- Handle messages ---
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  let textFromImage = "";

  // Extrage text din imagine dacă există
  if (msg.attachments.size > 0) {
    const file = msg.attachments.first();
    const buffer = await fetch(file.url).then(res => res.arrayBuffer());
    try {
      const { data: { text } } = await Tesseract.recognize(Buffer.from(buffer), "eng");
      textFromImage = text;
    } catch (err) {
      console.error("❌ Eroare OCR:", err);
      await msg.reply("❌ Nu am putut procesa imaginea.");
      return;
    }
  }

  // Combină regulamentul + mesajul user + text imagine
  const combinedText = `${regulamentText}\n\nMesaj utilizator: ${msg.content}\n\nText imagine: ${textFromImage}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ești un asistent inteligent pe Discord. Folosește regulamentul și textul primit pentru a răspunde corect." },
        { role: "user", content: combinedText }
      ]
    });

    await msg.reply(response.choices[0].message.content);

  } catch (e) {
    console.error("❌ Eroare OpenAI:", e);
    await msg.reply("❌ A apărut o eroare la procesarea cererii.");
  }
});

// --- Login Discord ---
client.login(process.env.DISCORD_TOKEN);
