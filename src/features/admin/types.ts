export type PathInfo = {
    title: string
    url: string
} | {
    title: string
    children: PathInfo[]
}