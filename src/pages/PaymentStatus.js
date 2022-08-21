import PageMessage from "../components/PageMessage";

const PaymentStatus = () => {
    return (<>
            <PageMessage
                errorCode="SUCCESS"
                mainMessage="Thanks"
                subMessage="Payment is Completed Successfully"
                messageDescription="Thank you for selecting our service"
            >
            </PageMessage>
        </>);
}

export default PaymentStatus;
