import React, { FunctionComponent } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';

interface ChartsIndexCardProps {
  title: string,
  description?: string,
  image: any,
  link?: string
}

const ChartsIndexCard: FunctionComponent<ChartsIndexCardProps> = ({ title, description, image, link }) => {
  return (
    <Col xs={6} md={4}>
      <Card className='my-3 m-sm-2'>
        <Card.Img variant="top" src={image} alt={title} />
        <Card.Body>
          <Card.Title>
            {title}
          </Card.Title>
          <Card.Text>
            {description}

            {link && (
              <Link to={link} className='stretched-link' />
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ChartsIndexCard;
