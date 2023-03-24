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
        _type: "media",
        media_type,
        component,
        componentProps,
        url,
        params,
        ref
    })

