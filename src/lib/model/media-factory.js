export const createMedia = (
    {
        media_type,
        url,
        component = null,
        componentProps = {},
        params = {},
        ref = null,
    } ) => (
    {
        type: "media",
        media_type,
        component,
        componentProps,
        url,
        params,
        ref
    })

