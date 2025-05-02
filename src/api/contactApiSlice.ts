import {api} from "./apiSlice";
import {ContactFormType} from "../types/contactTypes/ContactFormType";

export const contactApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendContactForm: builder.mutation<void, ContactFormType>({
            query: (formData) => ({
                url: "/contact",
                method: "POST",
                data: formData,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {useSendContactFormMutation} = contactApi;
