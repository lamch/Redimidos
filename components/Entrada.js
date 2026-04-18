import { format } from 'fecha';
import Link from 'next/link';
import styles from '../src/styles/Entrada.module.css'
import { Card, Col, Row, Button, Text } from "@nextui-org/react";

const Entrada = ({ entrada, height = "550px" }) => {
    const { titulo, fecha, id, imagen, categoria } = entrada;

    const fechaFormateada = (() => {
        try {
            return format(new Date(fecha), 'DD-MM-YYYY HH:mm');
        } catch {
            return '';
        }
    })();

    return (
        <Link href={`/noticias/${id}`} className={styles.enlace}>
            <Card hoverable clickable width="100%" css={{
                w: "100%", h: height,
                '&:hover': { background: '$pink100', color: '$pink800' }
            }}>
                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                    <Col>
                        <Row justify="center">
                            <Button flat auto rounded css={{ color: "#fff", bg: "linear-gradient(135deg, #FF6600, #FF4500)" }}>
                                <Text css={{ color: "inherit" }} size={18} weight="bold" transform="uppercase">
                                    {categoria}
                                </Text>
                            </Button>
                        </Row>
                    </Col>
                </Card.Header>
                <Card.Body css={{ p: 0 }}>
                    <Card.Image src={imagen} objectFit="cover" width="100%" height="100%" alt={titulo} />
                </Card.Body>
                <Card.Footer isBlurred css={{
                    position: "absolute",
                    bgBlur: "#0f111466",
                    borderTop: "$borderWeights$light solid $gray800",
                    bottom: 0,
                    zIndex: 1,
                }}>
                    <Row>
                        <Col>
                            <Text size={26} h2 color="white">{titulo}</Text>
                            <Col>
                                <Row justify="center">
                                    <Button flat auto rounded css={{ color: "#fff", bg: "linear-gradient(135deg, #FF6600, #FF4500)" }}>
                                        <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                                            {fechaFormateada}
                                        </Text>
                                    </Button>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Link>
    )
}

export default Entrada
