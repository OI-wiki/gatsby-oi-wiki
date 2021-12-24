import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { graphql, useStaticQuery } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import React from 'react';
import StyledLayout from '../components/StyledLayout';
import { DeepRequiredNonNull, DeepWriteable } from '../types/common';

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export interface TagsPageProps {
  location: Location
}

const TagsPage: React.FC<TagsPageProps> = (props) => {
  const {
    allMarkdownRemark: { group },
  } = useStaticQuery<GatsbyTypes.TagsQuery>(graphql`
    query Tags {
      site {
        siteMetadata {
          title
        }
      }
      allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `) as DeepWriteable<DeepRequiredNonNull<GatsbyTypes.TagsQuery>>;

  const classes = useStyles();
  const { location } = props;

  group.sort((a, b) => b.totalCount - a.totalCount);

  return (
    <StyledLayout location={location} noMeta={true} title="标签页">
      <div>
        {group.map((tag) => (
          <Chip
            label={`${tag.fieldValue}(${tag.totalCount})`}
            variant="outlined"
            component="a"
            clickable={true}
            key={tag.fieldValue}
            href={'/tags/' + kebabCase(tag.fieldValue)}
            className={classes.chip}
          />
        ))}
      </div>
    </StyledLayout>
  );
};

export default TagsPage;
