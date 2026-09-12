export const planimeterText = {
  de: {
    title: 'Planimeter',
    subtitle: 'Flächen messen, ohne zu rechnen',

    /* toolbar */
    setup: 'Aufbau',
    pole: 'Pol',
    poleHint: 'Pol setzen',
    armF: 'Fahrarm f',
    factorK: 'Faktor k',
    scale: 'Maßstab',
    image: 'Bild',
    loadImage: 'Bild laden',
    resetWheel: 'Messwerk nullen',
    clearTrace: 'Spur löschen',
    autoLog: 'Auto-Protokoll',
    mathMode: 'Mathe-Modus',
    help: 'Anleitung',
    showZeroCircle: 'Nullkreis',

    /* instrument */
    hinge: 'Gelenk',
    tracer: 'Fahrstift',
    wheel: 'Messrolle',
    polarm: 'Polarm',
    fahrarm: 'Fahrarm',
    reading: 'Ablesung',
    revs: 'Umläufe',
    drum: 'Trommel',
    vernier: 'Nonius',
    me: 'ME',

    /* notepad */
    notepad: 'Notizzettel',
    start: 'Startwert',
    end: 'Endwert',
    diff: 'Differenz m',
    area: 'Fläche A',
    onPaper: 'auf dem Papier',
    inReality: 'in der Wirklichkeit',
    take: 'übernehmen',
    formula: 'A = k · m',
    notes: 'Nebenrechnung',
    notesPlaceholder: 'Hier rechnen …',
    clearPad: 'Zettel leeren',
    runs: 'Messreihe',
    mean: 'Mittel',
    newRun: 'Messung notieren',
    noRuns: 'noch keine Messung notiert',

    /* status */
    outOfReach: 'Fahrstift außer Reichweite — Pol näher setzen',
    dragTracer: 'Fahrstift ziehen',
    tracing: 'misst …',
    closed: 'Kontur geschlossen',
    poleInside: 'Pol liegt innerhalb der Fläche — Nullkreis addieren',

    /* maths mode */
    mathTitle: 'Was die Rolle wirklich zählt',
    mathIntro:
      'Die Messrolle rollt nur, wenn sie sich quer zum Fahrarm bewegt. Längs des Arms rutscht sie. Jeder Schritt trägt also nur seine Querkomponente bei.',
    mathStep: 'Schrittbeitrag',
    mathSum: 'Summe bisher',
    mathClosed:
      'Über eine geschlossene Kurve addiert sich all das zu genau der eingeschlossenen Fläche, geteilt durch die Fahrarmlänge L.',
    mathGreen: 'Das ist der Satz von Green in Messing gegossen.',
    mathTrue: 'wahre Fläche',
    mathMeasured: 'gemessen',
    mathError: 'Abweichung',
    mathZeroCircle:
      'Liegt der Pol innerhalb der Kontur, fehlt der Rolle genau eine Nullkreisfläche. Die muss man addieren.',
    mathPerp: 'quer (rollt)',
    mathAlong: 'längs (rutscht)',
    mathLive: 'Momentaufnahme',

    /* help */
    helpTitle: 'So misst man',
    help1: 'Pol außerhalb der Fläche aufsetzen.',
    help2: 'Fahrarm auf den passenden Faktor k einstellen.',
    help3: 'Fahrstift auf einen Startpunkt der Kontur setzen, Ablesung notieren.',
    help4: 'Kontur im Uhrzeigersinn einmal ganz umfahren.',
    help5: 'Endwert ablesen, Differenz bilden, mit k multiplizieren.',
    close: 'schließen',

    /* image dialog */
    imageTitle: 'Bild und Maßstab',
    imageDrop: 'Bild hierher ziehen oder klicken',
    imageScaleHint: 'Maßstab: Strecke im Bild abgreifen und Länge eingeben',
    measureDistance: 'Referenzstrecke ziehen',
    realLength: 'entspricht',
    apply: 'übernehmen',
    cancel: 'abbrechen',
    builtin: 'Beispiele',
    mapScale: 'Kartenmaßstab',
    directScale: 'Direkt',

    /* samples */
    sampleLake: 'See',
    sampleField: 'Ackerschlag',
    sampleLeaf: 'Blatt',
    sampleCircle: 'Kreis (Probe)',

    /* result panel (replaces the notepad) */
    result: 'Ergebnis',
    resultHint: 'Kontur einmal umfahren, um zu messen',
    resultStart: 'Start',
    resultEnd: 'Ende',
    resultDiff: 'Differenz m',
    resultArea: 'Fläche',
    history: 'Verlauf',
    noHistory: 'noch keine Messung',
    clearHistory: 'Verlauf leeren',

    /* scale popover (opens on the hinge) */
    scaleTitle: 'Maßstab & Fahrarm',
    scaleIntro:
      'Ein Messwerkschritt (1 ME) entspricht auf dem Papier immer k cm² — unabhängig vom Kartenmaßstab. In der Wirklichkeit sind das, je nach Kartenmaßstab S, k·S²: darum lohnt sich pro Maßstab ein bestimmter Fahrarm. Trag unten den Maßstab deiner Karte ein, dann zeigt die Tabelle beide Seiten nebeneinander.',
    scaleMapScale: 'Kartenmaßstab',
    scaleCurrentSheet: 'aktuelles Blatt · zum Ändern eintippen',
    scaleOnPaper: 'pro ME auf dem Papier',
    scalePerME: 'pro ME in Wirklichkeit',
    scaleRecommended: 'empfohlen',
    scaleUse: 'verwenden',
    scaleInUse: 'eingestellt',
    scaleClose: 'schließen',

    /* tutorial */
    tutorial: 'Tutorial',
    tutorialSkip: 'überspringen',
    tutorialNext: 'weiter',
    tutorialBack: 'zurück',
    tutorialDone: 'fertig',
    tutorialStepOf: 'Schritt {n} von {total}',
    tut1Title: 'Das Planimeter',
    tut1Body:
      'Ein Polarplanimeter misst Flächen, ohne dass du rechnen musst — du fährst nur den Rand einmal ab. Dieses Tutorial führt dich einmal komplett durch eine echte Messung.',
    tut2Title: 'Der Pol',
    tut2Body:
      'Der schwere Zylinder links ist der Pol. Er bleibt fest liegen und verankert das Gerät. Zieh ihn testweise ein Stück — er darf überall außerhalb der zu messenden Fläche stehen.',
    tut3Title: 'Maßstab & Fahrarm',
    tut3Body:
      'Klicke auf das Gelenk in der Mitte. Dort öffnest du den Maßstab-Dialog: Er zeigt dir, welche Fahrarmlänge für welchen Kartenmaßstab sinnvoll ist, und stellt sie ein.',
    tut4Title: 'Der Fahrstift',
    tut4Body:
      'Am Ende des langen Arms sitzt der Fahrstift. Er ist der einzige Teil, den du direkt bewegst — Gelenk und Messrolle folgen automatisch der Kinematik der beiden Arme.',
    tut5Title: 'Jetzt messen',
    tut5Body:
      'Zieh den Fahrstift auf den Rand der grau gezeichneten Fläche und fahre die Kontur einmal komplett im Uhrzeigersinn ab, zurück zum Startpunkt. Rechts siehst du das Messwerk live mitlaufen.',
    tut6Title: 'Das Ergebnis',
    tut6Body:
      'Sobald die Kontur geschlossen ist, erscheint hier automatisch die gemessene Fläche — auf dem Papier und, nach Maßstab umgerechnet, in Wirklichkeit.',
    tut7Title: 'Mathe-Modus',
    tut7Body:
      'Wenn dich interessiert, warum das funktioniert: Der Mathe-Modus in der Werkzeugleiste erklärt Schritt für Schritt, wie aus dem Abrollen der Messrolle eine Flächenformel wird.',

    /* extended maths mode — linear planimeter build-up */
    mathIntroTitle: 'Warum das Abrollen die Fläche misst',
    mathTabLinear: '1 · Geradlinig',
    mathTabShapes: '2 · Beliebige Form',
    mathTabPolar: '3 · Mit Pol',
    mathTabLive: '4 · Live',

    mathLinTitle: 'Das Lineal-Planimeter',
    mathLinP1:
      'Stell dir zunächst ein vereinfachtes Gerät vor: kein Pol, nur ein Fahrarm der festen Länge k, der sich parallel verschiebt — wie ein Lineal, das seitlich über das Papier gleitet, während am einen Ende ein Rädchen mitläuft.',
    mathLinP2:
      'Schiebst du das Lineal um die Höhe m nach oben, überstreicht der Fahrstift ein Rechteck der Fläche k·m — genau die Fläche, die das Rädchen misst, denn es rollt exakt m ab (quer zur Fahrtrichtung).',
    mathLinP3:
      'Drehst du das Lineal dagegen nur um sein Ende (bewegst dich also parallel zum Arm oder drehst ihn), bewegt sich das Rädchen nicht quer zu sich selbst — es rollt kaum oder gar nicht. Reine Drehungen um einen Punkt auf der Arm-Achse tragen fast nichts bei.',
    mathLinFormula: 'A = k · m',

    mathShapesTitle: 'Von Rechtecken zu beliebigen Formen',
    mathShapesP1:
      'Jede krummlinig begrenzte Fläche lässt sich durch viele schmale Rechtecke annähern, die nebeneinanderliegen. Fährst du die Außenkante jedes einzelnen Rechtecks ab, misst das Rädchen jedes Mal dessen Fläche.',
    mathShapesP2:
      'Der Trick: Zwei benachbarte Rechtecke teilen sich eine Innenkante. Fährst du beide Rechtecke separat ab, wird diese Innenkante einmal in die eine, einmal in die andere Richtung durchlaufen — die beiden Beiträge heben sich exakt auf.',
    mathShapesP3:
      'Fährst du stattdessen nur die Außenkontur der gesamten Form ab, zählen automatisch nur die Außenkanten — alle inneren Kanten kürzen sich weg, ganz gleich wie fein die Rechtecke sind. Deshalb funktioniert das Verfahren für jede beliebige geschlossene Form, nicht nur für Rechtecke.',

    mathPolarTitle: 'Der Pol macht daraus ein Polarplanimeter',
    mathPolarP1:
      'Beim echten Gerät ist der Fahrarm nicht frei verschiebbar, sondern über ein zweites Gelenk am festen Pol angebunden. Dadurch dreht sich der Arm bei jeder Bewegung zusätzlich etwas.',
    mathPolarP2:
      'Diese Zusatzdrehungen würden das Messwerk verfälschen — außer über eine vollständig geschlossene Kontur: Dort summiert sich die Gesamtdrehung des Arms zu genau einer vollen Umdrehung (oder null, je nachdem ob der Pol innerhalb oder außerhalb liegt), und ihr Beitrag zum Messwerk ist bekannt und konstant.',
    mathPolarP3:
      'Liegt der Pol außerhalb der Kontur, heben sich die Drehanteile über den ganzen Umlauf exakt zu null auf — übrig bleibt genau A = k·m, wie beim Lineal-Planimeter. Liegt der Pol innerhalb, kommt eine feste zusätzliche Fläche hinzu: der Nullkreis π(R²+L²−2Ld). Das ist der einzige Unterschied.',
    mathPolarNote:
      'Deshalb die Regel „Pol außerhalb aufsetzen": dann brauchst du dich um die Korrektur nicht zu kümmern.',
    mathPolarOutsideLabel: 'Pol außerhalb → Drehung netto 0',
    mathPolarInsideLabel: 'Pol innerhalb → +1 volle Umdrehung',
    mathShapesCaption: 'Innenkanten heben sich auf · nur die Außenkontur (rot) zählt',
  },

  en: {
    title: 'Planimeter',
    subtitle: 'Measuring area without arithmetic',

    setup: 'Setup',
    pole: 'Pole',
    poleHint: 'place pole',
    armF: 'Tracer arm f',
    factorK: 'Factor k',
    scale: 'Scale',
    image: 'Image',
    loadImage: 'Load image',
    resetWheel: 'Zero the wheel',
    clearTrace: 'Clear trace',
    autoLog: 'Auto log',
    mathMode: 'Maths mode',
    help: 'How to',
    showZeroCircle: 'Zero circle',

    hinge: 'hinge',
    tracer: 'tracer',
    wheel: 'wheel',
    polarm: 'pole arm',
    fahrarm: 'tracer arm',
    reading: 'Reading',
    revs: 'turns',
    drum: 'drum',
    vernier: 'vernier',
    me: 'WU',

    notepad: 'Notepad',
    start: 'Start',
    end: 'End',
    diff: 'Difference m',
    area: 'Area A',
    onPaper: 'on paper',
    inReality: 'in reality',
    take: 'take',
    formula: 'A = k · m',
    notes: 'Scratch',
    notesPlaceholder: 'Work it out here …',
    clearPad: 'Clear pad',
    runs: 'Series',
    mean: 'mean',
    newRun: 'Record run',
    noRuns: 'no runs recorded yet',

    outOfReach: 'Tracer out of reach — move the pole closer',
    dragTracer: 'drag the tracer',
    tracing: 'measuring …',
    closed: 'contour closed',
    poleInside: 'pole lies inside the area — add the zero circle',

    mathTitle: 'What the wheel actually counts',
    mathIntro:
      'The wheel only rolls when it moves across the tracer arm. Along the arm it slides. So every step contributes just its perpendicular component.',
    mathStep: 'Step contribution',
    mathSum: 'Sum so far',
    mathClosed:
      'Around a closed curve all of it adds up to exactly the enclosed area divided by the tracer-arm length L.',
    mathGreen: "That is Green's theorem cast in brass.",
    mathTrue: 'true area',
    mathMeasured: 'measured',
    mathError: 'deviation',
    mathZeroCircle:
      'If the pole sits inside the contour, the wheel misses exactly one zero-circle area. Add it back.',
    mathPerp: 'across (rolls)',
    mathAlong: 'along (slides)',
    mathLive: 'snapshot',

    helpTitle: 'How to measure',
    help1: 'Put the pole outside the area.',
    help2: 'Set the tracer arm to the factor k you want.',
    help3: 'Put the tracer on a starting point, note the reading.',
    help4: 'Trace the contour once, clockwise.',
    help5: 'Read the end value, take the difference, multiply by k.',
    close: 'close',

    imageTitle: 'Image and scale',
    imageDrop: 'drop an image here, or click',
    imageScaleHint: 'Scale: drag a known distance, then type its length',
    measureDistance: 'drag a reference line',
    realLength: 'equals',
    apply: 'apply',
    cancel: 'cancel',
    builtin: 'Samples',
    mapScale: 'Map scale',
    directScale: 'Direct',

    sampleLake: 'Lake',
    sampleField: 'Field',
    sampleLeaf: 'Leaf',
    sampleCircle: 'Circle (check)',

    /* result panel (replaces the notepad) */
    result: 'Result',
    resultHint: 'trace the contour once to measure',
    resultStart: 'Start',
    resultEnd: 'End',
    resultDiff: 'Difference m',
    resultArea: 'Area',
    history: 'History',
    noHistory: 'no runs yet',
    clearHistory: 'Clear history',

    /* scale popover (opens on the hinge) */
    scaleTitle: 'Scale & tracer arm',
    scaleIntro:
      "One wheel unit (ME) is always k cm² on the paper, whatever the map's scale. In reality, depending on the map scale S, that is k·S² — so each scale has a tracer-arm setting worth using. Type your map's scale in below and the table shows both sides at once.",
    scaleMapScale: 'Map scale',
    scaleCurrentSheet: 'current sheet · type to change',
    scaleOnPaper: 'per ME on paper',
    scalePerME: 'per ME in reality',
    scaleRecommended: 'recommended',
    scaleUse: 'use',
    scaleInUse: 'in use',
    scaleClose: 'close',

    /* tutorial */
    tutorial: 'Tutorial',
    tutorialSkip: 'skip',
    tutorialNext: 'next',
    tutorialBack: 'back',
    tutorialDone: 'done',
    tutorialStepOf: 'Step {n} of {total}',
    tut1Title: 'The planimeter',
    tut1Body:
      'A polar planimeter measures area without any arithmetic — you just trace the outline once. This tutorial walks you through a full real measurement.',
    tut2Title: 'The pole',
    tut2Body:
      'The heavy cylinder on the left is the pole. It stays put and anchors the instrument. Try dragging it a little — it can sit anywhere outside the area you want to measure.',
    tut3Title: 'Scale & tracer arm',
    tut3Body:
      'Click the hinge in the middle. That opens the scale dialog: it shows which tracer-arm length suits which map scale, and sets it for you.',
    tut4Title: 'The tracer',
    tut4Body:
      'At the end of the long arm sits the tracer. It is the only part you move directly — the hinge and the measuring wheel follow automatically from the linkage of the two arms.',
    tut5Title: 'Now measure',
    tut5Body:
      'Drag the tracer onto the edge of the grey shape and trace the whole contour once, clockwise, back to your starting point. Watch the measuring wheel run live on the right.',
    tut6Title: 'The result',
    tut6Body:
      'Once the contour is closed, the measured area appears here automatically — on paper, and, converted by the scale, in reality.',
    tut7Title: 'Maths mode',
    tut7Body:
      'Curious why this works? Maths mode in the toolbar explains, step by step, how the wheel rolling turns into an area formula.',

    /* extended maths mode — linear planimeter build-up */
    mathIntroTitle: 'Why the rolling measures area',
    mathTabLinear: '1 · Straight-line',
    mathTabShapes: '2 · Any shape',
    mathTabPolar: '3 · With a pole',
    mathTabLive: '4 · Live',

    mathLinTitle: 'The linear planimeter',
    mathLinP1:
      'First imagine a simplified device: no pole, just a tracer arm of fixed length k that slides in parallel — like a ruler gliding sideways across the paper, with a little wheel running along at one end.',
    mathLinP2:
      'Slide the ruler up by height m, and the tracer sweeps out a rectangle of area k·m — exactly the area the wheel measures, since it rolls precisely m (across its direction of travel).',
    mathLinP3:
      'Rotate the ruler about its own end instead (move parallel to the arm, or turn it), and the wheel barely moves across itself — it hardly rolls at all. Pure rotation about a point on the arm\'s own axis contributes almost nothing.',
    mathLinFormula: 'A = k · m',

    mathShapesTitle: 'From rectangles to any shape',
    mathShapesP1:
      'Any curved outline can be approximated by many narrow rectangles placed side by side. Trace the outer edge of each rectangle individually, and the wheel measures its area every time.',
    mathShapesP2:
      'Here is the trick: two neighbouring rectangles share one inner edge. Trace both rectangles separately, and that inner edge gets traversed once in each direction — the two contributions cancel exactly.',
    mathShapesP3:
      'Trace only the outer boundary of the whole shape instead, and only the outer edges count automatically — every inner edge cancels away, no matter how fine the rectangles are. That is why the method works for any closed shape, not just rectangles.',

    mathPolarTitle: 'The pole turns this into a polar planimeter',
    mathPolarP1:
      "On the real instrument the tracer arm can't slide freely — it is linked through a second hinge to the fixed pole. So the arm also rotates a little with every move.",
    mathPolarP2:
      'Those extra rotations would throw the reading off — except over a fully closed contour: there, the arm\'s total rotation sums to exactly one full turn (or zero, depending on whether the pole sits inside or outside), and its contribution to the reading is known and constant.',
    mathPolarP3:
      'If the pole sits outside the contour, the rotational parts cancel to exactly zero over the whole loop — leaving exactly A = k·m, just as with the linear planimeter. If the pole sits inside, one fixed extra area is added: the zero circle π(R²+L²−2Ld). That is the only difference.',
    mathPolarNote:
      "That's the rule \"place the pole outside\": then you never have to worry about the correction.",
    mathPolarOutsideLabel: 'pole outside → net turn 0',
    mathPolarInsideLabel: 'pole inside → +1 full turn',
    mathShapesCaption: 'inner edges cancel · only the outline (red) counts',
  },
} as const;

export type PlanimeterText = Record<keyof typeof planimeterText.de, string>;
