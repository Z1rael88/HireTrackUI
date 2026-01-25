import React from "react";
import { motion } from "framer-motion";
import { Container, Link as MuiLink, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type Section = {
  title: string;
  content: string | React.ReactNode;
};

const bulletsSx = {
  pl: 3,
  listStyleType: "disc",
  "& .MuiListItem-root": { display: "list-item", py: 0.25, pl: 0 }
} as const;

const sections: Section[] = [
  {
    title: "1. Jakie dane zbieramy?",
    content:
      "Zbieramy dane osobowe, takie jak imię, nazwisko, adres e-mail, numer telefonu, CV oraz informacje związane z doświadczeniem zawodowym. Pracodawcy mogą podawać dane firmowe, w tym nazwę i dane kontaktowe."
  },
  {
    title: "2. Jak wykorzystujemy Twoje dane?",
    content: (
      <List sx={bulletsSx}>
        {[
          "Tworzenia i zarządzania kontem użytkownika.",
          "Umożliwienia aplikowania na oferty pracy.",
          "Przekazywania danych pracodawcom.",
          "Ulepszania naszych usług.",
          "Przesyłania powiadomień i ofert pracy.",
          "Zapewnienia zgodności z regulacjami prawnymi.",
          "Personalizacji treści i doświadczenia użytkownika."
        ].map((item) => (
          <ListItem key={item} disableGutters>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    )
  },
  {
    title: "3. Komu udostępniamy dane?",
    content:
      "Dane użytkowników mogą być udostępniane pracodawcom, zewnętrznym dostawcom usług, analitycznym firmom badawczym oraz organom publicznym, jeśli wymagają tego przepisy prawa."
  },
  {
    title: "4. Jak długo przechowujemy dane?",
    content:
      "Dane są przechowywane przez okres niezbędny do realizacji celów rekrutacyjnych lub do momentu wycofania zgody przez użytkownika. W niektórych przypadkach dane mogą być przechowywane przez dłuższy okres, jeśli wymaga tego obowiązujące prawo."
  },
  {
    title: "5. Twoje prawa",
    content: (
      <List sx={bulletsSx}>
        {[
          "Prawo dostępu do danych.",
          "Prawo do sprostowania danych.",
          "Prawo do usunięcia danych („prawo do bycia zapomnianym”).",
          "Prawo do ograniczenia przetwarzania danych.",
          "Prawo do przenoszenia danych.",
          "Prawo do sprzeciwu wobec przetwarzania danych.",
          "Prawo do wycofania zgody w dowolnym momencie."
        ].map((item) => (
          <ListItem key={item} disableGutters>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    )
  },
  {
    title: "6. Ochrona danych osobowych",
    content:
      "Dbamy o bezpieczeństwo Twoich danych osobowych poprzez wdrażanie odpowiednich środków technicznych i organizacyjnych, takich jak szyfrowanie danych, kontrola dostępu oraz regularne audyty zabezpieczeń."
  },
  {
    title: "7. Zmiany w polityce prywatności",
    content:
      "Zastrzegamy sobie prawo do aktualizacji niniejszej polityki prywatności w celu dostosowania jej do obowiązujących przepisów prawnych oraz zmian w naszych usługach. O wszelkich istotnych zmianach będziemy informować użytkowników na naszej stronie internetowej."
  },
  {
    title: "8. Kontakt",
    content: (
      <>
        W przypadku pytań dotyczących polityki prywatności prosimy o{" "}
        <MuiLink component={RouterLink} to="/contact" underline="hover" sx={{ fontWeight: 700, color: "inherit" }}>
          kontakt
        </MuiLink>
        .
      </>
    )
  }
];

export default function Privacy() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        component={motion.h1}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.25 }}
        variant="h3"
        fontWeight={800}
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Polityka Prywatności HireTrack
      </Typography>

      {sections.map((section, idx) => (
        <Typography
          key={section.title}
          component={motion.section}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.5 }}
          viewport={{ once: true, amount: 0.25 }}
          sx={{ display: "block" }}
        >
          <Typography variant="h5" fontWeight={800} gutterBottom>
            {section.title}
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            {section.content}
          </Typography>
        </Typography>
      ))}
    </Container>
  );
}