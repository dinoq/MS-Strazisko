import FormFrameContainer from "@features/admin/components/FormFrame/FormFrameContainer";


const formIDs = {
    intro: "IntroText",
    teachers: "Teacher",
    events: "Event",
    photos: "PublicPhoto",
    foto: "Year",
    dokumenty: "Document",
    kontakt: "ContactText"

}
const IntroPage = async ({ params }: { params: Promise<{ pageName: string }> }) => {
    const { pageName } = await params;
    const formID = formIDs[pageName];
    if(formID){
        return <FormFrameContainer formID={formID} />
    }
    return <FormFrameContainer formID={formIDs.intro} />
}

export default IntroPage;