import React from 'react';
import { Link } from "gatsby";
import PropTypes from 'prop-types';

export default function Tags({ list = [] }) {
  return (
    <ul className="tag-list">
      {list.map(tag => (
        <li key={tag}>
          <Link to={`/tags/${tag}`}>{tag}</Link>
        </li>
      ))}
    </ul>
  );
}
Tags.propTypes = {
  list: PropTypes.array.isRequired,
};
