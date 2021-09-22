import { graphql, useStaticQuery } from 'gatsby'
import { DeepRequiredNonNull } from '../types/common'

const useSiteMetadata = () => {
  const data = useStaticQuery<GatsbyTypes.SiteInfoQuery>(graphql`
    query SiteInfo {
      site {
        siteMetadata {
          title,
          description,
          siteUrl
        }
      }
    }
  `) as DeepRequiredNonNull<GatsbyTypes.SiteInfoQuery>

  return data.site.siteMetadata
}

export default useSiteMetadata
