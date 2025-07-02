import React from "react";
import { Card, Button } from "react-bootstrap";

export default function AdsCard({ item, onEdit, onDelete }) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Img variant="top" src={item.Media} alt="Ad Image" />

      <Card.Body>
        <Card.Title>{item.Title}</Card.Title>
        <Card.Text>{item.Content}</Card.Text>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="warning" size="sm" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(item.id)}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
