import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';

export const GET_POSTS = gql`
  query GetPosts {
    getProjects {
      projectId
      projectName
      projectDesc
      status
    }
  }
`;

export default () => (
  <Query query={GET_POSTS}>
    {({ loading, data }) => !loading && (
      console.log(data),
      <Table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Project Description</th>
            <th>Project Status</th>
          </tr>
        </thead>
        <tbody>
          {data.getProjects.map(post => (
            <tr key={post.id}>
              <td>{post.projectName}</td>
              <td>{post.projectDesc}</td>
              <td>{post.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Query>
);