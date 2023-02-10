export const createMedia = (
    {
        type,
        url,
        component = null,
        componentProps = {},
        ref = null
    } ) => (
    {
        type,
        url,
        component,
        componentProps,
        ref
    })

