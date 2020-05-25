import React, { FunctionComponent } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

interface ChartsIndexCardProps {
  title: string;
  description?: string;
  image: string;
  link?: string;
}

const ChartsIndexCard: FunctionComponent<ChartsIndexCardProps> = ({
  title,
  description,
  image,
  link,
}) => {
  return (
    <Col xs={6} md={4}>
      <Card className="my-3 mx-lg-2">
        <Card.Img variant="top" src={image} alt={title} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {description}

            {link && <Link to={link} className="stretched-link" />}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ChartsIndexCard;
