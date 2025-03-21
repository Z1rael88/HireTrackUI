import {motion} from "framer-motion";
import {Container, Typography, Link, List, ListItem} from "@mui/material";

const Privacy = () => {
    return (
        <Container maxWidth="md" sx={{py: 6}}>
            <motion.div
                initial={{opacity: 0, y: -20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{textAlign: "center", mb: 4}}>
                    Polityka Prywatności HireTrack
                </Typography>
            </motion.div>

            {[
                {
                    title: "1. Jakie dane zbieramy?",
                    content:
                        "Zbieramy dane osobowe, takie jak imię, nazwisko, adres e-mail, numer telefonu, CV oraz " +
                        "informacje związane z doświadczeniem zawodowym. Pracodawcy mogą podawać dane firmowe, w " +
                        "tym nazwę i dane kontaktowe."
                },
                {
                    title: "2. Jak wykorzystujemy Twoje dane?",
                    content: (
                        <List>
                            {["Tworzenia i zarządzania kontem użytkownika.",
                                "Umożliwienia aplikowania na oferty pracy.",
                                "Przekazywania danych pracodawcom.",
                                "Ulepszania naszych usług.",
                                "Przesyłania powiadomień i ofert pracy.",
                                "Zapewnienia zgodności z regulacjami prawnymi.",
                                "Personalizacji treści i doświadczenia użytkownika."].map((item, idx) => (
                                <ListItem key={idx} sx={{pl: 2}}>
                                    • {item}
                                </ListItem>
                            ))}
                        </List>
                    )
                },
                {
                    title: "3. Komu udostępniamy dane?",
                    content:
                        "Dane użytkowników mogą być udostępniane pracodawcom, zewnętrznym dostawcom usług, analitycznym " +
                        "firmom badawczym oraz organom publicznym, jeśli wymagają tego przepisy prawa."
                },
                {
                    title: "4. Jak długo przechowujemy dane?",
                    content:
                        "Dane są przechowywane przez okres niezbędny do realizacji celów rekrutacyjnych lub do momentu " +
                        "wycofania zgody przez użytkownika. W niektórych przypadkach dane mogą być przechowywane przez " +
                        "dłuższy okres, jeśli wymaga tego obowiązujące prawo."
                },
                {
                    title: "5. Twoje prawa",
                    content: (
                        <List>
                            {["Prawo dostępu do danych.",
                                "Prawo do sprostowania danych.",
                                "Prawo do usunięcia danych (\"prawo do bycia zapomnianym\").",
                                "Prawo do ograniczenia przetwarzania danych.",
                                "Prawo do przenoszenia danych.",
                                "Prawo do sprzeciwu wobec przetwarzania danych.",
                                "Prawo do wycofania zgody w dowolnym momencie."].map((item, idx) => (
                                <ListItem key={idx} sx={{pl: 2}}>
                                    • {item}
                                </ListItem>
                            ))}
                        </List>
                    )
                },
                {
                    title: "6. Ochrona danych osobowych",
                    content:
                        "Dbamy o bezpieczeństwo Twoich danych osobowych poprzez wdrażanie odpowiednich środków " +
                        "technicznych i organizacyjnych, takich jak szyfrowanie danych, kontrola dostępu oraz " +
                        "regularne audyty zabezpieczeń."
                },
                {
                    title: "7. Pliki cookies i technologie śledzące",
                    content: (
                        <>
                            <Typography variant="body1">
                                Używamy plików cookies oraz podobnych technologii do analizy ruchu na stronie,
                                personalizacji treści oraz dostosowania reklam. Możesz zarządzać ustawieniami plików
                                cookies w swojej przeglądarce.
                            </Typography>
                            <List>
                                {["Niezbędne pliki cookies - wymagane do działania serwisu.",
                                    "Analityczne pliki cookies - pomagają nam analizować ruch na stronie.",
                                    "Marketingowe pliki cookies - służą do dostosowania reklam."].map((item, idx) => (
                                    <ListItem key={idx} sx={{pl: 2}}>
                                        • {item}
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )
                },
                {
                    title: "8. Zmiany w polityce prywatności",
                    content:
                        "Zastrzegamy sobie prawo do aktualizacji niniejszej polityki prywatności w celu dostosowania " +
                        "jej do obowiązujących przepisów prawnych oraz zmian w naszych usługach. O wszelkich istotnych " +
                        "zmianach będziemy informować użytkowników na naszej stronie internetowej."
                },
                {
                    title: "9. Kontakt",
                    content: (
                        <>
                            W przypadku pytań dotyczących polityki prywatności prosimy o {" "}
                            <Link href="/contact" color="primary.contrastText"
                                  sx={{fontWeight: "bold"}}> kontakt</Link>
                        </>
                    )
                }
            ].map((section, index) => (
                <motion.div
                    key={index}
                    initial={{opacity: 0, y: -20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.05, duration: 0.5}}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {section.title}
                    </Typography>
                    <Typography variant="body1" sx={{mb: 4}}>
                        {section.content}
                    </Typography>
                </motion.div>
            ))}
        </Container>
    );
};
export default Privacy;