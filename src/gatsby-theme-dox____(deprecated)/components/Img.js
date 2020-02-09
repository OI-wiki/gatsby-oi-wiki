import React from "react"

function Img({ src, alt, ...props }) {
  console.log(src)
  return (
    <img
      {...props}
      src={
        src.match(/^http/) == null
          ? src.toString().replace(/[\.\/]*static\//, "")
          : src
      }
      alt={alt}
    />
  )
}

export default Img
