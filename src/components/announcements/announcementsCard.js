import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdsCard({ item, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    if (descRef.current && !expanded) {
      setShowReadMore(
        descRef.current.scrollHeight > descRef.current.clientHeight
      );
    } else {
      setShowReadMore(false);
    }
  }, [item.Content, expanded]);

  return (
    <div
      className="ad-card shadow rounded-4 d-flex flex-column justify-content-between"
      style={{
        width: 260,
        height: expanded ? "auto" : 320,
        background: "#fff",
        margin: 8,
        overflow: "hidden",
        transition: "height 0.2s",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 150,
          overflow: "hidden",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <img
          src={item.Media}
          alt="Ad Image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      <div
        className="p-3 d-flex flex-column flex-grow-1"
        style={{ minHeight: 0 }}
      >
        <h5
          style={{
            color: "#1E3A5F",
            fontWeight: 700,
            minHeight: 40,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.Title}
        </h5>
        <div style={{ minHeight: 48, position: "relative" }}>
          <p
            ref={descRef}
            style={{
              color: "#444",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              overflow: expanded ? "visible" : "hidden",
              textOverflow: "ellipsis",
              marginBottom: 0,
              fontSize: 15,
              whiteSpace: expanded ? "pre-line" : undefined,
              maxHeight: expanded ? "none" : 48,
              transition: "max-height 0.2s",
            }}
          >
            {item.Content}
          </p>
          {!expanded && showReadMore && (
            <span
              style={{
                color: "#FF7F00",
                cursor: "pointer",
                fontSize: 14,
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#fff",
                paddingLeft: 6,
              }}
              onClick={() => setExpanded(true)}
            >
              Read More
            </span>
          )}
          {expanded && (
            <span
              style={{
                color: "#FF7F00",
                cursor: "pointer",
                fontSize: 14,
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#fff",
                paddingLeft: 6,
              }}
              onClick={() => setExpanded(false)}
            >
              Show Less
            </span>
          )}
        </div>
        <div className="d-flex justify-content-end gap-2 mt-auto">
          <button
            className="button-orange"
            style={{ padding: "6px 12px", fontSize: 18 }}
            onClick={() => onEdit(item)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="button-blue"
            style={{ padding: "6px 12px", fontSize: 18 }}
            onClick={() => onDelete(item.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <style>{`
        .button-blue svg,
        .button-orange svg {
          color: #fff !important;
          transition: color 0.2s;
        }
        .button-blue:hover svg,
        .button-blue:focus svg,
        .button-orange:hover svg,
        .button-orange:focus svg {
          color: var(--primary-color) !important;
        }
      `}</style>
    </div>
  );
}
