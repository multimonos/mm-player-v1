export const createMedia = (
    {
        media_type,
        url,
        duration = false,
        audioUrl = null,
        component = null,
        params = {},
        ref = null,
        sketch = null,
        prepare = null,
    } ) => (
    {
        _type: "media",
        media_type,
        component,
        url,
        duration,
        audioUrl,
        params,
        ref,
        sketch,
        prepare,
    })

