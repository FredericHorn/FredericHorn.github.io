export const politicsDimensionsText = {
  en: {
    heroEyebrow: 'SVD & PCA · an interactive essay',
    heroTitleLine1: 'How many dimensions',
    heroTitleLine2: 'does politics have?',
    heroSubtitle:
      "How many questions do you need to ask someone to pinpoint their party preference? And which ones? The usual picture shows two axis, but are they optimal?",
    heroBegin: 'begin',
    heroSkip: 'skip to results',

    s01Eyebrow: 'where the map came from',
    s01Title: 'One axis is history. The second is a patch job.',
    s01P1:
      "In France's first National Assembly in 1789, delegates who wanted to keep the monarchy sat on the right of the assembly's president; delegates who wanted to overturn it sat on the left. That conflict gave its name to the most important distinction between political camps. A centuries-old divide runs between economically \"right-wing\" and \"left-wing\" politics.",
    s01P2a:
      "But a large share of political disagreement doesn't fit on that one line. Questions about immigration, national identity, or law and order don't reduce to taxes and redistribution. Political scientists patched the gap with a second axis, ",
    s01P2b: 'GAL–TAN',
    s01P2c: ': ',
    s01P2d: 'Green–Alternative–Libertarian',
    s01P2e: ' at one pole, ',
    s01P2f: 'Traditional–Authoritarian–Nationalist',
    s01P2g:
      ' at the other. This second dimension acts as a catch-all for issues on which positions, however, often line up together.',
    s01P3:
      "Even so, Germany's actual party system isn't spread evenly across the plane spanned by these two axes. Below are the seven largest parties that stood in the 2025 Bundestag election, placed roughly by economic position and GAL–TAN stance; each blob's size is that party's share of the 2025 vote. What stands out is that nearly the entire mass of votes runs along a single diagonal. The two axes don't separate the parties optimally.",

    compassCaption1:
      'positions are approximate placements on economic left–right (x) and GAL–TAN (y) · blob size = share of the 2025 Bundestagswahl vote',
    compassCaption2:
      'rough estimates for illustration only — not derived from the Wahl-O-Mat data used elsewhere on this page',
    compassRight: 'right',
    compassLeft: 'left',

    s03Text1: 'To find the real axes, what it takes is a reliable ',
    s03Numbers: 'data foundation',

    s02Eyebrow: 'politics as points',
    s02Title: 'Every party becomes a row of numbers',
    s02P1a: "Germany's Wahl-O-Mat asks parties to answer dozens of theses with ",
    s02Agree: 'agree',
    s02P1b: ', ',
    s02Neutral: 'neutral',
    s02P1c: ', or ',
    s02Disagree: 'disagree',
    s02P1d:
      '. Encode those as +1, 0, −1 and each party turns into a row — a point in a space with one axis per thesis.',
    s02Caption: 'Wahl-O-Mat 2025 · {parties} parties × {theses} theses · hover a column for the thesis · Datensatz © bpb',
    deepDiveObject: 'the object formally',
    deepDiveObjectBody1:
      'We have a matrix ',
    deepDiveObjectBody2: ' with ',
    deepDiveObjectBody3: ' parties (rows) and ',
    deepDiveObjectBody4: ' theses (columns), entries in ',
    deepDiveObjectBody5: '. Row ',
    deepDiveObjectBody6: ', written ',
    deepDiveObjectBody7: ", is party ",
    deepDiveObjectBody8: "'s position vector; the whole dataset can be viewed as a cloud of ",
    deepDiveObjectBody9: ' points in ',
    deepDiveObjectBody10: '. Everything that follows is a statement about the shape of that cloud.',

    s03bEyebrow: 'counting the dimensions',
    s03bTitle: 'How many dimensions does a space of opinions have?',
    s03bP1:
      'In mathematics, the dimension of a space is the largest number of directions you can move in independently — none of them just a mixture of the others. For example, the plane is two dimesional, because one has the independent x and y directions but every possible third direction would just be a combination of those two.',
    s03bP2:
      "In politics, we want to see a dimension in much the same way — as something separate you can hold a view on. The Wahl-O-Mat gives every party 38 answers, so the space of positions starts out 38-dimensional. The question is how many of those 38 are really independent, and how many are asking about the same values, just phrased differently.",
    s03bCard1H: 'in mathematics',
    s03bCard1B: 'the largest number of linearly independent directions in a space.',
    s03bCard2H: 'in politics',
    s03bCard2B: 'the separate things a person can take a position on.',

    s04Eyebrow: 'the core move',
    s04Title: 'Two questions that turn out to ask one',
    s04P1a: 'Take two theses that sound unrelated — ',
    s04Thesis1: '"All citizens should be required to be insured under statutory health insurance plans"',
    s04P1b: ' and ',
    s04Thesis2: '"Germany should resume using nuclear energy for electricity generation."',
    s04P1c:
      " Plot every party by its two answers and they don't fill the square; they fall along a diagonal, because a party that wants one usually wants the other too.",
    s04P2:
      "This is the pattern behind almost every real dataset: raw data is spread out over many directions, but those directions are rarely independent. They're correlated, dragging each other along. Correlation is exactly what lets you simplify. If knowing a party's stance on one thesis already tells you most of its stance on the other, you don't need two numbers to describe the party — one number, along the right diagonal, does almost as well.",
    s04P3:
      "Below is a little game. Grab the handle and rotate the axis by hand, trying to swing it onto the diagonal the cloud actually leans along. The bar chart score tells you how well you're doing. There's a second direction too, drawn faintly at a right angle to your axis: in this two-thesis picture, once the first axis is fixed, the second is forced — mathematically ",
    s04Orthogonal: 'orthogonal',
    s04P3b: ' to it, with no freedom left to search over.',
    s04P4:
      "With only two theses this is easy to see and easy to verify by eye. Our political data has 38 theses, 38 starting directions, and no picture to look at. To find the best axes, we have to compute.",

    sandboxLabel: 'VARIANCE CAPTURED',
    sandboxAxis1: 'axis 1',
    sandboxAxis2: 'axis 2',
    sandboxAligned: '✓ aligned with PC1',
    sandboxSnap: 'snap to best (PCA)',
    sandboxHint:
      "Drag the handle and try to maximize the spread along axis 1. The faint perpendicular line is axis 2: it's orthogonal to your choice by construction, so there's nothing to aim there, only what's left over.",

    deepDiveRotate: 'rotate · stretch · rotate = UΣVᵀ',

    s06Eyebrow: 'a technical note',
    s06Title: 'Before any of that, you have to center the data',
    s06P1:
      'There\'s a step hiding before "spread out the most" means anything: spread out relative to what? A cloud of points sitting far from the origin can look like it has a dominant direction simply because every point points the same way from zero — toward wherever the cloud happens to be, not along the shape the cloud actually has. Ask for the direction of greatest spread on raw, off-center data and you mostly just measure the offset.',
    s06P2:
      "The fix: move the cloud so it sits around its own middle first. For every thesis, take the average answer across all parties, and subtract that average from every answer. Each column now has mean zero.",
    s06P3a:
      'Once the data sits at zero, "spread out the most" finally means the right thing: variance around the center, not distance from an arbitrary reference point.',
    deepDiveCentering: 'centering, precisely',

    s07Eyebrow: 'the result',
    s07Title: 'The two-dimensional spectrum, drawn by the data',
    s07P1:
      "Now applying the singular value decomposition and keeping the two strongest singular directions, every party gets two coordinates. Plotted, they form a spectrum no one drew by hand. It's a combination of each party's 38 different positions.",
    s07P2:
      "What the axes mean is left to clarify in the next step. The theses that point in the corresponding directions give us an indicator. The parties in these directions tend to support these theses.",
    s07P3:
      "Instead of going by way of finding optimal directions, the SVD can also be pictured as a decomposition of the Wahl-O-Mat matrix into a sum of simple matrices, each carrying just one message. Simple here means they are weighted rank-1 matrices. Taking only the sum of the k matrices with the highest weight gets you very close to the original matrix, very quickly.",
    deepDiveRankK: 'best rank-k approximation',

    partyMapKeep1: 'keep 1 axis',
    partyMapKeep2: 'keep 2 axes',
    partyMapShowTheses: 'show thesis arrows',
    partyMapHideTheses: 'hide thesis arrows',
    partyMapAxis1: 'axis 1 →',
    partyMapAxis2: '↑ axis 2',
    s08Eyebrow: 'reading the axes',
    s08Title: 'What the two axes turn out to be',
    s08P1:
      'The axes fall out of arithmetic, but they are not meaningless. Sort the theses by how strongly they load on each one and you can venture an interpretation. The first appears to be the economic left–right spectrum we already expected.',
    s08P2:
      "The second is a surprise: it isn't the liberal-versus-authoritarian axis of the usual compass. After a long look at the theses it loads on, my best interpretation is a split between preservation and change — between continuing the existing political maxims and (sometimes radical) changes to them.",

    axisMeaningShowTop4: 'show top 4 only',
    axisMeaningShowAbove: 'show all above {threshold}',
    axis1Title: 'Economic left — right',
    axis1Subtitle: 'Over half of all the disagreement lives on this one line.',
    axis1PullLeft: 'pulls left',
    axis1PullRight: 'pulls right',
    axis1Note:
      'This is the axis everyone already knows — taxes, rents, transport, energy. The parties order themselves along it Linke · Grüne · SPD · BSW · FDP · CDU · AfD, with nobody told in advance what "left" means.',
    axis2Title: 'Preservation — change',
    axis2Subtitle: 'An establishment split: who backs the current order, who wants to break with it.',
    axis2Preservation: 'preservation',
    axis2Change: 'change',
    axis2Note:
      'The governing centre — CDU, FDP, SPD, Grüne — clusters on one side; AfD, BSW and the Left share the other. This second division separates parties that defend the status quo from those campaigning to upend it.',
    axisLabel: 'axis {n}',

    s09Eyebrow: 'how much fits in two',
    s09Title: 'Two axes hold about seventy-five percent',
    s09P1:
      'Each singular value says how much of the parties\' disagreement its axis accounts for. The first holds roughly half of it. The second brings the running total to about three-quarters. Everything after that adds only a few percent apiece. Two axes are not the whole of it, but they are most of what is there.',
    screePlotAxis1Alone: 'axis 1 alone =',
    screePlotAxes12: 'axes 1+2 =',
    screePlotOfDisagreement: 'of all disagreement',
    deepDiveStability: 'how stable is a rank-k cut',

    s10Eyebrow: 'the answer',
    s10Title: 'So how many dimensions does politics have?',
    s10P1:
      'Two. At least once you accept two conditions.',
    s10Card1H: 'You have to call about seventy-five percent "enough."',
    s10Card1B:
      'That is roughly what the first two axes recover. Insist on more and the count climbs; the remaining twenty-five percent is spread thinly across a dozen smaller directions.',
    s10Card2H: 'You have to take the Wahl-O-Mat as a stand-in for politics.',
    s10Card2B:
      'Thirty-eight statements chosen by an editorial team, answered by parties rather than by people.',
    s10P2:
      'Grant both and the answer is two. That is already a strong claim: for all its apparent noise, the space of German party positions is very nearly a plane.',

    s11Eyebrow: 'keeping honest',
    s11Title: "What the numbers don't tell you",
    s11Card1H: "The theses aren't neutral.",
    s11Card1B:
      'The Wahl-O-Mat keeps only statements where the parties actually differ and that are easy for many people to understand. That selection is built to maximise contrast, which sharpens the left–right axis and is part of why the structure looks so clean.',
    s11Card2H: 'The sign is arbitrary.',
    s11Card2B:
      'SVD has no notion of which end is "left." The orientation of each axis is a choice made by hand after the fact.',
    s11Card3H: 'Naming is interpretation.',
    s11Card3B:
      'The arithmetic hands you a direction. Calling it "left–right" or "preservation–change" is a reading we lay on top of it.',
    s11Card4H: 'Parties are not voters.',
    s11Card4B: 'This maps where the parties stand. People are messier and would cluster differently.',

    s12Eyebrow: 'the same move, everywhere',
    s12Title: 'Politics is just another table of numbers',
    s12P1:
      'The procedure that folded 38 political dimensions down to two is the same one behind image compression, recommendation systems, face recognition and climate analysis. Whenever a large table hides a few strong directions, SVD finds them, keeps the ones that matter and discards the rest. Politics was simply one table among many.',

    footerEyebrow: 'Data source & legal notice',
    footerBadge: 'The bpb is not the author of this analysis.',
    footerBadgeNot: 'not',
    footerP1a: 'This presentation is based on the dataset ',
    footerP1b: '"Wahl-O-Mat zur Bundestagswahl 2025"',
    footerP1c: ". The dataset's author is the ",
    footerP1d: 'Bundeszentrale für politische Bildung (bpb)',
    footerP1e: '.',
    footerP2:
      'This SVD/PCA analysis of party positions and its visualization were created independently for scientific and educational purposes. The bpb did not create, review, or authorize this analysis and is not its author.',
    footerAI:
      'The content of this analysis — the underlying math, the interpretation of the data, and the writing — is my own. I used AI assistance only for the technical implementation and for building the interactive visualizations.',
    footerP3a: 'This is not a Wahl-O-Mat and does not constitute voting advice. It does ',
    footerP3Not: 'not',
    footerP3b:
      " calculate or show any individual user's proximity to parties; the interactive compass is illustrative only and is not based on the dataset.",
    footerSource: 'Source:',
    footerNote:
      'A personal note: my thanks to the bpb for building the Wahl-O-Mat and making its data publicly available — work like this is what made this analysis possible. I was also part of the team that built the 2026 state Wahl-O-Mat for Sachsen-Anhalt, and it was a genuinely interesting and rewarding experience.',

    cellColorLegend: 'cell color = |reconstruction error|:',
    cellColorExact: 'exact',
    cellColorWayOff: 'way off',
    rankKHint:
      'Every cell is colored by how far the rank-{k} guess is from the party\'s true answer — {good} means the reconstruction nailed it, {bad} means it\'s badly wrong, regardless of whether the true answer was agree or disagree — chosen so the two ends stay distinct even under red–green color blindness. Drag {kItalic} from 0 to {maxK}: at k=0 every party is guessed as the average answer (mostly orange), and as k grows the grid visibly drains of orange until, at k={maxK}, it\'s entirely blue — an exact reconstruction. The error number above is read directly off the tail of the singular values, not recomputed from the grid — theorem and picture agree by construction, and shrink together.',

    centeringCentered: '✓ centered',
    centeringRaw: 'raw (uncentered)',
    centeringHint1:
      'Same seven parties, same first two axes. The teal ring — the origin — sits right in the middle of the cloud: distances from it now reflect the cloud\'s actual shape.',
    centeringHint2:
      'Same seven parties, same first two axes. The coral arrow is the offset centering removes — the mean position μ. Uncentered, "spread from the origin" mostly just measures that offset, not how the parties differ from each other.',
  },
  de: {
    heroEyebrow: 'SVD & PCA · ein interaktiver Essay',
    heroTitleLine1: 'Wie viele Dimensionen',
    heroTitleLine2: 'hat Politik?',
    heroSubtitle:
      'Wie viele Fragen muss man jemandem stellen, um dessen Parteipräferenz genau zu bestimmen? Und welche? Das übliche Modell zeigt zwei Achsen – aber sind diese auch optimal?',
    heroBegin: 'los geht\'s',
    heroSkip: 'zu den Ergebnissen',

    s01Eyebrow: 'woher die Karte kommt',
    s01Title: 'Eine Achse ist Geschichte. Die zweite ist ein Flickwerk.',
    s01P1:
      'Bei der ersten französischen Nationalversammlung 1789 saßen Abgeordnete, die die Monarchie erhalten wollten, rechts vom Präsidenten der französischen Nationalversammlung; Abgeordnete, die sie stürzen wollten, saßen links. Dieser Konflikt sollte namensgebend für die wichtigste Unterscheidung von politischen Lagern werden. Zwischen wirtschaftspolitisch "rechter" und "linker" Politik verläuft ein jahrhundertealter Graben.',
    s01P2a:
      'Doch ein großer Teil politischer Meinungsverschiedenheiten passt nicht auf diese eine Linie. Fragen zu Migration, nationaler Identität oder innerer Sicherheit lassen sich nicht auf Steuern und Umverteilung reduzieren. Politikwissenschaftler haben die Lücke mit einer zweiten Achse geflickt, ',
    s01P2b: 'GAL–TAN',
    s01P2c: ': ',
    s01P2d: 'Grün–Alternativ–Libertär',
    s01P2e: ' am einen Pol, ',
    s01P2f: 'Traditionell–Autoritär–Nationalistisch',
    s01P2g:
      ' am anderen. Diese zweite Dimension bildet ein Sammelbecken für Themen, zu denen die Positionen jedoch oft übereinstimmen.',
    s01P3:
      'Trotzdem verteilt sich Deutschlands tatsächliches Parteiensystem nicht gleichmäßig über die Ebene, die von diesen zwei Achsen aufgespannt wird. Unten sind die sieben größten Parteien, die 2025 zur Bundestagswahl antraten, grob nach wirtschaftlicher Position und GAL–TAN-Haltung platziert; die Größe jedes Blobs entspricht dem Stimmenanteil der Partei 2025. Auffällig ist, dass nahezu die gesamte Masse an Stimmen entlang einer Diagonale verläuft. Die beiden Achsen trennen die Parteien nicht optimal.',

    compassCaption1:
      'Positionen sind ungefähre Platzierungen auf wirtschaftlich links–rechts (x) und GAL–TAN (y) · Blobgröße = Anteil an der Bundestagswahl 2025',
    compassCaption2:
      'grobe Schätzungen nur zur Veranschaulichung — nicht aus den Wahl-O-Mat-Daten abgeleitet, die sonst auf dieser Seite verwendet werden',
    compassRight: 'rechts',
    compassLeft: 'links',

    s03Text1: 'Um die echten Achsen zu finden, braucht es eine verlässliche ',
    s03Numbers: 'Datengrundlage',

    s02Eyebrow: 'Politik als Punkte',
    s02Title: 'Jede Partei wird zu einer Zeile aus Zahlen',
    s02P1a: 'Deutschlands Wahl-O-Mat lässt Parteien Dutzende Thesen mit ',
    s02Agree: 'stimme zu',
    s02P1b: ', ',
    s02Neutral: 'neutral',
    s02P1c: ' oder ',
    s02Disagree: 'stimme nicht zu',
    s02P1d:
      ' beantworten. Kodiert man das als +1, 0, −1, wird jede Partei zu einer Zeile — ein Punkt in einem Raum mit einer Achse pro These.',
    s02Caption: 'Wahl-O-Mat 2025 · {parties} Parteien × {theses} Thesen · Spalte für These überfahren · Datensatz © bpb',
    deepDiveObject: 'das Objekt, formal',
    deepDiveObjectBody1: 'Wir haben eine Matrix ',
    deepDiveObjectBody2: ' mit ',
    deepDiveObjectBody3: ' Parteien (Zeilen) und ',
    deepDiveObjectBody4: ' Thesen (Spalten), Einträge in ',
    deepDiveObjectBody5: '. Zeile ',
    deepDiveObjectBody6: ', geschrieben ',
    deepDiveObjectBody7: ', ist der Positionsvektor von Partei ',
    deepDiveObjectBody8: '; der gesamte Datensatz lässt sich als Punktwolke von ',
    deepDiveObjectBody9: ' Punkten in ',
    deepDiveObjectBody10: ' auffassen. Alles Folgende ist eine Aussage über die Form dieser Wolke.',

    s03bEyebrow: 'Dimensionen zählen',
    s03bTitle: 'Wie viele Dimensionen hat ein Raum von Meinungen?',
    s03bP1:
      'In der Mathematik ist die Dimension eines Raums die größte Anzahl von Richtungen, in die man sich unabhängig voneinander bewegen kann — keine davon nur eine Mischung der anderen. Die Ebene ist zum Beispiel zweidimensional, weil es die unabhängigen x- und y-Richtungen gibt, jede mögliche dritte Richtung aber nur eine Kombination dieser beiden wäre.',
    s03bP2:
      'In der Politik wollen wir eine Dimension ganz ähnlich als etwas Eigenständiges sehen, zu dem man eine Meinung haben kann. Der Wahl-O-Mat gibt jeder Partei 38 Antworten, der Positionsraum startet also 38-dimensional. Die Frage ist, wie viele dieser 38 wirklich unabhängig sind und wie viele dieselben Wertevorstellungen abfragen, nur anders formuliert.',
    s03bCard1H: 'in der Mathematik',
    s03bCard1B: 'die größte Anzahl linear unabhängiger Richtungen in einem Raum.',
    s03bCard2H: 'in der Politik',
    s03bCard2B: 'die eigenständigen Dinge, zu denen jemand eine Position beziehen kann.',

    s04Eyebrow: 'der zentrale Kniff',
    s04Title: 'Zwei Fragen, die sich als eine entpuppen',
    s04P1a: 'Nimm zwei Thesen, die unabhängig klingen — ',
    s04Thesis1: '"Alle Bürger sollen zur gesetzlichen Krankenversicherung verpflichtet sein"',
    s04P1b: ' und ',
    s04Thesis2: '"Deutschland soll die Kernenergie zur Stromerzeugung wieder nutzen."',
    s04P1c:
      ' Trägt man jede Partei nach ihren beiden Antworten ein, füllen sie nicht das Quadrat; sie liegen auf einer Diagonalen, weil eine Partei, die das eine will, meist auch das andere will.',
    s04P2:
      'Das ist das Muster hinter fast jedem echten Datensatz: Rohdaten streuen über viele Richtungen, aber diese Richtungen sind selten unabhängig. Sie sind korreliert und ziehen sich gegenseitig mit. Korrelation ist genau das, was Vereinfachung erlaubt. Kennt man die Haltung einer Partei zu einer These, kennt man meist schon fast ihre Haltung zur anderen — man braucht keine zwei Zahlen, um die Partei zu beschreiben, eine Zahl entlang der richtigen Diagonale reicht fast aus.',
    s04P3:
      'Unten ist ein kleines Spiel. Fasse den Griff an und drehe die Achse von Hand, in dem Versuch, sie auf die Diagonale zu schwenken, entlang der die Wolke tatsächlich liegt. Der Balken zeigt, wie gut du bist. Es gibt auch eine zweite Richtung, blass im rechten Winkel zu deiner Achse gezeichnet: In diesem Zwei-Thesen-Bild ist die zweite Achse, sobald die erste feststeht, erzwungen — mathematisch ',
    s04Orthogonal: 'orthogonal',
    s04P3b: ' dazu, ohne Spielraum zum Suchen.',
    s04P4:
      'Mit nur zwei Thesen ist das leicht zu sehen und mit bloßem Auge zu prüfen. Unsere politischen Daten haben 38 Thesen, 38 Startrichtungen und kein Bild zum Hinsehen. Um die besten Achsen zu finden, müssen wir rechnen.',

    sandboxLabel: 'ERFASSTE VARIANZ',
    sandboxAxis1: 'Achse 1',
    sandboxAxis2: 'Achse 2',
    sandboxAligned: '✓ mit PC1 ausgerichtet',
    sandboxSnap: 'auf Optimum springen (PCA)',
    sandboxHint:
      'Zieh am Griff und versuche, die Streuung entlang Achse 1 zu maximieren. Die blasse Senkrechte ist Achse 2: Sie steht konstruktionsbedingt orthogonal zu deiner Wahl, dort gibt es also nichts anzuvisieren, nur das, was übrig bleibt.',

    deepDiveRotate: 'drehen · strecken · drehen = UΣVᵀ',

    s06Eyebrow: 'eine technische Bemerkung',
    s06Title: 'Davor muss man die Daten erst zentrieren',
    s06P1:
      'Bevor "am weitesten streuen" überhaupt etwas bedeutet, versteckt sich ein Schritt: gestreut relativ wozu? Eine Punktwolke weit vom Ursprung entfernt kann so aussehen, als hätte sie eine dominante Richtung, einfach weil jeder Punkt von null aus in dieselbe Richtung zeigt — dorthin, wo die Wolke zufällig liegt, nicht entlang der Form, die die Wolke tatsächlich hat. Fragt man auf rohen, unzentrierten Daten nach der Richtung größter Streuung, misst man meist nur diesen Versatz.',
    s06P2:
      'Die Lösung: Die Wolke zuerst um ihre eigene Mitte legen. Für jede These nimmt man die durchschnittliche Antwort über alle Parteien und zieht diesen Durchschnitt von jeder Antwort ab. Jede Spalte hat jetzt Mittelwert null.',
    s06P3a:
      'Sobald die Daten bei null liegen, bedeutet "am weitesten streuen" das Richtige: Varianz um das Zentrum, nicht Abstand von einem willkürlichen Bezugspunkt.',
    deepDiveCentering: 'Zentrierung, präzise',

    s07Eyebrow: 'das Ergebnis',
    s07Title: 'Das zweidimensionale Spektrum, von den Daten gezeichnet',
    s07P1:
      'Wendet man nun die Singulärwertzerlegung an und behält die zwei stärksten Singulärrichtungen, bekommt jede Partei zwei Koordinaten. Aufgetragen bilden sie ein Spektrum, das niemand von Hand gezeichnet hat. Es ist eine Kombination aus den je 38 verschiedenen Positionen der Parteien.',
    s07P2:
      'Was die Achsen bedeuten, gilt es im nächsten Schritt zu klären. Einen Indikator liefern uns die Thesen, die in die entsprechenden Richtungen zeigen. Die Parteien in diesen Richtungen unterstützen eher diese Thesen.',
    s07P3:
      'Statt über die Bestimmung optimaler Richtungen zu gehen, kann man sich die SVD auch als eine Zerlegung der Wahl-O-Mat-Matrix in eine Summe einfacher Matrizen vorstellen, die jeweils nur eine Botschaft enthalten. Einfach bedeutet dabei, dass es gewichtete Rang-1-Matrizen sind. Nimmt man nur die Summe der k Matrizen mit dem höchsten Gewicht, kommt man sehr schnell an die ursprüngliche Matrix heran.',
    deepDiveRankK: 'beste Rang-k-Approximation',

    partyMapKeep1: '1 Achse behalten',
    partyMapKeep2: '2 Achsen behalten',
    partyMapShowTheses: 'Thesenpfeile zeigen',
    partyMapHideTheses: 'Thesenpfeile verbergen',
    partyMapAxis1: 'Achse 1 →',
    partyMapAxis2: '↑ Achse 2',
    s08Eyebrow: 'die Achsen lesen',
    s08Title: 'Was die beiden Achsen tatsächlich sind',
    s08P1:
      'Die Achsen ergeben sich aus Arithmetik, sind aber nicht bedeutungslos. Sortiert man die Thesen danach, wie stark sie auf jede Achse laden, kann man eine Interpretation wagen. Die erste scheint das wirtschaftliche Links-Rechts-Spektrum zu sein, das wir schon erwarteten.',
    s08P2:
      'Die zweite ist eine Überraschung: Es ist nicht die liberal-gegen-autoritär-Achse des üblichen Kompasses. Nach langer Inspektion der zugeordneten Thesen ist meine beste Interpretation eine Spaltung zwischen Bewahrung und Wandel. Zwischen der Fortführung der bestehenden politischen Maximen und (teils radikalen) Änderungen.',

    axisMeaningShowTop4: 'nur Top 4 zeigen',
    axisMeaningShowAbove: 'alle über {threshold} zeigen',
    axis1Title: 'Wirtschaftlich links — rechts',
    axis1Subtitle: 'Über die Hälfte aller Meinungsverschiedenheiten liegt auf dieser einen Linie.',
    axis1PullLeft: 'zieht nach links',
    axis1PullRight: 'zieht nach rechts',
    axis1Note:
      'Das ist die Achse, die jeder schon kennt — Steuern, Mieten, Verkehr, Energie. Die Parteien ordnen sich entlang ihr Linke · Grüne · SPD · BSW · FDP · CDU · AfD, ohne dass vorab jemandem gesagt wurde, was "links" bedeutet.',
    axis2Title: 'Bewahrung — Wandel',
    axis2Subtitle: 'Eine Spaltung des Establishments: wer die bestehende Ordnung stützt, wer mit ihr brechen will.',
    axis2Preservation: 'Bewahrung',
    axis2Change: 'Wandel',
    axis2Note:
      'Die regierende Mitte — CDU, FDP, SPD, Grüne — bündelt sich auf einer Seite; AfD, BSW und die Linke teilen sich die andere. Diese zweite Trennung unterscheidet Parteien, die den Status quo verteidigen, von jenen, die für seinen Umsturz kämpfen.',
    axisLabel: 'Achse {n}',

    s09Eyebrow: 'wie viel in zwei passt',
    s09Title: 'Zwei Achsen fassen etwa fünfundsiebzig Prozent',
    s09P1:
      'Jeder Singulärwert sagt, wie viel der Meinungsverschiedenheit der Parteien seine Achse erklärt. Die erste trägt etwa die Hälfte davon. Die zweite bringt die Summe auf rund drei Viertel. Alles danach fügt nur noch wenige Prozent hinzu. Zwei Achsen sind nicht alles, aber sie sind das meiste davon.',
    screePlotAxis1Alone: 'Achse 1 allein =',
    screePlotAxes12: 'Achsen 1+2 =',
    screePlotOfDisagreement: 'aller Meinungsverschiedenheit',
    deepDiveStability: 'wie stabil ist ein Rang-k-Schnitt',

    s10Eyebrow: 'die Antwort',
    s10Title: 'Wie viele Dimensionen hat Politik also?',
    s10P1:
      'Zwei. Zumindest sobald man zwei Bedingungen akzeptiert.',
    s10Card1H: 'Man muss etwa fünfundsiebzig Prozent als "genug" gelten lassen.',
    s10Card1B:
      'Das ist ungefähr, was die ersten beiden Achsen einfangen. Verlangt man mehr, steigt die Zahl; die verbleibenden fünfundzwanzig Prozent verteilen sich dünn auf ein Dutzend kleinerer Richtungen.',
    s10Card2H: 'Man muss den Wahl-O-Mat als Stellvertreter für Politik akzeptieren.',
    s10Card2B:
      'Achtunddreißig Aussagen, gewählt von einem Redaktionsteam, beantwortet von Parteien statt von Menschen.',
    s10P2:
      'Gewährt man beides, lautet die Antwort zwei. Das ist bereits eine starke Aussage: Trotz allen scheinbaren Rauschens ist der Raum deutscher Parteipositionen fast eine Ebene.',

    s11Eyebrow: 'ehrlich bleiben',
    s11Title: 'Was die Zahlen nicht verraten',
    s11Card1H: 'Die Thesen sind nicht neutral.',
    s11Card1B:
      'Der Wahl-O-Mat behält nur Aussagen, bei denen sich die Parteien tatsächlich unterscheiden und die für viele Menschen leicht verständlich sind. Diese Auswahl ist auf maximalen Kontrast angelegt, was die Links-rechts-Achse schärft und mit erklärt, warum die Struktur so sauber aussieht.',
    s11Card2H: 'Das Vorzeichen ist willkürlich.',
    s11Card2B:
      'SVD hat keinen Begriff davon, welches Ende "links" ist. Die Ausrichtung jeder Achse ist eine nachträglich von Hand getroffene Wahl.',
    s11Card3H: 'Benennung ist Interpretation.',
    s11Card3B:
      'Die Arithmetik liefert eine Richtung. Sie "links–rechts" oder "Bewahrung–Wandel" zu nennen, ist eine Lesart, die wir darüberlegen.',
    s11Card4H: 'Parteien sind keine Wähler.',
    s11Card4B: 'Das bildet ab, wo die Parteien stehen. Menschen sind unordentlicher und würden anders clustern.',

    s12Eyebrow: 'derselbe Kniff, überall',
    s12Title: 'Politik ist nur eine Zahlentabelle von vielen',
    s12P1:
      'Das Verfahren, das 38 politische Dimensionen auf zwei gefaltet hat, steckt auch hinter Bildkompression, Empfehlungssystemen, Gesichtserkennung und Klimaanalyse. Wo immer eine große Tabelle ein paar starke Richtungen verbirgt, findet SVD sie, behält die wichtigen und verwirft den Rest. Politik war einfach eine Tabelle unter vielen.',

    footerEyebrow: 'Datenquelle & rechtlicher Hinweis',
    footerBadge: 'Die bpb ist nicht die Urheberin dieser Analyse.',
    footerBadgeNot: 'nicht',
    footerP1a: 'Diese Darstellung basiert auf dem Datensatz ',
    footerP1b: '"Wahl-O-Mat zur Bundestagswahl 2025"',
    footerP1c: '. Urheberin des Datensatzes ist die ',
    footerP1d: 'Bundeszentrale für politische Bildung (bpb)',
    footerP1e: '.',
    footerP2:
      'Diese SVD/PCA-Analyse der Parteipositionen und ihre Visualisierung wurden unabhängig zu wissenschaftlichen und Bildungszwecken erstellt. Die bpb hat diese Analyse weder erstellt noch geprüft oder autorisiert und ist nicht ihre Urheberin.',
    footerAI:
      'Der Inhalt dieser Analyse — die zugrundeliegende Mathematik, die Interpretation der Daten und der Text — stammt von mir selbst. KI-Unterstützung habe ich ausschließlich für die technische Umsetzung und die Erstellung der interaktiven Visualisierungen genutzt.',
    footerP3a: 'Dies ist kein Wahl-O-Mat und stellt keine Wahlempfehlung dar. Es werden ',
    footerP3Not: 'keine',
    footerP3b:
      ' individuellen Nähewerte von Nutzern zu Parteien berechnet oder angezeigt; der interaktive Kompass dient nur der Veranschaulichung und basiert nicht auf dem Datensatz.',
    footerSource: 'Quelle:',
    footerNote:
      'Eine persönliche Anmerkung: Mein Dank gilt der bpb für den Aufbau des Wahl-O-Mat und die öffentliche Bereitstellung ihrer Daten — Arbeit wie diese hat diese Analyse erst möglich gemacht. Ich war außerdem Teil des Teams, das den Landes-Wahl-O-Mat 2026 für Sachsen-Anhalt gebaut hat, und es war eine wirklich interessante und lohnende Erfahrung.',

    cellColorLegend: 'Zellfarbe = |Rekonstruktionsfehler|:',
    cellColorExact: 'exakt',
    cellColorWayOff: 'stark daneben',
    rankKHint:
      'Jede Zelle ist danach eingefärbt, wie weit die Rang-{k}-Schätzung von der wahren Antwort der Partei entfernt ist — {good} bedeutet, die Rekonstruktion trifft genau, {bad} bedeutet, sie liegt stark daneben, unabhängig davon, ob die wahre Antwort Zustimmung oder Ablehnung war — so gewählt, dass beide Enden auch bei Rot-Grün-Farbenblindheit unterscheidbar bleiben. Zieh {kItalic} von 0 bis {maxK}: bei k=0 wird jede Partei mit der Durchschnittsantwort geschätzt (meist orange), und mit wachsendem k verschwindet Orange sichtbar aus dem Raster, bis bei k={maxK} alles blau ist — eine exakte Rekonstruktion. Die Fehlerzahl oben wird direkt aus dem Ende der Singulärwerte abgelesen, nicht aus dem Raster neu berechnet — Theorem und Bild stimmen konstruktionsbedingt überein und schrumpfen gemeinsam.',

    centeringCentered: '✓ zentriert',
    centeringRaw: 'roh (unzentriert)',
    centeringHint1:
      'Dieselben sieben Parteien, dieselben ersten beiden Achsen. Der türkise Ring — der Ursprung — sitzt genau in der Mitte der Wolke: Abstände von ihm spiegeln jetzt die tatsächliche Form der Wolke wider.',
    centeringHint2:
      'Dieselben sieben Parteien, dieselben ersten beiden Achsen. Der korallenfarbene Pfeil ist der Versatz, den die Zentrierung entfernt — die mittlere Position μ. Unzentriert misst "Streuung vom Ursprung" meist nur diesen Versatz, nicht wie sich die Parteien voneinander unterscheiden.',
  },
} as const;

export type PoliticsDimensionsText = Record<keyof typeof politicsDimensionsText.en, string>;
