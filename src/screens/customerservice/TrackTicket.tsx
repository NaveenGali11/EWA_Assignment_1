import React, {useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner
} from "reactstrap";
import {CUSTOMER_SERVICE_URL} from "../../utils/urlUtils";
import axios from "axios";

type ticketStatus = {
    created_at: string,
    description: string,
    image_url: string,
    status: string,
    ticket_id: string
}

const StatusSection: React.FC<{ title: string, content: string }> = ({title, content}) => (
    <Col md="4" className="mb-4">
        <h5 className="text-primary">{title}</h5>
        <p className="text-muted">{content}</p>
    </Col>
);

const TrackTicket = () => {
    const [ticketId, setTicketId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<ticketStatus | null>(null)

    const getTicketStatus = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        axios.get(CUSTOMER_SERVICE_URL + "/" + ticketId, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res: any) => {
            console.log("Ticket Status : ", res.data);
            setStatus(res.data)
            setIsLoading(false);
        }, (err) => {
            console.log("ERROR IN TICKET STATUS RESPONSE : ", err);
            setIsLoading(false);
        })
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <div>
            <Container>
                <Card style={{marginTop: "20px"}}>
                    <CardHeader>
                        <h3>Track Your Ticket</h3>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <FormGroup row>
                                <Label for="issue" sm={2}>
                                    Issue
                                </Label>
                                <Col sm={10}>
                                    <Input
                                        id="issue"
                                        name="text"
                                        placeholder="Enter Your Ticket ID Here!"
                                        onChange={(e) => setTicketId(e.target.value)}
                                    />
                                </Col>
                            </FormGroup>
                            <Button type="submit" color="primary" onClick={getTicketStatus}>
                                {
                                    !isLoading ? "Track Ticket" : <Spinner color="light" size="sm"/>
                                }
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
                {
                    status && <Card className="shadow-sm" style={{marginTop: "20px"}}>
                        <CardHeader>
                            Ticket Details
                        </CardHeader>
                        <CardBody>
                            {status && (
                                <div>
                                    <Row>
                                        <StatusSection title="Description" content={status.description}/>
                                        <Col md="4" className="mb-4">
                                            <h5 className="text-primary">Image</h5>
                                            <img src={status.image_url} alt="Ticket Image" className="img-fluid rounded"
                                                 style={{maxHeight: "150px"}}/>
                                        </Col>
                                        <StatusSection title="Status" content={status.status}/>
                                    </Row>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                }
            </Container>
        </div>
    )
}
export {TrackTicket}