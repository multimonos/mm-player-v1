export const createMedia = (
    {
        media_type,
        url,
        duration = false,
        audioUrl = null,
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
        audioUrl,
        params,
        ref
    })

