import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Legal Notice',
  description: 'Impressum and Datenschutzerklärung.',
};

export default function LegalPage() {
  return (
    <>
      <PageHeader title="Legal Notice" ornament="§" />

      <div className="section-container pb-24">
        <div className="max-w-reading space-y-16">
          {/* Impressum */}
          <header>
        <h1 className="text-3xl font-bold mb-6">Impressum</h1>
        <p className="mb-4">
          <strong>Dienstanbieter gemäß § 5 TMG sowie Verantwortlicher für redaktionelle Inhalte nach § 18 Abs. 2 MStV:</strong>
        </p>
        <address style={{ fontStyle: 'normal', marginBottom: '20px' }}>
          Frederic Horn<br />
          Fakultät für Mathematik<br />
          Universitätsplatz 2<br />
          39106 Magdeburg<br />
          Deutschland
        </address>
        
        <p className="mb-2">
          <strong>Kontakt per E-Mail:</strong>{' '}
          <a href="mailto:frederic.horn@ovgu.de">frederic.horn@ovgu.de</a>
        </p>
        <p className="mb-6">
          <strong>Link zu dieser Seite:</strong>{' '}
          <a href="https://www.frederichorn.de/legal">https://www.frederichorn.de/legal</a>
        </p>
      </header>

      <hr className="my-8" />

      <section className="legal-notice">
        <h2 className="text-2xl font-semibold mb-4">Rechtliche Hinweise</h2>

        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Haftung für Inhalte</h3>
          <p>
            Die Erstellung der Inhalte dieser Webseite erfolgte mit größtmöglicher Sorgfalt. 
            Dennoch kann für die Präzision, die Vollständigkeit sowie die Aktualität der bereitgestellten 
            Informationen keine Garantie übernommen werden. Als Diensteanbieter bin ich laut § 7 Abs. 1 TMG 
            für eigene Inhalte nach den allgemeinen gesetzlichen Vorschriften verantwortlich. 
            Gemäß den §§ 8 bis 10 TMG besteht jedoch keine Verpflichtung, übermittelte oder gespeicherte 
            Informationen Dritter permanent zu überwachen oder nach Anhaltspunkten für rechtswidrige 
            Aktivitäten zu suchen. Bestehende Verpflichtungen zur Sperrung oder Löschung von Informationen 
            nach allgemeinen Gesetzen bleiben hiervon unberührt. Eine Haftung tritt in diesem Zusammenhang 
            erst ab dem Moment ein, in dem eine konkrete Rechtsverletzung bekannt wird. Sobald entsprechende 
            Verstöße gemeldet werden, erfolgt eine sofortige Entfernung dieser Inhalte.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Haftung für externe Verlinkungen</h3>
          <p>
            Diese Präsenz enthält Verknüpfungen zu Webseiten Dritter. Da ich auf deren Gestaltung und 
            Inhalte keinen Einfluss habe, kann ich für diese fremden Informationen keine Verantwortung übernehmen. 
            Verantwortlich ist stets der jeweilige Seitenbetreiber oder Anbieter. Zum Zeitpunkt der Verlinkung 
            wurden die externen Seiten auf mögliche Rechtsverstöße geprüft; rechtswidrige Inhalte waren dabei 
            nicht ersichtlich. Ohne konkrete Hinweise auf eine Rechtsverletzung ist eine dauerhafte inhaltliche 
            Überprüfung der verlinkten Seiten nicht zumutbar. Bei Bekanntwerden von Rechtsverstößen werden 
            die betroffenen Links umgehend gelöscht.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Urheberrecht</h3>
          <p>
            Die auf diesen Seiten veröffentlichten Inhalte und Werke unterliegen dem deutschen Urheberrecht. 
            Jede Form der Vervielfältigung, Modifikation, Verbreitung oder Verwertung außerhalb der 
            gesetzlichen Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Einverständniserklärung 
            des Erstellers. Kopien und Downloads sind ausschließlich für den privaten, nicht-kommerziellen 
            Gebrauch zulässig. Sofern Inhalte nicht vom Betreiber selbst erstellt wurden, werden die 
            Urheberrechte Dritter gewahrt und diese Inhalte als solche kenntlich gemacht. Sollten Sie dennoch 
            eine Urheberrechtsverletzung feststellen, bitte ich um einen entsprechenden Hinweis. 
            Bei Bekanntwerden von Verstößen werde ich die betroffenen Inhalte unverzüglich entfernen.
          </p>
        </article>
        </section>

          {/* Datenschutzerklärung */}
          <section id="privacy">
            <h2 className="font-display text-display-sm text-ink-900 mb-6">
              Datenschutzerklärung
            </h2>
            <div className="text-ink-600 leading-relaxed space-y-8 text-sm">

              <div className="space-y-3">
                <h3 id="m716" className="font-semibold text-ink-800 text-base">Präambel</h3>
                <p>
                  Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten
                  Ihrer personenbezogenen Daten (nachfolgend auch kurz als &quot;Daten&quot; bezeichnet) wir zu
                  welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für
                  alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen
                  der Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in
                  mobilen Applikationen sowie innerhalb externer Onlinepräsenzen, wie z.&nbsp;B. unserer
                  Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als &quot;Onlineangebot&quot;).
                </p>
                <p>Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p>
                <p>Stand: 17. April 2026</p>
              </div>

              <div className="space-y-3">
                <h3 id="m3" className="font-semibold text-ink-800 text-base">Verantwortlicher</h3>
                <p>
                  Frederic Horn<br />
                  Universitätsplatz 2, Fakultät für Mathematik<br />
                  39106 Magdeburg, Deutschland
                </p>
                <p>
                  E-Mail-Adresse:{' '}
                  <a href="mailto:frederic.horn@ovgu.de" className="underline hover:text-ink-900">
                    frederic.horn@ovgu.de
                  </a>
                </p>
                <p>
                  <strong>Maßgebliche Rechtsgrundlagen nach der DSGVO: </strong>
                  Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren
                  Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass
                  neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem
                  Wohn- oder Sitzland gelten können. Sollten ferner im Einzelfall speziellere
                  Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung
                  mit.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO)</strong> – Die betroffene
                    Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden
                    personenbezogenen Daten für einen spezifischen Zweck oder mehrere bestimmte Zwecke
                    gegeben.
                  </li>
                  <li>
                    <strong>
                      Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO)
                    </strong>{' '}
                    – Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die
                    betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich,
                    die auf Anfrage der betroffenen Person erfolgen.
                  </li>
                  <li>
                    <strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO)</strong> – Die
                    Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der
                    Verantwortliche unterliegt.
                  </li>
                  <li>
                    <strong>Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)</strong> – Die
                    Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder
                    eines Dritten notwendig, vorausgesetzt, dass die Interessen, Grundrechte und
                    Grundfreiheiten der betroffenen Person nicht überwiegen.
                  </li>
                </ul>
                <p>
                  <strong>Nationale Datenschutzregelungen in Deutschland: </strong>
                  Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum
                  Datenschutz in Deutschland. Hierzu gehört insbesondere das Bundesdatenschutzgesetz
                  (BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum
                  Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien
                  personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie
                  automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling. Ferner
                  können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung gelangen.
                </p>
              </div>

              <div className="space-y-3">
                <h3 id="m27" className="font-semibold text-ink-800 text-base">Sicherheitsmaßnahmen</h3>
                <p>
                  Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands
                  der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und
                  der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten
                  und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen
                  geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes
                  Schutzniveau zu gewährleisten.
                </p>
                <p>
                  Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität
                  und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs
                  zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der
                  Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren
                  eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und
                  Reaktionen auf die Gefährdung der Daten gewährleisten.
                </p>
                <p>
                  Sicherung von Online-Verbindungen durch TLS-/SSL-Verschlüsselungstechnologie (HTTPS):
                  Um die Daten der Nutzer vor unerlaubten Zugriffen zu schützen, setzen wir auf
                  TLS-/SSL-Verschlüsselung. Wenn eine Website durch ein SSL-/TLS-Zertifikat gesichert
                  ist, wird dies durch die Anzeige von HTTPS in der URL signalisiert.
                </p>
              </div>

              <div className="space-y-3">
                <h3 id="m25" className="font-semibold text-ink-800 text-base">
                  Übermittlung von personenbezogenen Daten
                </h3>
                <p>
                  Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass diese
                  an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder
                  Personen übermittelt beziehungsweise ihnen gegenüber offengelegt werden. Zu den
                  Empfängern dieser Daten können z.&nbsp;B. mit IT-Aufgaben beauftragte Dienstleister
                  gehören oder Anbieter von Diensten und Inhalten, die in eine Website eingebunden sind.
                  In solchen Fällen beachten wir die gesetzlichen Vorgaben und schließen insbesondere
                  entsprechende Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit
                  den Empfängern Ihrer Daten ab.
                </p>
              </div>

              <div className="space-y-3">
                <h3 id="m24" className="font-semibold text-ink-800 text-base">
                  Internationale Datentransfers
                </h3>
                <p>
                  Datenverarbeitung in Drittländern: Sofern wir Daten in ein Drittland (d.&nbsp;h.
                  außerhalb der Europäischen Union (EU) oder des Europäischen Wirtschaftsraums (EWR))
                  übermitteln, erfolgt dies stets im Einklang mit den gesetzlichen Vorgaben.
                </p>
                <p>
                  Für Datenübermittlungen in die USA stützen wir uns vorrangig auf das Data Privacy
                  Framework (DPF), welches durch einen Angemessenheitsbeschluss der EU-Kommission vom
                  10.07.2023 als sicherer Rechtsrahmen anerkannt wurde. Zusätzlich haben wir mit den
                  jeweiligen Anbietern Standardvertragsklauseln abgeschlossen.
                </p>
                <p>
                  Weitere Informationen zum DPF und eine Liste der zertifizierten Unternehmen finden
                  Sie auf der Website des US-Handelsministeriums unter{' '}
                  <a
                    href="https://www.dataprivacyframework.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink-900 break-all"
                  >
                    https://www.dataprivacyframework.gov/
                  </a>{' '}
                  (in englischer Sprache).
                </p>
                <p>
                  Informationen zu Drittlandtransfers und geltenden Angemessenheitsbeschlüssen können
                  Sie dem Informationsangebot der EU-Kommission entnehmen:{' '}
                  <a
                    href="https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink-900 break-all"
                  >
                    https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en
                  </a>
                </p>
              </div>

              <div className="space-y-3">
                <h3 id="m12" className="font-semibold text-ink-800 text-base">
                  Allgemeine Informationen zur Datenspeicherung und Löschung
                </h3>
                <p>
                  Wir löschen personenbezogene Daten, die wir verarbeiten, gemäß den gesetzlichen
                  Bestimmungen, sobald die zugrundeliegenden Einwilligungen widerrufen werden oder keine
                  weiteren rechtlichen Grundlagen für die Verarbeitung bestehen.
                </p>
                <p>
                  Insbesondere müssen Daten, die aus handels- oder steuerrechtlichen Gründen
                  aufbewahrt werden müssen oder deren Speicherung notwendig ist zur Rechtsverfolgung
                  oder zum Schutz der Rechte anderer natürlicher oder juristischer Personen,
                  entsprechend archiviert werden.
                </p>
                <p>
                  Aufbewahrung und Löschung von Daten – die folgenden allgemeinen Fristen gelten für
                  die Aufbewahrung und Archivierung nach deutschem Recht:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>10 Jahre</strong> – Bücher und Aufzeichnungen, Jahresabschlüsse, Inventare,
                    Lageberichte, Eröffnungsbilanz sowie Arbeitsanweisungen und sonstige
                    Organisationsunterlagen (§ 147 Abs. 1 Nr. 1 i.V.m. Abs. 3 AO, § 14b Abs. 1 UStG,
                    § 257 Abs. 1 Nr. 1 i.V.m. Abs. 4 HGB).
                  </li>
                  <li>
                    <strong>8 Jahre</strong> – Buchungsbelege, wie z.&nbsp;B. Rechnungen und
                    Kostenbelege (§ 147 Abs. 1 Nr. 4 und 4a i.V.m. Abs. 3 Satz 1 AO sowie § 257
                    Abs. 1 Nr. 4 i.V.m. Abs. 4 HGB).
                  </li>
                  <li>
                    <strong>6 Jahre</strong> – Übrige Geschäftsunterlagen: empfangene Handels- oder
                    Geschäftsbriefe, sonstige Unterlagen, soweit sie für die Besteuerung von Bedeutung
                    sind (§ 147 Abs. 1 Nr. 2, 3, 5 i.V.m. Abs. 3 AO, § 257 Abs. 1 Nr. 2 u. 3
                    i.V.m. Abs. 4 HGB).
                  </li>
                  <li>
                    <strong>3 Jahre</strong> – Daten, die erforderlich sind, um potenzielle
                    Gewährleistungs- und Schadensersatzansprüche oder ähnliche vertragliche Ansprüche
                    zu berücksichtigen, basierend auf der regulären gesetzlichen Verjährungsfrist
                    (§§ 195, 199 BGB).
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 id="m10" className="font-semibold text-ink-800 text-base">
                  Rechte der betroffenen Personen
                </h3>
                <p>
                  Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich
                  insbesondere aus Art. 15 bis 21 DSGVO ergeben:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Widerspruchsrecht:</strong> Sie haben das Recht, aus Gründen, die sich aus
                    Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie
                    betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f
                    DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen
                    gestütztes Profiling.
                  </li>
                  <li>
                    <strong>Widerrufsrecht bei Einwilligungen:</strong> Sie haben das Recht, erteilte
                    Einwilligungen jederzeit zu widerrufen.
                  </li>
                  <li>
                    <strong>Auskunftsrecht:</strong> Sie haben das Recht, eine Bestätigung darüber zu
                    verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten
                    sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen
                    Vorgaben.
                  </li>
                  <li>
                    <strong>Recht auf Berichtigung:</strong> Sie haben das Recht, die Vervollständigung
                    der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen
                    Daten zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Löschung und Einschränkung der Verarbeitung:</strong> Sie haben
                    das Recht, zu verlangen, dass Sie betreffende Daten unverzüglich gelöscht werden,
                    bzw. alternativ eine Einschränkung der Verarbeitung zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Sie
                    betreffende Daten, die Sie uns bereitgestellt haben, in einem strukturierten,
                    gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen
                    anderen Verantwortlichen zu fordern.
                  </li>
                  <li>
                    <strong>Beschwerde bei Aufsichtsbehörde:</strong> Sie haben das Recht auf Beschwerde
                    bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen
                    Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, wenn
                    Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen
                    Daten gegen die Vorgaben der DSGVO verstößt.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 id="m225" className="font-semibold text-ink-800 text-base">
                  Bereitstellung des Onlineangebots und Webhosting
                </h3>
                <p>
                  Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung
                  stellen zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die
                  notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser
                  oder das Endgerät der Nutzer zu übermitteln.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Verarbeitete Datenarten:</strong> Nutzungsdaten; Meta-, Kommunikations- und
                    Verfahrensdaten (z.&nbsp;B. IP-Adressen, Zeitangaben, Identifikationsnummern);
                    Protokolldaten.
                  </li>
                  <li>
                    <strong>Betroffene Personen:</strong> Nutzer (z.&nbsp;B. Webseitenbesucher, Nutzer
                    von Onlinediensten).
                  </li>
                  <li>
                    <strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres Onlineangebotes und
                    Nutzerfreundlichkeit; Informationstechnische Infrastruktur; Sicherheitsmaßnahmen.
                  </li>
                  <li>
                    <strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im
                    Abschnitt &quot;Allgemeine Informationen zur Datenspeicherung und Löschung&quot;.
                  </li>
                  <li>
                    <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                    lit. f) DSGVO).
                  </li>
                </ul>
                <p>
                  <strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong>
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Bereitstellung Onlineangebot auf gemietetem Speicherplatz: </strong>Für die
                    Bereitstellung unseres Onlineangebotes nutzen wir Speicherplatz, Rechenkapazität und
                    Software, die wir von einem entsprechenden Serveranbieter (auch &quot;Webhoster&quot; genannt)
                    mieten oder anderweitig beziehen.{' '}
                    <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                    lit. f) DSGVO).
                  </li>
                  <li>
                    <strong>Erhebung von Zugriffsdaten und Logfiles: </strong>Der Zugriff auf unser
                    Onlineangebot wird in Form von sogenannten &quot;Server-Logfiles&quot; protokolliert. Zu den
                    Serverlogfiles können die Adresse und der Name der abgerufenen Webseiten und Dateien,
                    Datum und Uhrzeit des Abrufs, übertragene Datenmengen, Browsertyp nebst Version, das
                    Betriebssystem des Nutzers, Referrer URL und im Regelfall IP-Adressen gehören.{' '}
                    <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                    lit. f) DSGVO).{' '}
                    <strong>Löschung von Daten:</strong> Logfile-Informationen werden für die Dauer von
                    maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 id="m134" className="font-semibold text-ink-800 text-base">Einsatz von Cookies</h3>
                <p>
                  Unter dem Begriff „Cookies" werden Funktionen, die Informationen auf Endgeräten der
                  Nutzer speichern und aus ihnen auslesen, verstanden. Wir verwenden Cookies gemäß den
                  gesetzlichen Vorschriften. Dazu holen wir, wenn erforderlich, vorab die Zustimmung der
                  Nutzer ein. Ist eine Zustimmung nicht notwendig, setzen wir auf unsere berechtigten
                  Interessen.
                </p>
                <p>
                  <strong>Speicherdauer – </strong>Im Hinblick auf die Speicherdauer werden die
                  folgenden Arten von Cookies unterschieden:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Temporäre Cookies (auch: Session- oder Sitzungscookies):</strong> Werden
                    spätestens gelöscht, nachdem ein Nutzer ein Onlineangebot verlassen und sein
                    Endgerät geschlossen hat.
                  </li>
                  <li>
                    <strong>Permanente Cookies:</strong> Bleiben auch nach dem Schließen des Endgeräts
                    gespeichert. Sofern wir Nutzern keine expliziten Angaben zur Speicherdauer mitteilen,
                    sollten sie davon ausgehen, dass diese permanent sind und die Speicherdauer bis zu
                    zwei Jahre betragen kann.
                  </li>
                </ul>
                <p>
                  <strong>Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-out): </strong>Nutzer
                  können die von ihnen abgegebenen Einwilligungen jederzeit widerrufen und zudem einen
                  Widerspruch gegen die Verarbeitung entsprechend den gesetzlichen Vorgaben, auch
                  mittels der Privatsphäre-Einstellungen ihres Browsers, erklären.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Verarbeitete Datenarten:</strong> Meta-, Kommunikations- und Verfahrensdaten
                    (z.&nbsp;B. IP-Adressen, Zeitangaben, Identifikationsnummern).
                  </li>
                  <li>
                    <strong>Betroffene Personen:</strong> Nutzer.
                  </li>
                  <li>
                    <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                    lit. f) DSGVO). Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO).
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 id="m104" className="font-semibold text-ink-800 text-base">
                  Blogs und Publikationsmedien
                </h3>
                <p>
                  Wir nutzen Blogs oder vergleichbare Mittel der Onlinekommunikation und Publikation
                  (nachfolgend &quot;Publikationsmedium&quot;). Die Daten der Leser werden für die Zwecke des
                  Publikationsmediums nur insoweit verarbeitet, als es für dessen Darstellung und die
                  Kommunikation zwischen Autoren und Lesern oder aus Gründen der Sicherheit erforderlich
                  ist.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Verarbeitete Datenarten:</strong> Bestandsdaten; Kontaktdaten; Inhaltsdaten;
                    Nutzungsdaten; Meta-, Kommunikations- und Verfahrensdaten.
                  </li>
                  <li>
                    <strong>Betroffene Personen:</strong> Nutzer.
                  </li>
                  <li>
                    <strong>Zwecke der Verarbeitung:</strong> Feedback; Bereitstellung unseres
                    Onlineangebotes und Nutzerfreundlichkeit; Sicherheitsmaßnahmen;
                    Organisations- und Verwaltungsverfahren.
                  </li>
                  <li>
                    <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                    lit. f) DSGVO).
                  </li>
                </ul>
                <p>
                  <strong>Kommentare und Beiträge: </strong>Wenn Nutzer Kommentare oder sonstige
                  Beiträge hinterlassen, können ihre IP-Adressen auf Grundlage unserer berechtigten
                  Interessen gespeichert werden. Das erfolgt zu unserer Sicherheit, falls jemand in
                  Kommentaren und Beiträgen widerrechtliche Inhalte hinterlässt. Die im Rahmen der
                  Kommentare und Beiträge mitgeteilten Informationen werden von uns bis zum Widerspruch
                  der Nutzer dauerhaft gespeichert.{' '}
                  <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                  lit. f) DSGVO).
                </p>
              </div>

              <div className="space-y-3">
                <h3 id="m182" className="font-semibold text-ink-800 text-base">
                  Kontakt- und Anfrageverwaltung
                </h3>
                <p>
                  Bei der Kontaktaufnahme mit uns (z.&nbsp;B. per Post, Kontaktformular, E-Mail, Telefon
                  oder via soziale Medien) sowie im Rahmen bestehender Nutzer- und
                  Geschäftsbeziehungen werden die Angaben der anfragenden Personen verarbeitet, soweit
                  dies zur Beantwortung der Kontaktanfragen und etwaiger angefragter Maßnahmen
                  erforderlich ist.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Verarbeitete Datenarten:</strong> Kontaktdaten; Inhaltsdaten; Meta-,
                    Kommunikations- und Verfahrensdaten.
                  </li>
                  <li>
                    <strong>Betroffene Personen:</strong> Kommunikationspartner.
                  </li>
                  <li>
                    <strong>Zwecke der Verarbeitung:</strong> Kommunikation; Organisations- und
                    Verwaltungsverfahren; Feedback; Bereitstellung unseres Onlineangebotes und
                    Nutzerfreundlichkeit.
                  </li>
                  <li>
                    <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                    lit. f) DSGVO). Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1
                    lit. b) DSGVO).
                  </li>
                </ul>
                <p>
                  <strong>Kontaktformular: </strong>Bei Kontaktaufnahme über unser Kontaktformular, per
                  E-Mail oder anderen Kommunikationswegen, verarbeiten wir die uns übermittelten
                  personenbezogenen Daten zur Beantwortung und Bearbeitung des jeweiligen Anliegens. Wir
                  nutzen diese Daten ausschließlich für den angegebenen Zweck der Kontaktaufnahme und
                  Kommunikation.{' '}
                  <strong>Rechtsgrundlagen:</strong> Vertragserfüllung und vorvertragliche Anfragen
                  (Art. 6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                  lit. f) DSGVO).
                </p>
              </div>

              <div className="space-y-3">
                <h3 id="m136" className="font-semibold text-ink-800 text-base">
                  Präsenzen in sozialen Netzwerken (Social Media)
                </h3>
                <p>
                  Wir unterhalten Onlinepräsenzen innerhalb sozialer Netzwerke und verarbeiten in
                  diesem Rahmen Nutzerdaten, um mit den dort aktiven Nutzern zu kommunizieren oder
                  Informationen über uns anzubieten.
                </p>
                <p>
                  Wir weisen darauf hin, dass dabei Nutzerdaten außerhalb des Raumes der Europäischen
                  Union verarbeitet werden können. Hierdurch können sich für die Nutzer Risiken ergeben,
                  weil so zum Beispiel die Durchsetzung der Nutzerrechte erschwert werden könnte.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Verarbeitete Datenarten:</strong> Kontaktdaten; Inhaltsdaten; Nutzungsdaten.
                  </li>
                  <li>
                    <strong>Betroffene Personen:</strong> Nutzer.
                  </li>
                  <li>
                    <strong>Zwecke der Verarbeitung:</strong> Kommunikation; Feedback; Öffentlichkeitsarbeit.
                  </li>
                  <li>
                    <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                    lit. f) DSGVO).
                  </li>
                </ul>
                <p>
                  <strong>LinkedIn: </strong>Soziales Netzwerk – Wir sind gemeinsam mit LinkedIn Irland
                  Unlimited Company für die Erhebung (jedoch nicht die weitere Verarbeitung) von Daten
                  der Besucher verantwortlich, die zur Erstellung der „Page-Insights" (Statistiken)
                  unserer LinkedIn-Profile genutzt werden. Datenschutzinformationen zur Verarbeitung von
                  Nutzerdaten durch LinkedIn können den Datenschutzhinweisen von LinkedIn entnommen
                  werden:{' '}
                  <a
                    href="https://www.linkedin.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink-900 break-all"
                  >
                    https://www.linkedin.com/legal/privacy-policy
                  </a>
                  .{' '}
                  <strong>Dienstanbieter:</strong> LinkedIn Ireland Unlimited Company, Wilton Plaza,
                  Dublin 2, Irland.{' '}
                  <strong>Grundlage Drittlandtransfers:</strong> Data Privacy Framework (DPF),
                  Standardvertragsklauseln (
                  <a
                    href="https://legal.linkedin.com/dpa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink-900"
                  >
                    https://legal.linkedin.com/dpa
                  </a>
                  ).{' '}
                  <strong>Widerspruchsmöglichkeit (Opt-Out):</strong>{' '}
                  <a
                    href="https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink-900 break-all"
                  >
                    https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out
                  </a>
                  .
                </p>
              </div>

              <div className="space-y-3">
                <h3 id="m42" className="font-semibold text-ink-800 text-base">Begriffsdefinitionen</h3>
                <p>
                  In diesem Abschnitt erhalten Sie eine Übersicht über die in dieser
                  Datenschutzerklärung verwendeten Begrifflichkeiten. Soweit die Begrifflichkeiten
                  gesetzlich definiert sind, gelten deren gesetzliche Definitionen.
                </p>
                <ul className="list-disc ml-5 space-y-3">
                  <li>
                    <strong>Beschäftigte:</strong> Personen, die in einem Beschäftigungsverhältnis
                    stehen, sei es als Mitarbeiter, Angestellte oder in ähnlichen Positionen.
                  </li>
                  <li>
                    <strong>Bestandsdaten:</strong> Wesentliche Informationen, die für die
                    Identifikation und Verwaltung von Vertragspartnern, Benutzerkonten, Profilen und
                    ähnlichen Zuordnungen notwendig sind.
                  </li>
                  <li>
                    <strong>Inhaltsdaten:</strong> Informationen, die im Zuge der Erstellung,
                    Bearbeitung und Veröffentlichung von Inhalten aller Art generiert werden (Texte,
                    Bilder, Videos, Audiodateien etc.).
                  </li>
                  <li>
                    <strong>Kontaktdaten:</strong> Essentielle Informationen, die die Kommunikation mit
                    Personen oder Organisationen ermöglichen (Telefonnummern, postalische Adressen,
                    E-Mail-Adressen etc.).
                  </li>
                  <li>
                    <strong>Meta-, Kommunikations- und Verfahrensdaten:</strong> Informationen über die
                    Art und Weise, wie Daten verarbeitet, übermittelt und verwaltet werden, wie z.&nbsp;B.
                    IP-Adressen, Zeitstempel und Übertragungswege.
                  </li>
                  <li>
                    <strong>Nutzungsdaten:</strong> Informationen, die erfassen, wie Nutzer mit
                    digitalen Produkten, Dienstleistungen oder Plattformen interagieren.
                  </li>
                  <li>
                    <strong>Personenbezogene Daten:</strong> Alle Informationen, die sich auf eine
                    identifizierte oder identifizierbare natürliche Person beziehen.
                  </li>
                  <li>
                    <strong>Protokolldaten:</strong> Informationen über Ereignisse oder Aktivitäten, die
                    in einem System oder Netzwerk protokolliert wurden.
                  </li>
                  <li>
                    <strong>Verantwortlicher:</strong> Die natürliche oder juristische Person, Behörde,
                    Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die
                    Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
                  </li>
                  <li>
                    <strong>Verarbeitung:</strong> Jeder mit oder ohne Hilfe automatisierter Verfahren
                    ausgeführte Vorgang im Zusammenhang mit personenbezogenen Daten (Erheben,
                    Auswerten, Speichern, Übermitteln, Löschen etc.).
                  </li>
                </ul>
              </div>

              <p className="text-xs text-ink-400 pt-4 border-t border-ink-100">
                <a
                  href="https://datenschutz-generator.de/"
                  title="Rechtstext von Dr. Schwenke – für weitere Informationen bitte anklicken."
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="underline hover:text-ink-600"
                >
                  Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke
                </a>
              </p>

            </div>
          </section>
        </div>
      </div>
    </>
  );
}