export const logLogo = () => console.log('wa~')

export const pick = (name: string, rewrite: boolean = false) => {
    if (rewrite) {
        return (props: any) => props[name] || props.theme[name];
    }
    return (props: any) => props.theme[name];
}
