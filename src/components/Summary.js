/** @jsx jsx */
import { Link as GatsbyLink } from "gatsby"
import { jsx } from "theme-ui"
import { MdEdit, MdExpandMore } from "react-icons/md"

export default function({ className = null, children, ...props }) {
  if (className.match("note")) {
    return (
      <summary
        className={className}
        {...props}
        sx={{
          margin: "0 -0.6rem",
          padding: ".2rem .6rem .2rem 1rem",
          borderBottom: ".05rem solid rgba(68,138,255,.1)",
          backgroundColor: "rgba(68,138,255,.1)",
          fontWeight: 700,
          outline: "none",
          cursor: "pointer",
          p: {
            display: "inline-block",
            margin: 0,
            fontSize: "14px",
          },
          svg: {
            fontSize: "20px",
          },
          "::-webkit-details-marker": {
            display: "none",
          },
        }}
      >
        <MdEdit
          sx={{
            verticalAlign: "-4px",
            marginTop: "7px",
            mr: "0.6rem",
          }}
        />
        {children}
        <MdExpandMore
          className="expand-more-icon"
          sx={{
            verticalAlign: "-4px",
            marginTop: "7px",
            ml: "1rem",
            float: "right",
          }}
        />
      </summary>
    )
  }
  return (
    <summary className={className} {...props}>
      {children}
    </summary>
  )
}
