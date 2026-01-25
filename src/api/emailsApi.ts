import {api} from './apiSlice';

export const emailsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendGenericEmail: builder.mutation<
            void,
            { to: string; subject: string; body: string }
        >({
            query: ({to, subject, body}) => ({
                url: '/emails/sendGenericEmail',
                method: 'POST',
                params: {to, subject, body},
            }),
        }),
    }),
    overrideExisting: false,
});

export const {useSendGenericEmailMutation} = emailsApi;