import React from "react"
import { Link as GatsbyLink } from "gatsby"
import PropTypes from "prop-types"

export default function Link({ children, className, to }) {
  return (
    <GatsbyLink className={["link"].concat(className || []).join(" ")} to={to}>
      {children}
    </GatsbyLink>
  )
}

Link.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.func,
}
