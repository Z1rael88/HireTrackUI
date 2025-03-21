import _api from "../http";
import {ContactFormData} from "../types/ContactFormData.ts";

// Funkcja do wysyłania formularza kontaktowego
export const sendContactForm = async (formData: ContactFormData) => {
    try {
        const response = await _api.post("/contact", formData);
        return response.data;
    } catch (error) {
        console.error("Error send:", error);
    }
};
