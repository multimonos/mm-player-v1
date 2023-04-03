export const createMedia = (
    {
        media_type,
        url,
        duration = false,
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
        duration,
        params,
        ref
    })

