import Container from "../../common/Container";
import Header from "../../common/Header";
import ConfirmLink from "../../common/ListConfirmLink";
import PageTitle from "../../common/PageTitle";
import StepLink from "../../common/StepLink";
import Arrow from "../../common/Arrow";

const ResidentMenuMain = () => {
    return (
        <>
            <Header />
            <main>
                <Container>
                    <PageTitle />
                    <div className="flex flex-col gap-[19px] w-fit mx-auto mt-16">
                        <ConfirmLink actor="resident" type="application" />
                        <ConfirmLink actor="resident" type="VC" />
                    </div>
                </Container>
            </main>
        </>
    )
};

export default ResidentMenuMain;