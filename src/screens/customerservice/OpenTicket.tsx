import React, {useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Spinner} from "reactstrap";
import axios from "axios";
import {CUSTOMER_SERVICE_URL} from "../../utils/urlUtils";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

const OpenTicket = () => {
    const [description, setDescription] = useState("");
    const [issueFile, setIssueFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setIssueFile(e.target.files[0]);
        }
    };

    const getAlertMessage = (status: string) => {
        let BaseString = "Your ticket has been raised successfully.";
        switch (status) {
            case "Refund":
                return BaseString + " We will refund your money within 24 hours.";
            case "Replace":
                return BaseString + " We will replace your product within 24 hours.";
            case "Escalate":
                return BaseString + " We will escalate your issue to our sales team.";
            default :
                return BaseString + " We will escalate your issue to our sales team.";
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();

        const formData = new FormData();
        formData.append('description', description);
        if (issueFile) {
            formData.append('image', issueFile);
        }
        axios.post(CUSTOMER_SERVICE_URL, formData, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((response: any) => {
            Swal.fire({
                title: 'Ticket Raised Successfully! Your Ticket ID is : ' + response.data.ticket_id + '',
                text: getAlertMessage(response.data.status),
                icon: 'success',
            }).then((result) => {
                navigate("/");
            })
            setIsLoading(false);
        }, (err) => {
            console.log("ERROR IN TICKET RESPONSE : ", err)
            Swal.fire({
                title: 'Ticket Creation Failed!',
                text: "Some Thing Went Wrong! Please Try Again Later.",
                icon: 'error',
            });
            setIsLoading(false);
        })
    }

    return (
        <div>
            <Container>
                <Card style={{marginTop: "20px"}}>
                    <CardHeader>
                        <h3>Raise a Ticket</h3>
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
                                        type="textarea"
                                        placeholder="Describe Your Order Issue Here!"
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="issueFile" sm={2}>
                                    Upload Image
                                </Label>
                                <Col sm={10}>
                                    <Input type="file" id="image" onChange={handleImageUpload}/>
                                </Col>
                            </FormGroup>
                            <Button type="submit" color="primary" onClick={handleSubmit} disabled={isLoading}>
                                {
                                    !isLoading ? "Submit Issue" : <Spinner color="light" size="sm"/>
                                }
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
};

export {OpenTicket};
