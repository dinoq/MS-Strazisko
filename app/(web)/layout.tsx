
import Footer from '@features/web/components/footer/Footer';
import Header from '@features/web/components/header/Header';

const RootWebLayout = ({ children }: React.PropsWithChildren) => {
    return (<>
        {<Header noBackground={false} />}
        {children}
        {<Footer />}
    </>
    )
}

export default RootWebLayout;