import { withPrefix } from "gatsby"

export default function(url) {
  return withPrefix(url.charAt(0) !== "/" ? `/${url}` : url)
}
